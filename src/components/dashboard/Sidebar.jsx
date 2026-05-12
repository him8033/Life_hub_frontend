'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FiHome,
    FiUsers,
    FiMap,
    FiTag,
    FiPlusCircle,
    FiList,
    FiUser,
    FiSettings,
    FiChevronDown,
    FiChevronRight
} from 'react-icons/fi';
import { AiFillProfile } from 'react-icons/ai';
import styles from '@/styles/dashboard/Sidebar.module.css';
import { ROUTES } from '@/routes/routes.constants';

const menuItems = [
    {
        title: 'MAIN',
        items: [
            {
                id: 'dashboard',
                label: 'Dashboard',
                icon: <FiHome />,
                href: ROUTES.DASHBOARD.HOME,
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
                submenu: [
                    { label: 'All Users', href: '/dashboard/users' },
                    { label: 'Add User', href: '/dashboard/users/add' },
                    { label: 'Roles', href: '/dashboard/users/roles' }
                ]
            },
            {
                id: 'travelhub',
                label: 'Travel Hub',
                icon: <FiMap />,
                submenu: [
                    { label: 'All Travel Spots', href: ROUTES.DASHBOARD.TRAVELSPOT.LIST },
                    { label: 'Spot Categories', href: ROUTES.DASHBOARD.TRAVELSPOT.SPOTCATEGORY.LIST },
                ]
            },
            {
                id: 'portfolio',
                label: 'Portfolio Hub',
                icon: <AiFillProfile />,
                submenu: [
                    { label: 'All Snapshots', href: ROUTES.DASHBOARD.PORTFOLIO.LIST },
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
            }
        ]
    }
];

const Sidebar = ({ closeSidebar, isOpen }) => {
    const pathname = usePathname();
    const [openSubmenus, setOpenSubmenus] = useState({});
    const [hoveredItem, setHoveredItem] = useState(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0 });
    const hoverTimeoutRef = useRef(null);
    const dropdownRef = useRef(null);
    const itemRefs = useRef({});

    // Initialize open submenus based on current path
    useEffect(() => {
        const initialOpenState = {};
        menuItems.forEach(section => {
            section.items.forEach(item => {
                if (item.submenu) {
                    // Check if any submenu item matches current path
                    const isActive = item.submenu.some(subItem => 
                        isPathActive(subItem.href)
                    );
                    if (isActive) {
                        initialOpenState[item.id] = true;
                    }
                }
            });
        });
        setOpenSubmenus(initialOpenState);
    }, [pathname]);

    // Improved path matching function
    const isPathActive = (href) => {
        if (!href) return false;
        
        // Exact match for dashboard home
        if (href === ROUTES.DASHBOARD.HOME) {
            return pathname === href;
        }
        
        // For other routes, check if pathname starts with href
        // But make sure we're not matching dashboard home accidentally
        if (href !== ROUTES.DASHBOARD.HOME) {
            return pathname === href || pathname.startsWith(href + '/');
        }
        
        return false;
    };

    const isActive = (href) => {
        if (!href) return false;
        return isPathActive(href);
    };

    const isParentActive = (item) => {
        if (item.submenu) {
            return item.submenu.some(subItem => 
                isPathActive(subItem.href)
            );
        }
        return false;
    };

    // Check if current route is dashboard home
    const isDashboardActive = () => {
        return pathname === ROUTES.DASHBOARD.HOME;
    };

    const toggleSubmenu = (menuId) => {
        if (!isOpen) return;
        setOpenSubmenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    const handleMouseEnter = (itemId, event) => {
        if (!isOpen) {
            // Clear any pending hide timeout
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
            
            setHoveredItem(itemId);
            // Calculate position based on the menu item's position
            const rect = event.currentTarget.getBoundingClientRect();
            let topPosition = rect.top + (rect.height / 2);
            
            // Adjust if dropdown would go off screen
            const dropdownHeight = 300; // Approximate dropdown height
            const viewportHeight = window.innerHeight;
            
            if (topPosition + dropdownHeight / 2 > viewportHeight) {
                topPosition = viewportHeight - dropdownHeight / 2 - 20;
            }
            if (topPosition - dropdownHeight / 2 < 0) {
                topPosition = dropdownHeight / 2 + 20;
            }
            
            setDropdownPosition({ top: topPosition });
        }
    };

    const handleMouseLeave = () => {
        if (!isOpen) {
            // Delay hiding to allow moving to dropdown
            hoverTimeoutRef.current = setTimeout(() => {
                setHoveredItem(null);
            }, 200);
        }
    };

    const handleDropdownMouseEnter = () => {
        // Cancel hide timeout when entering dropdown
        if (hoverTimeoutRef.current) {
            clearTimeout(hoverTimeoutRef.current);
        }
    };

    const handleDropdownMouseLeave = () => {
        // Hide dropdown when leaving
        setHoveredItem(null);
    };

    // Cleanup timeout on unmount
    useEffect(() => {
        return () => {
            if (hoverTimeoutRef.current) {
                clearTimeout(hoverTimeoutRef.current);
            }
        };
    }, []);

    return (
        <nav className={styles.sidebarNav}>
            {menuItems.map((section, idx) => (
                <div key={idx} className={styles.menuSection}>
                    {isOpen && <div className={styles.menuTitle}>{section.title}</div>}
                    <ul className={styles.menuList}>
                        {section.items.map((item) => {
                            // For dashboard, use exact matching
                            const isItemActive = item.href === ROUTES.DASHBOARD.HOME 
                                ? isDashboardActive()
                                : isActive(item.href);
                            const isParentItemActive = isParentActive(item);
                            
                            return (
                                <li 
                                    key={item.id} 
                                    className={styles.menuItem}
                                    onMouseEnter={(e) => handleMouseEnter(item.id, e)}
                                    onMouseLeave={handleMouseLeave}
                                    ref={el => itemRefs.current[item.id] = el}
                                >
                                    {item.href ? (
                                        <Link
                                            href={item.href}
                                            className={`${styles.menuLink} ${(isItemActive || isParentItemActive) ? styles.active : ''}`}
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
                                                className={`${styles.menuLink} ${styles.hasSubmenu} ${isParentItemActive ? styles.active : ''}`}
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
                                            
                                            {/* Dropdown for mini sidebar hover */}
                                            {!isOpen && hoveredItem === item.id && item.submenu && (
                                                <div 
                                                    ref={dropdownRef}
                                                    className={styles.dropdownMenu}
                                                    style={{ top: `${dropdownPosition.top}px` }}
                                                    onMouseEnter={handleDropdownMouseEnter}
                                                    onMouseLeave={handleDropdownMouseLeave}
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
                                                            <span className={styles.dropdownItemText}>{subItem.label}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            )}
                                            
                                            {/* Normal submenu for expanded sidebar */}
                                            {isOpen && openSubmenus[item.id] && (
                                                <div className={styles.submenu}>
                                                    {item.submenu.map((subItem, idx) => (
                                                        <Link
                                                            key={idx}
                                                            href={subItem.href}
                                                            className={`${styles.submenuLink} ${isActive(subItem.href) ? styles.active : ''}`}
                                                            onClick={closeSidebar}
                                                        >
                                                            <span className={styles.submenuText}>{subItem.label}</span>
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