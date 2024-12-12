import {EBannerType, EBlank} from "@/types/enums/common-enum";
import {IPostData} from "@/types/interfaces/post-interface";
import {getAllPosts, getPopPosts} from "@/utils/postUtil";

import PageContainer from "@/components/containers/PageContainer";
import Blank from "@/components/blank/Blank";
import Banner from "@/components/banner/Banner";
import BodyContainer from "@/components/containers/BodyContainer";
import ContentsContainer from "@/components/containers/ContentsContainer";
import PopularPost from "@/components/home/PopularPost";
import AllPost from "@/components/home/AllPost";


const Home = () => {
    // 이거 두개가 api로 받아야할듯 fetch로
    // 현재 외부 공개시 페이지 완전 만들어서 보내는게 불가능 --> 반응형 떄문에
    // html로 들고 올 수 있는거만 들고오고 메타태그를 작성하는걸 중점으로 생각
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