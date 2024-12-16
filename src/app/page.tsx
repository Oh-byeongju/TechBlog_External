import {EBannerType, EBlank} from "@/types/enums/common-enum";
import {IPostData} from "@/types/interfaces/post-interface";
import {getAllPosts, getPopPosts} from "@/utils/postUtil";
import {getMetadata} from "@/seo/metadata/getMetadata";

import PageContainer from "@/components/containers/PageContainer";
import Blank from "@/components/blank/Blank";
import Banner from "@/components/banner/Banner";
import BodyContainer from "@/components/containers/BodyContainer";
import ContentsContainer from "@/components/containers/ContentsContainer";
import PopularPost from "@/components/home/PopularPost";
import AllPost from "@/components/home/AllPost";

// 기본 메타태그 추가
export async function generateMetadata() {
    return getMetadata();
}

const Home = () => {
    // 모든 페이지는 기본이 SSG
    // 아래처럼 사용하면 빌드 타임 때 데이터 불러오고 동적으로 갱신 X
    // 만약 SSR로 쓰려면 export const dynamic = 'force-dynamic' 이걸 추가해야함
    const result_allPost: IPostData[] = getAllPosts();
    const result_popPost: IPostData[] = getPopPosts();

    return (
        <PageContainer>
            <Blank type={EBlank.Header}/>
            <Banner type={EBannerType.Home} title={"Welcome"}/>
            <BodyContainer>
                <ContentsContainer>
                    <PopularPost popPost={result_popPost} />
                    <Blank type={EBlank.Column} size={30}/>
                    <AllPost allPost={result_allPost}/>
                </ContentsContainer>
            </BodyContainer>
        </PageContainer>
    );
}

export default Home;