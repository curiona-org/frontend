import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";
import RoadmapCard from "@/components/roadmap/roadmap-card";

const roadmapService = new RoadmapService();

interface Roadmap {
  created_at: Date;
  description: string;
  finished_topics: number;
  id: number;
  personalization_options: {
    daily_time_availability: {
      unit: string;
      value: number;
    };
    skill_level: string;
    total_duration: {
      unit: string;
      value: number;
    };
  };

  slug: string;
  title: string;
  total_topics: number;
  updated_at: Date;
}

const CommunityRoadmap = () => {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>([]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await roadmapService.listCommunityRoadmap();
        console.log("API Response:", response);
        if (response && response.data) {
          setRoadmaps(response.data.items);
        } else {
          console.error("Data items not found in response");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRoadmaps();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
      {roadmaps.length > 0 ? (
        roadmaps.map((roadmap) => (
          <RoadmapCard key={roadmap.id} roadmap={roadmap} />
        ))
      ) : (
        <p className="text-center col-span-full text-gray-500">
          No Data Available
        </p>
      )}
    </div>
  );
};

export default CommunityRoadmap;
