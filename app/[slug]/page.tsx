import { BoxProduct } from "@/components/productCard/box-product";
import { createClient } from "@/lib/supabase/server";
import { dataProducts, Props } from "@/types/types";
import { cookies } from "next/headers";

export default async function Page({ params }: Props) {

  const { slug } = await params

  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { data: category, error } = await supabase
    .from('categories')
    .select(`*, products(*, catalog(*))`)
    .eq('slug', slug)
    .single()

  if (error || !category) {
    return <div className="p-10">Hemos vendido todo, en breve volveremos a tener productos disponibles.</div>
  }

  return (
    <div className="container mx-auto gap-4 grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] mt-10">
      {category.products.map((p: dataProducts) => {
        if (p.catalog.length === 0) return
        return (
          <BoxProduct
            key={p.id}
            {...{
              name: p.name,
              catalog: p.catalog,
              id: p.id,
            }} />
        )
      })}
    </div>
  );
}

export const dynamic = 'force-dynamic';