import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { VideoSection } from "@/components/video-section";
import { Services } from "@/components/services";
import { Coverage } from "@/components/coverage";
import { StatsBand } from "@/components/stats-band";
import { Process } from "@/components/process";
import { Testimonials } from "@/components/testimonials";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <VideoSection />
      <Services />
      <Coverage />
      <StatsBand />
      <Process />
      <Testimonials />
      <FaqSection />
      <ContactSection />
    </>
  );
}
