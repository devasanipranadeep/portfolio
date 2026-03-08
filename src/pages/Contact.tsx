import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Linkedin, Github, Mail } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const Contact = () => {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  // Test Supabase connection on component mount
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase.from('user_roles').select('count');
        console.log('Supabase connection test:', { data, error });
        if (error) {
          console.error('Supabase connection failed:', error);
        } else {
          console.log('Supabase connection successful');
        }
      } catch (err) {
        console.error('Supabase connection error:', err);
      }
    };
    testConnection();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setSending(true);
    
    try {
      console.log('Attempting to send message to Supabase...');
      console.log('Form data:', { name: form.name, email: form.email, message: form.message.substring(0, 50) + '...' });
      
      // Insert the message into database
      const { data, error } = await supabase
        .from('contact_messages')
        .insert({
          name: form.name.trim(),
          email: form.email.trim(),
          message: form.message.trim()
        })
        .select();
      
      console.log('Supabase response:', { data, error });
      
      if (error) {
        console.error('Supabase error details:', error);
        throw error;
      }
      
      console.log('Message sent successfully:', data);
      toast.success("Message sent! I'll get back to you soon.");
      setForm({ name: "", email: "", message: "" });
    } catch (error: any) {
      console.error('Error sending message:', error);
      toast.error("Failed to send message. Please try again or email me directly at devasanipranadeep@gmail.com");
    } finally {
      setSending(false);
    }
  };

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Get In Touch" subtitle="Let's discuss opportunities, collaborations, or just say hello" />

          <div className="grid md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass-card rounded-xl p-6 space-y-4"
            >
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="Your name"
                  maxLength={100}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                  placeholder="you@email.com"
                  maxLength={255}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={5}
                  className="w-full px-4 py-2.5 rounded-lg bg-secondary border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  placeholder="Your message..."
                  maxLength={1000}
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {sending ? "Sending..." : "Send Message"} <Send size={16} />
              </button>
            </motion.form>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-center gap-6"
            >
              <p className="text-muted-foreground leading-relaxed">
                I'm always open to discussing new projects, research collaborations, 
                or opportunities in AI and Data Science. Feel free to reach out!
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:devasanipranadeep@gmail.com"
                  className="flex items-center gap-3 glass-card rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <Mail className="text-primary" size={20} />
                  <div>
                    <p className="text-sm font-medium text-foreground">Email</p>
                    <p className="text-xs text-muted-foreground">devasanipranadeep@gmail.com</p>
                  </div>
                </a>

                <a
                  href="https://www.linkedin.com/in/devasani-pranadeep"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 glass-card rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <Linkedin className="text-primary" size={20} />
                  <div>
                    <p className="text-sm font-medium text-foreground">LinkedIn</p>
                    <p className="text-xs text-muted-foreground">devasani-pranadeep</p>
                  </div>
                </a>

                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 glass-card rounded-lg p-4 hover:border-primary/30 transition-colors"
                >
                  <Github className="text-primary" size={20} />
                  <div>
                    <p className="text-sm font-medium text-foreground">GitHub</p>
                    <p className="text-xs text-muted-foreground">View my repositories</p>
                  </div>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Contact;
