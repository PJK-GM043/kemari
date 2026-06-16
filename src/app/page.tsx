import { destinationService } from "@/services/destination.service";
import { HeroSection, RecommendationSection, FeaturesSection, CityTabsSection, FAQSection, CTABanner } from "@/components/home/HomeSections";

export default async function HomePage() {
  const rankings = await destinationService.getRecommendations({ limit: 6 });

  const citiesRaw = await destinationService.getCities();
  const cities = await Promise.all(
    citiesRaw.map(async (city) => {
      const result = await destinationService.getDestinations({ page: 1, limit: 6, kota: city.slug });
      const tempat = result.data.map((d: any) => ({
        slug: d.slug,
        nama: d.nama,
        imageUrl: d.imageUrl,
        kota: d.kota,
        skor: d.skor,
        totalUlasan: d.totalUlasan,
      }));
      return { ...city, tempat };
    })
  );

  return (
    <>
      <HeroSection rankings={rankings} />
      <RecommendationSection rankings={rankings} />
      <FeaturesSection />
      <CityTabsSection cities={cities} />
      <FAQSection />
      <CTABanner />
    </>
  );
}
