import { useAppSelector } from '@/hooks/useRedux'
import { RootState } from '@/redux/makeStore'
import { CatListType, dataProducts } from '@/types/types'
import { useRef } from 'react'
import { TransitionLink } from './transition-link'

export const ListCategories = ({ setOpenOptions, openOptions }: CatListType) => {

    const data = useAppSelector((state: RootState) => state.data.products)

    const catListRef = useRef<HTMLDivElement>(null)

    return (
        <div ref={catListRef} className={`bg-(--backgroundlt) duration-500 overflow-hidden grid ${openOptions === "cat" ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
            <div className='min-h-0'>
                <div className="md:container-md mx-auto flex flex-row justify-center md:justify-start flex-wrap max-w-screen-lg pb-5">
                    {data?.map(c => {
                        const haveProducts = c.products.some((d: dataProducts) => d.catalog.length)
                        if (haveProducts) {
                            return (
                                <TransitionLink key={c.id} href={c.slug} setOpenOptions={setOpenOptions} className="text-[#fea70e] bg-(--background) px-2 me-2 whitespace-nowrap border w-fit rounded-full mt-3 md:mt-5">
                                    {c.name}
                                </TransitionLink>
                            )
                        }
                    })
                    }
                </div>
            </div>
        </div>
    )
}
