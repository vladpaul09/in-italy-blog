import "dotenv/config";

const config = {
  SALT_ROUNDS: 10,
  accessRevaldiate: 60 * 2, // 2 minutes
  fallbackLocale: "it",
  fallbackLocaleId: 1,
  noNameDefault: "N/A",
  frontendUrl: process.env.FRONTEND_URL || "https://initaly.it",
  // serverNameStatics: process.env.NODE_ENV === "development" ? "http://localhost:8000" : process.env.SERVER_NAME_STATICS,
  serverNameStatics: process.env.SERVER_NAME_STATICS,
  maxLimitNews: 6,
  menuArticleLimit: 3,
  menuEventLimit: 3,
  rateLimitMax: 1111,
  // Web Push Configuration
  vapid: {
    publicKey: "BB3beVD8BNvMpSA9taA0jLAgF2GJgWI2Q5W3aN2fY6dSu5AXVsQTsOZyt6pJQJz2P-VWGZP61KagOZLJw83AHig",
    privateKey: "Bp6s9axTxE8Dtair278H09QMNA_7pAq8CdFpAm8qDoE",
    subject: "mailto:info@ndbwebservice.com",
  },
  // Resend Email Configuration
  resend: {
    apiKey: "re_jGSy34bx_NdG7MnJfKUvqq6AMxTDeRzrS",
    fromEmail: process.env.RESEND_FROM_EMAIL || "noreply@shop.initaly.it",
    fromName: process.env.RESEND_FROM_NAME || "In Italy",
  },
};

export default config;
