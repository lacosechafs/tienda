"use client"

import { ChangePass } from "@/helpers/change-pass"
import { useEffect, useState } from "react"

export const InputPass = ({ email }: { email: string }) => {
    const [currentPass, setCurrentPass] = useState("")
    const [newPass, setNewPass] = useState("")
    const [confirmPass, setConfirmPass] = useState("")

    const [status, setStatus] = useState<string>("")
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [equalPass, setEqualPass] = useState<boolean | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (isLoading) return

        if (!currentPass || !newPass || !confirmPass) {
            setStatus("error")
            setErrorMessage("Todos los campos son obligatorios")
            return
        }

        if (newPass !== confirmPass) {
            setStatus("mismatch")
            setErrorMessage("Las contraseñas no coinciden")
            return
        }

        if (newPass.length < 6) {
            setStatus("error")
            setErrorMessage("La contraseña debe tener al menos 6 caracteres")
            return
        }

        if (currentPass === newPass) {
            setStatus("error")
            setErrorMessage("La nueva contraseña debe ser diferente a la anterior")
            return
        }

        setIsLoading(true)

        await ChangePass(email, currentPass, newPass, (resMessage) => {
            setIsLoading(false)
            setStatus(resMessage)

            if (resMessage === "Cambio realizado con éxito") {
                setErrorMessage("")
                setTimeout(() => {
                    setCurrentPass("")
                    setNewPass("")
                    setConfirmPass("")
                    setStatus("")
                }, 1500)
            } else {
                setErrorMessage(resMessage)
            }
        })
    }

    useEffect(() => {
        if (currentPass === "") {
            setStatus("")
            if (errorMessage) setErrorMessage("")
        }
    }, [currentPass])

    useEffect(() => {
        if (status === "Cambio realizado con éxito") return

        if (!newPass || !confirmPass) {
            setEqualPass(null)
            return
        }

        setEqualPass(null)

        const timer = setTimeout(() => {
            const isInvalid = newPass !== confirmPass || newPass.length < 6 || currentPass === newPass

            if (isInvalid) {
                setEqualPass(false)
            } else {
                setEqualPass(true)
            }
        }, 1500)

        return () => clearTimeout(timer)
    }, [newPass, confirmPass, currentPass, status])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col relative">
            <div className="flex justify-between border-t border-[#ffffff50]">
                <input
                    type="password"
                    placeholder="Contraseña Anterior"
                    value={currentPass}
                    onChange={(e) => {
                        setCurrentPass(e.target.value)
                        if (errorMessage) setErrorMessage("")
                    }}
                    className="w-5/6 px-2 py-[6px] rounded outline-none bg-transparent"
                />
                <div className="w-1/6 justify-items-center content-center me-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className={`text-red-400 transition-opacity duration-500 ${status.includes("incorrecta")
                            ? "opacity-100 animate-pulse [animation-delay:500ms]"
                            : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
                    </svg>
                </div>
            </div>

            <div className="flex justify-between border-t border-[#ffffff50]">
                <input
                    type="password"
                    placeholder="Contraseña Nueva"
                    value={newPass}
                    onChange={(e) => {
                        setNewPass(e.target.value)
                        if (errorMessage) setErrorMessage("")
                    }}
                    className="w-5/6 px-2 py-[6px] rounded outline-none bg-transparent"
                    autoComplete="off"
                />
            </div>

            <div className="flex justify-between border-y border-[#ffffff50]">
                <input
                    type="password"
                    placeholder="Repita Contraseña Nueva"
                    value={confirmPass}
                    onChange={(e) => {
                        setConfirmPass(e.target.value)
                        if (errorMessage) setErrorMessage("")
                    }}
                    className="w-5/6 px-2 py-[6px] rounded outline-none bg-transparent"
                    autoComplete="off"
                />

                <div className="w-1/6 justify-items-center content-center me-2 relative">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className={`text-red-400 transition-opacity duration-500 ${equalPass === false && status !== "Cambio realizado con éxito"
                            ? "opacity-100 animate-pulse [animation-delay:500ms]"
                            : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
                    </svg>

                    <div className="absolute inset-0 text-center content-center">
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`p-2 transition-all duration-500 ${status === "Cambio realizado con éxito"
                                ? "text-green-400 opacity-100 duration-500"
                                : equalPass === true
                                    ? "text-white opacity-100 duration-500"
                                    : "opacity-0 pointer-events-none duration-500"
                                }`}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="20"
                                height="20"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="currentColor"
                                    d="M5 21h14a2 2 0 0 0 2-2V8a1 1 0 0 0-.29-.71l-4-4A1 1 0 0 0 16 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2m10-2H9v-5h6zM13 7h-2V5h2zM5 5h2v4h8V5h.59L19 8.41V19h-2v-5a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v5H5z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* VER ERRORES EN PANTALLA DE TODAS LOS FORMS */}
            
            {/* Mensajes de feedback */}
            <div className="absolute top-full">
                {errorMessage && <span className="text-red-400 text-xs mt-1 px-2">{status}</span>}
                {status === "Cambio realizado con éxito" && <span className="text-green-400 text-xs mt-1 px-2">¡Contraseña actualizada con éxito!</span>}
            </div>
        </form>
    )
}