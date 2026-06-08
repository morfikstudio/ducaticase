export const aboutSplitSectionDesignDimensions = {
  mobile: { width: 720, height: 360 },
  desktop: { width: 900, height: 900 },
} as const

export const aboutSplitSectionRecommendedCrop = {
  mobile: {
    aspectRatio: "2:1",
    width: aboutSplitSectionDesignDimensions.mobile.width,
    height: aboutSplitSectionDesignDimensions.mobile.height,
  },
  desktop: {
    aspectRatio: "1:1",
    width: aboutSplitSectionDesignDimensions.desktop.width,
    height: aboutSplitSectionDesignDimensions.desktop.height,
  },
} as const

export const aboutSplitSectionStudioPreviewAspect = {
  mobile:
    aboutSplitSectionDesignDimensions.mobile.width /
    aboutSplitSectionDesignDimensions.mobile.height,
  desktop:
    aboutSplitSectionDesignDimensions.desktop.width /
    aboutSplitSectionDesignDimensions.desktop.height,
} as const
