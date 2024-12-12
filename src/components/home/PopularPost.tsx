'use client';

import {useState, useEffect} from "react";

import {IPostData} from "@/types/interfaces/post-interface";
import useBreakPoint from "@/hooks/useBreakPoint";
import {EBreakPoint} from "@/types/enums/common-enum";

import Label from "@/components/label/Label";
import ColumnPostMotion from "@/components/post/ColumnPostMotion";
import ColumnPostSlider from "@/components/post/ColumnPostSlider";

interface Props {
    popPost: IPostData[];
}

const PopularPost = ({popPost}: Props) => {
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
            <Label text={'인기 있는 글'}/>
            {!isLoaded ? (
                <div style={{width: '100%', height: '388px', borderRadius: '10px', background: 'lightgray'}}/>
                ) : (
                breakPoint === EBreakPoint.LG ? (
                    <ColumnPostMotion posts={popPost}/>
                ) : (
                    <ColumnPostSlider posts={popPost}/>
                )
            )}
        </>
    );
};

export default PopularPost;
