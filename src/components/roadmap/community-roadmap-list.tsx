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
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9); // Set to 9 to display 9 roadmaps at a time

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

  // Pagination logic: slice the roadmaps array based on the current page
  const paginatedRoadmaps = roadmaps.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(roadmaps.length / pageSize);

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Function to generate pagination with ellipsis
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5; // Set the max number of page numbers to show (including ellipsis)

    // Always show ellipsis between pages, even if only 2 pages
    pageNumbers.push(1); // Always show the first page
    if (totalPages > 1) pageNumbers.push("..."); // Show ellipsis if there's more than 2 pages

    // Add middle pages if applicable
    for (let i = 2; i < totalPages; i++) {
      pageNumbers.push(i);
    }

    if (totalPages > 2) pageNumbers.push("..."); // Show ellipsis if there's more than 2 pages
    pageNumbers.push(totalPages); // Always show the last page

    return pageNumbers;
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

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {paginatedRoadmaps.length > 0 ? (
          paginatedRoadmaps.map((roadmap) => (
            <RoadmapCard
              key={roadmap.id}
              roadmap={roadmap}
              showProgress={false} // Set showProgress to false for Community Roadmap
            />
          ))
        ) : (
          <p className="text-center col-span-full text-gray-500">
            No Data Available
          </p>
        )}
      </div>

      {/* Pagination Controls */}
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
    </div>
  );
};

export default CommunityRoadmap;
