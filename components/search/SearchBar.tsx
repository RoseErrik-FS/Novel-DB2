// components\search\SearchBar.tsx
"use client";

import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";
import { Input, Button } from "@nextui-org/react";
import { SearchIcon } from "@/components/utils/icons";

interface SearchBarProps {
  initialQuery?: string;
}

const SearchBar = ({ initialQuery = "" }: SearchBarProps) => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState(initialQuery);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    router.push(`/Search?q=${encodeURIComponent(searchQuery)}`);
  };

  return (
    <form onSubmit={handleSearch} className="mb-4">
      <Input
        type="search"
        aria-label="Search"
        placeholder="Search novels..."
        value={searchQuery}
        onChange={(e: { target: { value: SetStateAction<string> } }) =>
          setSearchQuery(e.target.value)
        }
        size="lg"
        fullWidth
        startContent={
          <SearchIcon className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
        }
        endContent={
          <Button type="submit" color="primary" className="mr-2">
            Search
          </Button>
        }
        classNames={{
          inputWrapper: "!pr-0",
          input: "!pr-0",
        }}
      />
    </form>
  );
};

export default SearchBar;
