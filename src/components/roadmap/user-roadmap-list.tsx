import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";
import RoadmapCard from "@/components/roadmap/roadmap-card";

const roadmapService = new RoadmapService();

export interface RoadmapProps {
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

const UserRoadmapList = () => {
  const [roadmaps, setRoadmaps] = useState<RoadmapProps[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleClick = () => {
    setSaved(!saved);
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const result = await roadmapService.listUserRoadmap();
        console.log("API Response:", result);

        if (result?.data?.items) {
          setRoadmaps(result.data.items);
        } else {
          console.error("Items not found in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, []);

  if (loading) {
    return (
      <p className="text-center col-span-full text-gray-500">Loading...</p>
    );
  }

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

export default UserRoadmapList;
