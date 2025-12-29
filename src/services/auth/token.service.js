"use client";
import Cookies from "js-cookie";

class TokenService {
    store({ access, refresh, user }) {
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

        if (user) {
            Cookies.set("user", JSON.stringify(user), {
                expires: 7,
                sameSite: "Strict",
                path: "/",
            });
        }
    }

    get() {
        const user = Cookies.get("user");
        return {
            access: Cookies.get("access_token") || null,
            refresh: Cookies.get("refresh_token") || null,
            user: user ? JSON.parse(user) : null
        };
    }

    remove() {
        Cookies.remove("access_token", { path: "/" });
        Cookies.remove("refresh_token", { path: "/" });
        Cookies.remove("user", { path: "/" });
    }
}

export const tokenService = new TokenService();
