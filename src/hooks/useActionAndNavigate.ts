'use client';

import { useRouter } from 'next/navigation';
import {useEffect} from "react";

import usePopup from "@/hooks/usePopup";

const useActionAndNavigate = (url?: string) => {
    const popupController = usePopup();
    const router = useRouter();

    const actionAndNavigate = (clickUrl: string, action?: () => void) => {
        !!action && action();
        router.push(clickUrl);
        popupController.closeAll();
    };

    useEffect(() => {
        if (typeof url === "string") {
            router.prefetch(url);
        }
    }, [router, url])

    return { actionAndNavigate };
};

export default useActionAndNavigate;
