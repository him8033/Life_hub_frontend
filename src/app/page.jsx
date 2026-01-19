// "use client";

// import { LandingSections } from "@/config/sections";

// export default function LandingPage() {
//   return (
//     <main>
//       {LandingSections.map((Section, index) => (
//         <Section key={index} />
//       ))}
//     </main>
//   );
// }


'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/styles/pages/Landing.module.css';
import { ROUTES } from '@/routes/routes.constants';
import { tokenService } from '@/services/auth/token.service';

export default function LandingPage() {
  const router = useRouter();

  const handleGetStarted = () => {
    const isAuthenticated = tokenService.get();
    if (isAuthenticated) {
      router.push(ROUTES.DASHBOARD.HOME);
    } else {
      router.push(ROUTES.AUTH.REGISTER);
    }
  };

  const handleExploreSpots = () => {
    router.push(ROUTES.PUBLIC.TRAVELSPOTS);
  };

  return (
    <div className={styles.landingContainer}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Discover, Manage & Share
            <span className={styles.highlight}> Amazing Travel Experiences</span>
          </h1>
          <p className={styles.heroDescription}>
            LifeHub helps you explore breathtaking travel destinations, manage your favorite spots,
            and share your experiences with fellow travelers worldwide.
          </p>
          <div className={styles.heroButtons}>
            <button
              onClick={handleGetStarted}
              className={styles.primaryButton}
            >
              Get Started Free
            </button>
            <button
              onClick={handleExploreSpots}
              className={styles.secondaryButton}
            >
              Explore Travel Spots
            </button>
          </div>
        </div>
        <div className={styles.heroImage}>
          {/* Placeholder for hero image */}
          <div className={styles.imagePlaceholder}>
            <div className={styles.floatingElement} style={{ '--delay': '0s' }}>✈️</div>
            <div className={styles.floatingElement} style={{ '--delay': '0.5s' }}>🗺️</div>
            <div className={styles.floatingElement} style={{ '--delay': '1s' }}>🏔️</div>
            <div className={styles.floatingElement} style={{ '--delay': '1.5s' }}>🏖️</div>
            <div className={styles.floatingElement} style={{ '--delay': '2s' }}>🏛️</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Why Choose LifeHub?</h2>
          <p className={styles.sectionDescription}>
            Our platform offers everything you need for your travel journey
          </p>
        </div>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🗺️</div>
            <h3 className={styles.featureTitle}>Discover Destinations</h3>
            <p className={styles.featureDescription}>
              Explore thousands of travel spots with detailed information, photos, and reviews.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📝</div>
            <h3 className={styles.featureTitle}>Manage Your Spots</h3>
            <p className={styles.featureDescription}>
              Create, organize, and track your favorite travel destinations in one place.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>🤝</div>
            <h3 className={styles.featureTitle}>Share Experiences</h3>
            <p className={styles.featureDescription}>
              Share your travel experiences and recommendations with our community.
            </p>
          </div>
          <div className={styles.featureCard}>
            <div className={styles.featureIcon}>📍</div>
            <h3 className={styles.featureTitle}>Detailed Info</h3>
            <p className={styles.featureDescription}>
              Get complete information including location, coordinates, and travel tips.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2 className={styles.ctaTitle}>Ready to Start Your Travel Journey?</h2>
          <p className={styles.ctaDescription}>
            Join thousands of travelers who use LifeHub to discover and manage their favorite destinations.
          </p>
          <div className={styles.ctaButtons}>
            <button
              onClick={handleGetStarted}
              className={styles.ctaPrimaryButton}
            >
              Create Free Account
            </button>
            <Link href={ROUTES.PUBLIC.TRAVELSPOTS} className={styles.ctaLink}>
              Browse Travel Spots →
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.statsSection}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>1000+</div>
            <div className={styles.statLabel}>Travel Spots</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>5000+</div>
            <div className={styles.statLabel}>Happy Travelers</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>50+</div>
            <div className={styles.statLabel}>Cities Covered</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statNumber}>24/7</div>
            <div className={styles.statLabel}>Support Available</div>
          </div>
        </div>
      </section>
    </div>
  );
}