import { DomainProfileSchema } from "./schemas.js";

export const domainProfiles = [
  {
    domain: "portrait",
    description: "Portrait, selfie, and personal appearance content.",
    scoringWeights: {
      subjectClarity: 0.16,
      faceClarity: 0.18,
      expressionStrength: 0.12,
      compositionQuality: 0.1,
      lightingQuality: 0.12,
      coverPotential: 0.14,
      hookPotential: 0.1,
      reuseValue: 0.08,
      riskScore: -0.12
    },
    preferredContentTypes: ["short_video", "image_post", "mixed_post", "interactive_post"],
    captionStyles: ["casual", "diary", "interactive", "aesthetic_note"],
    editingRules: [
      "Use a clear face or strong eye contact in the first second.",
      "Avoid three consecutive shots from the same selfie angle.",
      "Expression changes matter more than transitions."
    ],
    coverRules: [
      "Face is clear.",
      "Expression is natural.",
      "Background does not overpower the subject."
    ],
    nextShootingChecklistTemplate: [
      "front-facing eye contact clip",
      "side profile or turn-back clip",
      "half-body or full-body clip",
      "detail close-ups"
    ]
  },
  {
    domain: "cosplay",
    description: "Character costume, styling, convention, and cosplay outdoor content.",
    scoringWeights: {
      subjectClarity: 0.12,
      faceClarity: 0.14,
      characterVibe: 0.18,
      outfitVisibility: 0.14,
      compositionQuality: 0.08,
      lightingQuality: 0.08,
      coverPotential: 0.12,
      hookPotential: 0.1,
      reuseValue: 0.08,
      riskScore: -0.1
    },
    preferredContentTypes: [
      "short_video",
      "image_post",
      "mixed_post",
      "character_note",
      "interactive_post"
    ],
    captionStyles: ["character_analysis", "casual", "behind_the_scenes", "interactive"],
    editingRules: [
      "Do not treat cosplay as ordinary selfie content.",
      "Preserve outfit, hair, prop, and character information.",
      "Use strong side-face or turn-back moments as peaks."
    ],
    coverRules: [
      "Character recognition is high.",
      "Styling is complete.",
      "Face or outfit has at least one strong point."
    ],
    nextShootingChecklistTemplate: [
      "front-facing character moment",
      "side profile or turn-back clip",
      "half-body and full-body outfit view",
      "prop and costume details"
    ]
  },
  {
    domain: "travel_landscape",
    description: "Travel, city, nature, and destination-oriented visual content.",
    scoringWeights: {
      subjectClarity: 0.08,
      placeRecognition: 0.18,
      aestheticQuality: 0.16,
      compositionQuality: 0.14,
      lightingQuality: 0.1,
      storyValue: 0.12,
      coverPotential: 0.12,
      reuseValue: 0.08,
      riskScore: -0.08
    },
    preferredContentTypes: ["image_post", "mixed_post", "short_video", "guide_post"],
    captionStyles: ["travel_note", "guide", "diary", "aesthetic_note"],
    editingRules: [
      "Establish place before showing details.",
      "Wide shots work well as openers or covers.",
      "A slower pace is acceptable, but avoid only empty scenery."
    ],
    coverRules: [
      "Place identity is clear.",
      "Color and composition are immediately readable.",
      "The cover is not visually fragmented."
    ],
    nextShootingChecklistTemplate: [
      "wide establishing shot",
      "signage or landmark detail",
      "walking transition",
      "local texture close-ups"
    ]
  },
  {
    domain: "product_still",
    description: "Product, object, unboxing, and review materials.",
    scoringWeights: {
      productClarity: 0.22,
      compositionQuality: 0.14,
      lightingQuality: 0.14,
      aestheticQuality: 0.12,
      storyValue: 0.08,
      coverPotential: 0.14,
      reuseValue: 0.1,
      brandSafety: 0.08,
      riskScore: -0.1
    },
    preferredContentTypes: ["image_post", "mixed_post", "short_video", "review_post"],
    captionStyles: ["review", "comparison", "usage_note", "commercial_clean"],
    editingRules: [
      "The product must remain clear.",
      "Detail shots should carry selling-point information.",
      "Do not sacrifice product recognition for mood."
    ],
    coverRules: [
      "Product is fully visible.",
      "Frame is clean.",
      "A key selling point is visually perceivable."
    ],
    nextShootingChecklistTemplate: [
      "clear front product image",
      "detail close-ups",
      "usage scene",
      "before/after or comparison"
    ]
  },
  {
    domain: "food_drink",
    description: "Food, cafe, drink, restaurant, and tabletop lifestyle content.",
    scoringWeights: {
      foodAppeal: 0.2,
      subjectClarity: 0.14,
      lightingQuality: 0.14,
      aestheticQuality: 0.12,
      storyValue: 0.1,
      coverPotential: 0.14,
      reuseValue: 0.08,
      riskScore: -0.08
    },
    preferredContentTypes: ["image_post", "mixed_post", "short_video", "guide_post", "review_post"],
    captionStyles: ["review", "diary", "guide", "aesthetic_note"],
    editingRules: [
      "Show the food or drink clearly before environment-only shots.",
      "Use steam, pouring, cutting, or hand movement when available.",
      "Keep environment shots short unless they add information."
    ],
    coverRules: [
      "Food or drink is appetizing.",
      "Lighting supports color and texture.",
      "Tabletop clutter is controlled."
    ],
    nextShootingChecklistTemplate: [
      "hero dish or drink shot",
      "texture close-up",
      "menu or price clue",
      "environment shot"
    ]
  },
  {
    domain: "event_exhibition",
    description: "Event, exhibition, convention, launch, and on-site materials.",
    scoringWeights: {
      eventImportance: 0.18,
      storyValue: 0.14,
      subjectClarity: 0.12,
      motionDensity: 0.1,
      coverPotential: 0.1,
      reuseValue: 0.08,
      platformFit: 0.1,
      riskScore: -0.18
    },
    preferredContentTypes: ["short_video", "mixed_post", "image_post", "behind_the_scenes"],
    captionStyles: ["behind_the_scenes", "diary", "guide", "commercial_clean"],
    editingRules: [
      "Prioritize key moments, crowd energy, or information-rich shots.",
      "Avoid using unhandled stranger faces as main visuals.",
      "A timeline structure often works better than random highlights."
    ],
    coverRules: [
      "The event subject is understandable.",
      "Key people or signage are not privacy risks.",
      "The frame is not overly chaotic."
    ],
    nextShootingChecklistTemplate: [
      "entrance or signage",
      "crowd or atmosphere wide shot",
      "key moment",
      "safe detail shots"
    ]
  }
].map((profile) => DomainProfileSchema.parse(profile));
