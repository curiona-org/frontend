"use client";
import { useState, useEffect } from "react";
import { Progress } from "radix-ui";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { ConfettiSideCannons } from "@/components/confetti-side-cannon";
import RoadmapChart from "@/components/roadmap/roadmap-chart";
import ChatbotWidget from "@/components/chatbot/chatbot";
import RegenerateDialog from "@/components/dialog/regenerate-dialog";
import DeleteDialog from "@/components/dialog/delete-dialog";
import FinishedDialog from "@/components/dialog/finished-dialog";
import Button from "@/components/ui/button";
import { useAuth } from "@/providers/auth-provider";

const roadmapService = new RoadmapService();

export default function RoadmapDetailClient({ initialRoadmap, slug }) {
  const { session } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [saved, setSaved] = useState(roadmap.is_bookmarked);
  const [loading, setLoading] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isFinishedDialogOpen, setIsFinishedDialogOpen] = useState(false);

  const localStorageKey = `confetti_seen_${slug}`;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768); // 768px = breakpoint `md:` Tailwind
    };

    // Panggil sekali di mount supaya langsung tahu kondisi awal
    checkMobile();
    // Pasang listener saat resize
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ============================================================
  // Hook kedua: inisialisasi atau update showDetails berdasarkan isMobile
  useEffect(() => {
    // Kalau sedang mobile, setShowDetails(false).
    // Kalau bukan mobile (desktop), setShowDetails(true).
    setShowDetails(!isMobile);
  }, [isMobile]);

  // Fungsi untuk fetch ulang data roadmap (dipanggil setelah dialog rating ditutup)
  const fetchRoadmap = async () => {
    try {
      const res = await roadmapService.getRoadmapBySlug(slug);
      if (res.data) {
        setRoadmap(res.data);
        setSaved(res.data.is_bookmarked);
      }
    } catch (err) {
      console.error("Gagal fetch roadmap terbaru:", err);
    }
  };

  // Dipanggil ketika FinishedDialog ditutup (baik karena submit rating ataupun cancel)
  const handleFinishedDialogClose = () => {
    setIsFinishedDialogOpen(false);
    fetchRoadmap();
  };

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  useEffect(() => {
    // Pastikan roadmap sudah benar‐benar selesai
    const isFinished =
      roadmap?.progression?.is_finished ||
      roadmap?.progression?.finished_topics === roadmap?.total_topics;

    if (!isFinished) return;

    // Hanya jalankan di browser
    if (typeof window !== "undefined") {
      // Cek apakah flag sudah ada
      const hasSeen = localStorage.getItem(localStorageKey);
      if (hasSeen) {
        // Kalau sudah pernah melihat, skip
        return;
      }

      // Jika belum, tampilkan confetti + dialog rating
      setShowConfetti(true);
      setIsFinishedDialogOpen(true);

      // Simpan flag agar tidak muncul lagi
      localStorage.setItem(localStorageKey, "true");
    }
  }, [
    roadmap?.progression?.finished_topics,
    roadmap?.progression?.is_finished,
    localStorageKey,
  ]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      if (saved) {
        await roadmapService.unbookmarkRoadmap(roadmap.slug);
        setSaved(false);
        console.log(roadmap.is_bookmarked);
      } else {
        await roadmapService.bookmarkRoadmap(roadmap.slug);
        setSaved(true);
        console.log(roadmap.is_bookmarked);
      }
    } catch (error) {
      console.error("Failed to toggle bookmark:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateTopicStatus = (updatedSlug: string, isFinished: boolean) => {
    if (!roadmap) return;

    const updatedTopics = roadmap.topics.map((topic) => {
      if (topic.slug === updatedSlug) {
        return { ...topic, is_finished: isFinished };
      }
      if (topic.subtopics) {
        const updatedSubtopics = topic.subtopics.map((sub) =>
          sub.slug === updatedSlug ? { ...sub, is_finished: isFinished } : sub
        );
        return { ...topic, subtopics: updatedSubtopics };
      }
      return topic;
    });

    const finishedCount = updatedTopics.reduce((count, topic) => {
      let c = topic.is_finished ? 1 : 0;
      if (topic.subtopics) {
        c += topic.subtopics.filter((sub) => sub.is_finished).length;
      }
      return count + c;
    }, 0);

    setRoadmap({
      ...roadmap,
      topics: updatedTopics,
      progression: {
        ...roadmap.progression,
        finished_topics: finishedCount,
      },
    });
  };

  if (!session) {
    return null;
  }

  const finishedTopics = roadmap?.progression?.finished_topics || 0;
  const totalTopics = roadmap.total_topics || 0;

  // Fungsi bantu untuk men‐render bintang (★ = filled, ☆ = empty)
  const renderStars = (rating: number) => {
    const full = "★".repeat(rating);
    const empty = "☆".repeat(5 - rating);
    return (
      <span className="text-xl leading-none">
        <span className="text-yellow-500">{full}</span>
        <span className="text-gray-300">{empty}</span>
      </span>
    );
  };

  return (
    <>
      {showConfetti && <ConfettiSideCannons />}
      <div className="px-6 lg:px-40 pt-32">
        <div className="flex flex-col gap-6 border-2 border-blue-500 rounded-lg p-6">
          <div className="flex flex-wrap justify-between">
            <h1 className="text-mobile-display-2 lg:text-heading-1-bold">
              {roadmap.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 mt-2">
              <button
                onClick={toggleSave}
                disabled={loading}
                className={`${
                  saved
                    ? "bg-blue-500 text-white-500"
                    : "text-gray-400 hover:text-blue-500"
                } transition-all ease-out duration-300 rounded-lg`}
                aria-label={saved ? "Unsave roadmap" : "Save roadmap"}
              >
                <div
                  className={`flex items-center gap-1 border ${
                    saved
                      ? "border-blue-500"
                      : "border-[#E5E5E5] hover:border-blue-500"
                  } rounded-lg p-2`}
                >
                  <span role="img" aria-label="folder">
                    🗂️
                  </span>
                  <span
                    className={`${saved ? "text-white-500" : "text-black-500"}`}
                  >
                    {saved ? "Saved!" : "Save"}
                  </span>
                </div>
              </button>
              <button
                onClick={() => setRegenerateDialogOpen(true)}
                aria-label="Regenerate roadmap"
                className="hover:text-white-500"
              >
                <div className="flex items-center gap-1 border border-[#E5E5E5] hover:bg-blue-500 hover:border-blue-700 rounded-lg p-2">
                  <span role="img" aria-label="refresh">
                    🔄
                  </span>
                  <span>Regenerate</span>
                </div>
              </button>
              {session.user.id === roadmap.creator.id && (
                <button
                  onClick={() => setDeleteDialogOpen(true)}
                  aria-label="Delete roadmap"
                  className="text-gray-400 hover:text-blue-500 transition-all ease-out duration-300 rounded-lg"
                >
                  <div className="flex items-center gap-1 border bg-red-50 border-red-400 hover:bg-red-500 hover:border-red-700 rounded-lg p-2">
                    <span role="img" aria-label="refresh">
                      🗑️
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          <div className="relative md:hidden dashedLine inset-0"></div>

          <div className="text-mobile-body-1-regular lg:text-body-1-regular flex items-center gap-2 md:hidden">
            <div className="flex items-center">
              <span>Your rating:</span>{" "}
              {roadmap.rating?.is_rated ? (
                <>{renderStars(roadmap.rating.rating)}</>
              ) : (
                <span className="text-xl leading-none text-gray-300">
                  ☆☆☆☆☆
                </span>
              )}
            </div>
            <Button
              onClick={() => setIsFinishedDialogOpen(true)}
              aria-label="Edit rating"
              className="bg-white-500 p-2 border-2 border-blue-500 text-gray-600 hover:text-gray-800 focus:outline-none"
            >
              <span role="img" aria-label="edit">
                ✏️
              </span>
            </Button>
          </div>

          <div className="relative dashedLine inset-0"></div>

          <div className={`${showDetails ? "" : "hidden"}`}>
            <div className="flex flex-col gap-6">
              <p className="text-mobile-body-1-regular lg:text-body-1-regular">
                {roadmap.description}
              </p>

              <div className="relative dashedLine inset-0"></div>

              <div className="flex flex-col gap-5">
                <div className="flex flex-col md:flex-row justify-between text-mobile-body-1-regular lg:text-body-1-regular flex-wrap gap-3">
                  <span>
                    📅 Date Created :{" "}
                    {new Date(roadmap.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span>
                    ⌛ Time Available :{" "}
                    {
                      roadmap.personalization_options.daily_time_availability
                        .value
                    }{" "}
                    {
                      roadmap.personalization_options.daily_time_availability
                        .unit
                    }{" "}
                    / Per Day
                  </span>
                  <span>
                    🤯 Skill Level :{" "}
                    {roadmap.personalization_options.skill_level}
                  </span>
                  <span>
                    📆 Duration :{" "}
                    {roadmap.personalization_options.total_duration.value}{" "}
                    {roadmap.personalization_options.total_duration.unit}
                  </span>
                </div>
              </div>

              <div className="relative dashedLine inset-0"></div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-wrap justify-between text-mobile-body-1-regular lg:text-body-1-regular">
              <span className="hidden md:block">🏃 Learning Progress</span>
              <span>{`${finishedTopics}/${totalTopics} Topics Completed`}</span>
            </div>
            <Progress.Root
              className="relative bg-blue-100 rounded-full h-3 overflow-hidden"
              value={finishedTopics}
              max={totalTopics}
            >
              <Progress.Indicator
                className="bg-blue-600 h-full transition-all duration-300 ease-out"
                style={{
                  width: `${(finishedTopics / totalTopics) * 100}%`,
                }}
              />
            </Progress.Root>
          </div>

          <div className="text-white-500 text-mobile-body-1-bold flex justify-end md:hidden">
            <Button
              onClick={toggleDetails}
              className="w-full h-11 bg-blue-500 active:bg-blue-900 text-black px-3"
            >
              {showDetails ? "Hide Roadmap Details" : "Show Roadmap Details"}
            </Button>
          </div>
        </div>
      </div>

      <RoadmapChart roadmap={roadmap} updateTopicStatus={updateTopicStatus} />

      <ChatbotWidget slug={slug} />

      <RegenerateDialog
        slug={slug}
        open={regenerateDialogOpen}
        onClose={() => setRegenerateDialogOpen(false)}
        initialPersonalization={{
          timeValue:
            roadmap.personalization_options.daily_time_availability.value,
          timeUnit:
            roadmap.personalization_options.daily_time_availability.unit,
          durationValue: roadmap.personalization_options.total_duration.value,
          durationUnit: roadmap.personalization_options.total_duration.unit,
          skillLevel: roadmap.personalization_options.skill_level,
        }}
      />

      <DeleteDialog
        slug={slug}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      />

      <FinishedDialog
        open={isFinishedDialogOpen}
        onClose={() => setIsFinishedDialogOpen(false)}
        slug={roadmap.slug}
        existingData={roadmap}
        onRated={() => {
          // Kalau memang tidak memerlukan rating & comment langsung,
          // misalnya:
          setIsFinishedDialogOpen(false);
          fetchRoadmap();
        }}
      />

      <div className="text-mobile-body-1-regular lg:text-body-1-regular hidden md:flex fixed bottom-20 left-12 z-50">
        <div className="flex items-center gap-2">
          <Button
            onClick={() => setIsFinishedDialogOpen(true)}
            aria-label="Edit rating"
            className="bg-white-500 p-2 border-2 border-blue-500 text-gray-600 hover:text-gray-800 focus:outline-none"
          >
            <span role="img" aria-label="edit">
              ✏️
            </span>
          </Button>
          <div className="flex items-center bg-white-500 border-2 border-blue-500 px-3 py-2 rounded-lg shadow-lg">
            <span>Your rating:</span>
            {roadmap.rating?.is_rated ? (
              <>{renderStars(roadmap.rating.rating)}</>
            ) : (
              <span className="text-xl leading-none text-gray-300">☆☆☆☆☆</span>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
