"use client";

import { useState } from "react";
import SearchBar, {
  SearchFormValues,
} from "@/features/search/components/SearchBar";
import { useSearchBusinesses } from "@/features/search/hooks/useSearchBusinesses";
import SearchBusinessList from "./SearchBusinessList";

export default function SearchPage() {
  const [params, setParams] = useState<{ q: string }>();

  const { data, isLoading, error } = useSearchBusinesses(params);

  const handleSearch = (values: SearchFormValues) => {
    setParams({ q: values.q });
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-center mb-6">
        Encontrá lo que buscás
      </h1>
      <SearchBar onSearch={handleSearch} />

      {isLoading && <p className="mt-6 text-center">Buscando...</p>}
      {error && (
        <p className="mt-6 text-center text-red-500">Error: {error.message}</p>
      )}

      {data && <SearchBusinessList businesses={data.data} />}
    </div>
  );
}
