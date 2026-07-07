"use client"

import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux"
import { setData } from "./dataSlice";

export const Initializer = ({ initialData }: { initialData: any[] }) => {

    const dispatch = useDispatch();
    const initialized = useRef(false)

    useEffect(() => {
        if (!initialized.current) {
            dispatch(setData(initialData))
            initialized.current = true
        }
    }, [])

    return null

}
