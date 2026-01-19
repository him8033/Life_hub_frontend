'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from '@/styles/layout/Header.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { tokenService } from '@/services/auth/token.service';
import { FaBars, FaTimes } from 'react-icons/fa';

export default function Header() {
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState('');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = () => {
        const token = tokenService.get();
        const user = token.user;

        if (token && user) {
            setIsAuthenticated(true);
            setUserName(user.name || 'User');
        } else {
            setIsAuthenticated(false);
            setUserName('');
        }
    };

    const handleLogout = () => {
        tokenService.remove();
        setIsAuthenticated(false);
        setUserName('');
        router.push(ROUTES.PUBLIC.HOME);
        setIsMenuOpen(false);
    };

    const handleLogin = () => {
        router.push(ROUTES.AUTH.LOGIN);
        setIsMenuOpen(false);
    };

    const handleRegister = () => {
        router.push(ROUTES.AUTH.REGISTER);
        setIsMenuOpen(false);
    };

    const handleDashboard = () => {
        router.push(ROUTES.DASHBOARD.HOME);
        setIsMenuOpen(false);
    };

    const isActive = (path) => {
        return pathname === path ? styles.active : '';
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <div className={styles.logoSection}>
                    <Link href={ROUTES.PUBLIC.HOME} className={styles.logo}>
                        <span className={styles.logoText}>LifeHub</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className={styles.desktopNav}>
                    <ul className={styles.navList}>
                        <li>
                            <Link
                                href={ROUTES.PUBLIC.HOME}
                                className={`${styles.navLink} ${isActive(ROUTES.PUBLIC.HOME)}`}
                            >
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link
                                href={ROUTES.PUBLIC.TRAVELSPOTS}
                                className={`${styles.navLink} ${isActive(ROUTES.PUBLIC.TRAVELSPOTS)}`}
                            >
                                Travel Spots
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/about"
                                className={`${styles.navLink} ${isActive('/about')}`}
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/services"
                                className={`${styles.navLink} ${isActive('/services')}`}
                            >
                                Services
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/contact"
                                className={`${styles.navLink} ${isActive('/contact')}`}
                            >
                                Contact
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Auth Buttons */}
                <div className={styles.authSection}>
                    {isAuthenticated ? (
                        <div className={styles.userMenu}>
                            <span className={styles.welcomeText}>
                                Welcome, <span className={styles.userName}>{userName}</span>
                            </span>
                            <div className={styles.authButtons}>
                                <button
                                    onClick={handleDashboard}
                                    className={styles.dashboardButton}
                                >
                                    Dashboard
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className={styles.logoutButton}
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className={styles.authButtons}>
                            <button
                                onClick={handleLogin}
                                className={styles.loginButton}
                            >
                                Login
                            </button>
                            <button
                                onClick={handleRegister}
                                className={styles.registerButton}
                            >
                                Register
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className={styles.mobileMenuButton}
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className={styles.menuIcon}>
                        {isMenuOpen ? <FaTimes /> : <FaBars />}
                    </span>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className={styles.mobileMenu}>
                    <nav className={styles.mobileNav}>
                        <ul className={styles.mobileNavList}>
                            <li>
                                <Link
                                    href={ROUTES.PUBLIC.HOME}
                                    className={`${styles.mobileNavLink} ${isActive(ROUTES.PUBLIC.HOME)}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href={ROUTES.PUBLIC.TRAVELSPOTS}
                                    className={`${styles.mobileNavLink} ${isActive(ROUTES.PUBLIC.TRAVELSPOTS)}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Travel Spots
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/about"
                                    className={`${styles.mobileNavLink} ${isActive('/about')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/services"
                                    className={`${styles.mobileNavLink} ${isActive('/services')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Services
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/contact"
                                    className={`${styles.mobileNavLink} ${isActive('/contact')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact
                                </Link>
                            </li>
                        </ul>

                        <div className={styles.mobileAuthSection}>
                            {isAuthenticated ? (
                                <>
                                    <div className={styles.mobileUserInfo}>
                                        <span className={styles.mobileWelcomeText}>
                                            Welcome, <span className={styles.mobileUserName}>{userName}</span>
                                        </span>
                                    </div>
                                    <button
                                        onClick={handleDashboard}
                                        className={styles.mobileDashboardButton}
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className={styles.mobileLogoutButton}
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={handleLogin}
                                        className={styles.mobileLoginButton}
                                    >
                                        Login
                                    </button>
                                    <button
                                        onClick={handleRegister}
                                        className={styles.mobileRegisterButton}
                                    >
                                        Register
                                    </button>
                                </>
                            )}
                        </div>
                    </nav>
                </div>
            )}
        </header>
    );
}