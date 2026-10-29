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
    FiLock,
    FiKey,
    FiLink,
    FiClock,
    FiMonitor,
    FiFileText,
    FiSettings,
    FiChevronDown,
    FiChevronRight
} from 'react-icons/fi';
import styles from '@/styles/dashboard/Sidebar.module.css';
import { ROUTES, canAccessRoute } from '@/routes/routes.constants';
import { FaPalette } from 'react-icons/fa';
import { useUserRole } from '@/services/auth/role.service';

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
                id: 'account',
                label: 'Accounts',
                icon: <FiUser />,
                submenu: [
                    {
                        label: 'Users',
                        icon: <FiUsers />,
                        href: ROUTES.DASHBOARD.ACCOUNT.USERS,
                    },
                    {
                        label: 'Statuses',
                        icon: <FiLayers />,
                        href: ROUTES.DASHBOARD.ACCOUNT.STATUS,
                    },
                    {
                        label: 'Roles',
                        icon: <FiShield />,
                        href: ROUTES.DASHBOARD.ACCOUNT.ROLES,
                    },
                    {
                        label: 'Role Permissions',
                        icon: <FiKey />,
                        href: ROUTES.DASHBOARD.ACCOUNT.ROLEPERMISSIONS,
                    },
                    {
                        label: 'OTP Purposes',
                        icon: <FiLock />,
                        href: ROUTES.DASHBOARD.ACCOUNT.OTPPURPOSES,
                    },
                    {
                        label: 'Permissions',
                        icon: <FiKey />,
                        href: ROUTES.DASHBOARD.ACCOUNT.PERMISSIONS,
                    },
                    {
                        label: 'Social Providers',
                        icon: <FiLink />,
                        href: ROUTES.DASHBOARD.ACCOUNT.SOCIALPROVIDERS,
                    },
                    {
                        label: 'Social Accounts',
                        icon: <FiUserPlus />,
                        href: ROUTES.DASHBOARD.ACCOUNT.SOCIALACCOUNTS,
                    },
                    {
                        label: 'Login History',
                        icon: <FiClock />,
                        href: ROUTES.DASHBOARD.ACCOUNT.LOGINHISTORY,
                    },
                    {
                        label: 'OTP Records',
                        icon: <FiLock />,
                        href: ROUTES.DASHBOARD.ACCOUNT.OTPS,
                    },
                    {
                        label: 'User Sessions',
                        icon: <FiMonitor />,
                        href: ROUTES.DASHBOARD.ACCOUNT.USERSESSIONS,
                    },
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
                        show: true,
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
                submenu: [
                    {
                        label: 'Skill Categories',
                        icon: <FiGrid />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.SKILLCATEGORY.LIST,
                    },
                    {
                        label: 'Master Skills',
                        icon: <FiCode />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.MASTERSKILL.LIST,
                    },
                    {
                        label: 'Languages',
                        icon: <FiGlobe />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.MASTERLANGUAGE.LIST,
                    },
                    {
                        label: 'Resume Templates',
                        icon: <FiFileText />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.RESUMETEMPLATE.LIST,
                    },
                    {
                        label: 'Portfolio Themes',
                        icon: <FaPalette />,
                        href: ROUTES.DASHBOARD.PORTFOLIO.PORTFOLIOTHEME.LIST,
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

// Check if item should be shown using centralized routeAccess configuration
const shouldShow = (item, role) => {
    // 1. Explicit override if set on the item
    if (item.show === 'admin') return role === 'admin';
    if (item.show === 'user') return role !== 'admin';
    if (item.show === false) return false;

    // 2. Check route access rule if item has an href
    if (item.href) {
        return canAccessRoute(item.href, role);
    }

    // 3. For parent container with submenu, show if AT LEAST ONE subitem is accessible
    if (item.submenu && item.submenu.length > 0) {
        return item.submenu.some(sub => shouldShow(sub, role));
    }

    return true;
};

const Sidebar = ({ closeSidebar, isOpen }) => {
    const pathname = usePathname();
    const { role, mounted } = useUserRole();

    const [openSubmenus, setOpenSubmenus] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
    const hoverTimeoutRef = useRef(null);
    const dropdownRef = useRef(null);

    // Initialize open submenus
    useEffect(() => {
        if (!mounted) return;

        const initialOpenState = {};
        menuItems.forEach(section => {
            section.items.forEach(item => {
                if (!shouldShow(item, role)) return;
                if (item.submenu) {
                    const isActive = item.submenu.some(subItem =>
                        shouldShow(subItem, role) && pathname.startsWith(subItem.href)
                    );
                    if (isActive) {
                        initialOpenState[item.id] = true;
                    }
                }
            });
        });
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setOpenSubmenus(initialOpenState);
    }, [pathname, role, mounted]);

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

    // Filter menu items based on role using centralized route access
    const filteredMenuItems = menuItems
        .map(section => {
            const filteredItems = section.items
                .filter(item => shouldShow(item, role))
                .map(item => {
                    if (item.submenu) {
                        return {
                            ...item,
                            submenu: item.submenu.filter(sub => shouldShow(sub, role))
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