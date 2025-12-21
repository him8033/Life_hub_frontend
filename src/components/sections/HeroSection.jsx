"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { theme } from "@/config/theme";

export default function HeroSection() {
    return (
        <section
            className="py-24 text-center"
            style={{ backgroundColor: theme.light }}
        >
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="text-5xl font-bold text-gray-900"
            >
                Build Fast, Deploy Faster 🚀
            </motion.h1>

            <p className="text-gray-600 mt-4 max-w-xl mx-auto">
                A modular UI system where every section is reusable and replaceable.
            </p>

            <Button className="mt-6" style={{ backgroundColor: theme.primary }}>
                Get Started
            </Button>
        </section>
    );
}
