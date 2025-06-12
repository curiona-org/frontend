"use client";
import RoadmapCard from "@/components/roadmap/roadmap-card";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { RoadmapSummary } from "@/types/api-roadmap";
import { usePathname } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import Loader from "../loader/loader";

const roadmapService = new RoadmapService();

interface UserRoadmapListProps {
  filter?: "all" | "onprogress" | "saved" | "finished";
  showPagination?: boolean;
}

const UserRoadmapList: React.FC<UserRoadmapListProps> = ({
  filter = "all",
  showPagination = true,
}) => {
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const pageSize = 6;
  const pathname = usePathname();

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const handleCustomPage = () => {
    const input = prompt(`Enter a page number (1 to ${totalPages}):`);
    const num = parseInt(input || "", 10);
    if (num >= 1 && num <= totalPages) {
      setCurrentPage(num);
    } else {
      alert("Invalid page number.");
    }
  };

  const generatePageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (startPage > 1) pages.unshift("...");
    if (endPage < totalPages) pages.push("...");

    return pages;
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        // endpoint sudah mengembalikan data.pagination & nested progression
        startTransition(async () => {
          let total = 1;
          let total_pages = 1;
          let current_page = 1;
          let items: RoadmapSummary[] = [];
          if (filter === "all") {
            const res = await roadmapService.listUserRoadmap(currentPage);
            total = res.data.total;
            total_pages = res.data.total_pages;
            current_page = res.data.current_page;
            items = res.data.items;
          } else if (filter === "onprogress") {
            const res = await roadmapService.listUserOnProgressRoadmap(
              currentPage
            );
            total = res.data.total;
            total_pages = res.data.total_pages;
            current_page = res.data.current_page;
            items = res.data.items;
          } else if (filter === "saved") {
            const res = await roadmapService.listBookmarkedRoadmaps(
              currentPage
            );
            total = res.data.total;
            total_pages = res.data.total_pages;
            current_page = res.data.current_page;
            items = res.data.items;
          } else if (filter === "finished") {
            const res = await roadmapService.listUserFinishedRoadmap(
              currentPage
            );
            total = res.data.total;
            total_pages = res.data.total_pages;
            current_page = res.data.current_page;
            items = res.data.items;
          }

          const mapped = items.map((item) => ({
            id: item.id,
            title: item.title,
            slug: item.slug,
            description: item.description,
            total_topics: item.total_topics,
            created_at: item.created_at,
            updated_at: item.updated_at,
            is_bookmarked: item.is_bookmarked,

            progression: {
              total_topics: item.progression.total_topics,
              finished_topics: item.progression.finished_topics,
              completion_percentage: item.progression.completion_percentage,
              is_finished: item.progression.completion_percentage === 100,
              finished_at:
                item.progression.completion_percentage === 100
                  ? item.progression.updated_at
                  : "",
              created_at: item.progression.created_at,
              updated_at: item.progression.updated_at,
            },

            personalization_options: item.personalization_options,
          }));

          setRoadmaps(mapped);
          setTotalItems(total);
          setTotalPages(total_pages);
          setCurrentPage(current_page);
        });
      } catch (err) {
        console.error(err);
        setRoadmaps([]);
        setTotalItems(0);
        setTotalPages(1);
      }
    };

    fetchRoadmaps();
  }, [currentPage, filter]);

  // reset ke halaman 1 kalau filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  return (
    <>
      <div
        className={`grid gap-4  ${
          pathname === "/profile" ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } gap-6 mt-4`}
      >
        {isPending && <Loader />}
        {!isPending && roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No Data Available
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className="flex flex-wrap gap-4 md:gap-0 justify-center md:justify-between items-center text-mobile-body-1-regular lg:text-body-1-regular mt-6">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {(currentPage - 1) * pageSize + roadmaps.length} of {totalItems}{" "}
            results
          </div>
          <div className="flex items-center space-x-0">
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className="py-2 px-4 bg-white-500 border border-gray-300 rounded-l hover:bg-gray-100 disabled:opacity-50"
            >
              ⏪
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="py-2 px-4 bg-white-500 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              ◀️
            </button>

            {generatePageNumbers().map((p, i) =>
              p === "..." ? (
                <button
                  key={i}
                  onClick={handleCustomPage}
                  className="py-2 px-4 bg-white-500 border border-gray-300 hover:bg-gray-100"
                >
                  ...
                </button>
              ) : (
                <button
                  key={i}
                  onClick={() => handlePageChange(p as number)}
                  className={`py-2 px-4 border border-gray-300 hover:bg-gray-100 disabled:opacity-50 ${
                    p === currentPage
                      ? "bg-blue-600 text-white-500 border-blue-600"
                      : "bg-white-500"
                  }`}
                >
                  {p}
                </button>
              )
            )}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="py-2 px-4 bg-white-500 border border-gray-300 hover:bg-gray-100 disabled:opacity-50"
            >
              ▶️
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className="py-2 px-4 bg-white-500 border border-gray-300 rounded-r hover:bg-gray-100 disabled:opacity-50"
            >
              ⏩
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default UserRoadmapList;
