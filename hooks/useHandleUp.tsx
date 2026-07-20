import { Dispatch, RefObject, SetStateAction } from "react";

export const handleKeyUp = (
    setAnimate: (value: boolean) => void,
    setIcon: Dispatch<SetStateAction<string>>,
    defaultIcon: string,
    ref: RefObject<NodeJS.Timeout | number | null>,
    repeated: boolean
) => {
    if (ref.current) {
        clearTimeout(ref.current);
    }

    ref.current = setTimeout(() => {
        if (repeated) {
            setIcon((prevIcon: string) => {
                if (prevIcon === "alert") return prevIcon;

                setAnimate(true);
                setTimeout(() => {
                    setIcon("alert");
                    setAnimate(false);
                }, 500);

                return prevIcon;
            });
        } else {
            setIcon((prevIcon: string) => {
                if (prevIcon !== "alert") return prevIcon;

                setAnimate(true);
                setTimeout(() => {
                    setIcon(defaultIcon);
                    setAnimate(false);
                }, 500);

                return prevIcon;
            });
        }
    }, 300);
};