'use client';

import styles from '@/styles/pages/About.module.css';

export default function AboutPage() {
    return (
        <div className={styles.aboutContainer}>
            <div className={styles.heroSection}>
                <h1 className={styles.heroTitle}>About LifeHub</h1>
                <p className={styles.heroDescription}>
                    We're passionate about making travel planning and management easier for everyone.
                </p>
            </div>

            <div className={styles.contentSection}>
                <div className={styles.contentGrid}>
                    <div className={styles.contentCard}>
                        <h2>Our Mission</h2>
                        <p>
                            To create a platform where travelers can discover, manage, and share their
                            travel experiences seamlessly.
                        </p>
                    </div>

                    <div className={styles.contentCard}>
                        <h2>Our Vision</h2>
                        <p>
                            To become the go-to platform for travel enthusiasts worldwide, connecting
                            people through shared experiences and beautiful destinations.
                        </p>
                    </div>

                    <div className={styles.contentCard}>
                        <h2>Our Values</h2>
                        <p>
                            We believe in authenticity, community, and making travel accessible to everyone
                            through innovative technology.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}