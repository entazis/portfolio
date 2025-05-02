export const defaultNS = "common";
export const fallbackLng = "en";

export const getOptions = (lng = fallbackLng, ns = defaultNS) => ({
  supportedLngs: ["en", "hu"],
  fallbackLng,
  lng,
  fallbackNS: defaultNS,
  defaultNS,
  ns,
});
