import React, { useState } from "react";
import { Skeleton } from "@nextui-org/react";
import ImageGrid from "./ImageGrid";
import YouTubePreview from "./YouTubePreview"; // Import the new YouTubePreview component

interface CardProps {
  websiteName: string;
  url: string;
  title: string;
  snippet: string;
  imageUrl: string;
}

const Card: React.FC<CardProps> = ({
  websiteName,
  url,
  title,
  snippet,
  imageUrl,
}) => {
  const [isHovered, setIsHovered] = useState(false); // Track hover state
  const [summary, setSummary] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]); // Store fetched images
  const [loading, setLoading] = useState(false); // Track loading state
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  // Utility function to check if the URL is a YouTube link and extract the video ID
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
      setLoadingImages(true); // Start loading for both summary and images
      try {
        // Use Promise.all to fetch both summary and images asynchronously
        const [summaryResponse, imagesResponse] = await Promise.all([
          fetch("/api/testSummary", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }),
          }),
          fetch("/api/fetch-images", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ url }), // Assuming you have an endpoint to fetch images
          }),
        ]);

        const summaryData = await summaryResponse.json();
        const imagesData = await imagesResponse.json();

        setSummary(summaryData.summary);
        setImages(imagesData.images || []); // Ensure images is always an array
      } catch (error) {
        console.error("Error fetching summary and images:", error);
      } finally {
        setLoading(false); // Stop loading for both summary and images
        setLoadingSummary(false);
        setLoadingImages(false);
      }
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className="w-full overflow-hidden text-white transition-all duration-300 ease-in-out"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex">
        <div className="flex-grow">
          <h2 className="mb-1 text-xl font-bold text-blue-400">{title}</h2>
          <p className="mb-1 text-sm text-gray-400">{websiteName}</p>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="mb-2 inline-block text-sm text-blue-500 hover:underline"
          >
            {url}
          </a>

          {/* Expandable content with dynamic height */}
          <div
            className={`text-gray-300 transition-all duration-300 ease-in-out ${
              isHovered ? "max-h-[1000px] opacity-100" : "max-h-0 opacity-0"
            } overflow-hidden`}
          >
            {/* Show the video preview if it's a YouTube link and the card is hovered */}
            {videoId && isHovered ? (
              <YouTubePreview videoId={videoId} /> // Use the new YouTubePreview component
            ) : (
              <>
                {/* If loading, show skeleton; else show the summary and images */}
                {loadingSummary ? (
                  <div className="flex w-full max-w-[300px] flex-col gap-2">
                    <p className="font-bold">GENERATING SUMMARY</p>
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                    <Skeleton className="h-16 w-2/5 rounded-lg" />
                  </div>
                ) : (
                  <p>{summary}</p>
                )}

                {/* Display the images below the summary */}
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
                  <div className="mt-2 flex flex-wrap items-center justify-center gap-2">
                    {Array.isArray(images) && images.length > 0 && (
                      <ImageGrid images={images} />
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
