import { getRoadmapBySlug } from "@/app/roadmap/[slug]/actions";
import RoadmapDetailClient from "@/components/roadmap/roadmap-detail-client";
import { notFound } from "next/navigation";

interface RoadmapDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const result = await getRoadmapBySlug(slug);

  if (!result.success || !result.data) {
    notFound();
  }

  const roadmap = result.data;

  return <RoadmapDetailClient initialRoadmap={roadmap} slug={slug} />;
}
