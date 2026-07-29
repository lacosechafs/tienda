"use client"

import { useAppDispatch, useAppStore } from '@/hooks/useRedux'
import { createClient } from '@/lib/supabase/client'
import { setCartProducts } from '@/redux/cartSlice'
import { RootState } from '@/redux/makeStore'
import { useEffect, useRef, useState } from 'react'

export const SubscribeCart = () => {
    const store = useAppStore()
    const supabase = createClient()
    const dispatch = useAppDispatch()

    const [isFullyLoaded, setIsFullyLoaded] = useState(false)
    const [userLogged, setUserLogged] = useState("")
    const lastSavedStateRef = useRef<any>(null)

    useEffect(() => {
        async function fetchInitialCart() {
            try {
                const { data: { user } } = await supabase.auth.getUser()

                if (user) {
                    setUserLogged(user.id)
                    const { data } = await supabase
                        .from('profiles')
                        .select('saved_cart')
                        .eq('id', user.id)
                        .single()

                    if (data?.saved_cart) {
                        lastSavedStateRef.current = data.saved_cart
                        dispatch(setCartProducts(data.saved_cart))
                    }
                } else {
                    const localCart = window.localStorage.getItem('cart')
                    if (localCart) {
                        const parsedCart = JSON.parse(localCart)
                        lastSavedStateRef.current = parsedCart
                        dispatch(setCartProducts(parsedCart))
                    }
                }
            } catch (error) {
                console.error('Error al traer el carrito inicial:', error)
            } finally {
                setIsFullyLoaded(true)
            }
        }

        fetchInitialCart()
    }, [supabase, dispatch])

    useEffect(() => {
        if (!isFullyLoaded) return

        const unsubscribe = store.subscribe(async () => {
            const state = (store.getState() as unknown) as RootState
            const dataToSync = state.cart.products
            const userToSync = state.user.data
            const allInfo = { saved_cart: dataToSync, ...userToSync }

            const cartChanged = JSON.stringify(lastSavedStateRef.current.cart) !== JSON.stringify(dataToSync)
            const userChanged = JSON.stringify(lastSavedStateRef.current.user) !== JSON.stringify(userToSync)

            if (!cartChanged && !userChanged) {
                return
            }

            lastSavedStateRef.current = {
                cart: dataToSync,
                user: userToSync
            }
            
            try {
                if (!userLogged) {
                    if (dataToSync) {
                        window.localStorage.setItem('cart', JSON.stringify(dataToSync))
                    }
                    return
                }

                await supabase
                    .from('profiles')
                    .update(allInfo)
                    .eq('id', userLogged)

            } catch (error) {
                console.error('Error al guardar productos:', error)
            }
            console.log('guardado')

        })

        return () => {
            unsubscribe()
        }
    }, [store, supabase, isFullyLoaded, userLogged])

    return null
}