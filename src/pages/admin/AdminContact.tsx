import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MessageSquare, Trash2, Mail, User, Clock } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
  updated_at: string;
}

const AdminContact = () => {
  const queryClient = useQueryClient();
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const { data: messages, isLoading } = useQuery({
    queryKey: ["contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as ContactMessage[];
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Message deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      setSelectedMessage(null);
    },
    onError: (error) => {
      console.error('Error deleting message:', error);
      toast.error("Failed to delete message");
    },
  });

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
      <div className="text-muted-foreground">Loading messages...</div>
    </div>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Contact Messages</h1>
        <div className="text-sm text-muted-foreground">
          {messages?.length || 0} total messages
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-1 space-y-3">
          {messages && messages.length > 0 ? (
            messages.map((message) => (
              <div
                key={message.id}
                onClick={() => setSelectedMessage(message)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  selectedMessage?.id === message.id
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/30 hover:bg-secondary/50"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-muted-foreground" />
                    <span className="font-medium text-foreground text-sm truncate">
                      {message.name}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <Mail size={14} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground truncate">
                    {message.email}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {message.message}
                </p>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <MessageSquare size={48} className="mx-auto mb-4 opacity-50" />
              <p>No messages yet</p>
            </div>
          )}
        </div>

        {/* Message Detail */}
        <div className="lg:col-span-2">
          {selectedMessage ? (
            <div className="glass-card rounded-xl p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-foreground mb-2">
                    {selectedMessage.name}
                  </h2>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Mail size={14} />
                      <a href={`mailto:${selectedMessage.email}`} className="hover:text-primary">
                        {selectedMessage.email}
                      </a>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {new Date(selectedMessage.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => deleteMutation.mutate(selectedMessage.id)}
                  disabled={deleteMutation.isPending}
                  className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h3 className="text-sm font-medium text-muted-foreground mb-3">Message</h3>
                <div className="bg-secondary/50 rounded-lg p-4">
                  <p className="text-foreground whitespace-pre-wrap">
                    {selectedMessage.message}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: Contact from your portfolio`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  <Mail size={16} />
                  Reply via Email
                </a>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-xl p-12 text-center">
              <MessageSquare size={64} className="mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium text-foreground mb-2">Select a message</h3>
              <p className="text-muted-foreground">
                Choose a message from the list to view details
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminContact;
