import {Metadata} from "next";

import {EBannerType, EBlank} from "@/types/enums/common-enum";
import {getMetadata} from "@/seo/metadata/getMetadata";
import {IMetadata} from "@/types/interfaces/metadata-interface";

import PageContainer from "@/components/containers/PageContainer";
import Blank from "@/components/blank/Blank";
import Banner from "@/components/banner/Banner";
import ContentsContainer from "@/components/containers/ContentsContainer";
import BodyContainer from "@/components/containers/BodyContainer";
import SearchPost from "@/components/search/SearchPost";

interface Props {
    params: {
        keyword: string
    }
}

// 검색 메타태그 추가
export async function generateMetadata({params}: Props): Promise<Metadata> {
    const decodedKeyword = decodeURIComponent(params.keyword);

    const searchMeta: IMetadata = {
        title: `${decodedKeyword} - 세정아이앤씨 기술 블로그 `,
        description:
            `${decodedKeyword} - 세정아이앤씨 기술 블로그의 검색 결과입니다.`,
        keywords: [
            decodedKeyword,
            '세정아이앤씨',
            'SJINC',
            '기술블로그',
            'TechBlog',
        ],
        baseUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL + `/board/search/${decodedKeyword}`,
        pageUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL + `/board/search/${decodedKeyword}`,
        ogImage: process.env.NEXT_PUBLIC_CLI_BASE_URL + '/images/banner.jpg',
    }

    return getMetadata(searchMeta);
}

const Search = (props: Props) => {
    const decodedKeyword = decodeURIComponent(props.params.keyword);

    return(
        <PageContainer>
            <Blank type={EBlank.Header}/>
            <Banner type={EBannerType.Search} title={"Result for " + decodedKeyword}/>
            <BodyContainer>
                <ContentsContainer>
                    <SearchPost keyword={decodedKeyword}/>
                </ContentsContainer>
            </BodyContainer>
        </PageContainer>
    )
}

export default Search;