"use client";
import {
  getRoadmapTopicBySlug,
  markTopicAs,
} from "@/app/roadmap/[slug]/actions";
import Loader from "@/components/loader/loader";
import { GetTopicBySlugOutput } from "@/types/api-topic";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";
import Button from "../ui/button";

interface TopicDialogProps {
  slug: string | null;
  roadmapSlug: string;
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
    const res = await getRoadmapTopicBySlug(slug);
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
      await markTopicAs({ slug, completed: !data.is_finished });
      updateTopicStatus(slug, !data.is_finished);
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
          <Dialog.Content className="fixed md:rounded-lg md:border-2 md:border-blue-500 left-1/2 top-1/2 w-full h-full md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-600 -translate-x-1/2 -translate-y-1/2 bg-white-500 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all">
            <Dialog.Title className="sr-only">Topic Details</Dialog.Title>
            {!loading && data ? (
              <>
                <div className="w-full sticky top-0 bg-white-500 shadow-md p-4 z-50 flex justify-between">
                  <div className="flex items-center gap-2">
                    <a
                      href={`http://www.google.com/search?q=${data.external_search_query}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button className="border-2 border-white-600 hover:border-blue-500 w-11 h-11 flex items-center justify-center">
                        <svg
                          width="25"
                          height="25"
                          viewBox="0 0 25 25"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M23.1674 12.8574C23.1674 12.0774 23.0974 11.3274 22.9674 10.6074H12.6074V14.8674H18.5274C18.2674 16.2374 17.4874 17.3974 16.3174 18.1774V20.9474H19.8874C21.9674 19.0274 23.1674 16.2074 23.1674 12.8574Z"
                            fill="#4285F4"
                          />
                          <path
                            d="M12.6076 23.6075C15.5776 23.6075 18.0676 22.6275 19.8876 20.9475L16.3176 18.1775C15.3376 18.8375 14.0876 19.2375 12.6076 19.2375C9.7476 19.2375 7.3176 17.3075 6.4476 14.7075H2.7876V17.5475C4.5976 21.1375 8.3076 23.6075 12.6076 23.6075Z"
                            fill="#34A853"
                          />
                          <path
                            d="M6.44742 14.6975C6.22742 14.0375 6.09742 13.3375 6.09742 12.6075C6.09742 11.8775 6.22742 11.1775 6.44742 10.5175V7.67749H2.78742C2.03742 9.15749 1.60742 10.8275 1.60742 12.6075C1.60742 14.3875 2.03742 16.0575 2.78742 17.5375L5.63742 15.3175L6.44742 14.6975Z"
                            fill="#FBBC05"
                          />
                          <path
                            d="M12.6076 5.98742C14.2276 5.98742 15.6676 6.54742 16.8176 7.62742L19.9676 4.47742C18.0576 2.69742 15.5776 1.60742 12.6076 1.60742C8.3076 1.60742 4.5976 4.07742 2.7876 7.67742L6.4476 10.5174C7.3176 7.91742 9.7476 5.98742 12.6076 5.98742Z"
                            fill="#EA4335"
                          />
                        </svg>
                      </Button>
                    </a>
                    <a
                      target="_blank"
                      rel="noopener noreferrer"
                      href={`https://www.youtube.com/results?search_query=${data.external_search_query}`}
                    >
                      <Button className="border-2 border-white-600 hover:border-blue-500 w-11 h-11 flex items-center justify-center">
                        <svg
                          className="w-8"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path
                            fill="#f40202"
                            d="m10 15l5.19-3L10 9zm11.56-7.83c.13.47.22 1.1.28 1.9c.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83c-.25.9-.83 1.48-1.73 1.73c-.47.13-1.33.22-2.65.28c-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44c-.9-.25-1.48-.83-1.73-1.73c-.13-.47-.22-1.1-.28-1.9c-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83c.25-.9.83-1.48 1.73-1.73c.47-.13 1.33-.22 2.65-.28c1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44c.9.25 1.48.83 1.73 1.73"
                          />
                        </svg>
                      </Button>
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      onClick={toggleFinished}
                      disabled={loading}
                      className={`w-full md:max-w-48 text-sm border-2 py-3 px-2 transition text-mobile-body-1-regular lg:text-body-1-regular ${
                        data.is_finished
                          ? "border-blue-500 bg-blue-500 text-white-500"
                          : "border-white-600 hover:border-blue-500"
                      }`}
                    >
                      {loading
                        ? "Processing..."
                        : data.is_finished
                        ? "✅ Mark as Done"
                        : "✅ Mark as Done"}
                    </Button>
                    <Dialog.Close asChild>
                      <button
                        className="flex items-center justify-center w-11 h-11 p-2 bg-blue-50 shrink-0 rounded-lg text-blue-400 hover:text-blue-600 hover:bg-blue-100"
                        aria-label="Close Chat"
                        title="Close Chat"
                      >
                        <svg
                          className="w-3"
                          viewBox="0 0 12 13"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0.906738 1.51465L11.0919 11.6998M0.906738 11.6998L11.0919 1.51465"
                            stroke="#4B7CE8"
                            stroke-width="1.83333"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </button>
                    </Dialog.Close>
                  </div>
                </div>

                <div className="px-6 pb-6 md:px-10 md:pb-10">
                  <Dialog.Title className="text-mobile-heading-2-bold lg:text-heading-2-bold mt-4">
                    {data.title}
                  </Dialog.Title>

                  <div className="dashedLine my-6"></div>

                  <p className="text-mobile-heading-4-regular lg:text-body-1-regular">
                    {data.description}
                  </p>

                  <div className="dashedLine my-6"></div>

                  {/* Youtube Videos */}
                  {data.external_resources &&
                    data.external_resources.youtube_videos.length > 0 && (
                      <>
                        <section className="flex flex-col gap-4">
                          <div className="text-mobile-heading-4-bold lg:text-heading-4-bold flex items-center gap-2">
                            <div className="bg-blue-600 text-white rounded p-1">
                              ▶️
                            </div>
                            <p>Youtube</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {data.external_resources &&
                              data.external_resources.youtube_videos.map(
                                (video, i) => {
                                  const videoId = extractYouTubeID(video.url);
                                  return (
                                    <div
                                      key={i}
                                      className="rounded overflow-hidden shadow-md"
                                    >
                                      {videoId ? (
                                        <div className="max-w-sm h-full mx-auto bg-white-500 rounded-lg shadow-md overflow-hidden">
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
                                          <div className="text-mobile-body-1-bold lg:text-body-1-bold p-2 bg-white border-t border-gray-200 flex flex-col">
                                            <p
                                              className="font-semibold"
                                              dangerouslySetInnerHTML={{
                                                __html: video.title,
                                              }}
                                            ></p>
                                            <span className="text-mobile-body-1-regular lg:text-body-1-regular text-sm text-gray-600">
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
                  {data.external_resources &&
                    data.external_resources.books.length > 0 && (
                      <section>
                        <div className="text-mobile-heading-4-bold lg:text-heading-4-bold flex items-center gap-2">
                          <div className="bg-blue-600 text-white rounded p-1">
                            📙
                          </div>
                          <p className="font-bold">Books</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {data.external_resources &&
                            data.external_resources.books.map((book, i) => (
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
                                <div className="flex flex-col gap-2">
                                  <p
                                    className="text-mobile-body-1-bold lg:text-body-1-bold"
                                    dangerouslySetInnerHTML={{
                                      __html: book.title,
                                    }}
                                  ></p>
                                  <p className="text-mobile-body-1-regular lg:text-body-1-regular">
                                    {book.author}
                                  </p>
                                  <p className="text-mobile-body-1-regular lg:text-body-1-regular">
                                    Pages: {book.length}
                                  </p>
                                </div>
                              </a>
                            ))}
                        </div>
                      </section>
                    )}

                  <div className="dashedLine my-6"></div>

                  <div className="flex flex-col gap-4">
                    {/* Pro Tips */}
                    <div className="bg-blue-100 text-blue-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded border border-blue-300">
                      <p className="font-bold">ℹ️ Tips & Tricks</p>
                      <p>{data.pro_tips}</p>
                    </div>
                    {/* Disclaimer */}
                    <div className="bg-yellow-100 text-yellow-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded border border-yellow-300">
                      <p className="font-bold">⚠️ Disclaimer</p>
                      <p>
                        The resources provided may not be exhaustive or
                        accurate. Please verify the content and consult multiple
                        sources for a comprehensive understanding of the topic.
                      </p>
                    </div>
                  </div>
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
