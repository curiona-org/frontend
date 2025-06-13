import { listCommunityRoadmaps } from "@/app/roadmap/[slug]/actions";
import RoadmapCard from "@/components/roadmap/roadmap-card";
import { RoadmapSummary } from "@/types/api-roadmap";
import { useEffect, useState, useTransition, useRef } from "react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CommunityRoadmapListProps {
  search: string;
  orderBy: "newest" | "oldest";
  showPagination?: boolean;
  limit?: number;
}

const CommunityRoadmap = ({
  search,
  orderBy,
  showPagination = true,
  limit = 9,
}: CommunityRoadmapListProps) => {
  const isMobile = useIsMobile();
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isPending, startTransition] = useTransition();
  const gridRef = useRef<HTMLDivElement>(null);
  const pageSize = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, orderBy]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await listCommunityRoadmaps({
          page: currentPage,
          limit,
          search,
          orderBy,
        });
        if (response && response.data) {
          setRoadmaps(response.data.items);
          setTotalPages(response.data.total_pages);
          setTotalData(response.data.total);
        } else {
          console.error("Data items not found in response");
        }
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    startTransition(() => fetchRoadmaps());
  }, [currentPage, search, orderBy, limit]);

  const scrollToGrid = () => {
    if (gridRef.current) {
      setTimeout(() => {
        const yOffset = -50;
        const element = gridRef.current;

        if (element) {
          const y =
            element.getBoundingClientRect().top + window.pageYOffset + yOffset;

          window.scrollTo({
            top: y,
            behavior: "smooth",
          });
        }
      }, 100);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      scrollToGrid();
    }
  };

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

  return (
    <>
      <div
        ref={gridRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6"
      >
        {isPending ? (
          <div className="col-span-full flex justify-center">
            <span className="loader"></span>
          </div>
        ) : roadmaps.length > 0 ? (
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
        <div className="flex flex-wrap justify-center md:justify-between items-center text-mobile-body-1-regular lg:text-body-1-regular">
          {/* Showing page info */}
          <div className="text-center mt-4">
            <span>
              Showing {1 + (currentPage - 1) * pageSize} to{" "}
              {Math.min(currentPage * pageSize, totalData)} of {totalData}{" "}
              results
            </span>
          </div>

          <div className="flex justify-center items-center mt-6 space-x-0">
            <button
              className="text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50"
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              ⏪
            </button>
            <button
              className="text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀️
            </button>

            {/* Page Numbers with Ellipsis */}
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
                disabled={page === "..."}
              >
                {page}
              </button>
            ))}

            <button
              className="text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ▶️
            </button>
            <button
              className="text-mobile-body-1-regular lg:text-body-1-regular w-8 h-8 md:w-10 md:h-10 bg-white-500 border border-black-100 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50"
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              ⏩
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CommunityRoadmap;
