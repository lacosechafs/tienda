import { InputSearchType } from "@/types/types"

export const InputSearch = ({ setFindProduct, setOpenOptions }: InputSearchType) => {

    return (
        <div className="flex flex-col w-full h-fit self-center relative p-2" onFocus={() => setOpenOptions(prev => prev === 'search' ? '' : 'search')} >
            <input id='search' type="text" placeholder='Busqueda de producto' onChange={(e) => setFindProduct(e.target.value)} autoComplete='off' />
        </div>
    )
}