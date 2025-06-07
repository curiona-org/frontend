"use client";
import Loader from "@/components/loader/loader";
import { RoadmapService } from "@/lib/services/roadmap.service";
import { GetTopicBySlugOutput } from "@/types/api-topic";
import { Dialog } from "radix-ui";
import { useEffect, useState } from "react";

const roadmapService = new RoadmapService();

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
        <Dialog.Overlay className='z-[100] fixed inset-0 bg-[#3C3C3C]/10 backdrop-blur-sm data-[state=open]:animate-fadeIn overflow-y-auto'>
          <Dialog.Content className='fixed left-1/2 top-1/2 w-[400px] h-[600px] md:w-[700px] md:h-[700px] lg:w-[800px] lg:h-[800px] overflow-y-auto [&::-webkit-scrollbar]:bg-transparent [&::-webkit-scrollbar]:w-[6px] [&::-webkit-scrollbar-thumb]:bg-blue-500 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-blue-600 -translate-x-1/2 -translate-y-1/2 rounded-xl bg-white-500 border-2 border-blue-500 p-10 text-blue-900 shadow-lg outline-none data-[state=open]:animate-fadeIn transition-all'>
            <Dialog.Title className='sr-only'>Topic Details</Dialog.Title>
            {!loading && data ? (
              <>
                <div className='flex gap-4 justify-between items-start'>
                  <Dialog.Title className='text-mobile-heading-2-bold lg:text-heading-2-bold'>
                    {data.title}
                  </Dialog.Title>
                  <button
                    onClick={toggleFinished}
                    disabled={loading}
                    className={`w-full md:max-w-48 text-sm border p-3 rounded-lg transition text-heading-3 ${
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

                <div className='dashedLine my-4'></div>

                <p className='text-mobile-heading-4-regular lg:text-body-1-regular'>
                  {data.description}
                </p>

                <div className='dashedLine my-4'></div>

                {/* Youtube Videos */}
                {data.external_resources &&
                  data.external_resources.youtube_videos.length > 0 && (
                    <>
                      <section className='flex flex-col gap-4'>
                        <div className='text-mobile-heading-4-bold lg:text-heading-4-bold flex items-center gap-2'>
                          <div className='bg-blue-600 text-white rounded p-1'>
                            ▶️
                          </div>
                          <p>Youtube</p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {data.external_resources &&
                            data.external_resources.youtube_videos.map(
                              (video, i) => {
                                const videoId = extractYouTubeID(video.url);
                                return (
                                  <div
                                    key={i}
                                    className='rounded overflow-hidden shadow-md'
                                  >
                                    {videoId ? (
                                      <div className='max-w-sm h-full mx-auto bg-white-500 rounded-lg shadow-md overflow-hidden'>
                                        {/* Video aspect ratio */}
                                        <div className='aspect-video relative'>
                                          <iframe
                                            src={`https://www.youtube.com/embed/${videoId}`}
                                            title={video.title}
                                            className='absolute inset-0 w-full h-full'
                                            frameBorder='0'
                                            allowFullScreen
                                          ></iframe>
                                        </div>
                                        {/* Info bawah */}
                                        <div className='text-mobile-body-1-bold lg:text-body-1-bold p-2 bg-white border-t border-gray-200 flex flex-col'>
                                          <p
                                            className='font-semibold'
                                            dangerouslySetInnerHTML={{
                                              __html: video.title,
                                            }}
                                          ></p>
                                          <span className='text-mobile-body-1-regular lg:text-body-1-regular text-sm text-gray-600'>
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

                <div className='dashedLine my-6'></div>

                {/* Books */}
                {data.external_resources &&
                  data.external_resources.books.length > 0 && (
                    <section>
                      <div className='text-mobile-heading-4-bold lg:text-heading-4-bold flex items-center gap-2 mb-3'>
                        <div className='bg-blue-600 text-white rounded p-1'>
                          📙
                        </div>
                        <p className='font-bold'>Books</p>
                      </div>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {data.external_resources &&
                          data.external_resources.books.map((book, i) => (
                            <a
                              key={i}
                              href={book.url}
                              target='_blank'
                              rel='noopener noreferrer'
                              className='flex gap-4 border rounded p-4 hover:shadow-lg transition'
                            >
                              <img
                                src={book.cover_url}
                                alt={book.title}
                                className='w-20 h-28 object-cover rounded'
                              />
                              <div className='flex flex-col gap-2'>
                                <p
                                  className='text-mobile-body-1-bold lg:text-body-1-bold'
                                  dangerouslySetInnerHTML={{
                                    __html: book.title,
                                  }}
                                ></p>
                                <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
                                  {book.author}
                                </p>
                                <p className='text-mobile-body-1-regular lg:text-body-1-regular'>
                                  Pages: {book.length}
                                </p>
                              </div>
                            </a>
                          ))}
                      </div>
                    </section>
                  )}

                <div className='dashedLine my-6'></div>

                {/* Pro Tips */}
                <div className='bg-blue-100 text-blue-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded border border-blue-300 mb-4'>
                  <p className='font-bold mb-1'>ℹ️ Tips & Tricks</p>
                  <p>{data.pro_tips}</p>
                  <p>
                    To get the most out of this topic, consider searching using
                    keywords like
                    <a
                      href={`http://www.google.com/search?q=${data.external_search_query}`}
                      target='_blank'
                      rel='noopener'
                      className='font-semibold hover:underline p-2'
                    >
                      🌍 {data.external_search_query}
                    </a>
                  </p>
                </div>
                {/* Disclaimer */}
                <div className='bg-yellow-100 text-yellow-800 text-mobile-heading-4-regular lg:text-body-1-regular p-4 rounded border border-yellow-300'>
                  <p className='font-bold mb-1'>⚠️ Disclaimer</p>
                  <p>
                    The resources provided may not be exhaustive or accurate.
                    Please verify the content and consult multiple sources for a
                    comprehensive understanding of the topic.
                  </p>
                </div>
              </>
            ) : (
              <div className='flex justify-center items-center min-h-full'>
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
