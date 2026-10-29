"use client";
import Cookies from "js-cookie";
import { ROUTES } from '@/routes/routes.constants';
import { clearSession } from '@/utils/sessionHandler';

class TokenService {
    store({ access, refresh, user, session_id, device }) {
        if (!access) return;
        Cookies.set("access_token", access, {
            expires: 7, // 7 day
            sameSite: "Strict",
            path: "/",
        });

        if (refresh) {
            Cookies.set("refresh_token", refresh, {
                expires: 7,
                sameSite: "Strict",
                path: "/",
            });
        }

        if (user) {
            Cookies.set("user", JSON.stringify(user), {
                expires: 7,
                sameSite: "Strict",
                path: "/",
            });
        }

        if (session_id) {
            Cookies.set("session_id", session_id, {
                expires: 7,
                sameSite: "Strict",
                path: "/",
            });
        }

        if (device) {
            Cookies.set("device", device, {
                expires: 7,
                sameSite: "Strict",
                path: "/",
            });
        }
    }

    get() {
        const user = Cookies.get("user");
        let parsedUser = null;
        if (user) {
            try {
                parsedUser = JSON.parse(user);
            } catch (e) {
                console.error("Failed to parse user cookie:", e);
                Cookies.remove("user", { path: "/" });
            }
        }
        return {
            access: Cookies.get("access_token") || null,
            refresh: Cookies.get("refresh_token") || null,
            user: parsedUser,
            session_id: Cookies.get("session_id") || null,
            device: Cookies.get("device") || null,
        };
    }

    remove() {
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
        Cookies.remove("session_id", { path: "/" });
        Cookies.remove("device", { path: "/" });

        // Clear session data from localStorage
        clearSession();

        // Trigger redirect to login
        if (typeof window !== 'undefined') {
            window.location.href = ROUTES.AUTH.LOGIN;
        }
    }
}

export const tokenService = new TokenService();
