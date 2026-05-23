import {
    FiUser, FiLink, FiCode, FiBriefcase, FiBook,
    FiFolder, FiAward, FiStar, FiFlag, FiHeart,
    FiShield, FiGrid
} from 'react-icons/fi';

export const PROFILE_SECTIONS = [
    {
        id: 'basic-info',
        title: 'Basic Info',
        description: 'Personal information and contact details',
        icon: 'FiUser',
        component: 'BasicInfoSection',
        required: true,
        order: 1,
        enabled: true,
    },
    {
        id: 'social-links',
        title: 'Social Links',
        description: 'GitHub, LinkedIn, and other profiles',
        icon: 'FiLink',
        component: 'SocialLinksSection',
        required: false,
        order: 2,
        enabled: true,
    },
    {
        id: 'skills',
        title: 'Skills',
        description: 'Technical skills and proficiency levels',
        icon: 'FiCode',
        component: 'SkillsSection',
        required: false,
        order: 3,
        enabled: true,
    },
    {
        id: 'experience',
        title: 'Experience',
        description: 'Work history and professional experience',
        icon: 'FiBriefcase',
        component: 'ExperienceSection',
        required: false,
        order: 4,
        enabled: true,
    },
    {
        id: 'education',
        title: 'Education',
        description: 'Academic background and qualifications',
        icon: 'FiBook',
        component: 'EducationSection',
        required: false,
        order: 5,
        enabled: true,
    },
    {
        id: 'projects',
        title: 'Projects',
        description: 'Portfolio projects and case studies',
        icon: 'FiFolder',
        component: 'ProjectsSection',
        required: false,
        order: 6,
        enabled: true,
    },
    {
        id: 'certificates',
        title: 'Certificates',
        description: 'Professional certifications and credentials',
        icon: 'FiAward',
        component: 'CertificatesSection',
        required: false,
        order: 7,
        enabled: true,
    },
    {
        id: 'achievements',
        title: 'Achievements',
        description: 'Awards, honors, and accomplishments',
        icon: 'FiStar',
        component: 'AchievementsSection',
        required: false,
        order: 8,
        enabled: true,
    },
    {
        id: 'languages',
        title: 'Languages',
        description: 'Languages you know and proficiency levels',
        icon: 'FiFlag',
        component: 'LanguagesSection',
        required: false,
        order: 9,
        enabled: true,
    },
    {
        id: 'hobbies',
        title: 'Hobbies',
        description: 'Personal interests and activities',
        icon: 'FiHeart',
        component: 'HobbiesSection',
        required: false,
        order: 10,
        enabled: true,
    },
    {
        id: 'strengths',
        title: 'Strengths',
        description: 'Key strengths and personal traits',
        icon: 'FiShield',
        component: 'StrengthsSection',
        required: false,
        order: 11,
        enabled: true,
    },
    {
        id: 'custom-sections',
        title: 'Custom Sections',
        description: 'Add your own custom content sections',
        icon: 'FiGrid',
        component: 'CustomSectionsSection',
        required: false,
        order: 12,
        enabled: true,
    },
];

// Icon mapping for dynamic rendering
export const SECTION_ICONS = {
    FiUser, FiLink, FiCode, FiBriefcase, FiBook,
    FiFolder, FiAward, FiStar, FiFlag, FiHeart,
    FiShield, FiGrid
};

// Helper functions
export const getEnabledSections = () =>
    PROFILE_SECTIONS
        .filter(s => s.enabled)
        .sort((a, b) => a.order - b.order);

export const getRequiredSections = () =>
    PROFILE_SECTIONS.filter(s => s.required);

export const getSectionById = (id) =>
    PROFILE_SECTIONS.find(s => s.id === id);

export const getNextSection = (currentId) => {
    const enabled = getEnabledSections();
    const currentIndex = enabled.findIndex(s => s.id === currentId);
    if (currentIndex < enabled.length - 1) {
        return enabled[currentIndex + 1];
    }
    return null;
};

export const getPreviousSection = (currentId) => {
    const enabled = getEnabledSections();
    const currentIndex = enabled.findIndex(s => s.id === currentId);
    if (currentIndex > 0) {
        return enabled[currentIndex - 1];
    }
    return null;
};