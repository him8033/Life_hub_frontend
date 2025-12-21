import { tokenService } from "./token.service";

class AuthService {
    isAuthenticated() {
        const { access } = tokenService.get();
        return Boolean(access);
    }
    // future helpers: refreshToken, logout, getUserFromToken, etc.
}

export const authService = new AuthService();
