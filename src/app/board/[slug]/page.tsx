import {Metadata} from "next";
import {redirect} from "next/navigation";

import {EBannerType, EBlank} from '@/types/enums/common-enum';
import {IPostData} from "@/types/interfaces/post-interface";
import {getPostBySlug} from "@/utils/postUtil";
import {IMetadata} from "@/types/interfaces/metadata-interface";
import {META} from "@/contants/metadata";
import {getMetadata} from "@/seo/metadata/getMetadata";

import Blank from '@/components/blank/Blank';
import PageContainer from '@/components/containers/PageContainer';
import Banner from '@/components/banner/Banner';
import WriterInfo from '@/components/read/WriterInfo';
import ContentsContainer from '@/components/containers/ContentsContainer';
import BodyContainer from '@/components/containers/BodyContainer';
import TagList from '@/components/read/TagList';
import EditorSection from "@/components/edit/EditorSection";
import Summary from "@/components/read/Summary";

interface Props {
    params: {
        slug: string;
    };
}

export async function generateMetadata({params}: Props): Promise<Metadata> {
    const post = getPostBySlug(params.slug)
    if (!post) return {};
    const metadata: IMetadata = {
        title: `${post.title} - 세정아이앤씨 기술 블로그`,
        description: post.description,
        keywords: post.keywords,
        baseUrl: META.baseUrl,
        pageUrl: `/board/${params.slug}`,
        ogImage: post.thumbnail
    };
    return getMetadata(metadata);
}

// export async function generateStaticParams() {
//     const slugs = getAllPosts();
//     return slugs.map((slug) => ({
//       slug,
//     }));
//
//     /// 이부분이 파일 다 읽어야하는 부분
//     const data = ['dynamic-routing', 'hello-world', 'pr2eview', 'preview'];
//
//     /// 게시물 관련을 SSG 와 ISR로 구현한다고 하면,,,,,
//     //// 게시물 crud를 했을 때 md 파일을 직접 사용하는 애들은 모두 갱신이 필요.
//
//     return data;
//   }

// 할일 ldjson 추가하기
// generateStaticParams 체크하기

const Post = (props: Props) => {
    const post: IPostData | undefined = getPostBySlug(props.params.slug);

    if (!post) {
        redirect('/');
    }

    return (
        <PageContainer>
            <Blank type={EBlank.Header}/>
            {
                !post ?
                    <Banner type={EBannerType.Home} title={""}/>
                    :
                    <>
                        <Banner type={EBannerType.Read} title={post.title} author={post.author}
                                dateModified={post.dateModified}/>
                        <BodyContainer>
                            <ContentsContainer>
                                <Summary description={post.description}/>
                                <EditorSection post={post} readOnly={true}/>
                                <WriterInfo author={post.author}/>
                                <TagList tags={post.keywords}/>
                                {/*<ActivityBox slug={post.slug}/>*/}
                            </ContentsContainer>
                        </BodyContainer>
                    </>
            }
        </PageContainer>
    );
};

export default Post;
