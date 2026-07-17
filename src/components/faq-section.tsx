import { SectionHeading } from "./section-heading";
import { Faq } from "./faq";

export function FaqSection() {
  return (
    <section id="faq" className="scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading
          eyebrow="// Questions"
          title="Answers before you ask."
          intro="The things people most want to know before booking a survey."
          align="center"
        />
        <Faq />
      </div>
    </section>
  );
}
