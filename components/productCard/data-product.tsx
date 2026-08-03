import { useAppDispatch, useAppSelector } from '@/hooks/useRedux';
import { RootState } from '@/redux/makeStore';
import { changeData } from '@/redux/userSlice';
import { dataCatalog, PropsDataProduct } from '@/types/types';
import { useEffect, useState } from 'react'
import { SizeZone } from './size-zone';
import { QuantityInput } from './quantity-input';
import { GridComp } from '../grid-comp';
import { DisplayWidth } from '@/helpers/display-width';
import { ProductsCart } from './products-cart';

export const DataProduct = ({
    id,
    name,
    title,
    orderCatalog,
    ids
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
            setOpenOptions({ id: orderCatalog?.[0]?.id, index: indexStocked })
        }
    }, [orderCatalog])

    const [openOptions, setOpenOptions] = useState<Record<string, number>>({ index: 0, id: 0 });
    const [openAddOptions, setOpenAddOptions] = useState<boolean>(false);
    const displayWidth = DisplayWidth()

    const maxDiscount = Math.max(...orderCatalog.map(m => m.percentage_discount))

    return (
        <div className="flex flex-col flex-1 px-2 pt-0 md:pt-2 justify-between">
            <div className="flex w-full min-h-14 relative">

                {/* BADGE DE DESCUENTO EN MOBILE */}
                {maxDiscount > 0 && displayWidth < 768 && (
                    <div className="absolute -top-3.5 left-0 z-10 flex items-center gap-1 bg-background px-1.5 py-0.5 rounded-full shadow-xs border border-[#fea70e]/20">
                        <span className="text-[11px] me-4 font-extrabold uppercase tracking-tight text-[#fea70e]">
                            Hasta
                        </span>

                        <div className='absolute left-[48px] bottom-[1px]'>
                            {/* SVG Llama con número de descuento integrado */}
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="28" viewBox="0 0 1024 1024" className="shrink-0">
                                <path fill="red" d="M834.1 469.2A347.5 347.5 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8c-1.4 1.5-3 1.9-4.1 2s-2.8-.1-4.3-1.5c-1.4-1.2-2.1-3-2-4.8c3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9c-11 29.5-26.8 56.9-47 81.5a295.6 295.6 0 0 1-47.5 46.1a352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9" />
                                <text
                                    textAnchor="middle"
                                    fill="white"
                                    fontFamily="Arial, sans-serif"
                                >
                                    <tspan
                                        x="520"
                                        y="640"
                                        dominantBaseline="central"
                                        fontSize="440"
                                        fontWeight="900"
                                        stroke="white"
                                        strokeWidth="10"
                                    >
                                        {maxDiscount}%
                                    </tspan>
                                </text>
                            </svg>
                        </div>

                        <span className="text-[11px] ms-4 font-extrabold uppercase tracking-tight text-[#fea70e]">
                            off
                        </span>
                    </div>
                )}

                <div className='flex w-full items-center justify-between my-3'>
                    <h2 className="font-bold text-[#fea70e]">
                        {name}
                    </h2>
                    <div className='md:hidden w-fit'>
                        <ProductsCart
                            ids={ids}
                            orderCatalog={orderCatalog}
                        />
                    </div>
                </div>

                <div
                    onClick={() => displayWidth < 768 && setOpenAddOptions(prev => !prev)}
                    className={`w-fit self-center md:hidden duration-500 ${openAddOptions ? "rotate-180" : "rotate-0"}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 512 512">
                        <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="48" d="m112 184l144 144l144-144" />
                    </svg>
                </div>
            </div>

            <GridComp condition={displayWidth >= 768 ? true : openAddOptions} extraClass="">
                <div className="flex flex-col w-full justify-around md:p-0">
                    {orderCatalog.length > 0 &&
                        <div className="flex justify-between w-full py-2">
                            <div className="flex ">
                                {orderCatalog.map((m, i) => {
                                    const haveStock = (m.bulk_stock + m.stored_stock) > m.min_stock && m.visible;
                                    const bgClass = openOptions.index === i
                                        ? (m.show_discount ? 'bg-[#fea70e]' : 'bg-[#fea70e]/80')
                                        : (m.show_discount ? 'bg-[#fea70e]/20' : '');

                                    return (
                                        <div
                                            key={`${title}-${m.id}`}
                                            className='relative'
                                        >
                                            <button
                                                onClick={() => setOpenOptions({ id: m.id, index: i })}
                                                className={`border relative rounded-lg min-w-[60px] px-2 py-1 me-2 duration-500 ease-in-out ${bgClass} ${!haveStock ? "opacity-50" : "opacity-100"}`}
                                                disabled={!haveStock}
                                            >
                                                {m.size}{m.unit}
                                            </button>
                                            {m.show_discount && m.percentage_discount > 0 &&
                                                <>
                                                    <div className='text-sm absolute top-[2px] left-[calc(100%-10px)] -translate-1/2'>
                                                        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 1024 1024">
                                                            <path fill="red" d="M834.1 469.2A347.5 347.5 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8c-1.4 1.5-3 1.9-4.1 2s-2.8-.1-4.3-1.5c-1.4-1.2-2.1-3-2-4.8c3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9c-11 29.5-26.8 56.9-47 81.5a295.6 295.6 0 0 1-47.5 46.1a352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9" />
                                                        </svg>
                                                    </div>
                                                </>
                                            }
                                        </div>
                                    );
                                })}
                            </div>
                            <span className={`inline-block align-middle float-end cursor-pointer text-[#fea70e] duration-500 ${user.favs.includes(id) ? "opacity-100" : "opacity-50"}`}
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
                    }

                    <div className="flex flex-col justify-between md:pb-2 h-fit">
                        <div className="py-1 h-[40px] overflow-hidden">
                            <div
                                className="flex flex-col flex-grow gap-2 duration-300 ease-in-out"
                                style={{ transform: `translateY(-${openOptions.index * 40}px)` }}
                            >
                                {orderCatalog.length > 0
                                    ? orderCatalog.map(d => {
                                        const qStock = (d.bulk_stock + d.stored_stock) - d.min_stock;
                                        const { id, size, unit, public_price, show_discount, percentage_discount } = d;
                                        const selected = openOptions.id === d.id

                                        return (
                                            <div key={title + size} className={`flex items-center justify-between my-1 ${qStock > 0 ? "opacity-100" : "opacity-50"}`}>
                                                <SizeZone
                                                    obj={d}
                                                    selected={selected}
                                                    openAddOptions={openAddOptions}
                                                    show_discount={show_discount}
                                                    percentage_discount={percentage_discount}
                                                />
                                                <QuantityInput
                                                    id={id}
                                                    size={size}
                                                    name={name}
                                                    haveStock={qStock > 0}
                                                    price={public_price}
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
                </div>
            </GridComp>
        </div >
    )
}
