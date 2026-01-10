'use client';

import { useState } from 'react';
import { FiEdit2, FiSave, FiX } from 'react-icons/fi';
import { MdEmail, MdPhone, MdLocationOn, MdCalendarToday, MdVerified } from 'react-icons/md';
import { AiOutlineUser } from 'react-icons/ai';
import styles from '@/styles/profile.module.css';

const ProfilePage = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [userData, setUserData] = useState({
        fullName: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+1 (555) 123-4567',
        location: 'New York, USA',
        jobTitle: 'Software Engineer',
        department: 'Engineering',
        joinDate: '2023-01-15',
        bio: 'Passionate software engineer with 5+ years of experience in full-stack development. Specialized in React, Node.js, and cloud technologies.',
        skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB', 'AWS'],
        status: 'Active'
    });

    const [tempData, setTempData] = useState({ ...userData });

    const handleEdit = () => {
        setTempData({ ...userData });
        setIsEditing(true);
    };

    const handleSave = () => {
        setUserData({ ...tempData });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
    };

    const handleChange = (field, value) => {
        setTempData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <div className={styles.profileContainer}>
            {/* Header */}
            <div className={styles.profileHeader}>
                <h1 className={styles.profileTitle}>My Profile</h1>
                <p className={styles.profileSubtitle}>Manage your personal information and settings</p>

                <div className={styles.actionButtons}>
                    {!isEditing ? (
                        <button className={styles.editButton} onClick={handleEdit}>
                            <FiEdit2 /> Edit Profile
                        </button>
                    ) : (
                        <div className={styles.editActions}>
                            <button className={styles.saveButton} onClick={handleSave}>
                                <FiSave /> Save Changes
                            </button>
                            <button className={styles.cancelButton} onClick={handleCancel}>
                                <FiX /> Cancel
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className={styles.profileContent}>
                {/* Left Column - Profile Card & Basic Info */}
                <div className={styles.leftColumn}>
                    {/* Profile Card */}
                    <div className={styles.profileCard}>
                        <div className={styles.avatarSection}>
                            <div className={styles.avatar}>
                                <AiOutlineUser size={60} />
                            </div>
                            <div className={styles.avatarInfo}>
                                <h3 className={styles.userName}>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempData.fullName}
                                            onChange={(e) => handleChange('fullName', e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        userData.fullName
                                    )}
                                </h3>
                                <p className={styles.userTitle}>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempData.jobTitle}
                                            onChange={(e) => handleChange('jobTitle', e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        userData.jobTitle
                                    )}
                                </p>
                                <div className={`${styles.statusBadge} ${styles[userData.status.toLowerCase()]}`}>
                                    <MdVerified /> {userData.status}
                                </div>
                            </div>
                        </div>

                        <div className={styles.statsSection}>
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>47</span>
                                <span className={styles.statLabel}>Projects</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>128</span>
                                <span className={styles.statLabel}>Tasks</span>
                            </div>
                            <div className={styles.statDivider} />
                            <div className={styles.statItem}>
                                <span className={styles.statNumber}>89%</span>
                                <span className={styles.statLabel}>Completion</span>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className={styles.infoCard}>
                        <h3 className={styles.cardTitle}>Contact Information</h3>
                        <div className={styles.infoList}>
                            <div className={styles.infoItem}>
                                <MdEmail className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Email</span>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={tempData.email}
                                            onChange={(e) => handleChange('email', e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{userData.email}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <MdPhone className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Phone</span>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={tempData.phone}
                                            onChange={(e) => handleChange('phone', e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{userData.phone}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <MdLocationOn className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Location</span>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            value={tempData.location}
                                            onChange={(e) => handleChange('location', e.target.value)}
                                            className={styles.editInput}
                                        />
                                    ) : (
                                        <span className={styles.infoValue}>{userData.location}</span>
                                    )}
                                </div>
                            </div>

                            <div className={styles.infoItem}>
                                <MdCalendarToday className={styles.infoIcon} />
                                <div className={styles.infoContent}>
                                    <span className={styles.infoLabel}>Member Since</span>
                                    <span className={styles.infoValue}>
                                        {new Date(userData.joinDate).toLocaleDateString('en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Bio & Skills */}
                <div className={styles.rightColumn}>
                    {/* Bio Section */}
                    <div className={styles.bioCard}>
                        <h3 className={styles.cardTitle}>About Me</h3>
                        {isEditing ? (
                            <textarea
                                value={tempData.bio}
                                onChange={(e) => handleChange('bio', e.target.value)}
                                className={styles.editTextarea}
                                rows="5"
                            />
                        ) : (
                            <p className={styles.bioText}>{userData.bio}</p>
                        )}
                    </div>

                    {/* Skills Section */}
                    <div className={styles.skillsCard}>
                        <div className={styles.skillsHeader}>
                            <h3 className={styles.cardTitle}>Skills & Expertise</h3>
                            {isEditing && (
                                <button className={styles.addSkillButton}>+ Add Skill</button>
                            )}
                        </div>

                        <div className={styles.skillsList}>
                            {userData.skills.map((skill, index) => (
                                <div key={index} className={styles.skillTag}>
                                    {skill}
                                    {isEditing && (
                                        <button className={styles.removeSkill}>&times;</button>
                                    )}
                                </div>
                            ))}
                            {isEditing && (
                                <input
                                    type="text"
                                    placeholder="Add new skill..."
                                    className={styles.skillInput}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && e.target.value.trim()) {
                                            handleChange('skills', [...tempData.skills, e.target.value.trim()]);
                                            e.target.value = '';
                                        }
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className={styles.activityCard}>
                        <h3 className={styles.cardTitle}>Recent Activity</h3>
                        <div className={styles.activityList}>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot} />
                                <div className={styles.activityContent}>
                                    <p className={styles.activityText}>Updated profile information</p>
                                    <span className={styles.activityTime}>2 hours ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot} />
                                <div className={styles.activityContent}>
                                    <p className={styles.activityText}>Completed project "Dashboard Redesign"</p>
                                    <span className={styles.activityTime}>1 day ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot} />
                                <div className={styles.activityContent}>
                                    <p className={styles.activityText}>Added new team member</p>
                                    <span className={styles.activityTime}>3 days ago</span>
                                </div>
                            </div>
                            <div className={styles.activityItem}>
                                <div className={styles.activityDot} />
                                <div className={styles.activityContent}>
                                    <p className={styles.activityText}>Reset password</p>
                                    <span className={styles.activityTime}>1 week ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;