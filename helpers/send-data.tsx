import { createClient } from "@/lib/supabase/client"
import { SetStateAction } from "react"

export const SendData = async (type: string, value: string | null, setChangeConf: (value: string) => void) => {

  const supabase = createClient()

  const { data } = await supabase.auth.getUser()

  if (!data.user) return

  const { error } = await supabase
    .from('profiles')
    .update({
      [type]: value || null
    })
    .eq('id', data.user.id)

  if (error) {
    setChangeConf(error.message)
    return
  }

  setChangeConf("ok")

}
