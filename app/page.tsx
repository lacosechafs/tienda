import { FavsProducts } from "@/components/navbar/favs-products";
import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { ProductsOffers } from "@/components/products-offers";

export default function Home() {

  return (
    <div className="w-full mt-5 px-2">
      <Hero />
      <ProductsOffers />
      <FeaturedProducts />
    </div>
  )
}


