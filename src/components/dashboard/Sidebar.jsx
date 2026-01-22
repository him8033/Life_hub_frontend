'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUsers,
    FiFileText,
    FiSettings,
    FiChevronDown,
    FiChevronRight,
    FiUser
} from 'react-icons/fi';
import styles from '@/styles/dashboard/Sidebar.module.css';
import { ROUTES } from '@/routes/routes.constants';

const menuItems = [
    {
        title: 'Main',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <FiHome />,
                href: ROUTES.DASHBOARD.HOME,
                submenu: []
            },
        ]
    },
    {
        title: 'Management',
        items: [
            {
                id: 'users',
                label: 'Users',
                icon: <FiUsers />,
                href: '#',
                submenu: [
                    { label: 'All Users', href: '/dashboard/users' },
                    { label: 'Add User', href: '/dashboard/users/add' },
                    { label: 'Roles', href: '/dashboard/users/roles' }
                ]
            },
            {
                id: 'travelhub',
                label: 'Travel Hub',
                icon: <FiFileText />,
                href: '#',
                submenu: [
                    { label: 'Travel Spots', href: ROUTES.DASHBOARD.TRAVELSPOT.LIST },
                    { label: 'Spot Categories', href: ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST },
                ]
            },
        ]
    },
    {
        title: 'Account',
        items: [
            {
                id: 'profile',
                label: 'My Profile',
                icon: <FiUser />,
                href: ROUTES.DASHBOARD.PROFILE,
                submenu: []
            }
        ]
    },
    {
        title: 'Settings',
        items: [
            {
                id: 'settings',
                label: 'Settings',
                icon: <FiSettings />,
                href: '/dashboard/settings',
                submenu: []
            }
        ]
    }
];

const MenuItem = ({ item, pathname, openSubmenus, toggleSubmenu, closeSidebar }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = pathname === item.href ||
        (hasSubmenu && item.submenu.some(sub => sub.href === pathname));

    const handleClick = () => {
        if (!hasSubmenu) {
            closeSidebar(); // Close sidebar when clicking a non-submenu item on mobile
        }
    };

    return (
        <li className={styles.menuItem}>
            {hasSubmenu ? (
                <>
                    <button
                        onClick={() => toggleSubmenu(item.id)}
                        className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                        style={{
                            background: 'none',
                            border: 'none',
                            width: '100%',
                            textAlign: 'left',
                            cursor: 'pointer'
                        }}
                    >
                        <span className={styles.menuIcon}>{item.icon}</span>
                        <span className={styles.menuText}>{item.label}</span>
                        <span className={styles.menuIcon} style={{ marginLeft: 'auto' }}>
                            {openSubmenus[item.id] ? <FiChevronDown /> : <FiChevronRight />}
                        </span>
                    </button>

                    <div className={`${styles.submenu} ${openSubmenus[item.id] ? styles.submenuOpen : ''}`}>
                        <ul className={styles.submenuList}>
                            {item.submenu.map((subItem, index) => (
                                <li key={index} className={styles.submenuItem}>
                                    <Link
                                        href={subItem.href}
                                        className={`${styles.submenuLink} ${pathname === subItem.href ? styles.submenuLinkActive : ''}`}
                                        onClick={closeSidebar}
                                    >
                                        {subItem.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </>
            ) : (
                <Link
                    href={item.href}
                    className={`${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`}
                    onClick={handleClick}
                >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuText}>{item.label}</span>
                </Link>
            )}
        </li>
    );
};

const Sidebar = ({ closeSidebar }) => {
    const pathname = usePathname();
    const [openSubmenus, setOpenSubmenus] = useState({
        users: false,
        content: false,
        finance: false,
        ecommerce: false
    });

    const toggleSubmenu = (menuId) => {
        setOpenSubmenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    return (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarHeader}>
                <h3 className={styles.sidebarTitle}>Navigation</h3>
            </div>

            {menuItems.map((section, index) => (
                <div key={index}>
                    <div className={styles.menuTitle}>{section.title}</div>
                    <ul className={styles.menuList}>
                        {section.items.map((item) => (
                            <MenuItem
                                key={item.id}
                                item={item}
                                pathname={pathname}
                                openSubmenus={openSubmenus}
                                toggleSubmenu={toggleSubmenu}
                                closeSidebar={closeSidebar}
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;