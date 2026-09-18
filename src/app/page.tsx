import CategorySection from "@/components/CategorySection";
import HeroCarousel from "@/components/HeroCarousel";
import RecommendationSection from "@/components/RecommendationSection";
import BrandSection from "@/components/BrandSection";


export default function Home() {
  return (
    <main className="min-h-screen bg-[#181818] text-white">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-[100px] px-10 py-20">
        <HeroCarousel />
        <CategorySection />
        <RecommendationSection />
        <BrandSection />
      </div>
    </main>
  );
}