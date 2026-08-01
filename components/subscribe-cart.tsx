"use client"

import { useAppDispatch, useAppStore } from '@/hooks/useRedux'
import { createClient } from '@/lib/supabase/client'
import { setCartProducts } from '@/redux/cartSlice'
import { RootState } from '@/redux/makeStore'
import { useEffect, useRef, useState } from 'react'

const supabase = createClient()

export const SubscribeCart = () => {
    const store = useAppStore()
    const dispatch = useAppDispatch()

    const [isFullyLoaded, setIsFullyLoaded] = useState(false)

    const userLoggedRef = useRef<string | null>(null)

    const lastSavedStateRef = useRef<{ cart: any; user: any }>({
        cart: null,
        user: null,
    })

    useEffect(() => {
        let isMounted = true

        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (session?.user) {
                if (!isMounted) return
                userLoggedRef.current = session.user.id

                const { data } = await supabase
                    .from('profiles')
                    .select('saved_cart')
                    .eq('id', session.user.id)
                    .single()

                if (data?.saved_cart && isMounted) {
                    dispatch(setCartProducts(data.saved_cart))
                    lastSavedStateRef.current.cart = data.saved_cart
                }
            } else {
                if (!isMounted) return
                userLoggedRef.current = null

                const localCart = window.localStorage.getItem('cart')
                const parsedCart = localCart ? JSON.parse(localCart) : []
                dispatch(setCartProducts(parsedCart))
                lastSavedStateRef.current.cart = parsedCart
            }

            if (isMounted) {
                setIsFullyLoaded(true)
            }
        })

        return () => {
            isMounted = false
            subscription.unsubscribe()
        }
    }, [dispatch])

    useEffect(() => {
        if (!isFullyLoaded) return

        const unsubscribe = store.subscribe(async () => {
            const state = (store.getState() as unknown) as RootState
            const dataToSync = state.cart.products

            const { orders, ...userToSync } = state.user.data || {}

            const cartChanged = JSON.stringify(lastSavedStateRef.current.cart) !== JSON.stringify(dataToSync)
            const userChanged = JSON.stringify(lastSavedStateRef.current.user) !== JSON.stringify(userToSync)

            if (!cartChanged && !userChanged) {
                return
            }

            const currentUserId = userLoggedRef.current

            lastSavedStateRef.current = {
                cart: dataToSync,
                user: userToSync
            }

            try {
                if (!currentUserId) {
                    if (dataToSync) {
                        window.localStorage.setItem('cart', JSON.stringify(dataToSync))
                    }
                    return
                }

                const allInfo = { saved_cart: dataToSync, ...userToSync }

                await supabase
                    .from('profiles')
                    .update(allInfo)
                    .eq('id', currentUserId)

            } catch (error) {
                console.error('Error al guardar productos:', error)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [store, isFullyLoaded])

    return null
}