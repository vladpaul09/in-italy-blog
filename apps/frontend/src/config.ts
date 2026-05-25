const serverNameBackend = !process.env.NODE_ENV || process.env.NODE_ENV === "development" ? "https://api.initaly.it" : "https://api.initaly.it";
// const serverNameBackend = "https://api.initaly.it";

const isMobileApp = process.env.IS_MOBILE_APP === "true";
const domain = isMobileApp ? "https://app.initaly.it" : "https://initaly.it";

const config = {
  fallbackLocale: "it",
  tripadvisorAPIKey: "0073DEDD1A7B45F681443B60ED4607F1",
  tripadvisorEndpoint: "https://api.content.tripadvisor.com",
  isMobileApp: isMobileApp,
  domain: domain,
  serverNameBackend: serverNameBackend,
  fetchRevalidate: 1 * 60, // seconds
  fetchHomepageRevalidate: 1 * 60,
  weatherAPIKey: "ae751c5f525843ed9de163422251504",
  COOKIEBOT_ID: "eb0bf23b-469b-4291-a915-b9469b231dd9",
  spacingDesktop: 2,
  spacingMobile: 2,
  spacingRowColumnRatio: 2.1875,
  fontSizeDesktopTitleSection: 52,
  fontSizeMobileTitleSection: 32,
  fontSizeSubtitleSectionDesktop: 36,
  fontSizeSubtitleSectioMobile: 32,
  fontSizeArticleTitle: 18,
  fontSizeDefaultText: 16,
  fontWeightTitleDefault: 600,
  fontWeightDefault: 500,
  borderRadius: "4px",
  perPageCategoryArticles: 8,
  perPageCategoryEvents: 8,
  perPageCategoryPodcasts: 8,
  GA_TRACKING_ID: "GTM-5J77K7J5",
  admin: {
    localStorageUserPermissionsKey: "RaUserPerm",
    mainDataProviderUrlBase: `${serverNameBackend}/api/radmin`,
    authDataProviderUrlBase: `${serverNameBackend}/api/radmin/auth`,
    suggestionLimit: 100,
    dataProviderPerPage: 10000,
  },
  seo: {
    APP_NAME: "inItaly | True Italian Experience",
    APP_DEFAULT_TITLE: "inItaly | True Italian Experience",
    APP_TITLE_TEMPLATE: "%s - inItaly",
    APP_DESCRIPTION: "inItaly | True Italian Experience",
  },
  vapidPublicKey: "BB3beVD8BNvMpSA9taA0jLAgF2GJgWI2Q5W3aN2fY6dSu5AXVsQTsOZyt6pJQJz2P-VWGZP61KagOZLJw83AHig",
  vapidPrivateKey: "Bp6s9axTxE8Dtair278H09QMNA_7pAq8CdFpAm8qDoE",
  instagram: {
    accessToken: "IGAAPzuEBqoZBZABZAFRVMTlJNFVNRzdFaFcyYmdhLWdmdWthQzZAaeWtWZAE0xRnY1OHJNcFh2Yk1HckVxUThVLUJEbElLT3hpYkhQNXVTV0ZAQZAlN3S3ZAVd2JyUlR1NVJhVGRNWFQ1akpyQmc3VDRQX1dkMFpwTi1OVE5kS0dMUzBSMAZDZD",
    userId: "17841455679208034",
    hashtag: "initaly", // Hashtag to filter posts by
  },
};

export default config;
