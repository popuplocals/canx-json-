/**
 * Site navigation — every link, label and description is taken verbatim from the live canxglobal.com
 * mega-menu, so internal linking (and what crawlers see in the header) is unchanged.
 */
export type NavLeaf = { t: string; d?: string; h: string };
export type NavTab = { t: string; h: string; intro?: string; kids?: NavLeaf[]; kidsTitle?: string; sub?: { title: string; items: NavLeaf[] } };

export const SITE_CONTACT = {
  phone: "+1 778 564 3555", phoneHref: "tel:+17785643555",
  tollFree: "+1 888 752 2023", tollFreeHref: "tel:+18887522023",
  email: "help@canxglobal.com",
};

export const RECRUITMENT: NavTab[] = [
  { t: "Employers", h: "/employers/", intro: "Find, hire, and retain local, global, and TFW talent with expert sourcing and screening." },
  { t: "Hire Local", h: "/hire-local/", intro: "The Future of Business Starts Locally — Hire top local talent with affordable recruitment solutions." },
  { t: "Hire Global", h: "/hire-global/", intro: "Boundless Hiring, Endless Opportunities — Hire global talent with expert recruitment and staffing solutions." },
  { t: "Hire Remote", h: "/hire-remote/", intro: "Boundless Talent, Seamless Collaboration — Hire remote talent with flexible and efficient staffing." },
  {
    t: "LMIA", h: "/lmia/", intro: "Hire Temporary Foreign Workers with LMIA to meet your critical workforce needs efficiently.",
    kids: [
      { t: "High/Low Wage Stream", d: "Hire Temporary Foreign Workers for Your Critical Workforce Needs.", h: "/lmia/high-low-wage-lmia/" },
      { t: "Agriculture Stream", d: "Hire Temporary Foreign Workers for Your Critical Workforce Needs.", h: "/lmia/agriculture-stream-lmia/" },
      { t: "Global Talent Stream", d: "Quick, affordable, and efficient hiring for startups and industry leaders.", h: "/lmia/global-talent-stream-lmia/" },
      { t: "Caregiver/Nanny", d: "Hire a Nanny or Caregiver for children, seniors, and individuals with disabilities.", h: "/lmia/caregiver/" },
    ],
  },
  { t: "Job Seekers", h: "/job-seekers/", intro: "Find the Job You Deserve — Connect with top opportunities tailored to your skills and goals." },
];

export const IMMIGRATION: NavTab[] = [
  {
    t: "Permanent Residency", h: "/permanent-residency/",
    kids: [
      { t: "Express Entry", d: "Fast-Track Your Permanent Residency in Canada.", h: "/permanent-residency/express-entry/" },
      { t: "Provincial Nominee", d: "Settle in Canada where your skills are in demand.", h: "/permanent-residency/provincial-nominee-program/" },
      { t: "Family Sponsorship", d: "Reunite with loved ones in Canada seamlessly and successfully.", h: "/permanent-residency/family-sponsorship/" },
      { t: "Start Up Visa", d: "Launch Your Business in Canada and Build a Global Legacy.", h: "/permanent-residency/start-up-visa/" },
      { t: "Humanitarian and Compassionate (H&C)", d: "When Other Doors Close, H&C Opens a Path to Hope and Stability in Canada.", h: "/permanent-residency/humanitarian-and-compassionate-hc/" },
    ],
    sub: {
      title: "Family Sponsorship",
      items: [
        { t: "Spouse or Partner Sponsorship", d: "Sponsor Your Spouse, Common-Law, or Conjugal Partner to Canada.", h: "/permanent-residency/family-sponsorship/spouse-or-partner-sponsorship/" },
        { t: "Parents & Grandparents Sponsorship", d: "Bring Your Parents & Grandparents Home — Reunite and Stay Together in Canada.", h: "/permanent-residency/family-sponsorship/parents-grandparents-sponsorship/" },
        { t: "Dependent Child", d: "Sponsor Your Child — Every Child Deserves to Be with Family.", h: "/permanent-residency/family-sponsorship/dependent-child/" },
        { t: "Close Relative Sponsorship", d: "Sponsor orphaned siblings, nephews, nieces, and grandchildren to Canada with ease.", h: "/permanent-residency/family-sponsorship/close-relative-sponsorship/" },
      ],
    },
  },
  {
    t: "Work Permit", h: "/work-permit/",
    kids: [
      { t: "LMIA Based Work Permit", d: "Canada Needs Workers — Connect with Employers Seeking Hardworking Talent.", h: "/work-permit/lmia-based-work-permit/" },
      { t: "International Free Trade Agreements", d: "Work in Canada Made Easy — Leverage Free Trade Agreements for Seamless Entry.", h: "/work-permit/international-free-trade-agreements/" },
      { t: "Intra Company Transfer", d: "Move Talent Seamlessly Across Borders to Canada.", h: "/work-permit/intra-company-transfer/" },
      { t: "International Mobility Program", d: "Transfer Talent and Grow Your Business in Canada.", h: "/work-permit/international-mobility-program/" },
      { t: "Post Graduation Work Permit", d: "Study and Work in Canada — Post-Graduation Work Permit Opens Doors to Your Future.", h: "/work-permit/post-graduation-work-permit/" },
      { t: "Bridging Open Work Permit", d: "Keep Working in Canada While Awaiting PR.", h: "/work-permit/bridging-open-work-permit/" },
      { t: "International Experience Canada", d: "Work in Canada Without an LMIA Through Youth Mobility Agreements.", h: "/work-permit/international-experience-canada/" },
    ],
  },
  { t: "Study", h: "/study/", intro: "Study in Canada — Learn, Work, and Build Your Future in Canada." },
  { t: "Visit", h: "/visit/", intro: "Visit Canada — Explore, Reunite, and Experience Unmatched Hospitality." },
  { t: "Citizenship", h: "/citizenship/", intro: "Become a Canadian Citizen — Unlock Opportunities, Freedom, and a Future Without Limits." },
];

export const RESOURCES = {
  main: [
    { t: "Job Board", d: "Let Us Find Your Perfect Fit — Share Your Resume and Unlock Top Job Opportunities.", h: "/job-board/" },
    { t: "Career Guide", d: "Your Success, Our Mission: Guiding You with Care and Confidence.", h: "/career-guide/" },
  ] as NavLeaf[],
  guides: [
    { t: "Interview Guide", d: "Master Every Question and Land Your Dream Job.", h: "/career-guide/interview-guide/" },
    { t: "Resume Guide", d: "Craft a Standout Resume and Unlock Career Opportunities.", h: "/career-guide/resume-guide/" },
  ] as NavLeaf[],
};

export const BLOGS = [
  {
    t: "Recruitment", d: "Expert tips, industry insights and hiring strategies for employers and job seekers.", h: "/recruitment-blog/",
    feature: { t: "Building a Better Team — Turning Challenges into Success", h: "/building-a-better-team/", img: "/wp-content/uploads/2025/06/20-1024x572-1-1.jpg.webp" },
  },
  {
    t: "Immigration", d: "Canada immigration news, pathways, updates and eligibility guides.", h: "/immigration-blogs/",
    feature: { t: "What are the eligibility requirements for Express Entry?", h: "/what-are-the-eligibility-requirements-for-express-entry/", img: "/wp-content/uploads/2025/04/unnamed-9-1.webp" },
  },
];

export const COMPANY: (NavLeaf & { icon: string })[] = [
  { icon: "📖", t: "Our Story", d: "Empowering Lives. Transforming Workplaces.", h: "/our-story/" },
  { icon: "🎯", t: "Mission & Purpose", d: "We Help Companies Thrive and People Succeed — Real People, Real Solutions.", h: "/mission-purpose/" },
  { icon: "📊", t: "Why Can X", d: "Powered by People and Technology.", h: "/why-can-x/" },
  { icon: "✍️", t: "Careers", d: "Join Our Team — Grow, Innovate, and Make an Impact.", h: "/careers/" },
  { icon: "🕒", t: "Contact Us", d: "Real People. Real Solutions. No Bots, Just Genuine Support.", h: "/contact-us/" },
  { icon: "📒", t: "Affiliations", d: "Proudly affiliated with leading Canadian immigration and business associations.", h: "/affiliations/" },
  { icon: "👥", t: "Our Team", d: "Meet the people behind your success.", h: "/team/" },
  { icon: "🎙️", t: "Beyond Immigration", d: "Real Stories. Real People. Real Impact.", h: "/beyond-immigration-the-podcast/" },
];

/** Top-level groups, in header order. `match` = path prefixes that mark the group as current. */
export const GROUPS = [
  { key: "recruitment", label: "Recruitment", match: ["/employers", "/hire-local", "/hire-global", "/hire-remote", "/lmia", "/job-seekers"] },
  { key: "immigration", label: "Immigration", match: ["/permanent-residency", "/work-permit", "/study", "/visit", "/citizenship"] },
  { key: "resources", label: "Resources", match: ["/job-board", "/career-guide"] },
  { key: "blogs", label: "Blogs", match: ["/recruitment-blog", "/immigration-blogs"] },
  { key: "company", label: "Company", match: ["/our-story", "/mission-purpose", "/why-can-x", "/careers", "/contact-us", "/affiliations", "/team", "/beyond-immigration"] },
] as const;
export type GroupKey = (typeof GROUPS)[number]["key"];
