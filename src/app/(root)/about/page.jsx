'use client';

import PageLayout from '@/components/layout/PageLayout';
import styles from '@/styles/pages/About.module.css';

export default function AboutPage() {
    return (
        <PageLayout
            heroTitle="About LifeHub"
            heroDescription="We're passionate about making travel planning and management easier for everyone."
        >
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
        </PageLayout>
    );
}