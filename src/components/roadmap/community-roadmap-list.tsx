import RoadmapCard from "@/components/roadmap/roadmap-card";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { RoadmapSummary } from "@/types/api-roadmap";
import { useEffect, useState, useTransition } from "react";

const roadmapService = new RoadmapService();

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
  const [roadmaps, setRoadmaps] = useState<RoadmapSummary[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [isPending, startTransition] = useTransition();
  const pageSize = 9;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, orderBy]);

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const response = await roadmapService.listCommunityRoadmap(
          currentPage,
          limit,
          search,
          orderBy
        );
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
  }, [currentPage, search, orderBy]);

  // Pagination logic: slice the roadmaps array based on the current page

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const generatePageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      return [1, 2, 3, "...", totalPages];
    }
  };

  const handleCustomPage = () => {
    const customPage = prompt(`Enter a page number (1 to ${totalPages}):`);
    const pageNumber = parseInt(customPage || "", 10);
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    } else {
      alert("Invalid page number.");
    }
  };

  const pages = generatePageNumbers();

  return (
    <>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6'>
        {isPending ? (
          <div className='col-span-full flex justify-center'>
            <span className='loader'></span>
          </div>
        ) : roadmaps.length > 0 ? (
          roadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              showProgress={false}
            />
          ))
        ) : (
          <p className='text-center col-span-full text-gray-500'>
            No Data Available
          </p>
        )}
      </div>

      {/* Pagination Controls */}
      {showPagination && (
        <div className='flex flex-wrap justify-center md:justify-between items-center text-body-1-regular'>
          {/* Showing page info */}
          <div className='text-center mt-4'>
            <span>
              Showing {1 + (currentPage - 1) * pageSize} to{" "}
              {Math.min(currentPage * pageSize, totalData)} of {totalData}{" "}
              results
            </span>
          </div>

          <div className='flex justify-center items-center mt-6 space-x-0'>
            <button
              className='py-2 px-4 bg-white-500 border border-black-100 rounded-l-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              ⏪
            </button>
            <button
              className='py-2 px-4 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ◀️
            </button>

            {/* Page Numbers with Ellipsis */}
            {generatePageNumbers().map((page, index) => (
              <button
                key={index}
                className={`py-2 px-4 ${
                  page === currentPage
                    ? "bg-blue-500 text-white-500 border-none"
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
              className='py-2 px-4 bg-white-500 border border-black-100 hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              ▶️
            </button>
            <button
              className='py-2 px-4 bg-white-500 border border-black-100 rounded-r-lg hover:bg-gray-200 focus:outline-none focus:ring-0 disabled:opacity-50'
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
