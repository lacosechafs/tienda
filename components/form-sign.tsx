"use client"

import { createClient } from "@/lib/supabase/client"
import { signUser } from "@/helpers/sign-user"
import { setCartProducts } from "@/redux/cartSlice"
import { useRouter } from "next/navigation"
import { ChangeEvent, SubmitEvent, useEffect, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { SignInWithPasswordCredentials } from "@supabase/supabase-js"
import { InputUser } from "./input-user"
import { InputPass } from "./input-pass"
import { FormSignType } from "@/types/types"
import { useGetSession } from "@/hooks/useGetSession"
import { useAppSelector } from "@/hooks/useRedux"
import { RootState } from "@/redux/makeStore"
import { changeData, setApData } from "@/redux/userSlice"
import { GridComp } from "./grid-comp"
import { FavsProducts } from "./navbar/favs-products"
import { OrderHistory } from "./navbar/order-history"

export const FormSign = ({ openOptions }: FormSignType) => {

    const router = useRouter()
    const dispatch = useDispatch()

    const [dataAcc, setDataAcc] = useState<Record<string, string>>({ name: "", mail: "", password: "" })
    const [createAccount, setCreateAccount] = useState<boolean>(true)
    const [chosenOption, setChosenOption] = useState<string>('')
    const [errorUser, setErrorUser] = useState<string | null>(null)
    const [errorAnimate, setErrorAnimate] = useState<boolean>(false)

    const [deletingAddress, setDeletingAddress] = useState<string | null>(null);

    const accountRef = useRef<HTMLDivElement>(null)

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setDataAcc(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const apUser = useAppSelector((state: RootState) => state.user.data)

    const supabase = createClient()
    const [user, setUser] = useState<any>(null)

    const { userData } = useGetSession();

    useEffect(() => {
        if (userData) {
            setUser(userData)
            dispatch(setCartProducts(userData[0]?.saved_cart || []))
            dispatch(setApData(userData[0]))
        } else {
            setUser(null)
        }
    }, [userData, dispatch])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()

        if (error) {
            console.error("Error al cerrar sesión:", error)
            return
        }

        setUser(null)
        setDataAcc({ name: "", mail: "", password: "" })

        router.push('/')
        router.refresh()
        setDataAcc({ name: "", mail: "", password: "" })
    }

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
            <GridComp
                condition={openOptions === 'sign'}
                extraClass="bg-(--backgroundlt) w-full"
                class0fr="pointer-events-none"
            >
                <div>
                    <GridComp condition={user}>
                        <div className="p-2 mb-2">
                            <p className="h-[34px] text-[24px] mb-4 lg:justify-self-center">
                                {apUser?.name ? `Hola ${apUser?.name}` : "Hola"}!
                            </p>
                            <div className="relative lg:border-e lg:w-1/2">
                                <div className="text-end w-full lg:pe-[10%] my-2">
                                    <button
                                        className="cursor-pointer text-start w-full lg:w-fit font-semibold hover:underline my-1 outline-none"
                                        onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'data' ? 'data' : '')}
                                        onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('data')}
                                    >
                                        Mis datos
                                    </button>
                                </div>
                                <GridComp
                                    condition={chosenOption === 'data'}
                                    extraClass={`lg:absolute left-[110%] lg:top-0 lg:h-full lg:w-3/4 `}
                                    class0fr={`${chosenOption === '' ? "lg:grid-rows-[1fr] lg:opacity-100 lg:delay-100 lg:z-10" : ""}`}
                                >
                                    <div className="m-2 lg:m-0 lg:flex lg:flex-col lg:h-full">

                                        <InputUser
                                            user={apUser?.name}
                                            type="name"
                                            placeholder="Nombre (Opcional)"
                                            border="border-t lg:border-y"
                                            icon="save"
                                            onSave={(newValue, setStatus) => {
                                                dispatch(changeData({ key: 'name', value: newValue }))
                                            }}
                                        />

                                        <InputUser
                                            user={apUser?.phone ? Number(apUser?.phone) : null}
                                            type="phone"
                                            placeholder="Teléfono"
                                            border="border-y"
                                            icon="save"
                                            onSave={(newValue, setStatus) => {
                                                dispatch(changeData({ key: 'phone', value: newValue }))
                                            }}
                                        />
                                    </div>
                                </GridComp>

                                <div className="text-end w-full lg:pe-[10%] my-2">
                                    <button
                                        className="cursor-pointer text-start w-full lg:w-fit font-semibold hover:underline my-1 outline-none"
                                        onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'address' ? 'address' : '')}
                                        onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('address')}
                                    >
                                        Mis direcciones
                                    </button>
                                </div>
                                <GridComp condition={chosenOption === 'address'} extraClass="lg:absolute left-[110%] lg:top-0 lg:h-full lg:w-3/4">

                                    <div className="m-2 lg:m-0 lg:flex lg:flex-col lg:h-full">
                                        <div className="lg:mb-2 min-h-[58px]">
                                            <p className="text-sm hidden lg:block">Direcciones guardadas</p>
                                            {apUser.address.length > 0 ? (
                                                apUser.address.map((a: string, i: number) => {
                                                    const isDeleting = deletingAddress === a;
                                                    const isLast = apUser.address.length - 1 === i

                                                    return (
                                                        <GridComp key={a || i} condition={!isDeleting}>

                                                            <div className={`flex justify-between border-[#ffffff50] ${isLast ? "border-t lg:border-y" : "border-t"}`}>
                                                                <p className="w-5/6 content-center ms-2">{a}</p>
                                                                <div className="w-1/6 text-center content-center me-2">
                                                                    <button
                                                                        onClick={() => {
                                                                            setDeletingAddress(a);

                                                                            const actualAddress = apUser.address.filter((f) => f !== a);
                                                                            setTimeout(() => {
                                                                                dispatch(changeData({ key: 'address', value: actualAddress }))
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

                                                        </GridComp>
                                                    );
                                                })
                                            ) : (
                                                <p className="p-2 text-sm opacity-70">No hay direcciones guardadas</p>
                                            )}
                                        </div>

                                        <InputUser
                                            user={""}
                                            type="address"
                                            placeholder="Dirección"
                                            border="border-t lg:border-y"
                                            icon="save"
                                            array={apUser?.address}
                                            onSave={async (newValue, setStatus) => {
                                                if (!newValue) return;

                                                const updatedAddresses = [...apUser.address, String(newValue)]; +

                                                    dispatch(changeData({ key: 'address', value: updatedAddresses }))

                                            }}
                                        />
                                    </div>
                                </GridComp>

                                <div className="text-end w-full lg:pe-[10%] my-2">
                                    <button
                                        className="cursor-pointer text-start w-full lg:w-fit font-semibold hover:underline my-1 outline-none"
                                        onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'pass' ? 'pass' : '')}
                                        onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('pass')}
                                    >
                                        Cambiar contraseña
                                    </button>
                                </div>

                                <GridComp condition={chosenOption === 'pass'} extraClass="lg:absolute left-[110%] lg:top-0 lg:h-full lg:w-3/4">
                                    <div className="m-2 lg:m-0 lg:flex lg:flex-col lg:h-full">
                                        <InputPass email={user?.[0].mail} />
                                    </div>
                                </GridComp>
                                <div className="text-end w-full lg:pe-[10%] my-2">
                                    <button
                                        className="cursor-pointer text-start w-full lg:w-fit font-semibold hover:underline my-1 outline-none"
                                        onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'fav' ? 'fav' : '')}
                                        onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('fav')}
                                    >
                                        Ver mis favoritos
                                    </button>
                                </div>
                                <GridComp condition={chosenOption === 'fav'} extraClass="lg:absolute left-[100%] w-full lg:top-0 lg:h-full">
                                    <FavsProducts />
                                </GridComp>
                                <div className="text-end w-full lg:pe-[10%] my-2">
                                    <button
                                        className="cursor-pointer text-start w-full lg:w-fit font-semibold hover:underline my-1 outline-none"
                                        onClick={() => window.innerWidth < 768 && setChosenOption(prev => prev !== 'hist' ? 'hist' : '')}
                                        onMouseEnter={() => window.innerWidth >= 768 && setChosenOption('hist')}
                                    >
                                        Historial de pedidos
                                    </button>
                                </div>

                                <GridComp
                                    condition={chosenOption === 'hist'} extraClass="lg:absolute left-[110%] lg:top-0 lg:h-full w-full"
                                >
                                    {apUser.orders
                                        ? <OrderHistory />
                                        : <p className="cursor-pointer text-neutral-600 outline-none">Aún no has realizado pedidos</p>
                                    }
                                </GridComp>

                                <div className="mt-2 lg:text-end lg:pe-[10%]">
                                    <button className="w-fit py-1 cursor-pointer outline-none" onClick={signOut}>
                                        Cerrar sesión
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GridComp>
                    <GridComp condition={!user} extraClass="w-full max-w-120 justify-self-center ">
                        <form
                            className="flex flex-col gap-4 mb-2"
                            onSubmit={(e: SubmitEvent<HTMLFormElement>) => {
                                createAccount
                                    ? signUser(e, dataAcc, (data: SignInWithPasswordCredentials) => supabase.auth.signInWithPassword(data), false, setErrorUser)
                                    : signUser(e, dataAcc, (data: SignInWithPasswordCredentials) => supabase.auth.signUp(data), true, setErrorUser)
                            }}
                        >
                            <div className="flex flex-col justify-between w-full gap-2 min-h-[110px]">
                                <input
                                    id="name-input"
                                    name="name"
                                    type="text"
                                    placeholder="Nombre (opcional)"
                                    value={dataAcc.name || ""}
                                    onChange={handleChange}
                                    className={`px-2 rounded border overflow-hidden duration-500 transition-all text-sm ease-in-out
                                                ${!createAccount
                                            ? "h-[34px] py-1 opacity-100 block"
                                            : "h-0 border-y-0 py-0 opacity-0 pointer-events-none"
                                        }`}
                                />
                                <input id="mail" name="mail" type="email" className="border px-2 py-1 rounded text-sm" placeholder="Email" value={dataAcc.mail || ""} onChange={handleChange} />
                                <input id="password" name="password" type="password" className="border px-2 py-1 rounded text-sm" placeholder="Contraseña" value={dataAcc.password || ""} onChange={handleChange} />
                            </div>

                            <div className="text-center w-full lg:w-28 [perspective:1000px]">
                                <button
                                    className={`relative w-full lg:w-28 h-10 border rounded cursor-pointer duration-500 ease-in-out [transform-style:preserve-3d] transition-transform outline-none ${createAccount ? "[transform:rotateX(180deg)]" : "[transform:rotateX(0deg)]"}`}
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

                        <div className={`absolute top-full left-0 rounded-lg bg-[#fce49f] w-full min-h-8 px-3 py-2 mt-2 transition-all duration-500 ease-in-out shadow-md border border-[#f3d078]
                                    ${errorAnimate && !user ? "opacity-100 translate-y-0 block" : "opacity-0 -translate-y-2 pointer-events-none hidden"}`}
                        >
                            <p className="text-[#714e10] font-medium">{!user && errorUser}</p>
                        </div>
                    </GridComp>
                </div>
            </GridComp>
        </div >
    )
}