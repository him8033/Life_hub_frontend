"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

// UI Components
import { Card, CardContent } from "@/components/ui/card";

// Assets & Icons
import Logo from "@/components/Application/Logo";

// Routes
import { ROUTES } from "@/routes/routes.constants";

// API Hooks
import { useGetLoggedUserQuery } from "@/services/api/authApi";
import { tokenService } from "@/services/auth/token.service";
import Link from "next/link";


const DashboardPage = () => {
    const router = useRouter();
    const { data, error, isSuccess } = useGetLoggedUserQuery();
    const [userData, setUserData] = useState({
        email: "",
        name: "",
    })

    useEffect(() => {
        if (isSuccess && data?.data) {
            setUserData({
                name: data.data.name,
                email: data.data.email,
            });
        }
    }, [isSuccess, data]);

    useEffect(() => {
        if (error?.status === 401 || error?.status === 403) {
            tokenService.remove();
            router.push(ROUTES.AUTH.LOGIN);
        }
    }, [error, router]);

    const handleLogout = () => {
        tokenService.remove();
        router.push(ROUTES.AUTH.LOGIN);
    };

    return (
        <Card className="w-full max-w-sm">
            <CardContent>
                {/* Logo */}
                <div className="flex justify-center mb-5">
                    <Logo width={60} height={60} />     {/* This is Main Project logo */}
                </div>

                {/* Page Title */}
                <div className="text-center mb-5">
                    <h1 className="text-3xl font-bold">
                        Dashboard <span className="text-blue-600">LifeHub</span>
                    </h1>
                    <h2>Name:{userData.name}</h2>
                    <h2>Email:{userData.email}</h2>
                </div>

                {/* Logout Button */}
                <button
                    onClick={handleLogout}
                    className="w-full py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                    Logout
                </button>
                <div className="text-center">
                    <Link
                        href={ROUTES.AUTH.CHANGE_PASSWORD}
                        className="text-blue-600 hover:underline"
                    >
                        Change Password
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
};

export default DashboardPage;
