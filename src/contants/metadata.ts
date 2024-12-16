export const META = {
    title: '세정아이앤씨 기술 블로그',
    description:
        '세정아이앤씨 기술 블로그입니다.',
    keywords: [
        '세정아이앤씨',
        'SJINC',
        '기술블로그',
        'TechBlog',
    ],
    baseUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL || 'https://sjtb.vercel.app',
    pageUrl: process.env.NEXT_PUBLIC_CLI_BASE_URL || 'https://sjtb.vercel.app',
    ogImage: '/images/banner.jpg',
} as const;