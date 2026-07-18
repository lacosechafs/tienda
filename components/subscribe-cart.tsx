"use client"

import { useAppStore } from '@/hooks/useRedux'
import { createClient } from '@/lib/supabase/client'
import { RootState } from '@/redux/makeStore'
import { useEffect, useRef, useState } from 'react'

export const SubscribeCart = () => {
    const store = useAppStore()
    const supabase = createClient()

    const [isFullyLoaded, setIsFullyLoaded] = useState(false)
    const lastSavedStateRef = useRef<any>(null)

    useEffect(() => {
        async function fetchInitialCart() {
            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (user) {
                    const { data } = await supabase
                        .from('profiles')
                        .select('saved_cart')
                        .eq('id', user.id)
                        .single()

                    if (data?.saved_cart) {
                        lastSavedStateRef.current = data.saved_cart
                    }
                }
            } catch (error) {
                console.error('Error al traer el carrito inicial:', error)
            } finally {
                setIsFullyLoaded(true)
            }
        }

        fetchInitialCart()
    }, [store, supabase])

    useEffect(() => {
        if (!isFullyLoaded) return

        const unsubscribe = store.subscribe(async () => {
            const state = (store.getState() as unknown) as RootState
            const dataToSync = state.cart.products

            if (JSON.stringify(lastSavedStateRef.current) === JSON.stringify(dataToSync)) {
                return
            }

            lastSavedStateRef.current = dataToSync

            try {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return

                await supabase
                    .from('profiles')
                    .update({ saved_cart: dataToSync })
                    .eq('id', user.id)

            } catch (error) {
                console.error('Error al guardar productos en la base:', error)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [store, supabase, isFullyLoaded])

    return null
}