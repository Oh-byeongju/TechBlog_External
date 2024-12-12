'use client';

import {useEffect, useState} from "react";

import {EBlank, EBreakPoint} from "@/types/enums/common-enum";
import {IPostData} from "@/types/interfaces/post-interface";
import useBreakPoint from "@/hooks/useBreakPoint";

import Label from "@/components/label/Label";
import RowPost from "@/components/post/RowPost";
import Blank from "@/components/blank/Blank";
import RowPostMd from "@/components/post/RowPostMd";

interface Props {
    allPost: IPostData[];
}

const AllPost = ({allPost}: Props) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const breakPoint = useBreakPoint();

    useEffect(() => {
        // 브레이크포인트 계산 후 로딩 상태를 true로 변경
        if (breakPoint) {
            setIsLoaded(true);
        }
    }, [breakPoint]);

    return (
        <>
            <Label text={'전체 게시글'}/>
            {
                !isLoaded ?
                    <div style={{width: '100%', height: '200px', borderRadius: '10px', background: 'lightgray'}}/> :
                    allPost.map((value: IPostData) =>
                        <>
                            {
                                breakPoint === EBreakPoint.LG ?
                                    <RowPost key={value.slug + value.author + value.datePublished} postData={value}/> :
                                    <RowPostMd key={value.slug + value.author + value.datePublished} postData={value}/>
                            }
                            <Blank type={EBlank.Column} size={60}/>
                        </>
                    )
            }
        </>
    )
}

export default AllPost;