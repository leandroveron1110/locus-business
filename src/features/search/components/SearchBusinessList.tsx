import { SearchResultBusiness } from "../types/search";
import { SearchBusinessCard } from "./SearchBusinessCard";

interface Props {
  businesses: SearchResultBusiness[];
}

export default function SearchBusinessList({ businesses }: Props) {
  return (
    <div className="grid gap-4">
      {businesses.map((b) => (
        <SearchBusinessCard key={b.id} business={b}  />
      ))}
    </div>
  );
}
