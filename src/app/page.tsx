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
              summary="AI Engineer with expertise in building production-ready AI systems, conversational agents, and intelligent automation workflows. Proficient in LLMs, voice AI, and real-time processing with hands-on experience in FastAPI, cloud deployment, and microservices architecture. Experienced in developing end-to-end AI solutions from concept to production, with strong background in data science and cloud platforms including AWS and Azure."
              photoUrl="/Generated Image September 13, 2025 - 2_46PM.png"
              email="sandhyavathi.g890@gmail.com"
              linkedinUrl="https://www.linkedin.com/in/sandhyavathi/"
              githubUrl="https://github.com/Sandhyavathi"
              resumeUrl="https://drive.google.com/file/d/1HVBaUjGxnbEGaTF9HST3MQp6iAaNTsUo/view?usp=sharing"
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
                resumeUrl="https://drive.google.com/file/d/1HVBaUjGxnbEGaTF9HST3MQp6iAaNTsUo/view?usp=sharing"
                className="mt-2"
              />
            </section>
          </div>
        </div>
      </div>
    </main>
  )
}
