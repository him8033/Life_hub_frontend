'use client';

import Link from 'next/link';
import styles from '@/styles/layout/Footer.module.css';
import { ROUTES } from '@/routes/routes.constants';
import {
    FaBriefcase,
    FaClock,
    FaFacebook,
    FaInstagram,
    FaLinkedin,
    FaMailBulk,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaTwitter,
    FaYoutube,
    FaGithub
} from 'react-icons/fa';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const socialLinks = [
        { icon: FaFacebook, href: '#', label: 'Facebook', color: '#1877f2' },
        { icon: FaTwitter, href: '#', label: 'Twitter', color: '#1da1f2' },
        { icon: FaInstagram, href: '#', label: 'Instagram', color: '#e4405f' },
        { icon: FaLinkedin, href: '#', label: 'LinkedIn', color: '#0077b5' },
        { icon: FaYoutube, href: '#', label: 'YouTube', color: '#ff0000' },
        { icon: FaGithub, href: '#', label: 'GitHub', color: '#333' },
    ];

    return (
        <footer className={styles.footer}>
            <div className={styles.footerContainer}>
                {/* Top Section */}
                <div className={styles.footerTop}>
                    {/* Company Info */}
                    <div className={styles.footerSection}>
                        <h3 className={styles.footerTitle}>LifeHub</h3>
                        <p className={styles.footerDescription}>
                            Your one-stop solution for managing travel experiences and discovering amazing destinations across India.
                        </p>
                        <div className={styles.socialLinks}>
                            {socialLinks.map((social, index) => (
                                <a
                                    key={index}
                                    href={social.href}
                                    className={styles.socialLink}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <social.icon />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerSubtitle}>Quick Links</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href={ROUTES.PUBLIC.HOME} className={styles.footerLink}>Home</Link></li>
                            <li><Link href={ROUTES.PUBLIC.TRAVELSPOTS} className={styles.footerLink}>Travel Spots</Link></li>
                            <li><Link href="/about" className={styles.footerLink}>About Us</Link></li>
                            <li><Link href="/services" className={styles.footerLink}>Services</Link></li>
                            <li><Link href="/contact" className={styles.footerLink}>Contact</Link></li>
                            <li><Link href="/blog" className={styles.footerLink}>Blog</Link></li>
                        </ul>
                    </div>

                    {/* Services */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerSubtitle}>Services</h4>
                        <ul className={styles.footerLinks}>
                            <li><Link href="/dashboard/travelspots" className={styles.footerLink}>Travel Spot Management</Link></li>
                            <li><Link href="#" className={styles.footerLink}>Travel Planning</Link></li>
                            <li><Link href="#" className={styles.footerLink}>Destination Guides</Link></li>
                            <li><Link href="#" className={styles.footerLink}>Trip Reviews</Link></li>
                            <li><Link href="#" className={styles.footerLink}>Custom Itineraries</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className={styles.footerSection}>
                        <h4 className={styles.footerSubtitle}>Contact Us</h4>
                        <ul className={styles.contactInfo}>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}><FaMapMarkerAlt /></span>
                                <span>123 Travel Street, Connaught Place, New Delhi - 110001, India</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}><FaPhoneAlt /></span>
                                <span>+91 98765 43210</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}><FaMailBulk /></span>
                                <span>info@lifehub.com</span>
                            </li>
                            <li className={styles.contactItem}>
                                <span className={styles.contactIcon}><FaClock /></span>
                                <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className={styles.footerBottom}>
                    <p className={styles.copyright}>© {currentYear} LifeHub. All rights reserved.</p>
                    <div className={styles.legalLinks}>
                        <Link href="/privacy" className={styles.legalLink}>Privacy Policy</Link>
                        <Link href="/terms" className={styles.legalLink}>Terms of Service</Link>
                        <Link href="/cookies" className={styles.legalLink}>Cookie Policy</Link>
                        <Link href="/sitemap" className={styles.legalLink}>Sitemap</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}