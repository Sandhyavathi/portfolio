import PortfolioHero from "@/components/portfolio-hero"
import EducationSection from "@/components/education-section"
import SkillsSection from "@/components/skills-section"
import ExperienceSection from "@/components/experience-section"
import ProjectsSection from "@/components/projects-section"
import CertificationsFooter from "@/components/certifications-footer"

export default function Page() {
  return (
    <main className="min-h-dvh w-full bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-6 sm:px-8 md:px-10">
        <div className="py-10 sm:py-12 md:py-14">
          <div className="grid gap-10 sm:gap-12 md:gap-16">
            <PortfolioHero
              name="Sandhyavathi G"
              title="AI Engineer"
              summary="AAI Engineer with expertise in building production-ready AI systems, conversational agents, and intelligent automation workflows. Proficient in LLMs, voice AI, and real-time processing with hands-on experience in FastAPI, cloud deployment, and microservices architecture. Experienced in developing end-to-end AI solutions from concept to production, with strong background in data science and cloud platforms including AWS and Azure."
              photoUrl="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/document-uploads/1757678464690-lagtcc8ipd.png"
              email="sandhyavathi.g@gmail.com"
              phone="+91 9353830857"
              linkedinUrl="https://www.linkedin.com/in/sandhyavathi/"
              githubUrl="https://github.com/Sandhyavathi"
              resumeUrl="/Sandhyavathi_G_Resume.pdf"
              scrollToId="education"
              className="bg-[color:var(--earth-card,#F3EFE7)]"
            />

            <section id="education" className="scroll-mt-24">
              <EducationSection className="rounded-[var(--radius)]" />
            </section>

            <section id="skills" className="scroll-mt-24">
              <SkillsSection />
            </section>

            <section id="experience" className="scroll-mt-24">
              <ExperienceSection />
            </section>

            <section id="projects" className="scroll-mt-24">
              <ProjectsSection />
            </section>

            <section id="certifications" className="scroll-mt-24">
              <CertificationsFooter
                resumeUrl="/Sandhyavathi_G_Resume.pdf"
                className="mt-2"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}