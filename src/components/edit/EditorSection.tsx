'use client'

import React, {useEffect, useRef, useState} from "react";
import {useRecoilState} from "recoil";

import "@/editor/theme/common/style.css";
import "@/editor/theme/frame/style.css";
import {darkModeAtom} from "@/atoms/darkModeAtom";
import {Crepe, CrepeFeature} from "@/editor";
import {IPostData} from "@/types/interfaces/post-interface";
import {EBlank} from "@/types/enums/common-enum";

import styles from "@/components/edit/EditorSection.module.scss";
import Blank from "@/components/blank/Blank";

interface EditorSectionProps {
    post?: IPostData;
    readOnly?: boolean;
}

const EditorSection = ({ post, readOnly = false }: EditorSectionProps) => {
    const localCrepeRef = useRef<Crepe | null>(null);
    const [rcDarkMode] = useRecoilState(darkModeAtom);
    const [editorClassName, setEditorClassName] = useState(styles.baseContainer);
    const [showBlank, setShowBlank] = useState(true);
    const editorSectionRef = useRef<HTMLDivElement | null>(null);

    // 에디터 생성 useEffect
    useEffect(() => {
        const rootElement = document.getElementById('editorSection');

        if (rootElement && !localCrepeRef.current) {
            localCrepeRef.current = new Crepe({
                root: rootElement,
                defaultValue: post ? post?.content : '',
                features: {
                    [CrepeFeature.Placeholder]: !readOnly, // placeholder 활성화 유무
                    [CrepeFeature.BlockEdit]: !readOnly // Toolbar 활성화 유무
                },
            });
            localCrepeRef.current.create().then(() => {
                localCrepeRef.current?.setReadonly(readOnly); // readOnly 설정
                setShowBlank(false);

                if (editorSectionRef.current) {
                    const walker = document.createTreeWalker(
                        editorSectionRef.current,
                        NodeFilter.SHOW_TEXT,
                        null
                    );

                    let node;
                    while ((node = walker.nextNode())) {
                        if (node.nodeValue && node.nodeValue.includes('\u00A0')) {
                            node.nodeValue = node.nodeValue.replaceAll('\u00A0', '');
                        }
                    }
                }
            });
        }
    }, []);

    // 다크모드, readOnly 전환 useEffect
    useEffect(() => {
        const baseClass = `${styles.baseContainer}`;
        const frameClass = rcDarkMode.isDark ? styles.frameDark : styles.frame;
        const readOnlyClass = readOnly ? styles.readOnly : ''; // readOnly가 true일 때만 readOnly 클래스 적용

        setEditorClassName(`${baseClass} ${frameClass} ${readOnlyClass}`);
    }, [rcDarkMode, readOnly]);

    return (
        <>
            {showBlank && <Blank type={EBlank.Column} size={150}/>}
            <div
                id="editorSection"
                className={editorClassName}
                ref={editorSectionRef}
            />
        </>
    );
};

export default EditorSection;
