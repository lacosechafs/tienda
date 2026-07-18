"use client"

import { clickOutside, removeCLickOut } from "@/helpers/click-outside"
import { createClient } from "@/lib/supabase/client"
import { signUser } from "@/components/sign-user"
import { setCartProducts } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { SignInWithPasswordCredentials } from "@supabase/supabase-js"

export const FormSign = () => {

    const router = useRouter()
    const dispatch = useDispatch()

    const [dataAcc, setDataAcc] = useState<Record<string, string>>({ name: "", mail: "", password: "" })
    const [createAccount, setCreateAccount] = useState<boolean>(true)
    const [accessAccount, setAccessAccount] = useState<boolean>(false)
    const [showMenu, setShowMenu] = useState<boolean>(false)
    const [chosenOption, setChosenOption] = useState<string>('')
    const [errorUser, setErrorUser] = useState<string | null>(null)
    const [errorAnimate, setErrorAnimate] = useState<boolean>(false)

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
        router.push('/')
        router.refresh()

    }

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, accountRef, setShowMenu)
        }

        return removeCLickOut(handleGlobalClick)

    }, [accountRef])

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
        <div ref={accountRef} className="relative content-center justify-items-center min-w-15 p-2">
            <svg
                className="cursor-pointer"
                onClick={() => setShowMenu(prev => !prev)}
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
            >
                <path fill="currentColor" d="M9.775 12q-.9 0-1.5-.675T7.8 9.75l.325-2.45q.2-1.425 1.3-2.363T12 4t2.575.938t1.3 2.362l.325 2.45q.125.9-.475 1.575t-1.5.675zM4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" />
            </svg>

            <div
                className={`absolute right-0 top-[calc(100%-8px)] border rounded-lg p-3 min-w-95 w-full bg-(--background) z-50
                            grid transition-all duration-500 ease-in-out grid-rows-[1fr]
                            ${showMenu ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
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

                                    <button
                                        className="cursor-pointer text-left w-full py-1 text-sm font-semibold hover:underline outline-none"
                                        onClick={() => setChosenOption(prev => prev !== 'pass' ? 'pass' : '')}
                                    >
                                        Mis datos
                                    </button>
                                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ease-in-out 
                                        ${chosenOption === 'pass'
                                            ? "grid-rows-[1fr] opacity-100 delay-100"
                                            : "grid-rows-[0fr] opacity-0 transition-[opacity,grid-template-rows] duration-[250ms,500ms]"
                                        }`}
                                    >
                                        <div className="overflow-hidden">
                                            <div className="flex flex-col gap-2 py-2">
                                                <input id="name" className="border px-2 py-1 text-sm rounded" placeholder={user?.[0]?.name || "Nombre (opcional)"} type="text" name="name" defaultValue={user?.[0]?.name || ""} />
                                                <input id="adress" className="border px-2 py-1 text-sm rounded" placeholder={user?.[0]?.adress || "Dirección"} type="text" name="adress" defaultValue={user?.[0]?.adress || ""} />
                                                <input id="phone" className="border px-2 py-1 text-sm rounded" placeholder={user?.[0]?.phone || "Teléfono"} type="text" name="phone" defaultValue={user?.[0]?.phone || ""} />
                                                <input id="password-update" className="border px-2 py-1 text-sm rounded" placeholder="Nueva Contraseña" type="password" name="password" />
                                                <button className="cursor-pointer bg-black text-white py-1 rounded text-sm font-semibold mt-1 outline-none">
                                                    Guardar cambios
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="cursor-pointer text-left w-full py-1 text-sm font-semibold hover:underline mt-2 outline-none"
                                        onClick={() => setChosenOption(prev => prev !== 'fav' ? 'fav' : '')}
                                    >
                                        Modificar mis favoritos
                                    </button>
                                    <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${chosenOption === 'fav' ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                        <div className="overflow-hidden">
                                            <div className="py-2">
                                                <button className="cursor-pointer text-sm text-neutral-600 outline-none">Ir a favoritos</button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        className="cursor-pointer text-left w-full py-1 text-sm font-semibold hover:underline mt-2 outline-none"
                                        onClick={() => setChosenOption(prev => prev !== 'hist' ? 'hist' : '')}
                                    >
                                        Historial de pedidos
                                    </button>
                                    <div className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${chosenOption === 'hist' ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                                        <div className="overflow-hidden">
                                            <div className="py-2">
                                                <button className="cursor-pointer text-sm text-neutral-600 outline-none">Ver pedidos anteriores</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <button className="w-full h-[38px] py-2 border rounded mt-2 cursor-pointer outline-none" onClick={signOut}>
                                    Cerrar sesión
                                </button>
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
                                            value={dataAcc.name}
                                            onChange={handleChange}
                                            className={`px-2 rounded border overflow-hidden duration-500 transition-all text-sm
                                                ${!createAccount
                                                    ? "h-[34px] py-1 opacity-100 block"
                                                    : "h-0 border-y-0 py-0 opacity-0 pointer-events-none"
                                                }`}
                                        />
                                        <input id="mail" name="mail" type="email" className="border px-2 py-1 rounded text-sm" placeholder="Email" value={dataAcc.mail} onChange={handleChange} />
                                        <input id="password" name="password" type="password" className="border px-2 py-1 rounded text-sm" placeholder="Contraseña" value={dataAcc.password} onChange={handleChange} />
                                    </div>

                                    <div className="self-center text-center w-full md:w-28 [perspective:1000px]">
                                        <button
                                            className={`relative w-full md:w-28 h-10 border rounded cursor-pointer duration-500 [transform-style:preserve-3d] transition-transform outline-none ${createAccount ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}
                                            type="submit"
                                        >
                                            <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background) rounded text-sm font-medium">
                                                Crear cuenta
                                            </span>
                                            <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background) rounded text-sm font-medium [transform:rotateX(180deg)]">
                                                Acceder
                                            </span>
                                        </button>
                                    </div>
                                </form>

                                <div className="flex text-sm mt-2">
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
                                    <p className="text-sm text-[#714e10] font-medium">{!user && errorUser}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}