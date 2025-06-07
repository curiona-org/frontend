"use client";
import ChatbotWidget from "@/components/chatbot/chatbot";
import { ConfettiSideCannons } from "@/components/confetti-side-cannon";
import DeleteDialog from "@/components/dialog/delete-dialog";
import FinishedDialog from "@/components/dialog/finished-dialog";
import RegenerateDialog from "@/components/dialog/regenerate-dialog";
import RoadmapChart from "@/components/roadmap/roadmap-chart";
import Button from "@/components/ui/button";
import {
  getGoogleCalendarURL,
  GoogleCalendarEvent,
} from "@/lib/google_calendar";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { useAuth } from "@/providers/auth-provider";
import { GetRoadmapOutput } from "@/types/api-roadmap";
import { Progress } from "radix-ui";
import { useEffect, useState } from "react";

const roadmapService = new RoadmapService();

type RoadmapDetailClientProps = {
  initialRoadmap: GetRoadmapOutput;
  slug: string;
};

export default function RoadmapDetailClient({
  initialRoadmap,
  slug,
}: RoadmapDetailClientProps) {
  const { session } = useAuth();
  const [isMobile, setIsMobile] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [roadmap, setRoadmap] = useState(initialRoadmap);
  const [saved, setSaved] = useState(roadmap.is_bookmarked);
  const [loading, setLoading] = useState(false);
  const [regenerateDialogOpen, setRegenerateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRated, setIsRated] = useState(roadmap.rating?.is_rated || false);
  const [isFinishedDialogOpen, setIsFinishedDialogOpen] = useState(false);
  const [overlayVisible, setOverlayVisible] = useState(false);

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

  const toggleDetails = () => {
    setShowDetails((prev) => !prev);
  };

  useEffect(() => {
    const isFinished =
      roadmap?.progression?.finished_topics === roadmap?.total_topics ||
      roadmap?.progression?.is_finished;

    if (isFinished && (roadmap?.rating?.is_rated || isRated)) {
      return;
    }
    if (!isFinished) return;

    // While the user haven't rated the roadmap yet even if the user has already finished it,
    /// we will not show the confetti, but show the finished dialog
    if (isFinished && !roadmap?.rating?.is_rated && !isRated) {
      const hasSeen = localStorage.getItem(localStorageKey);
      if (hasSeen) {
        setIsFinishedDialogOpen(true);
        return;
      }

      setShowConfetti(true);
      setIsFinishedDialogOpen(true);

      localStorage.setItem(localStorageKey, "true");
    }
  }, [
    roadmap?.progression?.finished_topics,
    roadmap?.total_topics,
    roadmap?.progression?.is_finished,
    roadmap?.rating?.is_rated,
    isRated,
    localStorageKey,
  ]);

  useEffect(() => {
    const zoomOverlaySeen = localStorage.getItem("zoom_overlay_seen");
    if (isMobile && !zoomOverlaySeen) {
      setOverlayVisible(true);
      const timer = setTimeout(() => {
        localStorage.setItem("zoom_overlay_seen", "true");
        setOverlayVisible(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [isMobile]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (loading) return;

    setLoading(true);
    try {
      if (saved) {
        await roadmapService.unbookmarkRoadmap(roadmap.slug);
        setSaved(false);
      } else {
        await roadmapService.bookmarkRoadmap(roadmap.slug);
        setSaved(true);
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
        is_finished: finishedCount === roadmap.total_topics,
        finished_topics: finishedCount,
      },
    });
  };

  const importToCalendarLink = () => {
    const now = new Date();

    // Calculate the end date based on the total duration in respective unit
    const unit = roadmap.personalization_options.total_duration.unit;
    const endDate = new Date(now);
    switch (unit) {
      case "days":
        endDate.setDate(
          now.getDate() + roadmap.personalization_options.total_duration.value
        );
        break;
      case "weeks":
        endDate.setDate(
          now.getDate() +
            roadmap.personalization_options.total_duration.value * 7
        );
        break;
      case "months":
        endDate.setMonth(
          now.getMonth() + roadmap.personalization_options.total_duration.value
        );
        break;
    }

    // Set the recurrence rule based on the total duration unit, if total duration is:
    // MONTHLY
    // - 1 Month: Will be notified each week
    // - >1 Month: Will be notified each month
    // WEEKLY
    // - 1 Week: Will be notified each day
    // - >1 Week: Will be notified each week
    // DAILY
    // - 1 Day: Will be notified each day
    // - >1 Day: Will be notified each day
    let recurrence: GoogleCalendarEvent["recurrence"] = "DAILY";
    if (roadmap.personalization_options.total_duration.value > 1) {
      switch (roadmap.personalization_options.total_duration.unit) {
        case "days":
          recurrence = "DAILY";
          break;
        case "weeks":
          recurrence = "WEEKLY";
          break;
        case "months":
          recurrence = "MONTHLY";
          break;
      }
    }

    if (roadmap.personalization_options.total_duration.value === 1) {
      switch (roadmap.personalization_options.total_duration.unit) {
        case "days":
          recurrence = "DAILY";
          break;
        case "weeks":
          recurrence = "DAILY"; // Will be notified each day
          break;
        case "months":
          recurrence = "WEEKLY"; // Will be notified each week
          break;
      }
    }

    return getGoogleCalendarURL({
      title: `Curiona: ${roadmap.title}`,
      start: new Date(),
      end: endDate,
      recurrence,
      description: `${roadmap.description}

—————
👤 Roadmap created by <b>${roadmap.creator.name}</b>.
🔗 View this roadmap: <a href="https://curiona.netlify.app/roadmap/${roadmap.slug}">https://curiona.netlify.app/roadmap/${roadmap.slug}</a>`,
    });
  };

  if (!session) {
    return null;
  }

  const finishedTopics = roadmap?.progression?.finished_topics || 0;
  const totalTopics = roadmap.total_topics || 0;

  const StarIcon = ({ filled }: { filled: boolean }) => (
    <svg
      className='w-6 h-6'
      viewBox='0 0 48 49'
      fill={filled ? "var(--yellow-500)" : "var(--black-100)"}
      xmlns='http://www.w3.org/2000/svg'
    >
      <path d='M21.1356 7.07571C21.3998 6.54003 21.8086 6.08897 22.3158 5.77357C22.823 5.45817 23.4084 5.29102 24.0056 5.29102C24.6029 5.29102 25.1883 5.45817 25.6955 5.77357C26.2027 6.08897 26.6115 6.54003 26.8756 7.07571L31.3236 16.0837L41.2676 17.5277C41.8588 17.6135 42.4141 17.8631 42.8707 18.2482C43.3274 18.6333 43.6671 19.1385 43.8515 19.7067C44.0359 20.2748 44.0576 20.8833 43.9141 21.4631C43.7706 22.043 43.4677 22.5711 43.0396 22.9877L36.3436 29.9997L38.0436 39.9037C38.1447 40.492 38.0793 41.0969 37.8547 41.6499C37.6301 42.203 36.7552 42.6822 36.2726 43.0334C35.7899 43.3846 35.2186 43.5937 34.6232 43.6373C34.0279 43.6808 33.9323 43.557 32.9036 43.2797L24.0036 38.5997L15.6076 43.2797C15.079 43.557 14.4833 43.6808 13.888 43.6373C12.7927 43.5937 12.2214 43.3846 11.7387 43.0334C11.256 42.6822 10.8812 42.203 10.6566 41.6499C10.432 41.0969 10.3665 40.492 10.4676 39.9037L12.1636 29.9997L4.96763 22.9877C4.53948 22.5708 4.23662 22.0424 4.09334 21.4622C3.95006 20.8821 3.97209 20.2734 4.15694 19.7052C4.34178 19.1369 4.68205 18.6317 5.13921 18.2469C5.59638 17.8621 6.15216 17.6129 6.74363 17.5277L16.6876 16.0877L21.1356 7.07571Z' />
    </svg>
  );

  const RenderZoomOverlay = () => {
    return (
      overlayVisible && (
        <div className='fixed w-screen h-screen bg-[#3C3C3C]/10 flex justify-center items-center text-white text-lg z-50'>
          <div className='bg-white-500 w-40 px-3 py-4 rounded-lg border border-blue-500'>
            <div className='flex flex-col items-center gap-2'>
              <svg
                width='32'
                height='33'
                viewBox='0 0 32 33'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
                className='animate-updown'
              >
                <path
                  d='M12.082 6.16722C11.0447 6.87855 10.9114 8.26989 11.4674 9.39922C12.4194 11.3332 14.046 14.5346 15.9174 17.7759C15.9174 17.7759 14.888 17.2199 13.344 16.8706C11.9174 16.5479 10.5554 17.5692 10.6434 19.0286C10.6654 19.3946 10.72 19.7752 10.8234 20.1519C11.008 20.8252 11.544 21.3199 12.166 21.6366C13.4807 22.3066 16.054 23.5012 19.0974 24.3099C20.2187 24.6072 21.3974 24.6326 22.4867 24.2352C23.2854 23.9446 24.344 23.4806 25.6134 22.7479C26.3119 22.3448 26.9968 21.9183 27.6667 21.4692C29.278 20.3872 30.1014 18.4972 29.774 16.5839C29.4609 14.7817 28.9689 13.0152 28.3054 11.3106C27.6027 9.49855 25.7674 8.45055 23.8647 8.84255C20.99 9.43522 18.4747 10.4866 18.4747 10.4866C17.948 9.57522 16.8394 7.96655 15.978 6.74522C15.2647 5.73389 14.0114 5.17655 12.8914 5.70322C12.6102 5.83646 12.3398 5.99137 12.0827 6.16655L12.082 6.16722ZM2.14003 6.64255C1.7447 6.41389 1.69203 5.86589 2.05336 5.58589C3.2867 4.62922 4.99603 3.54989 6.24003 3.28255C6.6427 3.19589 7.03336 3.42255 7.16003 3.81389C7.5507 5.02522 7.4707 7.04522 7.2587 8.59122C7.1967 9.04455 6.69603 9.27255 6.30003 9.04455L2.14003 6.64255ZM2.14003 21.0926C1.7447 21.3212 1.69203 21.8692 2.05336 22.1499C3.2867 23.1066 4.99603 24.1852 6.24003 24.4526C6.6427 24.5392 7.03336 24.3132 7.16003 23.9219C7.5507 22.7106 7.4707 20.6899 7.2587 19.1439C7.1967 18.6912 6.69603 18.4626 6.30003 18.6906L2.14003 21.0939V21.0926Z'
                  stroke='#4B7CE8'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M4.5834 8.05225C3.53957 9.83939 2.99289 11.8733 3.00007 13.9429C3.00007 16.5202 3.81607 18.4736 4.5454 19.7042'
                  stroke='#4B7CE8'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Pinch to zoom</span>
            </div>
          </div>
        </div>
      )
    );
  };

  return (
    <>
      {isMobile && <RenderZoomOverlay />}
      {showConfetti && <ConfettiSideCannons />}
      <div className='px-6 lg:px-40 pt-32'>
        <div className='bg-white-500 flex flex-col gap-6 border-2 border-blue-500 rounded-lg p-6'>
          <div className='flex flex-wrap justify-between'>
            <h1 className='text-mobile-display-2 lg:text-heading-1-bold'>
              {roadmap.title}
            </h1>
            <div className='flex flex-wrap items-center gap-4 mt-2'>
              <Button
                onClick={() => setIsFinishedDialogOpen(true)}
                aria-label='Rating'
                className='flex items-center gap-2 p-2 border border-[#E5E5E5] md:hidden'
              >
                <StarIcon filled={!!roadmap.rating?.is_rated} />
              </Button>
              <a
                href={importToCalendarLink()}
                target='_blank'
                rel='noopener noreferrer'
              >
                <Button
                  className='text-gray-400 hover:text-blue-500 transition-all ease-out duration-300 rounded-lg'
                  aria-label='Import to Calendar'
                >
                  <div
                    className={`flex items-center gap-1 border-2 rounded-lg border-[#E5E5E5] hover:border-blue-500 p-2`}
                  >
                    <span role='img' aria-label='folder'>
                      🗓️
                    </span>
                    <span className='text-black-500'>Import to Calendar</span>
                  </div>
                </Button>
              </a>
              <Button
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
                  className={`flex items-center gap-1 border-2 rounded-lg ${
                    saved
                      ? "border-blue-500"
                      : "border-[#E5E5E5] hover:border-blue-500"
                  } p-2`}
                >
                  <span role='img' aria-label='folder'>
                    🗂️
                  </span>
                  <span
                    className={`${saved ? "text-white-500" : "text-black-500"}`}
                  >
                    {saved ? "Saved!" : "Save"}
                  </span>
                </div>
              </Button>
              <Button
                onClick={() => setRegenerateDialogOpen(true)}
                aria-label='Regenerate roadmap'
                className='hover:text-white-500'
              >
                <div className='flex items-center gap-1 border-2 border-[#E5E5E5] hover:bg-blue-500 hover:border-blue-700 rounded-lg p-2'>
                  <span role='img' aria-label='refresh'>
                    🔄
                  </span>
                  <span>Regenerate</span>
                </div>
              </Button>
              {session.user.id === roadmap.creator.id && (
                <Button
                  onClick={() => setDeleteDialogOpen(true)}
                  aria-label='Delete roadmap'
                  className='text-gray-400 hover:text-blue-500 transition-all ease-out duration-300 rounded-lg'
                >
                  <div className='flex items-center gap-1 border bg-red-50 border-red-400 hover:bg-red-500 hover:border-red-700 rounded-lg p-2'>
                    <span role='img' aria-label='refresh'>
                      🗑️
                    </span>
                  </div>
                </Button>
              )}
            </div>
          </div>

          <div className='relative dashedLine inset-0'></div>

          <div className={`${showDetails ? "" : "hidden"}`}>
            <div className='flex flex-col gap-6'>
              <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
                {roadmap.description}
              </p>

              <div className='relative dashedLine inset-0'></div>

              <div className='flex flex-col gap-5'>
                <div className='grid grid-cols-2 md:flex md:flex-row md:justify-between gap-3 text-mobile-body-1-regular lg:text-body-1-regular flex-wrap'>
                  <span className='flex flex-col md:flex md:flex-row'>
                    <span>📅 Date Created : </span>
                    {new Date(roadmap.created_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  <span className='flex flex-col items-end md:flex md:flex-row'>
                    <span>⌛ Time Available : </span>
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
                  <span className='flex flex-col md:flex md:flex-row'>
                    <span>🤯 Skill Level : </span>
                    {roadmap.personalization_options.skill_level}
                  </span>
                  <span className='flex flex-col items-end md:flex md:flex-row'>
                    <span>📆 Duration : </span>
                    {roadmap.personalization_options.total_duration.value}{" "}
                    {roadmap.personalization_options.total_duration.unit}
                  </span>
                </div>
              </div>

              <div className='relative dashedLine inset-0'></div>
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='flex flex-wrap justify-between text-mobile-body-1-regular lg:text-body-1-regular'>
              <span className='hidden md:block'>🏃 Learning Progress</span>
              <span>{`${finishedTopics}/${totalTopics} Topics Completed`}</span>
            </div>
            <Progress.Root
              className='relative bg-blue-100 rounded-full h-3 overflow-hidden'
              value={finishedTopics}
              max={totalTopics}
            >
              <Progress.Indicator
                className='bg-blue-600 h-full transition-all duration-300 ease-out'
                style={{
                  width: `${(finishedTopics / totalTopics) * 100}%`,
                }}
              />
            </Progress.Root>
          </div>

          <div className='text-white-500 text-mobile-body-1-bold flex justify-end md:hidden'>
            <Button
              onClick={toggleDetails}
              className='w-full h-11 bg-blue-500 active:bg-blue-900 text-black px-3'
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
        isFinished={roadmap?.progression?.is_finished || false}
        open={isFinishedDialogOpen}
        onClose={() => setIsFinishedDialogOpen(false)}
        slug={roadmap.slug}
        existingData={roadmap}
        onRated={() => {
          // Kalau memang tidak memerlukan rating & comment langsung,
          // misalnya:
          setIsFinishedDialogOpen(false);
          setIsRated(true);
          fetchRoadmap();
        }}
      />

      <div className='text-mobile-body-1-regular lg:text-body-1-regular hidden md:flex fixed bottom-20 left-12 z-50'>
        <div className='flex items-center gap-2'>
          <Button
            onClick={() => setIsFinishedDialogOpen(true)}
            aria-label='Edit rating'
            className='bg-white-500 p-2 border-2 border-blue-500 text-gray-600 hover:text-gray-800 focus:outline-none'
          >
            <span role='img' aria-label='edit'>
              ✏️
            </span>
          </Button>
          <div className='flex items-center bg-white-500 border-2 border-blue-500 px-3 py-2 rounded-lg shadow-lg gap-2'>
            <span>Your rating:</span>
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon key={i} filled={i <= (roadmap.rating?.rating ?? 0)} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
