'use client';

import {useRecoilState} from "recoil";
import {usePathname} from "next/navigation";
import {useEffect, useState} from "react";

import {ILogin, IUser} from "@/types/interfaces/common-interface";
import useActionAndNavigate from "@/hooks/useActionAndNavigate";
import {loginAtom} from "@/atoms/loginAtom";

import styles from "./PageContainer.module.scss";

type Props = {
    children: string | React.ReactNode;
}

const PageContainer = ({children}: Props) => {
    const [isAuth, setIsAuth] = useState(false);
    const [rcLogin] = useRecoilState<ILogin>(loginAtom);
    const pathName = usePathname();
    const actionAndNavigate = useActionAndNavigate();

    useEffect(() => {
        setIsAuth(false);
        if (!rcLogin.isLogin && (pathName === '/board/new' || /^\/board\/\d+\/edit$/.test(pathName))) {
            actionAndNavigate.actionAndNavigate('/')
        }
        else {
            setIsAuth(true);
        }
    }, [pathName, rcLogin]);

    return (
        <div className={styles.baseContainer}>{isAuth && children}</div>
    );
}


export default PageContainer;
