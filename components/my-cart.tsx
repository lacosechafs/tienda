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
  const [step, setStep] = useState('Confirmá tú dirección')

  useEffect(() => {
    if (lastCart.length > myCart.products.length) {
      const timer = setTimeout(() => {
        setLastCart(myCart.products)
      }, 500)
      return () => clearTimeout(timer)
    } else {
      setLastCart(myCart.products)
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

  const groupByProduct = Object.entries(Object.groupBy(lastCart, f => f.name)).map(([key, value]) => ({
    [key]: value
  }))

  return (
    <>
      <div
        className={`hidden md:block shrink-0 transition-all duration-1000 ease-in-out pointer-events-none ${myCart.isOpen ? "w-screen md:w-[350px]" : "w-0"
          }`}
      />
      <div
        className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] z-50 transition-all duration-1000 ease-in-out ${myCart.isOpen ? "w-screen md:w-[350px] opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col w-screen md:w-[350px] h-full max-h-[calc(100vh-60px)] overflow-y-auto bg-(--backgroundlt)">
          <h2 className="my-2 whitespace-nowrap px-2">Carrito de compras</h2>

          <div className="overflow-y-scroll scrollbar-thin flex-1">
            <div
              className={`transition-all duration-500 grid overflow-hidden ${step === "Revisá tú pedido"
                ? "grid-rows-[1fr] py-2 opacity-100"
                : "grid-rows-[0fr] opacity-0 pointer-events-none py-0 border-none"
                }`}
            >
              {groupByProduct.length > 0 &&
                groupByProduct?.map((p) => {
                  const [productName, variants] = Object.entries(p)[0]
                  const isGroupActive = variants?.some((item) => currentCartIds.has(item.id))

                  return (
                    <div key={productName} className="px-2">
                      <div
                        className={`transition-all duration-500 grid overflow-hidden ${!isGroupActive
                          ? "grid-rows-[0fr] opacity-0 pointer-events-none py-0 border-none"
                          : "grid-rows-[1fr] py-2 opacity-100"
                          }`}
                      >
                        <div className="min-h-0">
                          <div className="flex border-t pt-3 justify-between text-[20px]">
                            {productName}
                          </div>

                          {variants
                            ?.sort((a, b) => {
                              const valueA = a.unit === "kg" ? a.size * 1000 : a.size
                              const valueB = b.unit === "kg" ? b.size * 1000 : b.size
                              return valueB - valueA
                            })
                            .map((m, i) => {
                              const isDeleted = !currentCartIds.has(m.id)
                              const withoutStock = productsStock.has(m.id)
                              const calculatedQStock = stockMap.get(`${m.id}-${m.size}`) || 0

                              return (
                                <div
                                  key={m.id}
                                  className={`transition-all duration-500 grid overflow-hidden ${isDeleted
                                    ? "grid-rows-[0fr] opacity-0 pointer-events-none py-0 border-none border-[transparent]"
                                    : `grid-rows-[1fr] starting:grid-rows-[0fr] py-2 ${i !== 0 && "border-t border-gray-800"
                                    }`
                                    } ${withoutStock ? "opacity-50 text-red-200" : "opacity-100"}`}
                                >
                                  <div className="min-h-0">
                                    <div className="px-2">
                                      <div className="flex flex-row justify-between">
                                        <p className="me-2 text-[18px] whitespace-nowrap">
                                          {m.size}
                                          {m.unit}
                                        </p>
                                        <div className="flex">
                                          <div className="flex">
                                            {!withoutStock ? (
                                              <div className="flex">
                                                <div className="me-5">
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
                                                <div className="min-w-[76px] flex justify-end">
                                                  <PriceAnimate
                                                    cartProducts={[m]}
                                                    fontSize={18}
                                                    delay={0}
                                                  />
                                                </div>
                                              </div>
                                            ) : (
                                              <div className="flex">
                                                <p className="whitespace-nowrap">No disponible</p>
                                                <button
                                                  className="me-3"
                                                  onClick={() =>
                                                    dispatch(
                                                      removeToCart({
                                                        id: m.id,
                                                        name: m.name,
                                                        size: m.size,
                                                        quantity: m.quantity,
                                                      })
                                                    )
                                                  }
                                                >
                                                  <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    width="20"
                                                    height="20"
                                                    viewBox="0 0 24 24"
                                                  >
                                                    <path
                                                      fill="currentColor"
                                                      d="M7 21q-.825 0-1.412-.587T5 19V6H4V4h5V3h6v1h5v2h-1v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zM9 17h2V8H9zm4 0h2V8h-2zM7 6v13z"
                                                    />
                                                  </svg>
                                                </button>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      </div>

                                      {/* Alerta de Stock */}
                                      <div
                                        className={`flex grid transition-all duration-500 overflow-hidden ${calculatedQStock < m.quantity
                                          ? "grid-rows-[1fr]"
                                          : "grid-rows-[0fr]"
                                          }`}
                                      >
                                        <div className="min-h-0 flex">
                                          <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="22"
                                            height="22"
                                            viewBox="0 0 24 24"
                                            className="flex-shrink-0 animate-pulse text-red-100"
                                          >
                                            <path
                                              fill="currentColor"
                                              d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2"
                                            />
                                          </svg>
                                          <p className="ms-1 text-red-600 whitespace-nowrap">
                                            Stock disponible: {calculatedQStock}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              )
                            })}
                        </div>
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          <div
            className={`transition-all duration-500 grid overflow-hidden ${step === "Confirmá tú dirección"
              ? "grid-rows-[1fr] py-2 opacity-100"
              : "grid-rows-[0fr] opacity-0 pointer-events-none py-0 border-none"
              }`}
          >
            <div className="overflow-y-scroll scrollbar-thin flex-1">

            </div>
          </div>

          <div
            className={`flex duration-500 mt-2 py-2 justify-between border-t ${myCart.isOpen ? "px-2" : "px-0"
              }`}
          >
            <p className="text-[24px] whitespace-nowrap">TOTAL</p>
            <PriceAnimate
              cartProducts={productsNoStock}
              fontSize={24}
              delay={0}
            />
          </div>
          <div className="flex">
            <button>←</button>
            <p>{step}</p>
            <button>→</button>
          </div>
        </div>
      </div>
    </>
  )
}