// import { FeaturedProducts } from "@/components/featured-products";
// import { Hero } from "@/components/hero";
// import { ProductsOffers } from "@/components/products-offers";

// export default function Home() {

//   return (
//     <div className="w-full mt-5 px-2">
//       <Hero />
//       {/* <ProductsOffers /> */}
//       <FeaturedProducts />
//     </div>
//   )
// }


"use client"

import { FeaturedProducts } from "@/components/featured-products";
import { Hero } from "@/components/hero";
import { ListCategoriesBody } from "@/components/new-model/list-categories-body";
import { useState } from "react";

export default function Home() {

  const [openOptions, setOpenOptions] = useState<string | null>(null)

  return (
    <div className="w-full mt-5">
      {/* <Hero /> */}
      <ListCategoriesBody />
      {/* <ProductsOffers /> */}
      {/* <FeaturedProducts /> */}
    </div>
  )
}


