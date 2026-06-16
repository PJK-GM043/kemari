import { destinationService } from "@/services/destination.service";
import { ExploreClient } from "./ExploreClient";

export default async function ExplorePage() {
  const result = await destinationService.getDestinations({ page: 1, limit: 12 });
  const cities = await destinationService.getCities();

  return (
    <ExploreClient
      initialData={result.data}
      pagination={result.pagination}
      cities={cities}
    />
  );
}
