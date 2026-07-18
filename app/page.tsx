import HeroSection from "@/components/hero/HeroSection";
import SignalLineMap from "@/components/timeline/SignalLineMap";
import ProjectGrid from "@/components/projects/ProjectGrid";
import SkillsGrid from "@/components/skills/SkillsGrid";
import AboutSection from "@/components/about/AboutSection";
import Footer from "@/components/footer/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SignalLineMap />
      <ProjectGrid />
      <SkillsGrid />
      <Footer />
    </main>
  );
}
