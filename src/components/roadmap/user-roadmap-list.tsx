"use client";
import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service"; // Mengimpor service untuk mengambil data roadmap
import RoadmapCard from "@/components/roadmap/roadmap-card";
import { usePathname } from "next/navigation"; // Mengimpor usePathname dari next/navigation untuk menggantikan useRouter

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

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6; // Menampilkan 6 roadmap per halaman (tergantung ukuran halaman dan jumlah card per baris)
  const totalPages = Math.ceil(roadmaps.length / pageSize);

  // Menggunakan usePathname untuk mendapatkan path di dalam app directory
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

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const result = await roadmapService.listUserRoadmap(); // Mendapatkan data roadmap
        console.log("API Response:", result);

        if (result?.data?.items) {
          setRoadmaps(result.data.items); // Menyimpan data roadmap
        } else {
          console.error("Items not found in response");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Menghentikan loading setelah data selesai diambil
      }
    };

    fetchRoadmaps();
  }, []);

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
          isProfilePage ? "grid-cols-2" : "grid-cols-3"
        } gap-6 mt-6`}
      >
        {limitedRoadmaps.length > 0 ? (
          limitedRoadmaps.map((roadmap) => (
            <RoadmapCard key={roadmap.id} roadmap={roadmap} />
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
