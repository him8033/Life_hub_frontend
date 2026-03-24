'use client';

import styles from '@/styles/auth/AuthLayout.module.css';

export default function AuthLayout({
    children,
    title,
    subtitle,
    showFooter = true,
    footerProps = {},
    maxWidth = '400px',
    className = '',
}) {
    const currentYear = new Date().getFullYear();

    return (
        <div className={`${styles.authContainer} ${className}`}>
            {/* Left Side - Branding with Footer */}
            <div className={styles.brandSide}>
                <div className={styles.brandContent}>
                    <img 
                        src="/assets/images/logo.png" 
                        alt="LifeHub" 
                        className={styles.brandLogo}
                        width={120}
                        height={120}
                    />
                    <h1 className={styles.brandName}>LifeHub</h1>
                    <p className={styles.brandTagline}>
                        Manage your life,<br />one hub at a time
                    </p>
                    
                    <div className={styles.brandFeatures}>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>✓</span>
                            <span>Discover amazing travel spots</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>✓</span>
                            <span>Manage your favorite destinations</span>
                        </div>
                        <div className={styles.featureItem}>
                            <span className={styles.featureIcon}>✓</span>
                            <span>Share experiences with community</span>
                        </div>
                    </div>

                    {/* Footer - Only visible on desktop */}
                    {showFooter && (
                        <div className={styles.brandFooter}>
                            <p className={styles.copyright}>
                                © {currentYear} LifeHub. All rights reserved.
                            </p>
                            <div className={styles.footerLinks}>
                                <a href="/privacy" className={styles.footerLink}>Privacy</a>
                                <span className={styles.footerSeparator}>•</span>
                                <a href="/terms" className={styles.footerLink}>Terms</a>
                                <span className={styles.footerSeparator}>•</span>
                                <a href="/help" className={styles.footerLink}>Help</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Right Side - Form Only */}
            <div className={styles.formSide}>
                <div className={styles.formWrapper} style={{ maxWidth }}>
                    {/* Form Header inside form section */}
                    <div className={styles.formHeader}>
                        <h2 className={styles.formTitle}>{title}</h2>
                        {subtitle && <p className={styles.formSubtitle}>{subtitle}</p>}
                    </div>

                    {/* Form Content */}
                    <div className={styles.authCard}>
                        {children}
                    </div>

                    {/* Mobile Footer - Only visible on mobile */}
                    {showFooter && (
                        <div className={styles.mobileFooter}>
                            <p className={styles.mobileCopyright}>
                                © {currentYear} LifeHub. All rights reserved.
                            </p>
                            <div className={styles.mobileFooterLinks}>
                                <a href="/privacy" className={styles.mobileFooterLink}>Privacy</a>
                                <span className={styles.mobileFooterSeparator}>•</span>
                                <a href="/terms" className={styles.mobileFooterLink}>Terms</a>
                                <span className={styles.mobileFooterSeparator}>•</span>
                                <a href="/help" className={styles.mobileFooterLink}>Help</a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}