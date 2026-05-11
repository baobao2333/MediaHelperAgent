import path from "node:path";
import { z } from "zod";
import {
  AssetInventorySchema,
  ClassificationResultSchema,
  ContentPlanSchema
} from "./schemas.js";
import { exists, readJson, resolveProjectPaths } from "./storage.js";

type ValidationMessage = {
  level: "ok" | "warn" | "error";
  message: string;
};

export async function validatePackage(project: string): Promise<ValidationMessage[]> {
  const paths = resolveProjectPaths(project);
  const messages: ValidationMessage[] = [];
  const inventory = parseWithMessages(
    AssetInventorySchema,
    await readJson(paths.inventoryPath),
    "asset_inventory.json",
    messages
  );

  if (!inventory) {
    return messages;
  }

  const assetIds = new Set(inventory.assets.map((asset) => asset.id));
  messages.push({
    level: "ok",
    message: `asset_inventory.json contains ${inventory.assets.length} assets`
  });

  const classificationPath = path.join(paths.outputDir, "classification_results.json");
  if (await exists(classificationPath)) {
    const results = parseWithMessages(
      z.array(ClassificationResultSchema),
      await readJson(classificationPath),
      "classification_results.json",
      messages
    );

    if (results) {
      for (const result of results) {
        if (!assetIds.has(result.assetId)) {
          messages.push({
            level: "error",
            message: `classification result references unknown assetId ${result.assetId}`
          });
        }
        if (result.confidence < 0.55 && !result.needsHumanReview) {
          messages.push({
            level: "error",
            message: `${result.assetId} has confidence < 0.55 but needsHumanReview is false`
          });
        }
      }
      messages.push({
        level: "ok",
        message: `classification_results.json contains ${results.length} results`
      });
    }
  } else {
    messages.push({
      level: "warn",
      message: "classification_results.json is missing; fill it from classification_results.template.json"
    });
  }

  const contentPlanPath = path.join(paths.outputDir, "content_plan.json");
  if (await exists(contentPlanPath)) {
    const plan = parseWithMessages(
      ContentPlanSchema,
      await readJson(contentPlanPath),
      "content_plan.json",
      messages
    );

    if (plan) {
      for (const post of plan.posts) {
        for (const assetId of post.assetIds) {
          if (!assetIds.has(assetId)) {
            messages.push({
              level: "error",
              message: `content_plan day ${post.day} references unknown assetId ${assetId}`
            });
          }
        }
      }
      messages.push({
        level: "ok",
        message: `content_plan.json contains ${plan.posts.length} posts`
      });
    }
  } else {
    messages.push({
      level: "warn",
      message: "content_plan.json is missing; run package:scaffold"
    });
  }

  return messages;
}

function parseWithMessages<T>(
  schema: z.ZodType<T>,
  value: unknown,
  label: string,
  messages: ValidationMessage[]
): T | undefined {
  const result = schema.safeParse(value);
  if (result.success) {
    return result.data;
  }

  for (const issue of result.error.issues) {
    messages.push({
      level: "error",
      message: `${label}: ${issue.path.join(".") || "(root)"} ${issue.message}`
    });
  }
  return undefined;
}
