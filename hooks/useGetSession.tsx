"use client"
import { createClient } from '@/lib/supabase/client'
import React, { useEffect, useState } from 'react'

export const useGetSession = () => {

    const supabase = createClient()
    const [userData, setUser] = useState<any>(null)

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
                }
            }
        }
        fetchUser()
    }, [])

    return userData
}
