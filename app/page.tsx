import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { ProductsOffers } from "@/components/products-offers";

export default function Home() {

  return (
    <div className="w-full max-w-[calc(100%-350px)] mt-10 px-2">
      <Hero />
      <ProductsOffers />
      <FeaturedProducts />
    </div>
  )
}


