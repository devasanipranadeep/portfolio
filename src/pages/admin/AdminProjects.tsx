import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

type Project = Tables<"projects">;

const emptyProject = { title: "", description: "", technologies: "", tags: "", github_url: "", demo_url: "", published: true };

const AdminProjects = () => {
  const qc = useQueryClient();
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState(emptyProject);
  const [showForm, setShowForm] = useState(false);

  const { data: projects, isLoading } = useQuery({
    queryKey: ["admin-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["admin-projects"] });
    qc.invalidateQueries({ queryKey: ["public-projects"] });
    qc.invalidateQueries({ queryKey: ["admin-counts"] });
  };

  const save = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title,
        description: form.description,
        technologies: form.technologies.split(",").map((s) => s.trim()).filter(Boolean),
        tags: form.tags.split(",").map((s) => s.trim()).filter(Boolean),
        github_url: form.github_url || null,
        demo_url: form.demo_url || null,
        published: form.published,
      };
      if (editing) {
        const { error } = await supabase.from("projects").update(payload).eq("id", editing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("projects").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => { invalidateAll(); toast({ title: editing ? "Project updated" : "Project created" }); closeForm(); },
    onError: (e: Error) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const del = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("projects").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => { invalidateAll(); toast({ title: "Project deleted" }); },
  });

  const openEdit = (p: Project) => {
    setEditing(p);
    setForm({
      title: p.title,
      description: p.description,
      technologies: (p.technologies ?? []).join(", "),
      tags: (p.tags ?? []).join(", "),
      github_url: p.github_url ?? "",
      demo_url: p.demo_url ?? "",
      published: p.published ?? true,
    });
    setShowForm(true);
  };

  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyProject); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-display font-bold text-foreground">Projects</h1>
        <button onClick={() => { closeForm(); setShowForm(true); }} className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">
          <Plus size={16} /> Add Project
        </button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6">
          <div className="flex justify-between mb-4">
            <h2 className="font-display font-semibold text-foreground">{editing ? "Edit" : "New"} Project</h2>
            <button onClick={closeForm}><X size={18} className="text-muted-foreground" /></button>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); save.mutate(); }} className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm md:col-span-2" rows={3} />
            <input placeholder="Technologies (comma-separated)" value={form.technologies} onChange={(e) => setForm({ ...form, technologies: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="GitHub URL" value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <input placeholder="Demo URL" value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="px-3 py-2 rounded-lg bg-secondary border border-border text-foreground text-sm" />
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} /> Published
            </label>
            <div className="md:col-span-2 flex gap-2">
              <button type="submit" disabled={save.isPending} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium">{save.isPending ? "Saving..." : "Save"}</button>
              <button type="button" onClick={closeForm} className="px-4 py-2 rounded-lg bg-secondary text-foreground text-sm">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="glass-card rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead><tr className="border-b border-border text-left text-muted-foreground">
            <th className="px-4 py-3">Title</th><th className="px-4 py-3">Tags</th><th className="px-4 py-3">Published</th><th className="px-4 py-3 w-24">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">Loading...</td></tr>}
            {projects?.map((p) => (
              <tr key={p.id} className="border-b border-border/50 hover:bg-secondary/50">
                <td className="px-4 py-3 text-foreground">{p.title}</td>
                <td className="px-4 py-3 text-muted-foreground">{(p.tags ?? []).join(", ")}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full ${p.published ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"}`}>{p.published ? "Yes" : "No"}</span></td>
                <td className="px-4 py-3 flex gap-2">
                  <button onClick={() => openEdit(p)} className="text-muted-foreground hover:text-primary"><Pencil size={15} /></button>
                  <button onClick={() => del.mutate(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={15} /></button>
                </td>
              </tr>
            ))}
            {!isLoading && (!projects || projects.length === 0) && <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No projects yet</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;
