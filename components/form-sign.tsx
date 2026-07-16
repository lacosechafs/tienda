"use client"

import { clickOutside, removeCLickOut } from "@/helpers/click-outside"
import { createClient } from "@/lib/supabase/client"
import { signIn } from "@/lib/supabase/signIn"
import { signUpNewUser } from "@/lib/supabase/signUp"
import { setCartProducts } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"

export const FormSign = () => {

    const router = useRouter()
    const dispatch = useDispatch()

    const [dataAcc, setDataAcc] = useState({ name: "", mail: "", password: "" })
    const [createAccount, setCreateAccount] = useState(true)
    const [accessAccount, setAccessAccount] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

    const accountRef = useRef<HTMLDivElement>(null)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

        const errorKeys = Object.entries(dataAcc).map(([clave, valor]) => {
            if (!valor && clave !== "name") {
                return clave
            }
        }).filter(Boolean)

        if (errorKeys.length) {
            errorKeys.forEach(e => {
                throw new Error(`El campo ${e} esta vacio`)
            });
        }

        if (!regex.test(dataAcc.mail)) throw new Error("El formato del mail es invalido")
        if (dataAcc.password.length < 6) throw new Error("La contraseña debe tener al menos 6 caracteres")


        try {
            const { error } = await signUpNewUser({ dataAcc })

        } catch (error) {
            console.error("Error al registrar usuario:", error)
        }
        setAccessAccount(prev => !prev)

    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!dataAcc) return



        try {
            const { error } = await signIn({ dataAcc })

        } catch (error) {
            console.error("Error al autenticar usuario:", error)
        }
        setAccessAccount(prev => !prev)
    }

    useEffect(() => {

        const handleGlobalClick = (e: MouseEvent) => {
            clickOutside(e, accountRef, setShowMenu)
        }

        return removeCLickOut(handleGlobalClick)

    }, [accountRef])

    return (
        <div ref={accountRef} className="relative content-center justify-items-center min-w-15 p-2">
            <svg className="cursor-pointer" onClick={() => setShowMenu(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.775 12q-.9 0-1.5-.675T7.8 9.75l.325-2.45q.2-1.425 1.3-2.363T12 4t2.575.938t1.3 2.362l.325 2.45q.125.9-.475 1.575t-1.5.675zM4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" /></svg>
            {user
                ? <div className={`bg-(--background) absolute right-0 top-[calc(100%-8px)] border min-w-80 w-full transition-discrete duration-500 ${showMenu ? "opacity-100 block starting:opacity-0" : "opacity-0 hidden"}`}>
                    <p>
                        Hola {user[0].name}
                    </p>
                    <button onClick={signOut}>Log out</button>
                </div >
                :
                <div className={`bg-(--background) absolute right-0 top-[calc(100%-8px)] border rounded-lg p-3 min-w-95 w-full transition-discrete duration-500 ${showMenu ? "opacity-100 block starting:opacity-0" : "opacity-0 hidden"}`}>
                    <form className="flex mb-2" onSubmit={createAccount ? handleSignIn : handleSignUp}>
                        <div className="flex flex-col w-min h-30 justify-around">
                            <input id="name" name="name" type="text" placeholder="Nombre (opcional)" value={dataAcc.name} onChange={handleChange}
                                className={`
                                        px-2 overflow-hidden duration-500 transition-all
                                        ${!createAccount
                                        ? "h-[34px] py-2 border mb-2 opacity-100 block"
                                        : "h-0 border-y-0 py-0 mb-0 opacity-0 pointer-events-none"
                                    }
  `}
                            />
                            <input id="mail" name="mail" type="mail" className="border mb-2 px-2 py-1" placeholder="Email" value={dataAcc.mail} onChange={handleChange} />
                            <input id="password" name="password" type="password" className="border mb-2 px-2 py-1" placeholder="Contraseña" value={dataAcc.password} onChange={handleChange} />
                        </div>
                        <div className="self-center text-center w-[stretch] [perspective:1000px]">
                            <button
                                className={`relative w-28 h-10 border cursor-pointer duration-500 [transform-style:preserve-3d] transition-transform ${createAccount ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"
                                    }`}
                                type="submit"
                            >
                                <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background)">
                                    Crear cuenta
                                </span>
                                <span className="absolute inset-0 flex items-center justify-center backface-hidden bg-(--background) [transform:rotateX(180deg)]">
                                    Acceder
                                </span>
                            </button>
                        </div>
                    </form >
                    <div className="flex">
                        <p className="w-[25px]">{createAccount ? "No" : "Ya"}&nbsp;</p>
                        <a className="cursor-pointer" onClick={() => setCreateAccount(prev => !prev)}> tienes cuenta? {createAccount ? "Creala" : "Ingresa"}</a>
                    </div >
                </div >
            }
        </div >
    )
}
