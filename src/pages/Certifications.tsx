import { motion } from "framer-motion";
import { Award, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const Certifications = () => {
  const { data: certs } = useQuery({
    queryKey: ["public-certifications"],
    queryFn: async () => {
      const { data, error } = await supabase.from("certifications").select("*").order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Certifications" subtitle="Professional credentials and continuous learning" />
          {(!certs || certs.length === 0) ? (
            <p className="text-center text-muted-foreground">Certifications coming soon.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto">
              {certs.map((cert, i) => (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors group"
                >
                  {cert.image_url ? (
                    <img src={cert.image_url} alt={cert.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                      <Award className="text-primary" size={18} />
                    </div>
                  )}
                  <h3 className="font-display font-semibold text-foreground text-sm mb-1">{cert.title}</h3>
                  <p className="text-xs text-muted-foreground mb-1">{cert.institution}</p>
                  {cert.completion_date && <p className="text-xs text-muted-foreground mb-3">{cert.completion_date}</p>}
                  {cert.verification_url && (
                    <a href={cert.verification_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                      Verify <ExternalLink size={10} />
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </PageWrapper>
  );
};

export default Certifications;
