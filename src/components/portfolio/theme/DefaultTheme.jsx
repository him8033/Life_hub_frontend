// src/components/portfolio/theme/DefaultTheme.jsx

'use client';

import styles from '@/styles/portfolio/theme/DefaultTheme.module.css';
import { FiMail, FiPhone, FiMapPin, FiGlobe } from 'react-icons/fi';

export default function DefaultTheme({ data }) {
    const { portfolio, basic_info } = data;

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1 className={styles.title}>{portfolio?.title || 'Portfolio'}</h1>
                {basic_info && (
                    <div className={styles.info}>
                        <p><strong>{basic_info.first_name} {basic_info.last_name}</strong></p>
                        {basic_info.summary && <p>{basic_info.summary}</p>}
                        <div className={styles.contact}>
                            {basic_info.email && <span><FiMail size={14} /> {basic_info.email}</span>}
                            {basic_info.phone && <span><FiPhone size={14} /> {basic_info.phone}</span>}
                            {basic_info.full_address && <span><FiMapPin size={14} /> {basic_info.full_address}</span>}
                            {basic_info.website && <span><FiGlobe size={14} /> {basic_info.website}</span>}
                        </div>
                    </div>
                )}
                <p className={styles.fallback}>Theme preview not available</p>
            </div>
        </div>
    );
}