import { InputSearchType } from "@/types/types"

export const InputSearch = ({ setFindProduct, setFocusItem, inputRef }: InputSearchType) => {

    return (
        <div ref={inputRef} className="flex flex-col w-full h-fit self-center relative p-2" onFocus={() => setFocusItem(true)} >
            <input id='search' type="text" placeholder='Busqueda de producto' onChange={(e) => setFindProduct(e.target.value)} autoComplete='off' />
        </div>
    )
}