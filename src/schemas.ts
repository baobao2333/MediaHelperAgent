import { z } from "zod";
import { contentDomains, platforms } from "./taxonomy.js";

export const ContentDomainSchema = z.enum(contentDomains);
export const PlatformSchema = z.enum(platforms);

export const ProjectConfigSchema = z.object({
  name: z.string(),
  platform: PlatformSchema,
  targetDays: z.number().int().nonnegative(),
  createdAt: z.string()
});

export const AssetSchema = z.object({
  id: z.string(),
  filePath: z.string(),
  fileType: z.enum(["image", "video"]),
  originalName: z.string(),
  extension: z.string(),
  sizeBytes: z.number().int().nonnegative(),
  durationSec: z.number().nonnegative().optional(),
  width: z.number().int().nonnegative(),
  height: z.number().int().nonnegative(),
  fps: z.number().nonnegative().optional(),
  createdAt: z.string().optional(),
  exif: z.record(z.string(), z.unknown()).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export const FrameSampleSchema = z.object({
  assetId: z.string(),
  timestampSec: z.number().nonnegative(),
  imagePath: z.string(),
  frameIndex: z.number().int().nonnegative(),
  sheetPath: z.string().optional()
});

export const TagSetSchema = z.object({
  subjectTags: z.array(z.string()),
  sceneTags: z.array(z.string()),
  visualTags: z.array(z.string()),
  actionTags: z.array(z.string()),
  contentRoleTags: z.array(z.string()),
  platformTags: z.array(z.string()),
  riskTags: z.array(z.string()),
  styleTags: z.array(z.string())
});

export const ClassificationResultSchema = z.object({
  assetId: z.string(),
  primaryDomain: ContentDomainSchema,
  domainScores: z.record(z.string(), z.number().min(0).max(1)),
  confidence: z.number().min(0).max(1),
  tags: TagSetSchema,
  reasoningSummary: z.string(),
  needsHumanReview: z.boolean()
});

export const DomainProfileSchema = z.object({
  domain: ContentDomainSchema,
  description: z.string(),
  scoringWeights: z.record(z.string(), z.number()),
  preferredContentTypes: z.array(z.string()),
  captionStyles: z.array(z.string()),
  editingRules: z.array(z.string()),
  coverRules: z.array(z.string()),
  riskRules: z.array(z.string()).optional(),
  nextShootingChecklistTemplate: z.array(z.string()).optional()
});

export const ShotCandidateSchema = z.object({
  id: z.string(),
  assetId: z.string(),
  startSec: z.number().nonnegative().optional(),
  endSec: z.number().nonnegative().optional(),
  sourceType: z.enum(["image", "video_segment"]),
  summary: z.string(),
  primaryDomain: ContentDomainSchema,
  domainScores: z.record(z.string(), z.number().min(0).max(1)),
  tags: z.array(z.string()),
  scores: z.object({
    subjectClarity: z.number(),
    aestheticQuality: z.number(),
    compositionQuality: z.number(),
    lightingQuality: z.number(),
    storyValue: z.number(),
    motionDensity: z.number().optional(),
    coverPotential: z.number(),
    hookPotential: z.number().optional(),
    reuseValue: z.number(),
    uniqueness: z.number(),
    platformFit: z.number(),
    riskScore: z.number(),
    domainSpecific: z.record(z.string(), z.number()).optional()
  }),
  recommendedUse: z.array(
    z.enum([
      "hook",
      "middle",
      "climax",
      "ending",
      "cover",
      "image_post",
      "carousel",
      "b_roll",
      "detail",
      "discard"
    ])
  ),
  notes: z.string()
});

export const PostPlanSchema = z.object({
  day: z.number().int().positive(),
  contentType: z.enum([
    "short_video",
    "image_post",
    "mixed_post",
    "interactive_post",
    "guide_post",
    "review_post",
    "behind_the_scenes",
    "character_note"
  ]),
  theme: z.string(),
  goal: z.enum([
    "exposure",
    "engagement",
    "profile_building",
    "material_reuse",
    "conversion"
  ]),
  domainFocus: z.array(ContentDomainSchema),
  assetIds: z.array(z.string()),
  shotCandidateIds: z.array(z.string()),
  coverCandidateIds: z.array(z.string()),
  captionBrief: z.string(),
  editBrief: z.string().optional(),
  riskNotes: z.array(z.string()).optional(),
  reusePolicy: z.enum(["fresh", "subtle_reuse", "obvious_reuse_allowed"])
});

export const ContentPlanSchema = z.object({
  projectId: z.string(),
  platform: PlatformSchema,
  targetDays: z.number().int().nonnegative(),
  feasibleDays: z.number().int().nonnegative(),
  posts: z.array(PostPlanSchema),
  strategySummary: z.string(),
  materialConservationNotes: z.string(),
  categorySummary: z.string()
});

export const EditDecisionListSchema = z.object({
  postId: z.string(),
  output: z.object({
    aspectRatio: z.enum(["9:16", "1:1", "16:9", "4:5"]),
    durationTargetSec: z.number().positive(),
    resolution: z.enum(["1080x1920", "1080x1080", "1920x1080", "1080x1350"])
  }),
  clips: z.array(
    z.object({
      assetId: z.string(),
      sourceStartSec: z.number().nonnegative().optional(),
      sourceEndSec: z.number().nonnegative().optional(),
      outputStartSec: z.number().nonnegative(),
      speed: z.number().positive().optional(),
      crop: z
        .enum([
          "center",
          "face_center",
          "subject_center",
          "full_body",
          "wide",
          "product_center"
        ])
        .optional(),
      transform: z
        .object({
          zoom: z.number().optional(),
          stabilize: z.boolean().optional()
        })
        .optional(),
      textOverlay: z
        .object({
          text: z.string(),
          startSec: z.number().nonnegative(),
          endSec: z.number().nonnegative(),
          position: z.enum(["top", "middle", "bottom"])
        })
        .optional(),
      transition: z.enum(["hard_cut", "fade", "flash"]).optional(),
      reason: z.string()
    })
  )
});

export const CaptionPackageSchema = z.object({
  titleOptions: z.array(z.string()),
  selectedTitle: z.string(),
  body: z.string(),
  hashtags: z.array(z.string()),
  commentPrompt: z.string().optional(),
  style: z.enum([
    "casual",
    "diary",
    "interactive",
    "aesthetic_note",
    "travel_note",
    "guide",
    "review",
    "commercial_clean",
    "behind_the_scenes",
    "character_analysis"
  ])
});

export const UsageRecordSchema = z.object({
  shotCandidateId: z.string(),
  usedInPostIds: z.array(z.string()),
  usageType: z.array(z.enum(["video", "cover", "image", "thumbnail", "draft"])),
  visibilityLevel: z.enum(["obvious", "subtle", "hidden"]),
  reuseAllowed: z.boolean(),
  notes: z.string()
});

export const AssetInventorySchema = z.object({
  projectId: z.string(),
  generatedAt: z.string(),
  assets: z.array(AssetSchema),
  frameSamples: z.array(FrameSampleSchema)
});

export type ProjectConfig = z.infer<typeof ProjectConfigSchema>;
export type Asset = z.infer<typeof AssetSchema>;
export type FrameSample = z.infer<typeof FrameSampleSchema>;
export type AssetInventory = z.infer<typeof AssetInventorySchema>;
export type ClassificationResult = z.infer<typeof ClassificationResultSchema>;
export type ContentPlan = z.infer<typeof ContentPlanSchema>;
