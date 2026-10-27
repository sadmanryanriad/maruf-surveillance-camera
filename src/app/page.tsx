import { Hero } from "@/components/hero";
import { Marquee } from "@/components/marquee";
import { AboutSection } from "@/components/about-section";
import { Services } from "@/components/services";
import { Coverage } from "@/components/coverage";
import { Process } from "@/components/process";
import { Testimonials } from "@/components/testimonials";
import { FaqSection } from "@/components/faq-section";
import { ContactSection } from "@/components/contact-section";

export default function Home() {
  return (
    <>
      <Hero />
      <Marquee />
      <AboutSection />
      <Services />
      <Coverage />
      <Process />
      <Testimonials />
      <FaqSection />
      <ContactSection />
    </>
  );
}
