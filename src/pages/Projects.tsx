import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const Projects = () => {
  const [filter, setFilter] = useState("All");

  const { data: projects } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const allTags = ["All", ...Array.from(new Set((projects ?? []).flatMap((p) => p.tags ?? [])))];
  const filtered = filter === "All" ? projects : projects?.filter((p) => (p.tags ?? []).includes(filter));

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Projects" subtitle="Showcasing AI, ML, and data science work" />

          {allTags.length > 1 && (
            <div className="flex flex-wrap justify-center gap-2 mb-10">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => setFilter(tag)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    filter === tag ? "bg-primary text-primary-foreground" : "glass-card text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          )}

          {(!filtered || filtered.length === 0) ? (
            <p className="text-center text-muted-foreground">Projects coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  layout
                  className="glass-card rounded-xl p-6 flex flex-col hover:border-primary/30 transition-colors"
                >
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {(project.tags ?? []).map((tag) => (
                      <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase tracking-wider">{tag}</span>
                    ))}
                  </div>
                  <h3 className="text-lg font-display font-semibold text-foreground mb-2">{project.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4 flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {(project.technologies ?? []).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{t}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-3 pt-3 border-t border-border">
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Github size={16} /></a>
                    )}
                    {project.demo_url && (
                      <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink size={16} /></a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Projects;
