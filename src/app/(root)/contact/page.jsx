'use client';

import { useState } from 'react';
import styles from '@/styles/pages/Contact.module.css';
import { FaMapMarkerAlt } from 'react-icons/fa';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log('Form submitted:', formData);
        alert('Thank you for your message! We will get back to you soon.');
        setFormData({
            name: '',
            email: '',
            subject: '',
            message: '',
        });
    };

    return (
        <div className={styles.contactContainer}>
            {/* Hero Section */}
            <section className={styles.heroSection}>
                <h1 className={styles.heroTitle}>Contact Us</h1>
                <p className={styles.heroDescription}>
                    Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                </p>
            </section>

            <div className={styles.contentWrapper}>
                {/* Contact Info */}
                <div className={styles.contactInfoSection}>
                    <h2 className={styles.sectionTitle}>Get in Touch</h2>
                    <p className={styles.sectionDescription}>
                        We're here to help with any questions about our services or platform.
                    </p>

                    <div className={styles.contactDetails}>
                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}><FaMapMarkerAlt title="Location" /></div>
                            <div>
                                <h3>Visit Us</h3>
                                <p>123 Travel Street<br />Delhi, India 110001</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>📞</div>
                            <div>
                                <h3>Call Us</h3>
                                <p>+91 9876543210<br />Mon-Fri, 9am-6pm</p>
                            </div>
                        </div>

                        <div className={styles.contactItem}>
                            <div className={styles.contactIcon}>✉️</div>
                            <div>
                                <h3>Email Us</h3>
                                <p>support@lifehub.com<br />info@lifehub.com</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className={styles.contactFormSection}>
                    <h2 className={styles.sectionTitle}>Send a Message</h2>
                    <form onSubmit={handleSubmit} className={styles.contactForm}>
                        <div className={styles.formGroup}>
                            <label htmlFor="name" className={styles.formLabel}>Name *</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                placeholder="Your name"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.formLabel}>Email *</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                placeholder="Your email address"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="subject" className={styles.formLabel}>Subject *</label>
                            <input
                                type="text"
                                id="subject"
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                className={styles.formInput}
                                required
                                placeholder="What is this regarding?"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="message" className={styles.formLabel}>Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                className={styles.formTextarea}
                                required
                                placeholder="Your message..."
                                rows="5"
                            />
                        </div>

                        <button type="submit" className={styles.submitButton}>
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}