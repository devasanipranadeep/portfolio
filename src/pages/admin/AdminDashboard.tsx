import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FolderKanban, Brain, FlaskConical, Award, MessageSquare } from "lucide-react";

const AdminDashboard = () => {
  const { data: counts } = useQuery({
    queryKey: ["admin-counts"],
    queryFn: async () => {
      const [projects, skills, research, certifications, contactMessages] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("skills").select("id", { count: "exact", head: true }),
        supabase.from("research").select("id", { count: "exact", head: true }),
        supabase.from("certifications").select("id", { count: "exact", head: true }),
        supabase.from("contact_messages").select("id", { count: "exact", head: true }),
      ]);
      return {
        projects: projects.count ?? 0,
        skills: skills.count ?? 0,
        research: research.count ?? 0,
        certifications: certifications.count ?? 0,
        contactMessages: contactMessages.count ?? 0,
      };
    },
  });

  const cards = [
    { label: "Projects", count: counts?.projects ?? 0, icon: FolderKanban },
    { label: "Skills", count: counts?.skills ?? 0, icon: Brain },
    { label: "Research", count: counts?.research ?? 0, icon: FlaskConical },
    { label: "Certifications", count: counts?.certifications ?? 0, icon: Award },
    { label: "Messages", count: counts?.contactMessages ?? 0, icon: MessageSquare },
  ];

  return (
    <div>
      <h1 className="text-3xl font-display font-bold text-foreground mb-8">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass-card rounded-xl p-5">
            <c.icon className="text-primary mb-2" size={22} />
            <p className="text-2xl font-bold text-foreground">{c.count}</p>
            <p className="text-sm text-muted-foreground">{c.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
