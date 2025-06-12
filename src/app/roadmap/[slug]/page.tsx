"use client";
import Loader from "@/components/loader/loader";
import RoadmapDetailClient from "@/components/roadmap/roadmap-detail-client";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import { notFound } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";

interface RoadmapDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const roadmapService = new RoadmapService();
export default function RoadmapDetailPage({ params }: RoadmapDetailPageProps) {
  const { slug } = use(params);
  const [roadmap, setRoadmap] = useState<GetRoadmapOutput | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function fetchRoadmap() {
      const result = await roadmapService.getRoadmapBySlug(slug);
      if (!result?.data) {
        notFound();
      } else {
        startTransition(() => {
          setRoadmap(result.data);
        });
      }
    }
    fetchRoadmap();
  }, [slug]);

  if (isPending || !roadmap) {
    return (
      <div className='fixed inset-0 z-[999] bg-white-500 flex items-center justify-center'>
        <Loader />
      </div>
    );
  }

  return <RoadmapDetailClient initialRoadmap={roadmap} slug={slug} />;
}
