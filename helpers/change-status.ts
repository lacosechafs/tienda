import { Dispatch, SetStateAction } from "react";

export const ChangeStatus = (setter: Dispatch<SetStateAction<boolean>>) => {
    let newValue = false;

    if (setter) {
        setter((prev) => {
            newValue = !prev;
            return newValue;
        });
    }

    return newValue;
};
