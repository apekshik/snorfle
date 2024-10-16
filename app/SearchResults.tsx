// app/vishva/SearchResults.tsx
import React from "react";
import Card from "./Card"; // Assuming Card component is named VishvaCard for your use case
import Card2 from './Card2'

interface SearchResultProps {
  query: string;
  results: Array<any>; // Array of search results
  loading: boolean; // Loading state to display while fetching results
}

const SearchResults: React.FC<SearchResultProps> = ({ query, results, loading }) => {
  return (
    <div className="mt-4">
      {results.length > 0 ? (
        <ul>
          <p className="mb-2 text-2xl font-bold text-white">Results</p>
          {results.map((result, index) => {
            // Extract image from the search result's pagemap
            const imageUrl =
              result.pagemap?.cse_image?.[0]?.src ||
              result.pagemap?.cse_thumbnail?.[0]?.src ||
              ""; // Fallback to empty string if no image is found

            return (
              <li key={index} className="mb-4">
                <Card2
                  websiteName={result.displayLink}
                  url={result.link}
                  title={result.title}
                  snippet={result.snippet}
                  imageUrl={imageUrl} // Pass the extracted image URL
                  query={query}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        !loading && <p className="text-white"></p>
      )}
    </div>
  );
};

export default SearchResults;
