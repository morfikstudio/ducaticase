/**
 * Ritaglio hero «Affidaci»: desktop **20:9**, mobile **4:5**.
 * `listYourPropertyHeroRecommendedCrop` usa px **2×** per il CDN; la GROQ
 * `recommendedCrop` documenta i px design **1×** (stessi rapporti).
 */
export const listYourPropertyHeroDesignDimensions = {
  mobile: { width: 800, height: 1000 },
  desktop: { width: 1920, height: 810 },
} as const

const DPR = 2 as const

export const listYourPropertyHeroRecommendedCrop = {
  landscape: {
    aspectRatio: "20:9",
    width: listYourPropertyHeroDesignDimensions.desktop.width * DPR,
    height: listYourPropertyHeroDesignDimensions.desktop.height * DPR,
  },
  portrait: {
    aspectRatio: "4:5",
    width: listYourPropertyHeroDesignDimensions.mobile.width * DPR,
    height: listYourPropertyHeroDesignDimensions.mobile.height * DPR,
  },
} as const
