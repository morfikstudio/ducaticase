export const listYourPropertyHeroDesignDimensions = {
  mobile: { width: 720, height: 960 },
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
