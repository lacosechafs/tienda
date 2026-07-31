import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/redux/makeStore';
import { changeData } from '@/redux/userSlice';
import { dataCatalog, PropsBoxProduct, PropsDataProduct } from '@/types/types';
import { useEffect, useState } from 'react'
import { SizeZone } from './size-zone';
import { QuantityInput } from './quantity-input';
import { PriceAnimate } from '../price-animation';

export const DataProduct = ({
    id,
    name,
    title,
    orderCatalog
}: PropsDataProduct) => {

    const dispatch = useAppDispatch()
    const user = useAppSelector((state: RootState) => state.user.data)

    useEffect(() => {
        if (!orderCatalog || orderCatalog.length === 0) return

        const indexStocked = orderCatalog
            ?.sort((a: dataCatalog, b: dataCatalog) => {
                const valueA = (a.unit === "kg" || a.unit === "l") ? a.size * 1000 : a.size
                const valueB = (b.unit === "kg" || b.unit === "l") ? b.size * 1000 : b.size
                return valueB - valueA
            })
            .findIndex((d: dataCatalog) => (d.bulk_stock + d.stored_stock) > d.min_stock)

        if (indexStocked !== -1) {
            setOpenOptions(indexStocked)
        }
    }, [orderCatalog])


    const [openOptions, setOpenOptions] = useState<number>(0);

    return (
        <div className="flex flex-col flex-1 p-2 justify-between">
            <div className="flex w-full">
                <h2 className="w-full font-bold text-[#fea70e]">{name}</h2>
                <span className={`inline-block align-middle float-end ms-2 cursor-pointer text-[#fea70e] duration-500 ${user.favs.includes(id) ? "opacity-100" : "opacity-50"}`}
                    onClick={() => {
                        let newFavs: Array<number> = []

                        if (user.favs.includes(id)) {
                            newFavs = user.favs.filter(f => f !== id)
                        } else {
                            newFavs = [...user.favs, id]
                        }

                        dispatch(changeData({ key: 'favs', value: newFavs }))
                    }}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
                        <path fill="currentColor" d="m7.625 6.4l2.8-3.625q.3-.4.713-.587T12 2t.863.188t.712.587l2.8 3.625l4.25 1.425q.65.2 1.025.738t.375 1.187q0 .3-.088.6t-.287.575l-2.75 3.9l.1 4.1q.025.875-.575 1.475t-1.4.6q-.05 0-.55-.075L12 19.675l-4.475 1.25q-.125.05-.275.063T6.975 21q-.8 0-1.4-.6T5 18.925l.1-4.125l-2.725-3.875q-.2-.275-.288-.575T2 9.75q0-.625.363-1.162t1.012-.763z" />
                    </svg>
                </span>
            </div>
            <div className="flex flex-col w-full justify-around md:p-0">
                {orderCatalog.length > 0 &&
                    <div className="flex py-2">
                        {orderCatalog.map((m, i) => {
                            const haveStock = (m.bulk_stock + m.stored_stock) > m.min_stock && m.visible;

                            return (
                                <button
                                    key={`${title}-${m.id}`}
                                    onClick={() => setOpenOptions(i)}
                                    className={`border rounded-lg min-w-15 px-2 py-1 me-4 duration-500 ease-in-out ${openOptions === i ? "bg-[#fea70e50]" : ""} ${!haveStock ? "opacity-50" : "opacity-100"}`}
                                    disabled={!haveStock}
                                >
                                    {m.size}{m.unit}
                                </button>
                            );
                        })}
                    </div>
                }

                <div className="flex flex-col justify-between md:pb-2 h-fit">
                    <div className="py-1 h-[40px] overflow-hidden">
                        <div
                            className="flex flex-col flex-grow gap-2 duration-300 ease-in-out"
                            style={{ transform: `translateY(-${openOptions * 40}px)` }}
                        >
                            {orderCatalog.length > 0
                                ? orderCatalog.map(d => {
                                    const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                                    const { id, size, unit, finalPrice } = d;

                                    return (
                                        <div key={title + size} className={`flex items-center justify-between my-1 ${qStock > 0 ? "opacity-100" : "opacity-50"}`}>
                                            <SizeZone
                                                id={id}
                                                size={size}
                                                unit={unit}
                                                haveStock={qStock > 0}
                                                price={finalPrice}
                                            />
                                            <QuantityInput
                                                id={id}
                                                size={size}
                                                name={name}
                                                haveStock={qStock > 0}
                                                price={finalPrice}
                                                qStock={qStock}
                                                unit={unit}
                                            />
                                        </div>
                                    );
                                })
                                : <div>Próximamente disponible</div>
                            }
                        </div>
                    </div>
                </div>
                <div className="flex md:hidden justify-end">
                    <PriceAnimate cartProducts={orderCatalog} fontSize={16} title="Subtotal" />
                </div>
            </div>
        </div>
    )
}
