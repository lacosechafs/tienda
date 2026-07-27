"use client"

import { clickOutside, removeCLickOut } from "@/helpers/click-outside"
import { createClient } from "@/lib/supabase/client"
import { signUser } from "@/helpers/sign-user"
import { setCartProducts } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import { ChangeEvent, RefObject, SubmitEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { SignInWithPasswordCredentials } from "@supabase/supabase-js"
import { InputUser } from "./input-user"
import { SendData } from "@/helpers/send-data"
import { InputPass } from "./input-pass"
import { FormSignType } from "@/types/types"

export const FormSign = ({ showMenu, setShowMenu, signRef }: FormSignType) => {

    const router = useRouter()
    const dispatch = useDispatch()

    const [dataAcc, setDataAcc] = useState<Record<string, string>>({ name: "", mail: "", password: "" })
    const [createAccount, setCreateAccount] = useState<boolean>(true)
    const [accessAccount, setAccessAccount] = useState<boolean>(false)
    const [chosenOption, setChosenOption] = useState<string>('')
    const [errorUser, setErrorUser] = useState<string | null>(null)
    const [errorAnimate, setErrorAnimate] = useState<boolean>(false)
    const [changeAdress, setChangeAdress] = useState<Array<string>>([])

    const [deletingAdress, setDeletingAdress] = useState<string | null>(null);

    const accountRef = useRef<HTMLDivElement>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDataAcc(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    useEffect(() => {
        const fetchUser = async () => {
            const { data } = await supabase.auth.getUser()

            if (data?.user) {
                const uuid = data.user.id

                const { data: dataProf, error: errorProf } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', uuid)

                if (dataProf) {
                    setUser(dataProf)
                    dispatch(setCartProducts(dataProf[0].saved_cart))
                    setChangeAdress([...dataProf[0].adress])
                }
            }
        }
        fetchUser()
    }, [accessAccount])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error("No pudimos desloguearte de forma correcta:", error)
        }

        setAccessAccount(prev => !prev)
        setUser(null)
        setDataAcc({ name: "", mail: "", password: "" })
        dispatch(setCartProducts([]))
        setChangeAdress([])
        router.push('/')
        router.refresh()

    }

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, [accountRef, signRef], setShowMenu)
        }

        return removeCLickOut(handleGlobalClick)

    }, [accountRef, signRef])

    useEffect(() => {
        if (!errorUser) {
            setErrorAnimate(false)
            return
        }

        setErrorAnimate(true)

        const timer = setTimeout(() => {
            setErrorAnimate(false)
            setTimeout(() => {
                setErrorUser(null)
            }, 1000);
        }, 11000);

        return () => clearTimeout(timer)

    }, [errorUser])

    return (
        <div ref={accountRef} className="relative content-center justify-items-center">
            <div
                className={`grid bg-(--backgroundlt) transition-discrete duration-500  w-full container
                            ${showMenu
                        ? "grid-rows-[1fr] opacity-100 duration-500 delay-50"
                        : "grid-rows-[0fr] opacity-0 pointer-events-none transition-[opacity,grid-template-rows] duration-[250ms,500ms]"
                    }`}
            >
                <div className="overflow-hidden">
                    <div>
                        <div className={`grid ease-in-out
                            ${user
                                ? "grid-rows-[1fr] opacity-100 duration-500 delay-50"
                                : "grid-rows-[0fr] opacity-0 pointer-events-none transition-[opacity,grid-template-rows] duration-[250ms,500ms]"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <div className="p-2 mb-2">
                                    <p className="h-[34px] mb-2">
                                        ¡Hola {user?.[0]?.name || "Usuario"}!
                                    </p>
                                    <div className="relative md:border-e md:w-1/2">
                                        <div className="text-end w-full pe-[10%] my-2 ">
                                            <button
                                                className="cursor-pointer text-start w-full md:w-fit font-semibold hover:underline my-1 outline-none"
                                                onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'data' ? 'data' : '')}
                                                onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('data')}
                                            >
                                                Mis datos
                                            </button>
                                        </div>
                                        <div className={`md:absolute left-[110%] md:top-0 md:h-full md:w-3/4 grid transition-[grid-template-rows,opacity] duration-500 ease-in-out overflow-hidden
                                                ${chosenOption === 'data'
                                                ? "grid-rows-[1fr] opacity-100 delay-100 z-10"
                                                : "grid-rows-[0fr] opacity-0 transition-[opacity,grid-template-rows] duration-[250ms,500ms] z-1"
                                            }
                                            ${chosenOption === ''
                                                ? "md:grid-rows-[1fr] md:opacity-100 md:delay-100 md:z-10"
                                                : ""
                                            }
                                            `}
                                        >
                                            <div className="min-h-0">
                                                <div className="m-2 md:m-0 md:flex md:flex-col md:h-full">

                                                    <InputUser
                                                        user={user?.[0]?.name}
                                                        type="name"
                                                        placeholder="Nombre (Opcional)"
                                                        border="border-t md:border-y"
                                                        icon="save"
                                                        onSave={(newValue, setStatus) => {
                                                            SendData("name", newValue, setStatus)
                                                        }}
                                                    />

                                                    <InputUser
                                                        user={user?.[0]?.phone}
                                                        type="phone"
                                                        placeholder="Teléfono"
                                                        border="border-y"
                                                        icon="save"
                                                        onSave={(newValue, setStatus) => {
                                                            SendData("phone", newValue, setStatus)
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end w-full pe-[10%] my-2 ">
                                            <button
                                                className="cursor-pointer text-start w-full md:w-fit font-semibold hover:underline my-1 outline-none"
                                                onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'adress' ? 'adress' : '')}
                                                onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('adress')}
                                            >
                                                Mis direcciones
                                            </button>
                                        </div>
                                        <div className={`md:absolute left-[110%] md:top-0 md:h-full md:w-3/4 grid transition-[grid-template-rows,opacity] duration-500 ease-in-out overflow-hidden
                                                        ${chosenOption === 'adress'
                                                ? "grid-rows-[1fr] opacity-100 delay-100 z-10"
                                                : "grid-rows-[0fr] opacity-0 transition-[opacity,grid-template-rows] duration-[250ms,500ms] z-1"
                                            }`}
                                        >
                                            <div className="min-h-0">
                                                <div className="m-2 md:m-0 md:flex md:flex-col md:h-full">
                                                    <div className="md:mb-2">
                                                        <p className="text-sm hidden md:block">Direcciones guardadas</p>
                                                        {changeAdress.length > 0 ? (
                                                            changeAdress.map((a: string, i: number) => {
                                                                const isDeleting = deletingAdress === a;
                                                                const isLast = changeAdress.length - 1 === i

                                                                return (
                                                                    <div
                                                                        key={a || i}
                                                                        className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out overflow-hidden ${isDeleting
                                                                            ? "grid-rows-[0fr] opacity-0"
                                                                            : "grid-rows-[1fr] opacity-100 starting:grid-rows-[0fr] starting:opacity-0"
                                                                            }`}
                                                                    >
                                                                        <div className={`min-h-0 flex justify-between border-[#ffffff50] ${isLast ? "border-t md:border-y" : "border-t"}`}>
                                                                            <p className="w-5/6 content-center ms-2">{a}</p>
                                                                            <div className="w-1/6 text-center content-center me-2">
                                                                                <button
                                                                                    onClick={() => {
                                                                                        setDeletingAdress(a);

                                                                                        const actualAdress = changeAdress.filter((f) => f !== a);

                                                                                        SendData("adress", actualAdress);

                                                                                        setTimeout(() => {
                                                                                            setChangeAdress(actualAdress);
                                                                                            setDeletingAdress(null);
                                                                                        }, 500);
                                                                                    }}
                                                                                    className="p-2"
                                                                                >
                                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                                                                                        <path fill="currentColor" d="M18.36 19.78L12 13.41l-6.36 6.37l-1.42-1.42L10.59 12L4.22 5.64l1.42-1.42L12 10.59l6.36-6.36l1.41 1.41L13.41 12l6.36 6.36z" />
                                                                                    </svg>
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                );
                                                            })
                                                        ) : (
                                                            <p className="p-2 text-sm opacity-70">No hay direcciones guardadas</p>
                                                        )}
                                                    </div>

                                                    <InputUser
                                                        user={""}
                                                        type="adress"
                                                        placeholder="Dirección"
                                                        border="border-t md:border-y"
                                                        icon="save"
                                                        array={user?.[0]?.adress}
                                                        onSave={async (newValue, setStatus) => {
                                                            if (!newValue) return;

                                                            const updatedAddresses = [...changeAdress, String(newValue)];

                                                            SendData("adress", updatedAddresses, (status) => {
                                                                setStatus(status);

                                                                if (status === "ok") {
                                                                    setTimeout(() => {
                                                                        setChangeAdress(updatedAddresses);
                                                                    }, 3000);
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="text-end w-full md:pe-[10%] my-2 ">
                                            <button
                                                className="cursor-pointer text-start w-full md:w-fit font-semibold hover:underline my-1 outline-none"
                                                onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'pass' ? 'pass' : '')}
                                                onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('pass')}
                                            >
                                                Cambiar contraseña
                                            </button>
                                        </div>

                                        <div className={`md:absolute left-[110%] md:top-0 md:h-full md:w-3/4 grid transition-[grid-template-rows,opacity] duration-500 ease-in-out overflow-hidden
                                                         ${chosenOption === 'pass'
                                                ? "grid-rows-[1fr] opacity-100 delay-100 z-10"
                                                : "grid-rows-[0fr] opacity-0 transition-[opacity,grid-template-rows] duration-[250ms,500ms] z-1"
                                            }`}
                                        >
                                            <div className="min-h-0">
                                                <div className="m-2 md:m-0 md:flex md:flex-col md:h-full">

                                                    <InputPass email={user?.[0].mail} />
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            className="md:pe-[10%] my-2 cursor-pointer text-start md:text-end w-full py-1 font-semibold hover:underline my-1 outline-none"
                                            onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'fav' ? 'fav' : '')}
                                            onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('fav')}
                                        >
                                            Modificar mis favoritos
                                        </button>
                                        <button
                                            className="md:pe-[10%] my-2 cursor-pointer text-start md:text-end w-full py-1 font-semibold hover:underline my-1 outline-none"
                                            onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'hist' ? 'hist' : '')}
                                            onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('hist')}
                                        >
                                            Historial de pedidos
                                        </button>
                                        <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${chosenOption === 'hist' ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                            <div className="overflow-hidden">
                                                <div className="py-2">
                                                    <button className="cursor-pointer text-neutral-600 outline-none">Ver pedidos anteriores</button>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="mt-2 md:text-end md:pe-[10%]">
                                            <button className="w-fit py-1 cursor-pointer outline-none" onClick={signOut}>
                                                {/* <button className="w-fit h-[38px] text-end px-2 py-1 border rounded mt-2 cursor-pointer outline-none" onClick={signOut}> */}
                                                Cerrar sesión
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={`grid ease-in-out
                            ${!user
                                ? "grid-rows-[1fr] opacity-100 duration-500 delay-50"
                                : "grid-rows-[0fr] opacity-0 pointer-events-none transition-[opacity,grid-template-rows] duration-[250ms,500ms]"
                            }`}
                        >
                            <div className="overflow-hidden">
                                <form
                                    className="flex flex-col md:flex-row gap-4 mb-2"
                                    onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                                        createAccount
                                            ? signUser(e, dataAcc, (data: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(data), setAccessAccount, false, setErrorUser)
                                            : signUser(e, dataAcc, (data: SignInWithPasswordCredentials) => supabase.auth.signUp(data), setAccessAccount, true, setErrorUser)
                                    }}
                                >
                                    <div className="flex flex-col w-full gap-2">
                                        <input
                                            id="name-input"
                                            name="name"
                                            type="text"
                                            placeholder="Nombre (opcional)"
                                            value={dataAcc.name || ""}
                                            onChange={handleChange}
                                            className={`px-2 rounded border overflow-hidden duration-500 transition-all text-sm
                                                ${!createAccount
                                                    ? "h-[34px] py-1 opacity-100 block"
                                                    : "h-0 border-y-0 py-0 opacity-0 pointer-events-none"
                                                }`}
                                        />
                                        <input id="mail" name="mail" type="email" className="border px-2 py-1 rounded text-sm" placeholder="Email" value={dataAcc.mail || ""} onChange={handleChange} />
                                        <input id="password" name="password" type="password" className="border px-2 py-1 rounded text-sm" placeholder="Contraseña" value={dataAcc.password || ""} onChange={handleChange} />
                                    </div>

                                    <div className="self-center text-center w-full md:w-28 [perspective:1000px]">
                                        <button
                                            className={`relative w-full md:w-28 h-10 border rounded cursor-pointer duration-500 [transform-style:preserve-3d] transition-transform outline-none ${createAccount ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}
                                            type="submit"
                                        >
                                            <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background) rounded font-medium">
                                                Crear cuenta
                                            </span>
                                            <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background) rounded font-medium [transform:rotateX(180deg)]">
                                                Acceder
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                <div className="flex mt-2">
                                    <p>{createAccount ? "No" : "Ya"} tienes cuenta?&nbsp;</p>
                                    <button
                                        className="cursor-pointer font-bold hover:underline bg-transparent border-0 p-0 outline-none"
                                        onClick={() => setCreateAccount(prev => !prev)}
                                    >
                                        {createAccount ? "Créala" : "Ingresa"}
                                    </button>
                                </div>

                                <div className={`absolute top-full left-0 rounded-lg bg-[#fce49f] w-full min-h-8 px-3 py-2 mt-2 transition-all duration-500 shadow-md border border-[#f3d078]
                                    ${errorAnimate && !user ? "opacity-100 translate-y-0 block" : "opacity-0 -translate-y-2 pointer-events-none hidden"}`}
                                >
                                    <p className="text-[#714e10] font-medium">{!user && errorUser}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}