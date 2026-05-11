import path from "node:path";
import { AssetInventorySchema, type AssetInventory, type ProjectConfig } from "./schemas.js";
import { exists, readJson, readProjectConfig, resolveProjectPaths, writeJson, writeText } from "./storage.js";

export async function scaffoldPackage(project: string): Promise<void> {
  const paths = resolveProjectPaths(project);
  const config = await readProjectConfig(project);
  const inventory = AssetInventorySchema.parse(await readJson(paths.inventoryPath));

  await writeJson(
    path.join(paths.outputDir, "classification_results.template.json"),
    buildClassificationTemplate(inventory)
  );

  const contentPlan = buildContentPlanTemplate(config);
  await writeJson(path.join(paths.outputDir, "content_plan.template.json"), contentPlan);

  const contentPlanPath = path.join(paths.outputDir, "content_plan.json");
  if (!(await exists(contentPlanPath))) {
    await writeJson(contentPlanPath, contentPlan);
  }

  await writeText(path.join(paths.outputDir, "publishing_plan.md"), publishingPlanTemplate(config, inventory));
  await writeText(path.join(paths.outputDir, "review_report.md"), reviewReportTemplate(project));
}

function buildClassificationTemplate(inventory: AssetInventory) {
  return inventory.assets.map((asset) => ({
    assetId: asset.id,
    primaryDomain: "mixed_unknown",
    domainScores: {},
    confidence: 0,
    tags: {
      subjectTags: [],
      sceneTags: [],
      visualTags: [],
      actionTags: [],
      contentRoleTags: [],
      platformTags: [],
      riskTags: [],
      styleTags: []
    },
    reasoningSummary: "TODO: inspect the asset or frame sheet and summarize visual evidence.",
    needsHumanReview: true
  }));
}

function buildContentPlanTemplate(config: ProjectConfig) {
  return {
    projectId: config.name,
    platform: config.platform,
    targetDays: config.targetDays,
    feasibleDays: 0,
    posts: [],
    strategySummary: "TODO: summarize the content strategy after classification.",
    materialConservationNotes: "TODO: explain which strong assets should be saved.",
    categorySummary: "TODO: summarize the material categories."
  };
}

function publishingPlanTemplate(config: ProjectConfig, inventory: AssetInventory): string {
  return `# Publishing Plan: ${config.name}

## Overall Judgment

TODO: summarize domains, strengths, weaknesses, and realistic publishing days.

## Material Summary

- Platform: ${config.platform}
- Target days: ${config.targetDays}
- Assets: ${inventory.assets.length}
- Video frame samples: ${inventory.frameSamples.length}

## Daily Plan

TODO: fill after classification and strategy planning.

## Material Conservation Notes

TODO: name high-value assets to save for later days.

## Next Shooting Checklist

TODO: list the minimum missing shots that would improve future plans.
`;
}

function reviewReportTemplate(project: string): string {
  return `# Review Report: ${project}

## Status

Needs review.

## Critical Issues

TODO: list blocking issues.

## Recommended Fixes

TODO: list concrete fixes.

## Material Reuse Notes

TODO: check whether high-value materials are consumed too quickly.

## Risk Notes

TODO: check privacy, watermark, brand, blur, and exposure risks.

## Export Readiness

TODO: mark whether the package is ready to export.
`;
}
