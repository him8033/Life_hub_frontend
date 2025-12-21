"use client";
import Cookies from "js-cookie";

class TokenService {
    store({ access, refresh }) {
        if (!access) return;
        Cookies.set("access_token", access, {
            expires: 1, // 1 day
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
    }

    get() {
        return {
            access: Cookies.get("access_token") || null,
            refresh: Cookies.get("refresh_token") || null,
        };
    }

    remove() {
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
    }
}

export const tokenService = new TokenService();
