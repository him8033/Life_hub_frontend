"use client";

import React from "react";

// Layout Components
import DashboardShell from "@/components/dashboard/DashboardLayout";

export default function DashboardLayout({ children }) {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    );
}
