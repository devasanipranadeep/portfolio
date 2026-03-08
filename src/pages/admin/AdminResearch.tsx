import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Research = Tables<"research">;
const empty = { title: "", abstract: "", methodology: "", technologies: "", publication_url: "", pdf_url: "", published: true };

const AdminResearch = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Research | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const { data: items, isLoading } = useQuery({
    queryKey: ["admin-research"],
    queryFn: async () => { const { data, error } = await supabase.from("research").select("*").order("created_at", { ascending: false }); if (error) throw error; return data; },
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-research"] });
    qc.invalidateQueries({ queryKey: ["public-research"] });
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title, abstract: form.abstract || null, methodology: form.methodology || null,
        technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
        publication_url: form.publication_url || null, pdf_url: form.pdf_url || null, published: form.published,
      };
      if (editing) { const { error } = await supabase.from("research").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("research").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { invalidateAll(); toast({ title: editing ? "Updated" : "Created" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("research").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { invalidateAll(); toast({ title: "Deleted" }); },
  });

  const openEdit = (r: Research) => { setEditing(r); setForm({ title: r.title, abstract: r.abstract ?? "", methodology: r.methodology ?? "", technologies: (r.technologies ?? []).join(", "), publication_url: r.publication_url ?? "", pdf_url: r.pdf_url ?? "", published: r.published ?? true }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Research</h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Add Research</button>
      </div>
      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h2 className="font-display font-semibold text-foreground">{editing ? "Edit" : "New"} Research</h2><button onClick={closeForm}><X size={18} className="text-muted-foreground" /></button></div>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" />
            <textarea placeholder="Abstract" value={form.abstract} onChange={(e) => setForm({ ...form, abstract: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" rows={3} />
            <textarea placeholder="Methodology" value={form.methodology} onChange={(e) => setForm({ ...form, methodology: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" rows={3} />
            <input placeholder="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Publication URL" value={form.publication_url} onChange={(e) => setForm({ ...form, publication_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="PDF URL" value={form.pdf_url} onChange={(e) => setForm({ ...form, pdf_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <label className="flex items-center gap-2 text-sm text-foreground"><input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published</label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">{save.isPending ? "Saving..." : "Save"}</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Title</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
            {items?.map((r) => (
              <tr key={r.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">{r.title}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${r.published ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{r.published ? "Yes" : "No"}</span></td>
                <td className="px-4 py-3 flex gap-2"><button onClick={() => openEdit(r)} className="text-muted-foreground hover:text-primary"><Pencil size={15} /></button><button onClick={() => del.mutate(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button></td>
              </tr>
            ))}
            {!isLoading && (!items || items.length === 0) && <tr><td colSpan={3} className="px-4 py-8 text-center text-muted-foreground">No research yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminResearch;
