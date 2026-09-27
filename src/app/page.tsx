import CategorySection from "@/components/CategorySection";
import HeroCarousel from "@/components/HeroCarousel";
import RecommendationSection from "@/components/RecommendationSection";
import BrandSection from "@/components/BrandSection";

export default function Home() {
  return (
    <main className="bg-[#181818] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-16 px-4 py-12 md:gap-[100px] md:px-10 md:py-20">
        <HeroCarousel />
        <CategorySection />
        <RecommendationSection />
        <BrandSection />
      </div>
    </main>
  );
}