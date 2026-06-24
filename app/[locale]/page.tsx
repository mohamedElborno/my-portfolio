import dynamic from "next/dynamic";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { SectionDivider } from "@/components/ui/SectionDivider";

const Services = dynamic(() =>
  import("@/components/sections/Services").then((m) => m.Services)
);
const CaseStudies = dynamic(() =>
  import("@/components/sections/CaseStudies").then((m) => m.CaseStudies)
);
const TechStack = dynamic(() =>
  import("@/components/sections/TechStack").then((m) => m.TechStack)
);
const Contact = dynamic(() =>
  import("@/components/sections/Contact").then((m) => m.Contact)
);

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 flex-1">
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Services />
        <SectionDivider />
        <CaseStudies />
        <SectionDivider />
        <TechStack />
        <SectionDivider />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
