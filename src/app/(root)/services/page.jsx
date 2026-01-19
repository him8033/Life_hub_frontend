'use client';

import styles from '@/styles/pages/Services.module.css';

export default function ServicesPage() {
    const services = [
        {
            title: 'Travel Spot Management',
            description: 'Create, edit, and manage your favorite travel destinations with detailed information.',
            icon: '🗺️',
        },
        {
            title: 'Destination Discovery',
            description: 'Explore thousands of travel spots with photos, reviews, and detailed guides.',
            icon: '🔍',
        },
        {
            title: 'Trip Planning',
            description: 'Plan your trips with our intuitive tools and save your favorite itineraries.',
            icon: '📅',
        },
        {
            title: 'Community Sharing',
            description: 'Share your travel experiences and connect with fellow travelers.',
            icon: '👥',
        },
        {
            title: 'Location Analytics',
            description: 'Get insights about popular destinations and travel trends.',
            icon: '📊',
        },
        {
            title: 'Mobile Access',
            description: 'Access your travel spots and plans on the go with our mobile-friendly platform.',
            icon: '📱',
        },
    ];

    return (
        <div className={styles.servicesContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Our Services</h1>
                <p className={styles.heroDescription}>
                    Discover all the amazing features and services we offer to enhance your travel experience.
                </p>
            </section>

            {/* Services Grid */}
            <section className={styles.servicesSection}>
                <div className={styles.servicesGrid}>
                    {services.map((service, index) => (
                        <div key={index} className={styles.serviceCard}>
                            <div className={styles.serviceIcon}>{service.icon}</div>
                            <h3 className={styles.serviceTitle}>{service.title}</h3>
                            <p className={services.serviceDescription}>{service.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className={styles.ctaSection}>
                <h2 className={styles.ctaTitle}>Ready to Get Started?</h2>
                <p className={styles.ctaDescription}>
                    Join LifeHub today and start exploring amazing travel destinations.
                </p>
                <div className={styles.ctaButtons}>
                    <button className={styles.primaryButton}>
                        Sign Up Free
                    </button>
                    <button className={styles.secondaryButton}>
                        Learn More
                    </button>
                </div>
            </section>
        </div>
    );
}