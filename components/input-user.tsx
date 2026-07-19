"use client"

import { SendData } from "@/helpers/send-data"
import { useEffect, useState } from "react"

export const InputUser = ({ user, type, placeholder, border, icon }) => {
    const [data, setData] = useState<string>(user?.[0]?.[type])
    const [lastData, setLastData] = useState<string>(user?.[0]?.[type])
    const [changeConf, setChangeConf] = useState<string>("")

    useEffect(() => {
        setData(user?.[0]?.[type])
        setLastData(user?.[0]?.[type])
    }, [user?.[0]?.[type]])

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

    const isVisible = lastData != data || changeConf !== "";

    return (
        <div className={`flex justify-between ${border} border-[#ffffff50]`}>
            <input
                id={type}
                className="w-5/6 px-2 py-[6px] rounded outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder={placeholder}
                type={type === "phone" ? "number" : "text"}
                name={type}
                value={data}
                onChange={(e) => setData(e.target.value)}
                autoComplete="on"
            />
            <div className="w-1/6 text-center content-center me-2">
                <button
                    className={`p-2 duration-500 transition-[opacity,color] ${isVisible
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                        } ${changeConf === "ok"
                            ? "text-[green]"
                            : changeConf !== ""
                                ? "text-[red]"
                                : "text-white"
                        }`}
                    onClick={() => {
                        SendData(type, data || null, setChangeConf)
                    }}
                >
                    <svg
                        key={changeConf === "ok" ? "stable" : changeConf}
                        className={changeConf !== "" && changeConf !== "ok" ? "animate-shake" : ""}
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                    >
                        {icon === "save"
                            ? <path fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" />
                            : icon === "cancel"
                                ? <path fill="currentColor" d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z" />
                                : icon === "alert"
                                    ? <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
                                    : <path></path>
                        }
                    </svg>
                </button>
            </div>
        </div>
    )
}