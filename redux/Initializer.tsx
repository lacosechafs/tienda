"use client"

import { useEffect, useRef } from "react";
import { setData } from "./dataSlice";
import { useAppDispatch } from "@/hooks/useRedux";

export const Initializer = ({ initialData }: { initialData: any[] }) => {

    const dispatch = useAppDispatch();
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            dispatch(setData(initialData))
            initialized.current = true
        }
    }, [])

    return null

}
