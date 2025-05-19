"use client";
import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service"; // Mengimpor service untuk mengambil data roadmap
import RoadmapCard from "@/components/roadmap/roadmap-card";
import { usePathname } from "next/navigation"; // Mengimpor usePathname dari next/navigation untuk menggantikan useRouter

const roadmapService = new RoadmapService();

export interface RoadmapProps {
  id: number;
  title: string;
  slug: string;
  description: string;
  total_topics: number;
  created_at: string;
  updated_at: string;

  progression: {
    total_topics: number;
    finished_topics: number;
    completion_percentage: number;
    is_finished: boolean;
    finished_at: string;
    created_at: string;
    updated_at: string;
  };

  personalization_options: {
    daily_time_availability: {
      value: number;
      unit: string;
    };
    total_duration: {
      value: number;
      unit: string;
    };
    skill_level: string;
    additional_info?: string;
  };

  creator: {
    id: number;
    method: string;
    email: string;
    name: string;
    avatar: string;
    is_suspended: boolean;
    joined_at: string;
  };

  is_saved?: boolean;
}

interface UserRoadmapListProps {
  filter?: "all" | "onprogress" | "saved";
}

const UserRoadmapList: React.FC<UserRoadmapListProps> = ({
  filter = "all",
}) => {
  const [roadmaps, setRoadmaps] = useState<RoadmapProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.ceil(roadmaps.length / pageSize);
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const generatePageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  const handleCustomPage = () => {
    // Custom page logic for pagination
  };

  const handleToggleSave = (slug: string, saved: boolean) => {
    setRoadmaps((prev) =>
      prev.map((r) =>
        r.slug === slug
          ? {
              ...r,
              is_saved: saved,
            }
          : r
      )
    );
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      setLoading(true);
      try {
        let result;
        if (filter === "saved") {
          result = await roadmapService.listBookmarkedRoadmaps();
        } else {
          result = await roadmapService.listUserRoadmap();
        }

        if (result?.data?.items) {
          setRoadmaps(result.data.items);
        } else {
          setRoadmaps([]);
        }
      } catch (error) {
        setRoadmaps([]);
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmaps();
  }, [filter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const filteredRoadmaps = roadmaps.filter((roadmap) => {
    if (filter === "all") return true;
    if (filter === "onprogress")
      return (
        roadmap.progression.finished_topics < roadmap.progression.total_topics
      );
    if (filter === "saved") return roadmap.is_saved === true; // pastikan ada di data
    return true;
  });

  // Membatasi hanya menampilkan roadmap yang sesuai dengan currentPage
  const limitedRoadmaps = roadmaps.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return (
      <p className="text-center col-span-full text-gray-500">Loading...</p>
    );
  }

  // Cek apakah halaman saat ini adalah '/profile'
  const isProfilePage = pathname === "/profile";

  return (
    <>
      {/* Grid untuk menampilkan roadmap */}
      <div
        className={`grid ${
          pathname === "/profile" ? "grid-cols-2" : "grid-cols-3"
        } gap-6 mt-6`}
      >
        {limitedRoadmaps.length > 0 ? (
          limitedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={{
                ...roadmap,
                total_topics: roadmap.progression.total_topics,
                finished_topics: roadmap.progression.finished_topics,
              }}
              onToggleSave={handleToggleSave}
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No Data Available
          </p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-body-1-regular">
        {/* Showing page info */}
        <div className="text-center mt-4">
          <span>
            Showing {1 + (currentPage - 1) * pageSize} to{" "}
            {Math.min(currentPage * pageSize, roadmaps.length)} of{" "}
            {roadmaps.length} results
          </span>
        </div>

        <div className="flex justify-center items-center mt-6 space-x-0">
          <button
            className="py-2 px-4 bg-white-500 border border-black-100 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
          >
            &lt;&lt;
          </button>
          <button
            className="py-2 px-4 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            &lt;
          </button>

          {/* Page Numbers with Ellipsis */}
          {generatePageNumbers().map((page, index) => (
            <button
              key={index}
              className={`py-2 px-4 ${
                page === currentPage
                  ? "bg-blue-500 text-white-500 border-none" // Menghilangkan border biru pada tombol aktif
                  : page === "..."
                  ? "bg-white-500 border border-black-100"
                  : "bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0"
              }`}
              onClick={() =>
                page === "..."
                  ? handleCustomPage()
                  : handlePageChange(page as number)
              }
              disabled={page === "..."}
            >
              {page}
            </button>
          ))}

          <button
            className="py-2 px-4 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            &gt;
          </button>
          <button
            className="py-2 px-4 bg-white-500 border border-black-100 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-0"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage === totalPages}
          >
            &gt;&gt;
          </button>
        </div>
      </div>
    </>
  );
};

export default UserRoadmapList;
