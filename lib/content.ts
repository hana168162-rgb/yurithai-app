// Content loader - reads JSON files at build time

import dramasData from "@/content/dramas.json";
import watchingData from "@/content/watching.json";
import companiesData from "@/content/companies.json";
import taxonomyData from "@/content/taxonomy.json";
import questionsData from "@/content/diagnostic/questions.json";
import type {
  Drama,
  WatchingDrama,
  Company,
  Taxonomy,
  QuestionsFile,
} from "./types";

export const dramas = dramasData as unknown as Drama[];
export const watching = watchingData as unknown as WatchingDrama[];
export const companies = companiesData as unknown as Company[];
export const taxonomy = taxonomyData as unknown as Taxonomy;
export const questionsFile = questionsData as unknown as QuestionsFile;

export function getDramaBySlug(slug: string): Drama | undefined {
  return dramas.find((d) => d.slug === slug);
}

export function getAiringDramas(): Drama[] {
  return dramas.filter((d) => d.status === "airing");
}

export function getCompletedDramas(): Drama[] {
  return dramas.filter((d) => d.status === "completed");
}

// Take up to N completed dramas as featured (use most recent year first)
export function getFeaturedCompletedDramas(limit = 6): Drama[] {
  return [...getCompletedDramas()]
    .sort((a, b) => (b.year ?? 0) - (a.year ?? 0))
    .slice(0, limit);
}

// Watching list serves as homepage "currently airing pickup"
export function getCurrentPickup(): WatchingDrama[] {
  return watching.slice(0, 3);
}
