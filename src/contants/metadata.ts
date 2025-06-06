export const META = {
    title: '기술 블로그',
    description:
        '기술 블로그입니다.',
    keywords: [
        '개발자 지식',
        '코딩 지식',
        '기술블로그',
        'TechBlog',
    ],
    baseUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL || 'https://tech-blog-external.vercel.app',
    pageUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL || 'https://tech-blog-external.vercel.app',
    ogImage: '/images/banner.jpg',
} as const;