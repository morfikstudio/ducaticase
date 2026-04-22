export const listYourPropertyCoverDesignDimensions = {
  mobile: { width: 720, height: 960 },
  desktop: { width: 1920, height: 1080 },
} as const

const DPR = 2 as const

export const listYourPropertyCoverRecommendedCrop = {
  landscape: {
    aspectRatio: "16:9",
    width: listYourPropertyCoverDesignDimensions.desktop.width * DPR,
    height: listYourPropertyCoverDesignDimensions.desktop.height * DPR,
  },
  portrait: {
    aspectRatio: "4:5",
    width: listYourPropertyCoverDesignDimensions.mobile.width * DPR,
    height: listYourPropertyCoverDesignDimensions.mobile.height * DPR,
  },
} as const
