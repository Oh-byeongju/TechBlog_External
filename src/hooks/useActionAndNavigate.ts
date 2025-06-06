'use client';

import {usePathname, useRouter} from 'next/navigation';
import {useSetRecoilState} from "recoil";
import {useEffect} from "react";

import usePopup from "@/hooks/usePopup";
import {apiAtom} from "@/atoms/apiAtom";
import {routerAtom} from "@/atoms/routerAtom";

const useActionAndNavigate = (routeUrl?: string) => {
    const popupController = usePopup();
    const router = useRouter();
    const setApiState = useSetRecoilState(apiAtom);
    const setRouterState = useSetRecoilState(routerAtom);
    const pathname = usePathname();

    const actionAndNavigate = (url: string, action?: () => void) => {
        // url 값에 따라 get API 호출 State 조정
        if (/^\/board\/search\/.+$/.test(url)) {
            // 검색 결과 페이지
            setApiState(prev => ({
                ...prev,
                result_searchAPI: false
            }));
        } else {
            // 그 외
            setApiState(prev => ({
                ...prev
            }));
        }

        // 현재 스크롤 위치 저장 후 flag 설정
        const scrollY =  window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
        sessionStorage.setItem(`scroll-${pathname}`, String(scrollY));
        setRouterState(prev => ({
            ...prev,
            routerState: true
        }))

        !!action && action();
        router.push(url);
        popupController.closeAll();
    };

    useEffect(() => {
        if (typeof routeUrl === "string") {
            router.prefetch(routeUrl);
        }
    }, [router, routeUrl])

    return { actionAndNavigate };
};

export default useActionAndNavigate;
