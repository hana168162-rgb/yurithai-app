import type { MetadataRoute } from "next";
import {
  dramas,
  watching,
  upcoming,
  actresses,
  allTagSlugs,
} from "@/lib/content";

const SITE_URL = "https://yurithai.jp";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/dramas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dramas/airing`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/dramas/upcoming`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/cast`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/recommend`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // 作品詳細ページ（完結 + 放送中 + 公開予定）
  const dramaPages: MetadataRoute.Sitemap = [
    ...dramas,
    ...watching,
    ...upcoming,
  ].map((d) => ({
    url: `${SITE_URL}/dramas/${d.slug}`,
    lastModified: now,
    changeFrequency:
      d.status === "airing"
        ? ("daily" as const)
        : d.status === "upcoming"
        ? ("weekly" as const)
        : ("monthly" as const),
    priority:
      d.status === "airing" ? 0.9 : d.status === "upcoming" ? 0.7 : 0.8,
  }));

  // 女優個別ページ
  const actressPages: MetadataRoute.Sitemap = actresses.map((a) => ({
    url: `${SITE_URL}/cast/${a.id}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // タグ個別ページ
  const tagPages: MetadataRoute.Sitemap = allTagSlugs().map((slug) => ({
    url: `${SITE_URL}/tags/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  // タグ一覧ページ
  const tagsIndex: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}/tags`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  return [
    ...staticPages,
    ...tagsIndex,
    ...dramaPages,
    ...actressPages,
    ...tagPages,
  ];
}
