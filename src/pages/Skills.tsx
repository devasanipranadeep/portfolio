import { motion } from "framer-motion";
import { Code, Database, Brain, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const categoryIcons: Record<string, React.ElementType> = {
  Programming: Code,
  "Data Science": Brain,
  Tools: Database,
  MLOps: Settings,
  Other: Settings,
};

const SkillBar = ({ name, level, delay }: { name: string; level: number; delay: number }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1.5">
      <span className="text-sm text-foreground font-medium">{name}</span>
      <span className="text-xs text-muted-foreground">{level}%</span>
    </div>
    <div className="h-2 rounded-full bg-secondary overflow-hidden">
      <motion.div
        initial={{ width: 0 }}
        whileInView={{ width: `${level}%` }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay, ease: "easeOut" }}
        className="h-full rounded-full"
        style={{ background: "var(--gradient-primary)" }}
      />
    </div>
  </div>
);

const Skills = () => {
  const { data: skills } = useQuery({
    queryKey: ["public-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  // Group by category
  const grouped = (skills ?? []).reduce((acc, s) => {
    if (!acc[s.category]) acc[s.category] = [];
    acc[s.category].push(s);
    return acc;
  }, {} as Record<string, typeof skills>);

  const categories = Object.entries(grouped);

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Skills & Technologies" subtitle="Technical proficiency across the data science stack" />
          {categories.length === 0 ? (
            <p className="text-center text-muted-foreground">Skills coming soon.</p>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {categories.map(([cat, catSkills], ci) => {
                const Icon = categoryIcons[cat] || Settings;
                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: ci * 0.1 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="text-primary" size={18} />
                      </div>
                      <h3 className="font-display font-semibold text-foreground text-lg">{cat}</h3>
                    </div>
                    {catSkills!.map((skill, si) => (
                      <SkillBar key={skill.id} name={skill.name} level={skill.proficiency ?? 80} delay={ci * 0.1 + si * 0.1} />
                    ))}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Skills;
