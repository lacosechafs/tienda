"use client"

import { useAppStore } from '@/hooks/useRedux'
import { createClient } from '@/lib/supabase/client'
import { RootState } from '@/redux/makeStore'
import { useEffect, useRef } from 'react'

export const SubscribeCart = () => {

    const store = useAppStore()
    const supabase = createClient()

    const lastSavedStateRef = useRef<any>(null)

    useEffect(() => {
        const unsubscribe = store.subscribe(async () => {
            const state = (store.getState() as unknown) as RootState;

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
                    .update({
                        saved_cart: dataToSync
                    })
                    .eq('id', user.id)

            } catch (error) {
                console.error('Error al guardar productos en la base:', error)
            }
        })

        return () => {
            unsubscribe()
        }
    }, [store, supabase])

    return null
}
