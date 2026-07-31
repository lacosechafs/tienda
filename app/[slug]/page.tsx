import { ListProducts } from "@/components/list-products";
import { createClient } from "@/lib/supabase/server";
import { Props } from "@/types/types";
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
    <div className="w-full mt-5 px-2">
      <ListProducts products={category.products} title={category.name} />
    </div>
  );
}

export const dynamic = 'force-dynamic';