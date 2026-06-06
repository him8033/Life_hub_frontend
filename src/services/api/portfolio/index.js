import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "../baseQueryWithReauth";

export const portfolioApi = createApi({
    reducerPath: "portfolioApi",
    baseQuery: baseQueryWithReauth,
    tagTypes: [
        "Snapshot",
        "SkillCategory",
        "MasterSkill",
        "MasterLanguage",
        "ResumeTemplate",
        "PortfolioTheme",
        "BasicInfo",
        "ProfileSocialLink",
        "Achievement",
        "Hobby",
        "Strength",
        "ProfileLanguage",
        "ProfileEducation",
        "ProfileExperience",
        "ProfileCertificate",
        "ProfileSkill",
        "ProfileProject",
        "ProjectSkill",
        "ProjectImage",
        "ProfileCustomSection",
        "ResumeProject",
        "ResumeExport",
        "PortfolioProject",
        "PortfolioView",
    ],
    endpoints: () => ({}), // Empty - endpoints injected from modules
});