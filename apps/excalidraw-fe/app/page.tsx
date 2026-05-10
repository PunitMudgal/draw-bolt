import {
  Header,
  Hero,
  Features,
  Collaboration,
  Pricing,
  Footer,
} from "@/components/homepage";
import { Demo } from "@/components/homepage/demo";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Header />
      <Hero />
      <Demo />
      <Features />
      <Collaboration />
      <Pricing />
      <Footer />
    </main>
  );
}
