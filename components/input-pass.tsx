"use client"

import { ChangePass, verifyCurrentPass } from "@/helpers/change-pass"
import { useEffect, useState } from "react"

const AnimatedErrorMessage = ({ message }: { message: string }) => {
    const [displayMessage, setDisplayMessage] = useState(message)
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        if (message) {
            setIsVisible(false)

            const timer = setTimeout(() => {
                setDisplayMessage(message)
                setIsVisible(true)
            }, 500)

            return () => clearTimeout(timer)
        } else {
            setIsVisible(false)
        }
    }, [message])

    return (
        <div className="h-6 overflow-hidden">
            <span
                className={`block text-red-400 text-xs mt-1 px-2 transition-all duration-500 transform ${isVisible && message
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                    }`}
            >
                {displayMessage}
            </span>
        </div>
    )
}

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
        if (isLoading || equalPass !== true) return

        setIsLoading(true)

        await ChangePass(newPass, (resMessage) => {
            setIsLoading(false)
            setStatus(resMessage)

            if (resMessage === "Cambio realizado con éxito") {
                setErrorMessage("")
                setTimeout(() => {
                    setCurrentPass("")
                    setNewPass("")
                    setConfirmPass("")
                    setStatus("")
                    setEqualPass(null)
                }, 1500)
            } else {
                setErrorMessage(resMessage)
            }
        })
    }

    const handleVerifyCurrent = async (e: React.FormEvent) => {
        e.preventDefault()
        if (isLoading || !currentPass) return

        setIsLoading(true)
        await verifyCurrentPass(email, currentPass, (resMessage) => {
            setIsLoading(false)
            if (resMessage.includes("actual")) {
                setStatus(resMessage)
                setErrorMessage(resMessage)
            }
        })
    }

    useEffect(() => {
        if (!newPass && !confirmPass ||
            newPass.length === 0 && confirmPass.length === 0
        ) {
            setEqualPass(null)
            setErrorMessage("")
            return
        }

        const timer = setTimeout(() => {
            if (newPass !== confirmPass) {
                setErrorMessage("Las contraseñas no coinciden")
                setEqualPass(false)
            } else if (newPass.length > 0 && newPass.length < 6) {
                setErrorMessage("La contraseña debe tener al menos 6 caracteres")
                setEqualPass(false)
            } else if (currentPass && currentPass === newPass) {
                setErrorMessage("La nueva contraseña debe ser diferente a la anterior")
                setEqualPass(false)
            } else {
                setErrorMessage("")
                setStatus("")
                setEqualPass(true)
            }
        }, 400)

        return () => clearTimeout(timer)
    }, [newPass, confirmPass, currentPass])

    return (
        <form onSubmit={handleSubmit} className="flex flex-col relative">
            <div className="flex justify-between border-t border-[#ffffff50] relative">
                <input
                    type="password"
                    placeholder="Contraseña Anterior"
                    value={currentPass}
                    onChange={(e) => {
                        setCurrentPass(e.target.value)
                        if (status.includes("actual")) {
                            setStatus("")
                            setErrorMessage("")
                        }
                    }}
                    onBlur={(e) => {
                        if (e.target.value.length >= 6) {
                            handleVerifyCurrent(e)
                        } else {
                            setTimeout(() => {
                                setStatus("La contraseña actual debe tener al menos 6 caracteres")
                                setErrorMessage("La contraseña actual debe tener al menos 6 caracteres")
                            }, 500);
                        }
                    }}
                    className="w-5/6 px-2 py-[6px] rounded outline-none bg-transparent"
                />
                <div
                    className={`w-1/6 justify-items-center content-center me-2 text-red-400 transition-opacity duration-500 ${status.includes("actual")
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                        }`}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        className="text-red-400 animate-pulse"
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
                    onChange={(e) => setNewPass(e.target.value)}
                    className="w-5/6 px-2 py-[6px] rounded outline-none bg-transparent"
                    autoComplete="off"
                />
            </div>

            <div className="flex justify-between border-y border-[#ffffff50]">
                <input
                    type="password"
                    placeholder="Repita Contraseña Nueva"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
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
                            ? "opacity-100 animate-pulse"
                            : "opacity-0 pointer-events-none"
                            }`}
                    >
                        <path fill="currentColor" d="M12 2L1 21h22M12 6l7.53 13H4.47M11 10v4h2v-4m-2 6v2h2v-2" />
                    </svg>

                    <div className="absolute inset-0 text-center content-center">
                        <button
                            type="submit"
                            disabled={isLoading || equalPass !== true}
                            className={`p-2 transition-all duration-500 ${status === "Cambio realizado con éxito"
                                ? "text-green-400 opacity-100"
                                : equalPass === true
                                    ? "text-white opacity-100"
                                    : "opacity-0 pointer-events-none"
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

            <AnimatedErrorMessage message={errorMessage} />
        </form>
    )
}