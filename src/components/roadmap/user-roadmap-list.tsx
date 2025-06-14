"use client";
import {
  listUserBookmarkedRoadmaps,
  listUserFinishedRoadmaps,
  listUserOnProgressRoadmaps,
  listUserRoadmaps,
} from "@/app/roadmap/[slug]/actions";
import RoadmapCard from "@/components/roadmap/roadmap-card";
import { useIsMobile } from "@/hooks/use-mobile";
import { RoadmapSummary } from "@/types/api-roadmap";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import Loader from "../loader/loader";

interface UserRoadmapListProps {
  filter?: "all" | "onprogress" | "saved" | "finished";
  showPagination?: boolean;
}

const UserRoadmapList: React.FC<UserRoadmapListProps> = ({
  filter = "all",
  showPagination = true,
}) => {
  const isMobile = useIsMobile();
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [isPending, startTransition] = useTransition();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);
  const pageSize = 6;
  const pathname = usePathname();

  const scrollToGrid = () => {
    setTimeout(() => {
      if (gridRef.current) {
        const yOffset = -100;

        const scrollOptions = {
          behavior: "smooth" as ScrollBehavior,
          block: "start" as ScrollLogicalPosition,
        };

        gridRef.current.scrollIntoView(scrollOptions);

        setTimeout(() => {
          window.scrollBy({
            top: yOffset,
            behavior: "smooth",
          });
        }, 100);
      }
    }, 200);
  };

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    scrollToGrid();
  };

  // Desktop pagination
  const generateDesktopPageNumbers = () => {
    if (totalPages <= 10) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const pages = [];
      if (currentPage <= 5) {
        for (let i = 1; i <= 7; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 4) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 6; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 2; i <= currentPage + 2; i++) {
          pages.push(i);
        }
        pages.push("...");
        pages.push(totalPages);
      }
      return pages;
    }
  };

  // Mobile pagination
  const generateMobilePageNumbers = () => {
    const maxVisiblePages = 3;
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const pages = [];
      if (currentPage <= 2) {
        pages.push(1, 2);
        if (totalPages > 3) {
          pages.push("...");
        }
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 1) {
        pages.push(1);
        if (totalPages > 3) {
          pages.push("...");
        }
        pages.push(totalPages - 1, totalPages);
      } else {
        pages.push(currentPage - 1, currentPage);
        if (currentPage < totalPages - 1) {
          pages.push("...");
        }
        pages.push(totalPages);
      }
      return pages;
    }
  };

  const generatePageNumbers = () => {
    return isMobile
      ? generateMobilePageNumbers()
      : generateDesktopPageNumbers();
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
            const res = await listUserRoadmaps({ page: currentPage });
            if (res.data) {
              total = res.data.total;
              total_pages = res.data.total_pages;
              current_page = res.data.current_page;
              items = res.data.items;
            }
          } else if (filter === "onprogress") {
            const res = await listUserOnProgressRoadmaps({ page: currentPage });
            if (res.data) {
              total = res.data.total;
              total_pages = res.data.total_pages;
              current_page = res.data.current_page;
              items = res.data.items;
            }
          } else if (filter === "saved") {
            const res = await listUserBookmarkedRoadmaps({ page: currentPage });
            if (res.data) {
              total = res.data.total;
              total_pages = res.data.total_pages;
              current_page = res.data.current_page;
              items = res.data.items;
            }
          } else if (filter === "finished") {
            const res = await listUserFinishedRoadmaps({ page: currentPage });
            if (res.data) {
              total = res.data.total;
              total_pages = res.data.total_pages;
              current_page = res.data.current_page;
              items = res.data.items;
            }
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
        ref={gridRef}
        className={`grid gap-4  ${
          pathname === "/profile" ? "lg:grid-cols-2" : "lg:grid-cols-3"
        } gap-6 mt-4`}
      >
        {isPending && <Loader />}
        {!isPending &&
          roadmaps.length > 0 &&
          roadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
          ))}
        {!isPending && roadmaps.length == 0 && (
          <p className='my-8 text-center col-span-full text-gray-500'>
            No Data Available
          </p>
        )}
      </div>
      {/* Pagination Controls */}
      {showPagination && roadmaps.length > 0 && (
        <div className='flex flex-wrap gap-4 md:gap-0 justify-center md:justify-between items-center text-mobile-body-1-regular lg:text-body-1-regular mt-6'>
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{" "}
            {(currentPage - 1) * pageSize + roadmaps.length} of {totalItems}{" "}
            results
          </div>
          <div className='flex items-center space-x-0'>
            <button
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
              className='text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
            >
              ⏪
            </button>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className='text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
            >
              ◀️
            </button>
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                className={`text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 ${
                  page === currentPage
                    ? "bg-blue-500 text-white-500 border-none"
                    : page === "..."
                    ? "bg-white-500 border border-black-100"
                    : "bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0"
                }`}
                onClick={() => handlePageChange(page as number)}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
            >
              ▶️
            </button>
            <button
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
              className='text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
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
