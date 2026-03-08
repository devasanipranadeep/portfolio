import { motion } from "framer-motion";
import { GraduationCap, Target, Lightbulb, Rocket } from "lucide-react";
import PageWrapper from "@/components/PageWrapper";
import SectionHeading from "@/components/SectionHeading";

const timeline = [
  { year: "2020 - 2024", title: "BTech in AI & Machine Learning", desc: "Developed strong foundations in artificial intelligence, machine learning algorithms, and software engineering.", icon: GraduationCap },
  { year: "2025 - 2027", title: "Masters in Data Science", desc: "Advanced studies in statistical modeling, big data analytics, deep learning, and research methodologies.", icon: Rocket },
];

const expertise = [
  { title: "Machine Learning", desc: "Supervised & unsupervised learning, ensemble methods, model optimization" },
  { title: "Deep Learning", desc: "Neural networks, CNNs, RNNs, Transformers, GANs" },
  { title: "Data Engineering", desc: "ETL pipelines, data warehousing, stream processing" },
  { title: "Natural Language Processing", desc: "Text classification, sentiment analysis, language models" },
  { title: "Computer Vision", desc: "Object detection, image segmentation, video analysis" },
  { title: "MLOps", desc: "Model deployment, monitoring, CI/CD for ML systems" },
];

const About = () => (
  <PageWrapper>
    <section className="py-20">
      <div className="container mx-auto px-4">
        <SectionHeading title="About Me" subtitle="Passionate about transforming data into intelligent solutions" />

        <div className="grid md:grid-cols-2 gap-12 mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Target className="text-primary" size={20} /> Career Goals
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I aspire to work at the intersection of data science and product development, 
              building AI-powered solutions that create real-world impact. My goal is to contribute 
              to cutting-edge research while developing scalable ML systems.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              With a solid foundation in both theoretical concepts and practical applications, 
              I aim to bridge the gap between academic research and industry deployment.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h3 className="text-xl font-display font-semibold text-foreground mb-4 flex items-center gap-2">
              <Lightbulb className="text-primary" size={20} /> Mission
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              To leverage artificial intelligence and data science to solve meaningful problems 
              and make technology more accessible and impactful for everyone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              I believe in continuous learning, open-source collaboration, and the power of data 
              to drive informed decision-making across industries.
            </p>
          </motion.div>
        </div>

        {/* Timeline */}
        <SectionHeading title="Education" subtitle="My academic journey in AI and Data Science" />
        <div className="max-w-2xl mx-auto space-y-8">
          {timeline.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="flex gap-4"
            >
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="text-primary" size={18} />
                </div>
                {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
              </div>
              <div className="pb-8">
                <span className="text-xs text-primary font-medium">{item.year}</span>
                <h4 className="text-lg font-display font-semibold text-foreground mt-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Expertise */}
        <div className="mt-20">
          <SectionHeading title="Areas of Expertise" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {expertise.map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-xl p-5 hover:border-primary/30 transition-colors"
              >
                <h4 className="font-display font-semibold text-foreground mb-1">{item.title}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  </PageWrapper>
);

export default About;
