import React, { useState } from "react";
import { Skeleton, Button } from "@nextui-org/react";
import ImageGrid from "./ImageGrid";
import YouTubePreview from "./YouTubePreview";
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeHighlight from 'rehype-highlight';

interface CardProps {
  query: string;
  websiteName: string;
  url: string;
  title: string;
  snippet: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({
  query,
  websiteName,
  url,
  title,
  snippet,
  imageUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [summary, setSummary] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const getYouTubeVideoId = (url: string): string | null => {
    const match = url.match(
      /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    );
    return match ? match[1] : null;
  };

  const videoId = getYouTubeVideoId(url);

  const handleMouseEnter = async () => {
    setIsHovered(true);
    if (!summary && !loading && !videoId) {
      setLoading(true);
      setLoadingSummary(true);
      setLoadingImages(true);
      try {
        const [summaryResponse, imagesResponse] = await Promise.all([
          fetch("/api/testSummary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url, query }),
          }),
          fetch("/api/fetch-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }),
        ]);

        const summaryData = await summaryResponse.json();
        const imagesData = await imagesResponse.json();

        setSummary(summaryData.summary);
        setImages(imagesData.images || []);
      } catch (error) {
        console.error("Error fetching summary and images:", error);
      } finally {
        setLoading(false);
        setLoadingSummary(false);
        setLoadingImages(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handlePeekFurther = () => {
    // Implement the functionality for the Peek Further button
    console.log("Peeking further into:", url);
  };

  return (
    <div
      className="w-full overflow-hidden text-white transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex">
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div className="flex-grow">
              <h2 className="mb-1 text-xl font-bold text-blue-400">{title}</h2>
              <p className="mb-1 text-sm text-gray-400">{websiteName}</p>
              <div className="flex items-center mb-2">
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block text-sm text-blue-500 hover:underline mr-2"
                >
                  {url}
                </a>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              {isHovered && (
                <Button
                  size="sm"
                  color="success"
                  onClick={handlePeekFurther}
                  variant="shadow"
                >Grok it</Button>
              )}
            </div>
          </div>


          <div
            className={`text-gray-300 transition-all duration-300 ease-in-out ${isHovered ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
              } overflow-hidden`}
          >
            {videoId && isHovered ? (
              <YouTubePreview videoId={videoId} />
            ) : (
              <div className="space-y-3">
                {loadingSummary ? (
                  <div className="flex w-full max-w-[300px] flex-col gap-2">
                    <p className="font-bold">GENERATING SUMMARY</p>
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                    <Skeleton className="h-16 w-2/5 rounded-lg" />
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-800">
                      Summary
                    </p>
                    <div className="mt-2 p-4 border-2 border-yellow-400 rounded-md">
                      <ReactMarkdown
                        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeHighlight]}
                        className="markdown-content"
                      >
                        {summary || ''}
                      </ReactMarkdown>
                    </div>
                  </div>
                )}

                {loadingImages ? (
                  <div>
                    <p className="font-bold">LOADING IMAGES</p>
                    <div className="mt-2 flex w-full max-w-[300px] flex-row justify-center gap-2">
                      <Skeleton className="h-32 w-32 rounded-lg" />
                      <Skeleton className="h-32 w-32 rounded-lg" />
                      <Skeleton className="h-32 w-32 rounded-lg" />
                    </div>
                  </div>
                ) : (
                  <div>
                    {Array.isArray(images) && images.length > 0 && (
                      <div>
                        <p className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-blue-800">
                          Photos
                        </p>
                        <div className="mt-2 p-4 border-2 border-pink-600 rounded-md">
                          <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                            <ImageGrid images={images} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
