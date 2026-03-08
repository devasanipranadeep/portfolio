import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Cert = Tables<"certifications">;
const empty = { title: "", institution: "", completion_date: "", image_url: "", verification_url: "" };

const AdminCertifications = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Cert | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const { data: certs, isLoading } = useQuery({
    queryKey: ["admin-certifications"],
    queryFn: async () => { const { data, error } = await supabase.from("certifications").select("*").order("sort_order"); if (error) throw error; return data; },
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-certifications"] });
    qc.invalidateQueries({ queryKey: ["public-certifications"] });
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = { title: form.title, institution: form.institution, completion_date: form.completion_date || null, image_url: form.image_url || null, verification_url: form.verification_url || null };
      if (editing) { const { error } = await supabase.from("certifications").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("certifications").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { invalidateAll(); toast({ title: editing ? "Updated" : "Created" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("certifications").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { invalidateAll(); toast({ title: "Deleted" }); },
  });

  const openEdit = (c: Cert) => { setEditing(c); setForm({ title: c.title, institution: c.institution, completion_date: c.completion_date ?? "", image_url: c.image_url ?? "", verification_url: c.verification_url ?? "" }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Certifications</h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Add Certification</button>
      </div>
      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h2 className="font-display font-semibold text-foreground">{editing ? "Edit" : "New"} Certification</h2><button onClick={closeForm}><X size={18} className="text-muted-foreground" /></button></div>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Institution" value={form.institution} onChange={(e) => setForm({ ...form, institution: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input type="date" placeholder="Completion date" value={form.completion_date} onChange={(e) => setForm({ ...form, completion_date: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Image URL" value={form.image_url} onChange={(e) => setForm({ ...form, image_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Verification URL" value={form.verification_url} onChange={(e) => setForm({ ...form, verification_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">{save.isPending ? "Saving..." : "Save"}</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Title</th><th className="px-4 py-3">Institution</th><th className="px-4 py-3">Date</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
            {certs?.map((c) => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">{c.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.institution}</td>
                <td className="px-4 py-3 text-muted-foreground">{c.completion_date ?? "—"}</td>
                <td className="px-4 py-3 flex gap-2"><button onClick={() => openEdit(c)} className="text-muted-foreground hover:text-primary"><Pencil size={15} /></button><button onClick={() => del.mutate(c.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button></td>
              </tr>
            ))}
            {!isLoading && (!certs || certs.length === 0) && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No certifications yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCertifications;
