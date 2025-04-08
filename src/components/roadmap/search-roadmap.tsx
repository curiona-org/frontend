import { useState } from "react";
import Image from "next/image";
import Logo from "/public/logo-search.svg";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Newest");

  return (
    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden w-full h-14">
      {/* Input Search */}
      <Image src={Logo} alt="Logo" className="relative left-3"/>
      <input
        type="text"
        placeholder="Type a keyword to explore roadmaps..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full px-4 py-2 text-black-500 focus:outline-none"
      />

      {/* Dropdown Filter */}
      <div className="relative">
        <select
          className="px-4 py-2 bg-white text-black border-l border-gray-300 cursor-pointer focus:outline-none"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="Newest">Newest</option>
          <option value="Oldest">Oldest</option>
          <option value="Most Popular">Most Popular</option>
        </select>
      </div>
    </div>
  );
};

export default SearchBar;
