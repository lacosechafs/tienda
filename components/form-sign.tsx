"use client"

import { createClient } from "@/lib/supabase/client"
import { signIn } from "@/lib/supabase/signIn"
import { signUpNewUser } from "@/lib/supabase/signUp"
import { setCartProducts } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export const FormSign = () => {

    const router = useRouter()
    const dispatch = useDispatch()

    const [dataAcc, setDataAcc] = useState({ name: "", mail: "", password: "" })
    const [createAccount, setCreateAccount] = useState(true)
    const [accessAccount, setAccessAccount] = useState(false)
    const [showMenu, setShowMenu] = useState(false)

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
        router.push('/')
        router.refresh()

    }

    const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const { error } = await signUpNewUser({ dataAcc })

        } catch (error) {
            console.error("Error al registrar usuario:", error)
        }
        setAccessAccount(prev => !prev)

    }

    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const { error } = await signIn({ dataAcc })

        } catch (error) {
            console.error("Error al autenticar usuario:", error)
        }
        setAccessAccount(prev => !prev)
    }

    return (
        <div className="relative content-center justify-items-center min-w-15 p-2">
            <svg onClick={() => setShowMenu(prev => !prev)} xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"><path fill="currentColor" d="M9.775 12q-.9 0-1.5-.675T7.8 9.75l.325-2.45q.2-1.425 1.3-2.363T12 4t2.575.938t1.3 2.362l.325 2.45q.125.9-.475 1.575t-1.5.675zM4 18v-.8q0-.85.438-1.562T5.6 14.55q1.55-.775 3.15-1.162T12 13t3.25.388t3.15 1.162q.725.375 1.163 1.088T20 17.2v.8q0 .825-.587 1.413T18 20H6q-.825 0-1.412-.587T4 18" /></svg>
            {user
                ? <div className={`absolute right-0 top-[calc(100%-8px)] border min-w-80 w-full transition-discrete duration-500 ${showMenu ? "opacity-100 block starting:opacity-0" : "opacity-0 hidden"}`}>
                    <p>
                        Hola {user[0].name}
                    </p>
                    <button onClick={signOut}>Log out</button>
                </div >
                :
                <div className={`absolute right-0 top-[calc(100%-8px)] border min-w-80 w-full transition-discrete duration-500 ${showMenu ? "opacity-100 block starting:opacity-0" : "opacity-0 hidden"}`}>
                    <form onSubmit={createAccount ? handleSignIn : handleSignUp}>
                        {!createAccount &&
                            <input id="name" name="name" type="text" className="border" placeholder="Nombre" value={dataAcc.name} onChange={handleChange} />
                        }
                        <input id="mail" name="mail" type="mail" className="border" placeholder="Email" value={dataAcc.mail} onChange={handleChange} />
                        <input id="password" name="password" type="password" className="border" placeholder="Contraseña" value={dataAcc.password} onChange={handleChange} />
                        <button type="submit">{createAccount ? "Acceder" : "Crear cuenta"}</button>
                    </form >
                    <button onClick={() => setCreateAccount(prev => !prev)}>{createAccount ? "No tienes cuenta? Creala" : "Ya tienes cuenta? Ingresa"}</button>
                </div >
            }
        </div >
    )
}
