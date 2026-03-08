import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Skill = Tables<"skills">;
const empty = { name: "", category: "Programming", proficiency: 80, icon_name: "" };
const categories = ["Programming", "Data Science", "Tools", "MLOps", "Other"];

const AdminSkills = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState(empty);
  const [showForm, setShowForm] = useState(false);

  const { data: skills, isLoading } = useQuery({
    queryKey: ["admin-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("category").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-skills"] });
    qc.invalidateQueries({ queryKey: ["public-skills"] });
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = { name: form.name, category: form.category, proficiency: form.proficiency, icon_name: form.icon_name || null };
      if (editing) { const { error } = await supabase.from("skills").update(payload).eq("id", editing.id); if (error) throw error; }
      else { const { error } = await supabase.from("skills").insert(payload); if (error) throw error; }
    },
    onSuccess: () => { invalidateAll(); toast({ title: editing ? "Skill updated" : "Skill created" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => { const { error } = await supabase.from("skills").delete().eq("id", id); if (error) throw error; },
    onSuccess: () => { invalidateAll(); toast({ title: "Skill deleted" }); },
  });

  const openEdit = (s: Skill) => { setEditing(s); setForm({ name: s.name, category: s.category, proficiency: s.proficiency ?? 80, icon_name: s.icon_name ?? "" }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(empty); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Skills</h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"><Plus size={16} /> Add Skill</button>
      </div>
      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4"><h2 className="font-display font-semibold text-foreground">{editing ? "Edit" : "New"} Skill</h2><button onClick={closeForm}><X size={18} className="text-muted-foreground" /></button></div>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid md:grid-cols-2 gap-4">
            <input placeholder="Skill name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <div>
              <label className="text-xs text-muted-foreground">Proficiency: {form.proficiency}%</label>
              <input type="range" min={0} max={100} value={form.proficiency} onChange={(e) => setForm({ ...form, proficiency: +e.target.value })} className="w-full accent-primary" />
            </div>
            <input placeholder="Icon name (optional)" value={form.icon_name} onChange={(e) => setForm({ ...form, icon_name: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">{save.isPending ? "Saving..." : "Save"}</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}
      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground"><th className="px-4 py-3">Name</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Level</th><th className="px-4 py-3 w-24">Actions</th></tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
            {skills?.map((s) => (
              <tr key={s.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">{s.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{s.category}</td>
                <td className="px-4 py-3"><div className="w-24 h-2 bg-secondary rounded-full"><div className="h-full bg-primary rounded-full" style={{ width: `${s.proficiency}%` }} /></div></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-primary"><Pencil size={15} /></button>
                  <button onClick={() => del.mutate(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!isLoading && (!skills || skills.length === 0) && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No skills yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSkills;
