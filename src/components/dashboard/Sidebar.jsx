'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUsers,
    FiBarChart2,
    FiCalendar,
    FiFileText,
    FiSettings,
    FiChevronDown,
    FiChevronRight,
    FiInbox,
    FiCreditCard,
    FiMessageSquare,
    FiShoppingCart,
    FiUser
} from 'react-icons/fi';
import styles from '@/styles/dashboard.module.css';

const menuItems = [
    {
        title: 'Main',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <FiHome />,
                href: '/dashboard',
                submenu: []
            },
            // {
            //     id: 'analytics',
            //     label: 'Analytics',
            //     icon: <FiBarChart2 />,
            //     href: '/dashboard/analytics',
            //     submenu: []
            // }
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
                    { label: 'Travel Spots', href: '/dashboard/content/posts' },
                    // { label: 'Categories', href: '/dashboard/content/categories' },
                    // { label: 'Media', href: '/dashboard/content/media' }
                ]
            },
            // {
            //     id: 'finance',
            //     label: 'Finance',
            //     icon: <FiCreditCard />,
            //     href: '#',
            //     submenu: [
            //         { label: 'Transactions', href: '/dashboard/finance' },
            //         { label: 'Reports', href: '/dashboard/finance/reports' },
            //         { label: 'Invoices', href: '/dashboard/finance/invoices' }
            //     ]
            // }
        ]
    },
    // {
    //     title: 'Applications',
    //     items: [
    //         {
    //             id: 'calendar',
    //             label: 'Calendar',
    //             icon: <FiCalendar />,
    //             href: '/dashboard/calendar',
    //             submenu: []
    //         },
    //         {
    //             id: 'messages',
    //             label: 'Messages',
    //             icon: <FiMessageSquare />,
    //             href: '/dashboard/messages',
    //             submenu: []
    //         },
    //         {
    //             id: 'ecommerce',
    //             label: 'E-commerce',
    //             icon: <FiShoppingCart />,
    //             href: '#',
    //             submenu: [
    //                 { label: 'Products', href: '/dashboard/ecommerce/products' },
    //                 { label: 'Orders', href: '/dashboard/ecommerce/orders' },
    //                 { label: 'Customers', href: '/dashboard/ecommerce/customers' }
    //             ]
    //         },
    //         {
    //             id: 'inbox',
    //             label: 'Inbox',
    //             icon: <FiInbox />,
    //             href: '/dashboard/inbox',
    //             submenu: []
    //         }
    //     ]
    // },
    {
        title: 'Account',
        items: [
            {
                id: 'profile',
                label: 'My Profile',
                icon: <FiUser />,
                href: '/dashboard/profile',
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

const MenuItem = ({ item, pathname, openSubmenus, toggleSubmenu }) => {
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isActive = pathname === item.href ||
        (hasSubmenu && item.submenu.some(sub => sub.href === pathname));

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
                >
                    <span className={styles.menuIcon}>{item.icon}</span>
                    <span className={styles.menuText}>{item.label}</span>
                </Link>
            )}
        </li>
    );
};

const Sidebar = () => {
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
                            />
                        ))}
                    </ul>
                </div>
            ))}
        </aside>
    );
};

export default Sidebar;