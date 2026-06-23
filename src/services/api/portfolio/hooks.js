import { portfolioApi } from './index';

// Import all endpoint definitions
import { snapshotEndpoints } from './snapshotApi';
import { skillCategoryEndpoints } from './skillCategoryApi';
import { masterSkillEndpoints } from './masterSkillApi';
import { masterLanguageEndpoints } from './masterLanguageApi';
import { resumeTemplateEndpoints } from './resumeTemplateApi';
import { portfolioThemeEndpoints } from './portfolioThemeApi';
import { basicInfoEndpoints } from './basicInfoApi';
import { socialLinkEndpoints } from './socialLinkApi';
import { achievementEndpoints } from './achievementApi';
import { hobbyEndpoints } from './hobbyApi';
import { strengthEndpoints } from './strengthApi';
import { languageEndpoints } from './languageApi';
import { educationEndpoints } from './educationApi';
import { experienceEndpoints } from './experienceApi';
import { certificateEndpoints } from './certificateApi';
import { skillEndpoints } from './skillApi';
import { projectEndpoints } from './projectApi';
import { customSectionEndpoints } from './customSectionApi';
import { resumeProjectEndpoints } from './resumeProjectApi';
import { portfolioProjectEndpoints } from './portfolioProjectApi';

// Inject all endpoints - call each function with builder
const injectedApi = portfolioApi.injectEndpoints({
    endpoints: (builder) => ({
        ...snapshotEndpoints(builder),
        ...skillCategoryEndpoints(builder),
        ...masterSkillEndpoints(builder),
        ...masterLanguageEndpoints(builder),
        ...resumeTemplateEndpoints(builder),
        ...portfolioThemeEndpoints(builder),
        ...basicInfoEndpoints(builder),
        ...socialLinkEndpoints(builder),
        ...achievementEndpoints(builder),
        ...hobbyEndpoints(builder),
        ...strengthEndpoints(builder),
        ...languageEndpoints(builder),
        ...educationEndpoints(builder),
        ...experienceEndpoints(builder),
        ...certificateEndpoints(builder),
        ...skillEndpoints(builder),
        ...projectEndpoints(builder),
        ...customSectionEndpoints(builder),
        ...resumeProjectEndpoints(builder),
        ...portfolioProjectEndpoints(builder),
    }),
});

// Export all hooks
export const {
    // Snapshots
    useCreateSnapshotMutation,
    useGetSnapshotsQuery,
    useGetSnapshotQuery,
    useUpdateSnapshotMutation,
    useDeleteSnapshotMutation,
    useDuplicateSnapshotMutation,
    // Skill Categories
    useGetPublicSkillCategoriesQuery,
    useGetAdminSkillCategoriesQuery,
    useCreateSkillCategoryMutation,
    useGetSkillCategoryQuery,
    useUpdateSkillCategoryMutation,
    useDeleteSkillCategoryMutation,
    // Master Skills
    useGetPublicMasterSkillsQuery,
    useGetAdminMasterSkillsQuery,
    useCreateMasterSkillMutation,
    useGetMasterSkillQuery,
    useUpdateMasterSkillMutation,
    useDeleteMasterSkillMutation,
    // Master Languages
    useGetPublicMasterLanguagesQuery,
    useGetAdminMasterLanguagesQuery,
    useCreateMasterLanguageMutation,
    useGetMasterLanguageQuery,
    useUpdateMasterLanguageMutation,
    useDeleteMasterLanguageMutation,
    // Resume Templates
    useGetPublicResumeTemplatesQuery,
    useGetAdminResumeTemplatesQuery,
    useCreateResumeTemplateMutation,
    useGetResumeTemplateQuery,
    useUpdateResumeTemplateMutation,
    useDeleteResumeTemplateMutation,
    // Resume Template Sections
    useGetTemplateSectionsQuery,
    useUpdateTemplateSectionMutation,
    // Portfolio Themes
    useGetPublicPortfolioThemesQuery,
    useGetAdminPortfolioThemesQuery,
    useCreatePortfolioThemeMutation,
    useGetPortfolioThemeQuery,
    useUpdatePortfolioThemeMutation,
    useDeletePortfolioThemeMutation,
    // Portfolio Template Sections
    useGetThemeSectionsQuery,
    useUpdateThemeSectionMutation,
    // Basic Info
    useGetBasicInfoQuery,
    useSaveBasicInfoMutation,
    // Profile Social Links
    useGetProfileSocialLinksQuery,
    useCreateProfileSocialLinkMutation,
    useUpdateProfileSocialLinkMutation,
    useDeleteProfileSocialLinkMutation,
    useReorderProfileSocialLinksMutation,
    // Achievements
    useGetAchievementsQuery,
    useCreateAchievementMutation,
    useUpdateAchievementMutation,
    useDeleteAchievementMutation,
    useReorderAchievementsMutation,
    // Hobbies
    useGetHobbiesQuery,
    useCreateHobbyMutation,
    useUpdateHobbyMutation,
    useDeleteHobbyMutation,
    useReorderHobbiesMutation,
    // Strengths
    useGetStrengthsQuery,
    useCreateStrengthMutation,
    useUpdateStrengthMutation,
    useDeleteStrengthMutation,
    useReorderStrengthsMutation,
    // Profile Languages
    useGetProfileLanguagesQuery,
    useCreateProfileLanguageMutation,
    useUpdateProfileLanguageMutation,
    useDeleteProfileLanguageMutation,
    useReorderProfileLanguagesMutation,
    // Profile Education
    useGetProfileEducationQuery,
    useCreateProfileEducationMutation,
    useUpdateProfileEducationMutation,
    useDeleteProfileEducationMutation,
    useReorderProfileEducationMutation,
    // Profile Experience
    useGetProfileExperienceQuery,
    useCreateProfileExperienceMutation,
    useUpdateProfileExperienceMutation,
    useDeleteProfileExperienceMutation,
    useReorderProfileExperienceMutation,
    // Profile Certificate
    useGetProfileCertificatesQuery,
    useCreateProfileCertificateMutation,
    useUpdateProfileCertificateMutation,
    useDeleteProfileCertificateMutation,
    useReorderProfileCertificatesMutation,
    // Profile Skill
    useGetProfileSkillsQuery,
    useCreateProfileSkillMutation,
    useUpdateProfileSkillMutation,
    useDeleteProfileSkillMutation,
    useReorderProfileSkillsMutation,
    // Profile Project
    useGetProfileProjectsQuery,
    useCreateProfileProjectMutation,
    useGetProfileProjectQuery,
    useUpdateProfileProjectMutation,
    useDeleteProfileProjectMutation,
    useReorderProfileProjectsMutation,
    // Project Skills
    useGetProjectSkillsQuery,
    useAddProjectSkillMutation,
    useRemoveProjectSkillMutation,
    // Project Images
    useGetProjectImagesQuery,
    useUploadProjectImageMutation,
    useUpdateProjectImageMutation,
    useDeleteProjectImageMutation,
    useReorderProjectImagesMutation,
    // Profile Custom Sections
    useGetProfileCustomSectionsQuery,
    useCreateProfileCustomSectionMutation,
    useUpdateProfileCustomSectionMutation,
    useDeleteProfileCustomSectionMutation,
    useReorderProfileCustomSectionsMutation,
    // Resume Projects
    useGetResumeProjectsQuery,
    useCreateResumeProjectMutation,
    useGetResumeProjectQuery,
    useUpdateResumeProjectMutation,
    useDeleteResumeProjectMutation,
    useDuplicateResumeProjectMutation,
    useGenerateResumePDFMutation,
    useGetPublicResumeQuery,
    // Resume Exports
    useGetResumeExportsQuery,
    useDeleteResumeExportMutation,
    // Portfolio Projects
    useGetPortfolioProjectsQuery,
    useCreatePortfolioProjectMutation,
    useGetPortfolioProjectQuery,
    useUpdatePortfolioProjectMutation,
    useDeletePortfolioProjectMutation,
    useDuplicatePortfolioProjectMutation,
    // Portfolio Analytics
    useGetPortfolioAnalyticsQuery,
} = injectedApi;