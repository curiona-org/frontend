import RoadmapDetailClient from "@/components/roadmap/roadmap-detail-client";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { notFound } from "next/navigation";

const roadmapService = new RoadmapService();

interface RoadmapDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RoadmapDetailPage({
  params,
}: RoadmapDetailPageProps) {
  const { slug } = await params;
  const result = await roadmapService.getRoadmapBySlug(slug);

  if (!result?.data) {
    notFound();
  } else {
    console.log({ currRoadmap: result.data });
  }

  const roadmap = result.data;

  return <RoadmapDetailClient initialRoadmap={roadmap} slug={slug} />;
}
