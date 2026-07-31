import { EntriesOrderType, InputOrderType } from "@/types/types";

export const OrderInput = ({ label, name, placeholder, value, setValue }: InputOrderType) => {

    let query = String(value?.data)?.trim().toLowerCase() || "";

    return (
        <div className="md:mb-2">
            <label htmlFor={name} className="hidden md:block text-sm">{label}</label>
            <div className="flex flex-col justify-between border-[#ffffff50]">
                <textarea
                    id={name}
                    className="w-5/6 px-2 py-[6px] field-sizing-content resize-none rounded outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    placeholder={placeholder}
                    name={name}
                    value={value?.data ? value.data : ''}

                    onChange={(e) => {
                        setValue((prev: EntriesOrderType) => ({ ...prev, [name]: { ...prev[name], data: e.target.value } }))
                    }}
                    autoComplete="on"
                />
            </div>
        </div>
    )
}
