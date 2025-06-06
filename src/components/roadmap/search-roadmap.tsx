import CommunityRoadmapList from "@/components/roadmap/community-roadmap-list";
import Image from "next/image";
import { useEffect, useState } from "react";
import Logo from "/public/logo-search.svg";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [orderBy, setOrderBy] = useState<"newest" | "oldest">("newest");
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-wrap gap-4 items-center font-satoshi text-display-1'>
        <h1>Explore Community</h1>
        <span className='text-blue-500 dashedBorder px-5 py-1'>Roadmaps</span>
      </div>
      <p className='font-satoshi text-heading-4-regular'>
        Find inspiration in community-made roadmaps and start your own journey.
      </p>
      <div className='flex items-center border border-gray-300 bg-white-500 rounded-lg overflow-hidden w-full h-14'>
        {/* Input Search */}
        <Image src={Logo} alt='Logo' className='relative left-3' />
        <input
          type='text'
          placeholder='Type a keyword to explore roadmaps...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-full px-6 py-2 text-black-500 focus:outline-none'
        />

        {/* Dropdown Filter */}
        <div className='relative'>
          <select
            className='px-4 py-2 bg-white text-black border-l border-gray-300 cursor-pointer focus:outline-none'
            value={orderBy}
            onChange={(e) => setOrderBy(e.target.value as "newest" | "oldest")}
          >
            <option value='newest'>Newest</option>
            <option value='oldest'>Oldest</option>
          </select>
        </div>
      </div>
      <div className='flex flex-col'>
        <CommunityRoadmapList search={debouncedQuery} orderBy={orderBy} />
      </div>
    </div>
  );
};

export default SearchBar;
