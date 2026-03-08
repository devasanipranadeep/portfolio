import { motion } from "framer-motion";

const SectionHeading = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="text-center mb-12"
  >
    <h2 className="text-3xl md:text-4xl font-display font-bold gradient-text mb-3">{title}</h2>
    {subtitle && <p className="text-muted-foreground max-w-xl mx-auto">{subtitle}</p>}
  </motion.div>
);

export default SectionHeading;
