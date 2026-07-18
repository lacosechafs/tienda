"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { PriceAnimate } from "@/components/price-animation"
import { QuantityInput } from "./productCard/quantity-input"
import { ArrayProduct } from "@/types/types"
import { FlatStock } from "@/helpers/flat-stock"
import { removeToCart } from "@/redux/cartSlice"

export const MyCart = () => {
  const myCart = useAppSelector((state: RootState) => state.cart)
  const products = useAppSelector((state: RootState) => state.data.products)
  const dispatch = useAppDispatch()

  const productsStock = FlatStock({ products })

  const [lastCart, setLastCart] = useState<Array<ArrayProduct>>([])

  useEffect(() => {
    if (!lastCart.length) {
      setLastCart(myCart.products)
      return
    }

    if (lastCart.length === myCart.products.length) {
      setLastCart(myCart.products)
      return
    } else {
      const timer = setTimeout(() => {
        setLastCart(myCart.products)
      }, lastCart.length > myCart.products.length ? 500 : 10);

      return () => clearTimeout(timer)
    }
  }, [myCart.products])

  const stockMap = useMemo(() => {
    const map = new Map<string, number>()

    products.forEach((p: {
      products?: Array<{
        catalog?: Array<{
          id: number;
          size: number;
          bulk_stock: number;
          stored_stock: number;
          min_stock: number;
        }>
      }>
    }) => {
      p.products?.forEach(subP => {
        subP.catalog?.forEach(item => {
          const qStock = (item.bulk_stock + item.stored_stock) - item.min_stock
          map.set(`${item.id}-${item.size}`, qStock)
        })
      })
    })

    return map
  }, [products])

  const productsNoStock = useMemo(() => {
    return myCart.products.filter(f => !productsStock.has(f.id))
  }, [myCart.products, productsStock])

  const currentCartIds = useMemo(() => new Set(myCart.products.map(p => p.id)), [myCart.products])

  return (
    <div className={`relative duration-1000 transition-discrete ${myCart.isOpen ? "w-[350px] opacity-100 starting:opacity-0 starting:w-0" : "w-0 opacity-0"}`}>
      <div className="sticky top-15 whitespace-nowrap overflow-hidden">
        <h2 className="mb-2">Carrito de compras</h2>
        {lastCart?.map((m: ArrayProduct) => {
          const withoutStock = productsStock.has(m.id)
          const isDeleted = !currentCartIds.has(m.id)

          // Recuperamos el qStock calculado previamente para esta variante
          const calculatedQStock = stockMap.get(`${m.id}-${m.size}`) || 0

          return (
            <div
              key={m.id}
              className={`transition-discrete duration-500 grid overflow-hidden ${isDeleted
                ? "opacity-0 pointer-events-none scale-95 border-transparent mb-0 py-0 grid-rows-[0fr] border-none"
                : "grid-rows-[1fr] mb-4 py-2 border-t starting:opacity-0 starting:grid-rows-[0fr] starting:mb-0 starting:py-0 starting:border-none"
                } ${withoutStock ? "opacity-50 text-red-200" : "opacity-100"}`}
            >
              <div className="min-h-0">
                <div className="px-2">
                  <p>
                    {m.name}
                  </p>
                  <p>
                    {m.size}{m.unit}
                  </p>
                  {withoutStock
                    ? <div className="flex justify-between">
                      <p>No disponible</p>
                      <button onClick={() => dispatch(removeToCart({ id: m.id, name: m.name, size: m.size, quantity: m.quantity }))}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                          <path fill="currentColor" d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z" />
                        </svg>
                      </button>
                    </div>
                    : <div className="flex justify-between">
                      <PriceAnimate cartProducts={[m]} delay={lastCart.length !== myCart.products.length ? 1600 : 0} />
                      <QuantityInput
                        id={m.id}
                        size={m.size}
                        name={m.name}
                        haveStock={true}
                        unit={m.unit}
                        price={m.public_price}
                        qStock={calculatedQStock}
                      />
                    </div>
                  }
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex px-2">
        <p className="me-1">
          Total:
        </p>
        <PriceAnimate cartProducts={productsNoStock} delay={lastCart.length !== myCart.products.length ? 600 : 0} />
      </div>
    </div>
  )
}