module.exports = {
  i18n: {
    defaultLocale: "en",
    locales: ["en", "hu"],
    localeDetection: true,
  },
  reloadOnPrerender: process.env.NODE_ENV === "development",
};
