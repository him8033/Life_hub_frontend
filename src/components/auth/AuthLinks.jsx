'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FiArrowRight, FiExternalLink } from 'react-icons/fi';
import { Button } from '@/components/ui/button';
import styles from '@/styles/auth/AuthLinks.module.css';

export default function AuthLinks({
    links = [],
    className = '',
    variant = 'card', // 'default', 'card', 'minimal'
}) {
    const pathname = usePathname();

    if (links.length === 0) return null;

    return (
        <div className={`${styles.linksContainer} ${styles[variant]} ${className}`}>
            {links.map((link, index) => {
                const isActive = pathname === link.href;
                const isExternal = link.external || link.href.startsWith('http');

                return (
                    <div key={index} className={styles.linkWrapper}>
                        {link.prefix && (
                            <span className={styles.linkPrefix}>{link.prefix}</span>
                        )}

                        {isExternal ? (
                            <Button
                                variant="link"
                                className={`${styles.link} ${isActive ? styles.active : ''}`}
                                asChild
                            >
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {link.text}
                                    <FiExternalLink className={styles.linkIcon} />
                                </a>
                            </Button>
                        ) : (
                            <Button
                                variant="link"
                                className={`${styles.link} ${isActive ? styles.active : ''}`}
                                asChild
                            >
                                <Link href={link.href}>
                                    {link.text}
                                    {link.showIcon && <FiArrowRight className={styles.linkIcon} />}
                                </Link>
                            </Button>
                        )}

                        {index < links.length - 1 && variant === 'default' && (
                            <span className={styles.separator} aria-hidden="true">•</span>
                        )}
                    </div>
                );
            })}
        </div>
    );
}