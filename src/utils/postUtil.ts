import {join} from "path";
import fs from "fs";
import matter from "gray-matter";
import path from "node:path";

import {IPostData} from "@/types/interfaces/post-interface";

const postsDirectory = join(process.cwd(), "_posts");
const popPostsDirectory = join(process.cwd(), "_popPosts");

export function getPostSlugs(): string[] {
    return fs.readdirSync(postsDirectory);
}

export function getPopPostSlugs(): string[] {
    return fs.readdirSync(popPostsDirectory);
}

// _post에 있는 md 파일 파일명 추출 (SSG 사용)
export function getParamSlugs(): string[] {
    const fileNames = fs.readdirSync(postsDirectory);  // 디렉토리 내의 파일 목록을 읽어옴
    return fileNames.map(file => path.basename(file, path.extname(file)));  // 파일명만 추출하여 리턴
}

export function getPostBySlug(slug: string): IPostData | undefined {
    if (!slug) return;

    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(postsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Process the keywords field to be an array of strings
    const keywords = data.keywords && typeof data.keywords === 'string'
        ? data.keywords.split(',').map(keyword => keyword.trim())
        : [];

    return { ...data, slug: realSlug, content, keywords } as IPostData;
}

export function getPopPostBySlug(slug: string): IPostData | undefined {
    if (!slug) return;

    const realSlug = slug.replace(/\.md$/, "");
    const fullPath = join(popPostsDirectory, `${realSlug}.md`);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    // Process the keywords field to be an array of strings
    const keywords = data.keywords && typeof data.keywords === 'string'
        ? data.keywords.split(',').map(keyword => keyword.trim())
        : [];

    return { ...data, slug: realSlug, content, keywords } as IPostData;
}

export function getAllPosts(): IPostData[] {
    const slugs = getPostSlugs();
    const posts = slugs
        .map((slug) => getPostBySlug(slug))
        .filter((post): post is IPostData => post !== undefined) // undefined 제거
        .sort((post1, post2) => (post1.dateModified > post2.dateModified ? -1 : 1));
    return posts;
}

// 인기 게시물에는 sort를 헤더에 적어줘야 포함시켜줘야 정렬이 가능
// "1", "2", "3" 순서로 작성
export function getPopPosts(): IPostData[] {
    const slugs = getPopPostSlugs();
    const posts = slugs
        .map((slug) => getPopPostBySlug(slug))
        .filter((post): post is IPostData => post !== undefined) // undefined 제거
        .sort((post1, post2) => (post1.sort ?? "0") > (post2.sort ?? "0") ? 1 : -1);
    return posts;
}

export function getPostByTerm(searchTerm: string): IPostData[] {
    if (!searchTerm) return [];

    const allPosts = getAllPosts();

    return allPosts.filter((post) => {
        const { title, description, content, author } = post;
        const mdContent = content || "";

        // 제목, 발췌문, 본문 내용에서 검색어를 찾습니다
        // 작성자의 경우 완전 일치의 경우에만 검색
        return (
            title.includes(searchTerm) ||
            description.includes(searchTerm) ||
            mdContent.includes(searchTerm) ||
            author === searchTerm
        );
    }).sort((post1, post2) => (post1.dateModified > post2.dateModified ? -1 : 1));
}