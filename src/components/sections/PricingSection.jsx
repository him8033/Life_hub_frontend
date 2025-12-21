"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PricingSection() {
    return (
        <section className="py-20 bg-gray-50 text-center">
            <h2 className="text-4xl font-bold mb-10">Pricing</h2>

            <Card className="max-w-md p-8 mx-auto shadow-lg">
                <h3 className="text-2xl font-bold mb-4">Starter Plan</h3>
                <p className="text-3xl font-extrabold">$19/month</p>

                <Button className="mt-6">Start Now</Button>
            </Card>
        </section>
    );
}
