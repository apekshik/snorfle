"use client"
import Image from "next/image";
import React, { useState } from "react"
import { Textarea, Button, Tooltip, Chip } from "@nextui-org/react";
import SearchResults from "./SearchResults";

export default function Home() {
  const [query, setQuery] = useState(""); // State for query input
  const [results, setResults] = useState([]); // State for search results
  const [filters, setFilters] = useState<string[]>([]); // State for smart filters
  const [loading, setLoading] = useState(false); // State to track loading

  const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
  const CX = process.env.NEXT_PUBLIC_GOOGLE_CX;

  const handleSearch = async () => {
    if (!query) return; // If search is empty, don't search
    setLoading(true);
    // Clear previous results immediately when a new search starts
    setResults([]);
    try {
      // Fetch search results
      const response = await fetch(
        `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${CX}&q=${encodeURIComponent(query)}`,
      );
      const data = await response.json();
      setResults(data.items || []); // Update state with search results

      // Fetch smart filters
      const filterResponse = await fetch("/api/filters", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query }), // Send search query to API
      });
      const filterData = await filterResponse.json();
      setFilters(filterData.filters || []); // Update state with smart filters
    } catch (error) {
      console.error("Error fetching search results or filters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      handleSearch();
    }
  };


  return (
    <div className="flex min-h-screen w-full items-center justify-center">
    <div className="flex h-full w-full flex-col items-center justify-center space-y-6">
      <div className="">
        <h1 className="text-center font-bebas text-6xl font-bold text-white">
          GROOKLE
        </h1>
        <p className="text-center font-bebas text-gray-400">
          The modern Search Engine
        </p>
      </div>
      <div className="w-1/2">
        <Textarea
          placeholder="Search through the Universe..."
          minRows={1}
          maxRows={15}
          variant="bordered"
          size="lg"
          className="w-full"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />


        <div className="mt-4 flex w-full gap-2">
          <Tooltip
            showArrow={true}
            placement="bottom"
            content="Search like it's Google but see the magic"
          >
            <Button
              radius="sm"
              color="warning"
              size="sm"
              variant="shadow"
              isLoading={loading}
              spinnerPlacement="end"
              onClick={handleSearch}
              disabled={loading}
            >
              {loading ? "Searching" : "Search ⌘ + Enter"}
            </Button>
          </Tooltip>
          <Tooltip
            showArrow={true}
            content="Ask like it's ChatGPT (Coming soon)"
            placement="bottom"
          >
            <Button radius="sm" color="danger" size="sm" variant="flat">
              Chat ⌥ + Enter
            </Button>
          </Tooltip>
        </div>

        <SearchResults query={query} results={results} loading={loading} />
      </div>
    </div>
  </div>
  );
}
