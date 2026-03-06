'use client';

import styles from '@/styles/layout/PageLayout.module.css';
import common from '@/styles/pages/common.module.css';

export default function PageLayout({
    children,
    heroTitle,
    heroDescription,
    heroSubtitle,
    showHero = true,
    containerClass = '',
    contentClass = ''
}) {
    return (
        <div className={`${common.container} ${containerClass}`}>
            {showHero && (
                <section className={common.heroSection}>
                    <h1 className={common.heroTitle}>{heroTitle}</h1>
                    {heroDescription && (
                        <p className={common.heroDescription}>{heroDescription}</p>
                    )}
                    {heroSubtitle && (
                        <p className={common.heroSubtitle}>{heroSubtitle}</p>
                    )}
                </section>
            )}

            <div className={`${styles.contentWrapper} ${contentClass}`}>
                {children}
            </div>
        </div>
    );
}