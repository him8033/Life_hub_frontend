"use client";

import { Card } from "@/components/ui/card";

export default function FeaturesSection() {
  const features = [
    { title: "Dynamic Sections", desc: "Reorder sections anytime." },
    { title: "Reusable UI", desc: "Use components like Lego blocks." },
    { title: "Theming System", desc: "Change theme globally." },
  ];

  return (
    <section className="py-20 container mx-auto text-center">
      <h2 className="text-4xl font-bold mb-10">Features</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {features.map((f, i) => (
          <Card key={i} className="p-6 shadow-md">
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-gray-600">{f.desc}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}
