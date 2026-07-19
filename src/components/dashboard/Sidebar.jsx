// src/components/dashboard/Sidebar.jsx

'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUsers,
    FiUser,
    FiUserPlus,
    FiShield,
    FiMap,
    FiMapPin,
    FiGrid,
    FiBriefcase,
    FiLayers,
    FiCode,
    FiGlobe,
    FiFileText,
    FiSettings,
    FiChevronDown,
    FiChevronRight,
    FiMonitor
} from 'react-icons/fi';
import styles from '@/styles/dashboard/Sidebar.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { FaPalette } from 'react-icons/fa';
import { tokenService } from '@/services/auth/token.service';

// Menu items with simple visibility config
const menuItems = [
    {
        title: 'MAIN',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <FiHome />,
                href: ROUTES.DASHBOARD.HOME,
                show: true,
            },
        ]
    },

    {
        title: 'MANAGEMENT',
        items: [
            {
                id: 'users',
                label: 'Users',
                icon: <FiUsers />,
                show: true,
                submenu: [
                    {
                        label: 'All Users',
                        icon: <FiUsers />,
                        href: '/dashboard/users',
                        show: true,
                    },
                    {
                        label: 'Add User',
                        icon: <FiUserPlus />,
                        href: '/dashboard/users/add',
                        show: 'admin',
                    },
                    {
                        label: 'Roles',
                        icon: <FiShield />,
                        href: '/dashboard/users/roles',
                        show: 'admin',
                    }
                ]
            },

            {
                id: 'travelhub',
                label: 'Travel Hub',
                icon: <FiMap />,
                show: true,
                submenu: [
                    {
                        label: 'All Travel Spots',
                        icon: <FiMapPin />,
                        href: ROUTES.DASHBOARD.TRAVELSPOT.LIST,
                        show: true,
                    },
                    {
                        label: 'Spot Categories',
                        icon: <FiGrid />,
                        href: ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST,
                        show: 'admin',
                    },
                ]
            },

            {
                id: 'portfolio',
                label: 'Portfolio Hub',
                icon: <FiBriefcase />,
                show: true,
                submenu: [
                    {
                        label: 'All Snapshots',
                        icon: <FiLayers />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.SNAPSHOT.LIST,
                        show: true,
                    },
                    {
                        label: 'All Resumes',
                        icon: <FiFileText />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.RESUME.LIST,
                        show: true,
                    },
                    {
                        label: 'All Portfolios',
                        icon: <FiMonitor />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIO.LIST,
                        show: true,
                    },
                ]
            },

            {
                id: 'portfolio_settings',
                label: 'Portfolio Hub Settings',
                icon: <FiBriefcase />,
                show: 'admin',
                submenu: [
                    {
                        label: 'Skill Categories',
                        icon: <FiGrid />,
                        href: '/dashboard/portfolio/admin/skill-categories',
                        show: 'admin',
                    },
                    {
                        label: 'Master Skills',
                        icon: <FiCode />,
                        href: '/dashboard/portfolio/admin/master-skills',
                        show: 'admin',
                    },
                    {
                        label: 'Languages',
                        icon: <FiGlobe />,
                        href: '/dashboard/portfolio/admin/master-languages',
                        show: 'admin',
                    },
                    {
                        label: 'Resume Templates',
                        icon: <FiFileText />,
                        href: '/dashboard/portfolio/admin/resume-templates',
                        show: 'admin',
                    },
                    {
                        label: 'Portfolio Themes',
                        icon: <FaPalette />,
                        href: '/dashboard/portfolio/admin/portfolio-themes',
                        show: 'admin',
                    },
                ]
            },
        ]
    },

    {
        title: 'ACCOUNT',
        items: [
            {
                id: 'profile',
                label: 'My Profile',
                icon: <FiUser />,
                href: ROUTES.DASHBOARD.PROFILE,
                show: true,
            }
        ]
    },

    {
        title: 'SETTINGS',
        items: [
            {
                id: 'settings',
                label: 'Settings',
                icon: <FiSettings />,
                href: '/dashboard/settings',
                show: true,
            }
        ]
    }
];

// Check if item should be shown
const shouldShow = (item, isAdmin) => {
    if (item.show === 'admin') return isAdmin;
    if (item.show === 'user') return !isAdmin;
    return item.show !== false;
};

const Sidebar = ({ closeSidebar, isOpen }) => {
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    const [openSubmenus, setOpenSubmenus] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
    const hoverTimeoutRef = useRef(null);
    const dropdownRef = useRef(null);

    // Get user role after mounting (client-side only)
    useEffect(() => {
        setMounted(true);
        const { user } = tokenService.get();
        setIsAdmin(user?.role === 'admin');
    }, []);

    // Initialize open submenus
    useEffect(() => {
        if (!mounted) return;

        const initialOpenState = {};
        menuItems.forEach(section => {
            section.items.forEach(item => {
                if (!shouldShow(item, isAdmin)) return;
                if (item.submenu) {
                    const isActive = item.submenu.some(subItem =>
                        shouldShow(subItem, isAdmin) && pathname.startsWith(subItem.href)
                    );
                    if (isActive) {
                        initialOpenState[item.id] = true;
                    }
                }
            });
        });
        setOpenSubmenus(initialOpenState);
    }, [pathname, isAdmin, mounted]);

    const isActive = (href) => {
        if (!href) return false;
        if (href === ROUTES.DASHBOARD.HOME) return pathname === href;
        return pathname === href || pathname.startsWith(href + '/');
    };

    const toggleSubmenu = (menuId) => {
        if (!isOpen) return;
        setOpenSubmenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    // Filter menu items based on role
    const filteredMenuItems = menuItems
        .map(section => {
            const filteredItems = section.items
                .filter(item => shouldShow(item, isAdmin))
                .map(item => {
                    if (item.submenu) {
                        return {
                            ...item,
                            submenu: item.submenu.filter(sub => shouldShow(sub, isAdmin))
                        };
                    }
                    return item;
                })
                .filter(item => {
                    if (item.submenu) return item.submenu.length > 0;
                    return true;
                });

            if (filteredItems.length === 0) return null;
            return { ...section, items: filteredItems };
        })
        .filter(section => section !== null);

    // Prevent hydration mismatch by rendering only after mount
    if (!mounted) {
        // Return a minimal version that matches server render
        return (
            <nav className={styles.sidebarNav}>
                {menuItems.map((section, idx) => (
                    <div key={idx} className={styles.menuSection}>
                        {isOpen && <div className={styles.menuTitle}>{section.title}</div>}
                        <ul className={styles.menuList}>
                            {section.items.map((item) => (
                                <li key={item.id} className={styles.menuItem}>
                                    <div className={styles.menuLink}>
                                        <span className={styles.menuIcon}>{item.icon}</span>
                                        {isOpen && <span className={styles.menuText}>{item.label}</span>}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </nav>
        );
    }

    return (
        <nav className={styles.sidebarNav}>
            {filteredMenuItems.map((section, idx) => (
                <div key={idx} className={styles.menuSection}>
                    {isOpen && <div className={styles.menuTitle}>{section.title}</div>}
                    <ul className={styles.menuList}>
                        {section.items.map((item) => {
                            const isItemActive = isActive(item.href);
                            const isParentActive = item.submenu?.some(sub => isActive(sub.href));

                            return (
                                <li
                                    key={item.id}
                                    className={styles.menuItem}
                                    onMouseEnter={(e) => {
                                        if (!isOpen) {
                                            if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                            setHoveredItem(item.id);
                                            const rect = e.currentTarget.getBoundingClientRect();
                                            setDropdownPosition({ top: rect.top + rect.height / 2 });
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        if (!isOpen) {
                                            hoverTimeoutRef.current = setTimeout(() => setHoveredItem(null), 200);
                                        }
                                    }}
                                >
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className={`${styles.menuLink} ${(isItemActive || isParentActive) ? styles.active : ''}`}
                                            onClick={closeSidebar}
                                            title={!isOpen ? item.label : ''}
                                        >
                                            <span className={styles.menuIcon}>{item.icon}</span>
                                            {isOpen && <span className={styles.menuText}>{item.label}</span>}
                                        </Link>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => toggleSubmenu(item.id)}
                                                className={`${styles.menuLink} ${styles.hasSubmenu} ${isParentActive ? styles.active : ''}`}
                                                title={!isOpen ? item.label : ''}
                                            >
                                                <span className={styles.menuIcon}>{item.icon}</span>
                                                {isOpen && (
                                                    <>
                                                        <span className={styles.menuText}>{item.label}</span>
                                                        <span className={styles.menuChevron}>
                                                            {openSubmenus[item.id] ? <FiChevronDown /> : <FiChevronRight />}
                                                        </span>
                                                    </>
                                                )}
                                            </button>

                                            {/* Mini sidebar hover dropdown */}
                                            {!isOpen && hoveredItem === item.id && item.submenu && (
                                                <div
                                                    ref={dropdownRef}
                                                    className={styles.dropdownMenu}
                                                    style={{ top: `${dropdownPosition.top}px` }}
                                                    onMouseEnter={() => {
                                                        if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
                                                    }}
                                                    onMouseLeave={() => setHoveredItem(null)}
                                                >
                                                    <div className={styles.dropdownHeader}>
                                                        <span className={styles.dropdownIcon}>{item.icon}</span>
                                                        <span className={styles.dropdownTitle}>{item.label}</span>
                                                    </div>
                                                    <div className={styles.dropdownDivider} />
                                                    {item.submenu.map((subItem, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={subItem.href}
                                                            className={`${styles.dropdownItem} ${isActive(subItem.href) ? styles.dropdownItemActive : ''}`}
                                                            onClick={closeSidebar}
                                                        >
                                                            {subItem.icon && (
                                                                <span className={styles.dropdownItemIcon}>
                                                                    {subItem.icon}
                                                                </span>
                                                            )}
                                                            <span className={styles.dropdownItemText}>
                                                                {subItem.label}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Expanded sidebar submenu */}
                                            {isOpen && openSubmenus[item.id] && (
                                                <div className={styles.submenu}>
                                                    {item.submenu.map((subItem, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={subItem.href}
                                                            className={`${styles.submenuLink} ${isActive(subItem.href) ? styles.active : ''}`}
                                                            onClick={closeSidebar}
                                                        >
                                                            {subItem.icon && (
                                                                <span className={styles.submenuIcon}>
                                                                    {subItem.icon}
                                                                </span>
                                                            )}
                                                            <span className={styles.submenuText}>
                                                                {subItem.label}
                                                            </span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                        </>
                                    )}
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}
        </nav>
    );
};

export default Sidebar;