"use client";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { GetTopicBySlugOutput } from "@/types/api-topic";
import Loader from "@/components/loader/loader";

const roadmapService = new RoadmapService();

interface TopicDialogProps {
  slug: string;
  open: boolean;
  onClose: () => void;
  updateTopicStatus: (slug: string, isFinished: boolean) => void;
}

const TopicDialog = ({
  slug,
  open,
  onClose,
  updateTopicStatus,
}: TopicDialogProps) => {
  const [data, setData] = useState<GetTopicBySlugOutput | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchTopic = async (slug: string) => {
    setLoading(true);
    const res = await roadmapService.getRoadmapTopicBySlug(slug);
    setData(res.data);
    setLoading(false);
  };

  useEffect(() => {
    if (!slug) return;
    fetchTopic(slug);
  }, [slug]);

  const toggleFinished = async () => {
    if (!slug || !data) return;
    setLoading(true);
    try {
      if (data.is_finished) {
        await roadmapService.markTopicAsIncomplete(slug);
        updateTopicStatus(slug, false);
      } else {
        await roadmapService.markTopicAsFinished(slug);
        updateTopicStatus(slug, true);
      }
      await fetchTopic(slug);
      // window.location.reload();
    } finally {
      setLoading(false);
    }
  };

  function extractYouTubeID(url: string): string {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : "";
  }

  return (
    <Dialog.Root open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto">
          <Dialog.Content className="fixed left-1/2 top-1/2 w-[800px] h-[800px] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all">
            <Dialog.Title className="sr-only">Topic Details</Dialog.Title>
            {!loading && data ? (
              <>
                <div className="flex justify-between items-center">
                  <Dialog.Title className="text-2xl font-bold">
                    {data.title}
                  </Dialog.Title>
                  <button
                    onClick={toggleFinished}
                    disabled={loading}
                    className={`min-w-40 text-sm border p-3 rounded-lg transition text-heading-3 ${
                      data.is_finished
                        ? "border-red-500 text-red-500"
                        : "border-blue-600 text-blue-600"
                    }`}
                  >
                    {loading
                      ? "Processing..."
                      : data.is_finished
                      ? "📌 Mark as Incomplete"
                      : "📌 Mark as Done"}
                  </button>
                </div>

                <div className="dashedLine my-6"></div>

                <p>{data.description}</p>

                <div className="dashedLine my-6"></div>

                {/* Articles */}
                {data.external_resources?.articles.length > 0 && (
                  <>
                    <section>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-blue-600 text-white rounded p-1">
                          📄
                        </div>
                        <p className="font-bold">Articles</p>
                      </div>
                      <ul className="list-disc list-inside pl-5">
                        {data.external_resources.articles.map((a, i) => (
                          <li key={i}>
                            <a
                              href={a.url}
                              className="underline"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {a.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </section>
                    <div className="dashedLine my-2"></div>
                  </>
                )}

                {/* Youtube Videos */}
                {data.external_resources?.youtube_videos.length > 0 && (
                  <>
                    <section className="flex flex-col gap-4">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue-600 text-white rounded p-1">
                          ▶️
                        </div>
                        <p className="font-bold">Youtube</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {data.external_resources.youtube_videos.map(
                          (video, i) => {
                            const videoId = extractYouTubeID(video.url);
                            return (
                              <div
                                key={i}
                                className="rounded overflow-hidden shadow-md"
                              >
                                {videoId ? (
                                  <div className="max-w-sm mx-auto bg-white rounded-lg shadow-md overflow-hidden">
                                    {/* Video aspect ratio */}
                                    <div className="aspect-video relative">
                                      <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title={video.title}
                                        className="absolute inset-0 w-full h-full"
                                        frameBorder="0"
                                        allowFullScreen
                                      ></iframe>
                                    </div>
                                    {/* Info bawah */}
                                    <div className="p-2 bg-white border-t border-gray-200 flex flex-col">
                                      <p className="font-semibold">
                                        {video.title}
                                      </p>
                                      <span className="text-sm text-gray-600">
                                        {video.author}
                                      </span>
                                    </div>
                                  </div>
                                ) : (
                                  <p>Invalid video URL</p>
                                )}
                              </div>
                            );
                          }
                        )}
                      </div>
                    </section>
                  </>
                )}

                <div className="dashedLine my-6"></div>

                {/* Books */}
                {data.external_resources?.books.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="bg-blue-600 text-white rounded p-1">
                        📙
                      </div>
                      <p className="font-bold">Books</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {data.external_resources.books.map((book, i) => (
                        <a
                          key={i}
                          href={book.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex gap-4 border rounded p-4 hover:shadow-lg transition"
                        >
                          <img
                            src={book.cover_url}
                            alt={book.title}
                            className="w-20 h-28 object-cover rounded"
                          />
                          <div>
                            <p className="font-semibold">{book.title}</p>
                            <p className="text-sm text-gray-700">
                              {book.author}
                            </p>
                            <p className="text-xs text-gray-500">
                              Pages: {book.length}
                            </p>
                          </div>
                        </a>
                      ))}
                    </div>
                  </section>
                )}

                <div className="dashedLine my-6"></div>

                {/* Pro Tips */}
                <div className="bg-blue-100 text-blue-800 p-4 rounded border border-blue-300">
                  <p className="font-bold mb-1">Pro tips:</p>
                  <p>{data.pro_tips}</p>
                </div>
              </>
            ) : (
              <div className="flex justify-center items-center min-h-full">
                <Loader />
              </div>
            )}
          </Dialog.Content>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default TopicDialog;
