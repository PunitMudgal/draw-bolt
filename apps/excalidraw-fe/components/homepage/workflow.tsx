import { workflowSteps } from "@/config";

export function Workflow() {
   
    return (
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="grid gap-10 lg:grid-cols-3">
          {workflowSteps.map((step) => (
            <div key={step.n} className="relative">
              <div className="text-6xl font-bold text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.2)]">
                {step.n}
              </div>
              <h3 className="mt-3 text-2xl font-semibold">{step.t}</h3>
              <p className="mt-2 text-zinc-400">{step.d}</p>
            </div>
          ))}
        </div>
      </section>
    );
  }