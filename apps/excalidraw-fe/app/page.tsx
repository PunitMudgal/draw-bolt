import {
  Header,
  Hero,
  Features,
  Collaboration,
  Pricing,
  Footer,
} from "@/components/homepage";
import { Demo } from "@/components/homepage/demo";
import { Workflow } from "@/components/homepage/workflow";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <Demo />
      <Workflow />
      <Features />
      <Collaboration />
      <Pricing />
      <Footer />
    </main>
  );
}
