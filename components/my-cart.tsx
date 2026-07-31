"use client"

import { useEffect, useMemo, useState } from "react"
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { PriceAnimate } from "@/components/price-animation"
import { QuantityInput } from "./productCard/quantity-input"
import { ArrayProduct, EntriesOrderType } from "@/types/types"
import { FlatStock } from "@/helpers/flat-stock"
import { clearCart, closeCart, removeToCart } from "@/redux/cartSlice"
import { useGetSession } from "@/hooks/useGetSession"
import { confirmOrder } from "@/helpers/confirm-order"
import { getTotal } from "@/helpers/get-total"
import { OrderInput } from "./order-input"
import { changeData } from "@/redux/userSlice"
import { GridComp } from "./grid-comp"

export const MyCart = () => {
  const myCart = useAppSelector((state: RootState) => state.cart)
  const products = useAppSelector((state: RootState) => state.data.products)
  const apUser = useAppSelector((state: RootState) => state.user.data)
  const dispatch = useAppDispatch()

  const productsStock = FlatStock({ products })

  const [lastCart, setLastCart] = useState<Array<ArrayProduct>>([])
  const [openModPhone, setOpenModPhone] = useState<boolean>(false)
  const [step, setStep] = useState<number>(1)

  const [dataOrder, setDataOrder] = useState<EntriesOrderType>({
    address: {
      data: '',
      check: false
    },
    phone: {
      data: null,
      check: false
    },
  })

  const { userData } = useGetSession();

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

  const sendOrder = async () => {
    if (!groupByProduct.length || !dataOrder.address.data) return


    const totalToPay = getTotal(productsNoStock, myCart.products)

    const orderData = {
      uuid: userData[0]?.id || null,
      products: groupByProduct,
      address: String(dataOrder.address.data ?? ""),
      phone: dataOrder.phone.data ? Number(dataOrder.phone.data) : apUser.phone,
      total_pay: totalToPay
    }

    const succes = await confirmOrder(orderData)

    if (succes) {
      dispatch(clearCart())
      setTimeout(() => {
        dispatch(closeCart())
        setTimeout(() => {
          setStep(1)
        }, 0);
      }, 2000);
      return true
    } else {
      console.log("Error al confirmar la orden")
      return false
    }
  }

  const openAddress = apUser.address.some(s => s.includes(String(dataOrder.address.data)));

  return (
    <>
      <div
        className={`hidden md:block shrink-0 transition-all duration-1000 ease-in-out pointer-events-none ${myCart.isOpen ? "w-screen md:max-[1999px]:w-[362px] min-[2000px]:w-0" : "w-0"
          }`}
      />
      <div
        className={`fixed top-[60px] right-0 h-[calc(100vh-60px)] z-50 transition-all duration-1000 ease-in-out ${myCart.isOpen ? "w-screen md:w-[362px] opacity-100" : "w-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="flex flex-col w-screen md:w-[350px] h-full max-h-[calc(100vh-60px)] overflow-auto bg-(--backgroundlt)">
          <h2 className="my-2 whitespace-nowrap px-2">Carrito de compras</h2>

          <div className={`flex overflow-hidden bg-(--backgroundlt) flex-1`}>
            <div className={`flex duration-1000 ease-in-out relative
            ${step === 1 ? "translate-none" : "-translate-x-1/2"} 
            ${step === 3 ? "bg-green-500" : ""} 
            `}>

              <div
                className="w-screen md:w-[350px] min-w-screen md:min-w-[350px] h-full flex-1 flex flex-col"
              >
                <div className="overflow-y-scroll scrollbar-thin flex-1">
                  {groupByProduct.length > 0 &&
                    groupByProduct?.map((p) => {
                      const [productName, variants] = Object.entries(p)[0]
                      const isGroupActive = variants?.some((item) => currentCartIds.has(item.id))

                      return (
                        <div key={productName} className="px-2">
                          <GridComp condition={isGroupActive}>
                            <div className="flex border-t pt-3 justify-between text-[20px]">
                              {productName}
                            </div>

                            {variants
                              ?.sort((a, b) => {
                                const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                                const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                                return valueB - valueA
                              })
                              .map((m, i) => {
                                const isDeleted = !currentCartIds.has(m.id)
                                const withoutStock = productsStock.has(m.id)
                                const calculatedQStock = stockMap.get(`${m.id}-${m.size}`) || 0

                                return (
                                  <GridComp
                                    key={m.id}
                                    condition={!isDeleted}
                                    extraClass={`bg-(--backgroundlt) ${withoutStock ? "opacity-50 text-red-200" : "opacity-100"}`}
                                    class1fr={`py-2 ${i !== 0 && "border-t border-gray-800"}`}
                                    class0fr={`pointer-events-none py-0 border-none border-[transparent]`}
                                  >
                                    <div className="px-2">
                                      <div className="flex flex-row justify-between">
                                        <div className="flex">
                                          <p className="me-2 text-[18px] whitespace-nowrap">
                                            {m.size}
                                            {m.unit}
                                          </p>
                                          {withoutStock &&
                                            <p className="whitespace-nowrap content-center">No disponible</p>
                                          }
                                        </div>
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
                                      <GridComp
                                        key={m.id}
                                        condition={calculatedQStock < m.quantity && !withoutStock}
                                        extraClass={`bg-(--backgroundlt) ${withoutStock ? "opacity-50 text-red-200" : "opacity-100"}`}
                                      >
                                        <div className="flex">
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
                                          <p className="ms-1 text-red-600 whitespace-nowrap content-center">
                                            Stock disponible: {calculatedQStock}
                                          </p>
                                        </div>
                                      </GridComp>
                                    </div>
                                  </GridComp>
                                )
                              })}
                          </GridComp>
                        </div>
                      )
                    })}
                </div>


                <div
                  className={`flex duration-500 ease-in-out mt-2 py-2 justify-between border-t ${myCart.isOpen ? "px-2" : "px-0"
                    }`}
                >
                  <p className="text-[24px] whitespace-nowrap">TOTAL</p>
                  <PriceAnimate
                    cartProducts={productsNoStock}
                    fontSize={24}
                    delay={0}
                  />
                </div>
                <button
                  className={`border rounded-lg m-4 px-2 py-1 text-center ${groupByProduct.length === 0 ? "opacity-50" : "opacity-100"}`}
                  onClick={() => setStep(2)}
                  disabled={groupByProduct.length === 0}
                >
                  Continuar al envío
                </button>
              </div>

              <div
                className="w-full md:w-[350px] min-w-screen md:min-w-[350px] h-full flex-1 flex flex-col relative"
              >
                <div className="overflow-y-scroll scrollbar-thin flex-1">
                  <div className="px-2">
                    <h2>Revisa tus datos</h2>
                    <div>
                      <h3 className="my-2">Teléfono</h3>
                      {apUser?.phone &&
                        < div className="flex justify-between">
                          <p>{apUser?.phone}</p>
                          <button onClick={() => setOpenModPhone(prev => !prev)}>
                            Editar número
                          </button>
                        </div>
                      }
                      <GridComp
                        condition={Number(apUser?.phone) === 0 || openModPhone}
                      >
                        <OrderInput
                          label="Confirma tu teléfono"
                          name="phone"
                          placeholder="Teléfono"
                          value={dataOrder.phone}
                          setValue={setDataOrder}
                        />
                        <GridComp
                          condition={Number(dataOrder.phone.data) !== 0 && Number(dataOrder.phone.data) !== apUser.phone}
                          class1fr="delay-500"
                        >
                          <button
                            onClick={() => { dispatch(changeData({ key: "phone", value: dataOrder.phone.data })); setOpenModPhone(false); setDataOrder(prev => ({ ...prev, phone: { ...prev.phone, data: null } })) }}
                          >
                            Modificar número actual
                          </button>
                        </GridComp>
                      </GridComp>
                    </div>

                    <div>
                      <h3 className="my-2">Dirección de envio</h3>

                      <OrderInput
                        label="Indica nueva dirección"
                        name="address"
                        placeholder="Dirección"
                        value={dataOrder.address}
                        setValue={setDataOrder}
                      />

                      <GridComp
                        condition={!openAddress}
                      >
                        <button
                          onClick={() => dispatch(changeData({ key: "address", value: [...apUser.address, dataOrder.address.data] }))}
                        >
                          Guardar dirección
                        </button>
                      </GridComp>

                      <GridComp
                        condition={openAddress}
                      >
                        <div>
                          {apUser?.address?.map((address, i) => {
                            let query = String(dataOrder.address?.data)?.trim().toLowerCase() || "";
                            const matches = query.length > 0 && (query.length !== address.length && address.toLowerCase().includes(query));

                            return (
                              <GridComp
                                key={i}
                                condition={matches}
                                class1fr="my-1"
                                class0fr="my-0"
                              >
                                <button
                                  type="button"
                                  onClick={() => {
                                    setDataOrder(prev => ({
                                      ...prev,
                                      address: { ...prev.address, data: address }
                                    }));
                                  }
                                  }
                                >
                                  {address}
                                </button>
                              </GridComp>
                            );
                          })}

                        </div>

                      </GridComp>
                    </div>



                  </div>
                </div>
                <div className="flex m-4">
                  <button
                    className="border rounded-lg px-2 py-1 text-center me-2"
                    onClick={() => setStep(1)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20"><path fill="currentColor" d="m5.83 9l5.58-5.58L10 2l-8 8l8 8l1.41-1.41L5.83 11H18V9z" /></svg>
                  </button>
                  <button
                    className={`border rounded-lg px-2 py-1 text-center w-full ${groupByProduct.length === 0 ? "opacity-50" : "opacity-100"}`}
                    onClick={async () => {
                      const orderSent = await sendOrder();

                      if (!orderSent) return;

                      setStep(3)
                      setDataOrder({
                        address: {
                          data: '',
                          check: false
                        },
                        phone: {
                          data: null,
                          check: false
                        },
                      })

                    }
                    }
                    disabled={groupByProduct.length === 0}
                  >
                    Tramitar pedido
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div >
    </>
  )
}