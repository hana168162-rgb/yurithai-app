// Content loader - reads JSON files at build time

import dramasData from "@/content/dramas.json";
import watchingData from "@/content/watching.json";
import upcomingData from "@/content/upcoming.json";
import actressesData from "@/content/actresses.json";
import pairsData from "@/content/pairs.json";
import companiesData from "@/content/companies.json";
import taxonomyData from "@/content/taxonomy.json";
import questionsData from "@/content/diagnostic/questions.json";
import type {
  Drama,
  WatchingDrama,
  UpcomingDrama,
  AnyDrama,
  Actress,
  Company,
  Taxonomy,
  QuestionsFile,
} from "./types";

export const dramas = dramasData as unknown as Drama[];
export const watching = watchingData as unknown as WatchingDrama[];
export const upcoming = upcomingData as unknown as UpcomingDrama[];
export const actresses = actressesData as unknown as Actress[];
export const companies = companiesData as unknown as Company[];
export const taxonomy = taxonomyData as unknown as Taxonomy;
export const questionsFile = questionsData as unknown as QuestionsFile;

export function getActressById(id: string): Actress | undefined {
  return actresses.find((a) => a.id === id);
}

export const pairs = pairsData as Record<string, string[]>;

export function getActressesForPair(shipName: string): Actress[] {
  const ids = pairs[shipName] ?? [];
  return ids
    .map((id) => getActressById(id))
    .filter((a): a is Actress => Boolean(a));
}

export function getDramaBySlug(slug: string): Drama | undefined {
  return dramas.find((d) => d.slug === slug);
}

export function getAnyDramaBySlug(slug: string): AnyDrama | undefined {
  return (
    dramas.find((d) => d.slug === slug) ??
    watching.find((d) => d.slug === slug) ??
    upcoming.find((d) => d.slug === slug)
  );
}

export function allDramaSlugs(): string[] {
  return [
    ...dramas.map((d) => d.slug),
    ...watching.map((d) => d.slug),
    ...upcoming.map((d) => d.slug),
  ];
}

// Extract pair short name like "FreenBecky" from cast_pair string
export function extractPairName(castPair: string | null): string | null {
  if (!castPair) return null;
  const m = castPair.match(/（([^）]+)）/);
  return m ? m[1] : null;
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
  return watching.slice(0, 4);
}
