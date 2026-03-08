import { motion } from "framer-motion";
import { FileText, ExternalLink, Download } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const Research = () => {
  const { data: papers } = useQuery({
    queryKey: ["public-research"],
    queryFn: async () => {
      const { data, error } = await supabase.from("research").select("*").eq("published", true).order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <PageWrapper>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <SectionHeading title="Research" subtitle="Academic contributions to AI and Data Science" />
          <div className="max-w-3xl mx-auto space-y-8">
            {(!papers || papers.length === 0) && (
              <p className="text-center text-muted-foreground">Research papers coming soon.</p>
            )}
            {papers?.map((paper, i) => (
              <motion.div
                key={paper.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="glass-card rounded-xl p-6 md:p-8"
              >
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FileText className="text-primary" size={18} />
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-foreground text-lg">{paper.title}</h3>
                    {paper.published_at && <span className="text-xs text-muted-foreground">Published {new Date(paper.published_at).getFullYear()}</span>}
                  </div>
                </div>
                <div className="ml-12 space-y-4">
                  {paper.abstract && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Abstract</h4>
                      <p className="text-sm text-muted-foreground">{paper.abstract}</p>
                    </div>
                  )}
                  {paper.methodology && (
                    <div>
                      <h4 className="text-sm font-semibold text-foreground mb-1">Methodology</h4>
                      <p className="text-sm text-muted-foreground">{paper.methodology}</p>
                    </div>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {(paper.technologies ?? []).map((t) => (
                      <span key={t} className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground">{t}</span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {paper.publication_url && (
                      <a href={paper.publication_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        View Publication <ExternalLink size={10} />
                      </a>
                    )}
                    {paper.pdf_url && (
                      <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                        Download PDF <Download size={10} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </PageWrapper>
  );
};

export default Research;
