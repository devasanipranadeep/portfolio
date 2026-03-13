import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import pranayImg from "@/assets/pranay.jpg";

const Index = () => {
  const { data: projects } = useQuery({
    queryKey: ["public-projects"],
    queryFn: async () => {
      const { data, error } = await supabase.from("projects").select("*").eq("published", true).order("sort_order").limit(4);
      if (error) throw error;
      return data;
    },
  });

  const { data: skills } = useQuery({
    queryKey: ["public-skills"],
    queryFn: async () => {
      const { data, error } = await supabase.from("skills").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  const { data: resumeUrl } = useQuery({
    queryKey: ["public-resume"],
    queryFn: async () => {
      const { data, error } = await supabase.storage.from('resumes').list();
      if (error || !data || data.length === 0) {
        return "/Resume.pdf"; // Fallback to old resume
      }
      const { data: { publicUrl } } = supabase.storage.from('resumes').getPublicUrl(data[0].name);
      return publicUrl;
    },
  });

  const topSkills = (skills ?? []).slice(0, 6);

  return (
    <PageWrapper>
      <div className="relative min-h-screen mesh-gradient noise-overlay">
        {/* Hero Bento Section */}
        <section className="relative z-10 pt-16 md:pt-28 pb-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 auto-rows-auto">

              {/* Main Hero Card - spans full width with image */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="md:col-span-full bento-card p-8 md:p-12 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
                <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                  {/* Hero Content - spans 1 column */}
                  <div className="md:col-span-1">
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3 }}
                      className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs text-primary font-medium mb-6"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
                      Open to opportunities
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold leading-[1.1] mb-4">
                      <span className="text-foreground">Pranadeep</span>
                      <br />
                      <span className="gradient-text">Devasani</span>
                    </h1>

                    <p className="text-lg md:text-xl text-muted-foreground font-display font-light mb-3">
                      AI & Data Science Engineer
                    </p>

                    <p className="text-muted-foreground max-w-md mb-8 text-sm leading-relaxed">
                      Masters in Data Science student building intelligent systems
                      that transform raw data into actionable insights.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                      <Link
                        to="/projects"
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                      >
                        View Projects <ArrowRight size={14} />
                      </Link>
                      <Link
                        to="/contact"
                        className="inline-flex items-center justify-center px-4 sm:px-5 py-2.5 rounded-xl glass-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        Contact Me
                      </Link>
                      <a
                        href={resumeUrl || "/Resume.pdf"}
                        download
                        className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl glass-card text-foreground text-sm font-medium hover:bg-secondary transition-colors"
                      >
                        <Download size={14} /> Resume
                      </a>
                    </div>
                  </div>

                  {/* Profile Image - spans 1 column */}
                  <div className="md:col-span-1 relative group">
                    <img
                      src={pranayImg}
                      alt="Pranadeep Devasani"
                      className="w-full h-80 md:h-96 lg:h-[400px] rounded-2xl object-cover group-hover:scale-105 transition-transform duration-700 shadow-2xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent rounded-2xl" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex gap-2">
                        <a href="https://www.linkedin.com/in/devasani-pranadeep" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:text-primary transition-colors">
                          <Linkedin size={14} />
                        </a>
                        <a href="https://github.com/devasanipranadeep" target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-lg bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:text-primary transition-colors">
                          <Github size={14} />
                        </a>
                        <a href="mailto:devasanipranadeep@gmail.com" className="w-8 h-8 rounded-lg bg-background/60 backdrop-blur flex items-center justify-center text-foreground hover:text-primary transition-colors">
                          <Mail size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Skills Grid Card - spans 4 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="md:col-span-4 bento-card"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Core Skills</h3>
                <div className="grid grid-cols-2 gap-2">
                  {topSkills.map((skill) => (
                    <div key={skill.id} className="bg-secondary/50 rounded-xl px-3 py-2.5 group/skill hover:bg-primary/10 transition-colors">
                      <p className="text-xs font-medium text-foreground truncate">{skill.name}</p>
                      <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.proficiency}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className="h-full rounded-full bg-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <Link to="/skills" className="inline-flex items-center gap-1 text-xs text-primary hover:underline mt-4 font-medium">
                  All skills <ArrowRight size={10} />
                </Link>
              </motion.div>

              {/* Quick Stats Card - spans 4 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="md:col-span-4 bento-card flex flex-col justify-between"
              >
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Highlights</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Education</span>
                    <span className="text-sm text-foreground font-medium">M.S. Data Science</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Specialization</span>
                    <span className="text-sm text-foreground font-medium">AI & ML</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Projects</span>
                    <span className="text-sm text-foreground font-medium">{projects?.length ?? 0}+</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Focus</span>
                    <span className="text-sm text-foreground font-medium">Deep Learning</span>
                  </div>
                </div>
              </motion.div>

              {/* CTA Card - spans 4 cols */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="md:col-span-4 bento-card bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 flex flex-col justify-center items-center text-center"
              >
                <h3 className="font-display font-bold text-foreground text-lg mb-2">
                  Let's <span className="gradient-text">Collaborate</span>
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Interested in AI or ML projects?
                </p>
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
                >
                  Get In Touch <ArrowRight size={14} />
                </Link>
              </motion.div>

            </div>
          </div>
        </section>

        {/* Featured Projects Bento */}
        <section className="relative z-10 py-8">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">Featured Projects</h2>
                <p className="text-sm text-muted-foreground mt-1">Recent work in AI and Data Science</p>
              </div>
              <Link to="/projects" className="inline-flex items-center gap-1 text-sm text-primary hover:underline font-medium">
                View all <ArrowRight size={14} />
              </Link>
            </div>

            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project, i) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="bento-card group"
                  >
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {(project.tags ?? []).map((tag) => (
                        <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium uppercase tracking-wider">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {(project.technologies ?? []).slice(0, 3).map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-lg bg-secondary text-secondary-foreground">{t}</span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><Github size={14} /></a>
                        )}
                        {project.demo_url && (
                          <a href={project.demo_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors"><ExternalLink size={14} /></a>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground">Projects coming soon.</p>
            )}
          </div>
        </section>
      </div>
    </PageWrapper>
  );
};

export default Index;
