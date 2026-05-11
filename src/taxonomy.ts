export const contentDomains = [
  "portrait",
  "fashion_outfit",
  "cosplay",
  "travel_landscape",
  "street_photography",
  "food_drink",
  "product_still",
  "event_exhibition",
  "pet_animal",
  "daily_vlog",
  "interior_architecture",
  "commercial_brand",
  "mixed_unknown"
] as const;

export const platforms = [
  "xiaohongshu",
  "douyin",
  "bilibili",
  "wechat_channels",
  "instagram_reels",
  "tiktok",
  "weibo",
  "wechat_article"
] as const;

export const tagGroups = [
  "subjectTags",
  "sceneTags",
  "visualTags",
  "actionTags",
  "contentRoleTags",
  "platformTags",
  "riskTags",
  "styleTags"
] as const;

export const imageExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".bmp",
  ".tif",
  ".tiff",
  ".heic",
  ".heif"
]);

export const videoExtensions = new Set([
  ".mp4",
  ".mov",
  ".m4v",
  ".avi",
  ".mkv",
  ".webm",
  ".mts",
  ".m2ts"
]);

export type ContentDomain = (typeof contentDomains)[number];
export type Platform = (typeof platforms)[number];
