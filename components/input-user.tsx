"use client"

import { handleKeyUp } from "@/hooks/useHandleUp"
import { InputUserType } from "@/types/types"
import { useEffect, useRef, useState } from "react"

export const InputUser = ({
    user,
    type,
    placeholder,
    border,
    icon,
    onSave,
    array
}: InputUserType) => {

    const [data, setData] = useState<string | number>(user)
    const [lastData, setLastData] = useState<string | number>(user)
    const [changeConf, setChangeConf] = useState<string>("")

    const [iconShow, setIconShow] = useState<string>(icon)
    const [iconAnimate, setIconAnimate] = useState<boolean>(false)

    useEffect(() => {
        setData(user)
        setLastData(user)
    }, [user, type])

    useEffect(() => {
        if (changeConf === "ok") {
            setLastData(data)
        }

        if (changeConf !== "") {
            const timer = setTimeout(() => {
                setChangeConf("")
            }, 2500)

            return () => clearTimeout(timer)
        }
    }, [changeConf, data])

    const timerRef = useRef(null);

    const isVisible = lastData !== data || changeConf !== "";

    return (
        <div className={`flex justify-between ${border} border-[#ffffff50]`}>
            <textarea
                id={type}
                className="w-5/6 px-2 py-[6px] field-sizing-content resize-none rounded outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={placeholder}
                name={type}
                value={data}

                ref={timerRef}
                onChange={(e) => {
                    setData(e.target.value);
                    const repeated = array?.some(s => s.trim() === e.target.value.trim()) || false
                    handleKeyUp(setIconAnimate, setIconShow, icon, timerRef, repeated);
                }}
                autoComplete="on"
            />
            <div className="w-1/6 text-center content-center me-2">
                <button
                    className={`h-[36px] p-2 duration-500 transition-[opacity,color] ${isVisible
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                        } ${changeConf === "ok"
                            ? "text-[green]"
                            : changeConf !== ""
                                ? "text-[red]"
                                : "text-white"
                        }`}
                    onClick={async () => {
                        if (onSave) {
                            onSave(data, setChangeConf)
                            if (type === "adress") {
                                setTimeout(() => {
                                    setData("")
                                    setLastData("")
                                }, 3000);
                            }
                        }
                    }}
                >
                    <svg
                        key={changeConf === "ok" ? "stable" : changeConf}
                        className={`${changeConf !== "" && changeConf !== "ok" ? "animate-shake" : ""}`}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        {iconShow === "save"
                            ? <path className={`duration-500 ${iconAnimate
                                ? "opacity-0 pointer-events-none"
                                : "opacity-100 pointer-events-auto"}`}
                                fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" />
                            : iconShow === "cancel"
                                ? <path fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" />
                                : iconShow === "alert"
                                && <path className={`animate-pulse duration-500 ${iconAnimate
                                    ? "opacity-0 pointer-events-none"
                                    : "opacity-100 pointer-events-auto"}`}
                                    fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
                        }
                    </svg>
                </button>
            </div>
        </div>
    )
}