"use client";

import { SearchResultBusiness } from "../types/search";
import { SearchBusinessCard } from "./components/card/SearchBusinessCard";
import { Virtuoso } from "react-virtuoso";

interface Props {
  businesses: SearchResultBusiness[];
}

export default function SearchBusinessList({ businesses }: Props) {
  if (!businesses) return null;

  return (
    <section className="max-w-7xl flex flex-col h-[calc(100vh)]">

      {businesses.length > 0 ? (
        <div className="flex-1">
          <Virtuoso
            data={businesses}
            itemContent={(index, business) => (
              <div className="mb-4">
                <SearchBusinessCard key={index} business={business} />
              </div>
            )}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      ) : (
        <p className="text-gray-500 text-center mt-12">
        </p>
      )}
    </section>
  );
}
