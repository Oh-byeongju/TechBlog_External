## **1. 프로젝트 개요**

### **1. 프로젝트 소개**
- 내부 블로그에서 작성된 게시물을 외부에 노출하기 위해 기획한 프로젝트입니다.
- 상황에 따라 Next.js의 다양한 렌더링 기법(**SSR, CSR, SSG, ISR**)을 적절히 활용하여 개발을 진행하였습니다.

    <img width="100%" alt="Service" src="https://github.com/user-attachments/assets/3eb59290-0f6c-4c3e-a135-3400dfe25b98"/>

- 프로토타입 단계로, 백엔드는 구현하지 않았습니다.
- Vercel을 활용해 Next.js를 배포하여 운영할 수 있도록 구성했습니다.
- 추후 백엔드 기능이 필요해질 경우, Next.js App Router에 포함된 API Route를 활용해 개발을 진행할 예정입니다.
- **해당 프로젝트는 외부 사용자를 위한 서비스로**, 블로그 게시물의 조회 및 검색 기능만을 제공합니다.
    
    <img width="100%" alt="Service" src="https://github.com/user-attachments/assets/33166100-f9e2-402f-b23f-b9a982693830"/>
    
- 내부 사용자용 프로젝트 정보는 [기술 블로그 (내부 사용자)](https://github.com/Oh-byeongju/TechBlog_Internal)를 참고해주세요.
### **2. 개발 기간**
- 2024.12.01 ~ 2024.12.31
### **3. Deploy on Vercel**
- https://tech-blog-external.vercel.app

## **2. 기술 및 도구**

### `Frontend`
- Node.js 20.9
- Next.js 14.2.5 (App Router)
- TypeScript
- Axios
- Recoil
- React Query
### `Library / Deploy`
- Milkdown Editor
- Unsplash
- Vercel

## **3. 시스템 아키텍처**

<img width="80%" alt="System" src="https://github.com/user-attachments/assets/2adf9b88-03c2-4304-abbd-e79ce2e12fdb"/>

### 1. 게시물 및 코드 수정
- 개발자가 게시물의 Markdown 파일 또는 소스 코드를 GitHub 저장소에 푸시합니다.
### 2. 자동 배포 트리거
- GitHub에 변경사항이 감지되면 Vercel이 자동으로 빌드 및 배포를 수행합니다.
### 3. 프로젝트 빌드 및 배포
- Next.js 14의 App Router를 사용해 게시물 페이지를 **정적 HTML로 사전 렌더링**합니다.
- `generateStaticParams()` 함수를 통해 게시물 경로(slug)를 미리 생성하고, 필요한 정적 파일을 생성합니다.
- 빌드가 완료되면 HTML 파일이 Vercel CDN에 배포되어, 사용자가 페이지에 접근할 때 **정적 페이지**를 전달합니다.
```tsx
// 게시물의 SSG 페이지 생성 로직
export async function generateStaticParams() {
  return getParamSlugs();
}

export function getParamSlugs(): string[] {
  // 디렉토리 내 파일 목록을 읽어 slug 생성
  const fileNames = fs.readdirSync(postsDirectory);
  return fileNames.map(file =>
    path.basename(file, path.extname(file))
  );
}
```
### 4. 사용자 접근
- 방문자는 미리 생성된 정적 HTML 페이지를 빠르게 로딩할 수 있습니다.
- 초기 로딩이 빠르며, 검색 엔진에 최적화된 메타 정보를 제공합니다.
### 5. SEO 및 퍼포먼스 확보
- SSG를 활용해 검색엔진 노출(SEO)과 사용자 경험(UX) 모두 개선합니다.
- 배포 프로세스는 GitHub 커밋만으로 자동화되어 관리가 쉽습니다.

## 4. 렌더링 구조 및 핵심 기능

### 1. 렌더링 구조

- 대부분의 페이지는 **SSG** 또는 **SSR** 방식으로 구현되어 있습니다.
- 외부에 공개되는 서비스이므로, **검색 엔진 최적화(SEO)** 효과를 위해 모든 초기 페이지를 서버 측에서 렌더링하도록 구성했습니다.
- 반면, 사용자와의 상호작용이 필요한 화면은 **CSR** 방식을 적용해 사용자 경험을 개선했습니다.

```tsx
Route (app)                              Size     First Load JS
┌ ○ /                                    2.94 kB         157 kB
├ ○ /_not-found                          883 B          90.3 kB
├ ƒ /api/search                          0 B                0 B
├ ƒ /api/updateImage                     0 B                0 B
├ ● /board/[slug]                        147 kB          295 kB
├ ƒ /board/search/[keyword]              2.27 kB         156 kB
└ ○ /robots.txt                          0 B                0 B
+ First Load JS shared by all            89.4 kB
  ├ chunks/2117-4eac37192429b8c1.js      31.7 kB
  ├ chunks/fd9d1056-11ef1f382a39fa9a.js  53.7 kB
  └ other shared chunks (total)          4.04 kB

ƒ Middleware                             27 kB

○  (Static)   prerendered as static content
●  (SSG)      prerendered as static HTML (uses getStaticProps)
ƒ  (Dynamic)  server-rendered on demand
```

### 2. 메타데이터 생성

- 페이지별로 메타 태그(`title`, `description`, `keywords`, `og:image` 등)를 생성하였습니다.

```tsx
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getPostBySlug(params.slug);
  if (!post) return {};

  const metadata: IMetadata = {
    title: `${post.title} - 기술 블로그`,
    description: post.description,
    keywords: post.keywords,
    baseUrl: META.baseUrl,
    pageUrl: `/board/${params.slug}`,
    ogImage: post.thumbnail,
  };

  return getMetadata(metadata);
}
```

### 3. robots.txt 자동 생성

- `robots.ts` 파일을 작성하면 빌드 시 자동으로 `robots.txt`를 생성합니다. 이를 통해 검색 엔진 크롤러에 대한 노출 범위를 효과적으로 제어하였습니다.

```tsx
// app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [
        '/api/*',
        '/_not-found'
      ],
    },
    sitemap: '',
  };
}
```

### 4. JSON-LD (**구조화 데이터 마크업)**

- 검색 엔진에 구조화된 데이터를 제공하기 위해 게시물 상세 페이지에 `ld+json` 스크립트를 삽입하여, 검색 결과에 더 많은 정보가 표시되도록 했습니다.

```tsx
// 페이지 컴포넌트 내부
const jsonLd = getLdJsonArticle({
  id: `${META.baseUrl}/board/${post.slug}`,
  headline: post.title,
  image: [post.thumbnail],
  datePublished: post.datePublished,
  dateModified: post.dateModified,
  author: { name: post.author, url: '' },
  keywords: post.keywords,
});

return (
  <>
    {/* 기타 콘텐츠 */}
    <Scriptid="json-ld"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
    {/* 기타 콘텐츠 */}
  </>
);
```

### 5. 라우터 Prefetch 적용

- `router.prefetch()`를 활용해 백그라운드에서 데이터를 미리 로드하도록 하였으며, 이를 통해 페이지 전환 시 부드럽게 이동할 수 있도록 구현했습니다.

```tsx
// hooks/useActionAndNavigate.ts
const useActionAndNavigate = (routeUrl?: string) => {
  const router = useRouter();

  useEffect(() => {
    if (typeof routeUrl === 'string') {
      router.prefetch(routeUrl);
    }
  }, [router, routeUrl]);

  const actionAndNavigate = () => {
    if (routeUrl) router.push(routeUrl);
  };

  return { actionAndNavigate };
};

export default useActionAndNavigate;
```

## 5. 게시물/사용자 관리 가이드

- 현재 프로젝트는 **프로토타입 단계**이므로, 게시물/사용자 관리를 `enum` 또는 직접 파일을 추가하는 방식으로 처리합니다.
- 아래의 내용은 등록 절차이며, 추후 자동화 개발 과제로 개선할 예정입니다.

### 1. 파일 경로

- `_post`: 전체 게시글 파일 경로
- `_popPosts`: 인기 게시글 파일 경로
- `public/profile`: 사용자 프로필 사진 경로
- `public/asset/blog/{게시물이름}`: 게시물 이미지 경로

### 2. 사용자 관리

1. `user-enum.ts` 파일에서 사용자 정보를 추가하거나 수정합니다.
2. 프로필 사진이 필요한 경우 `public/profile`에 이미지를 추가합니다.
3. `enum`에 아래 정보를 기입합니다.
    - **userName**: 사용자 이름
    - **profileCont**: 프로필 설명
    - **profilePicPath**: 프로필 사진 경로

### 3. 전체 게시글 등록

1. 내부 프로젝트에서 작성한 Markdown 파일과 사용된 이미지를 가져옵니다.
2. Markdown 파일명은 URL에 사용되므로 적절히 수정합니다.
    - `Cloud-Service.md` → `https://tech-blog-external.vercel.app/board/Cloud-Service`
3. 새로운 파일명으로 된 Markdown 파일을 `_post` 경로에 추가합니다.
4. `public/asset/blog/{게시물이름}` 디렉토리를 생성합니다.
5. 게시물에 사용된 이미지를 적절한 이름으로 변경한 뒤, 해당 디렉토리로 이관합니다.
6. Markdown 파일 내부를 수정합니다.
    - **thumbnail**: 게시물 썸네일 경로
    - **author**: 작성자 이메일 (작성자 정보 조회에 사용)
    - **image**: 경로를 `asset`부터 작성 → `(/assets/blog/Cloud-Infra/Cloud.jpg)`

## 아래부터 수정 필요

## **8. 개선사항 및 향후 개발 계획**

### 1. 에디터 기능 강화
- 이미지 첨부 시 드래그 앤 드롭 및 복사-붙여넣기 지원
- 게시물 작성 및 수정 중 임시 저장 기능 제공, 페이지 이탈 시 경고 메시지 출력
- 이미지 업로드 시 `temp` 디렉토리를 활용하여 불필요한 이미지 저장 방지
- 일정 주기로 자동 저장되는 기능 구현

### 2. Markdown 파일 서버 연동 및 이력 관리
- 현재 프론트엔드에서만 사용하는 `md` 파일을 백엔드 서버와 연동하여 관리
- `boad_cont_info` 테이블에 게시물 메타 정보(분류, 공개 여부 등) 저장
- `sy_file_md_info` 테이블을 활용해 버전별 `md` 파일을 관리하고, GitHub처럼 히스토리 관리 기능 제공

### 3. 관리자 페이지 구축
- 공통 코드, 사용자, 게시물 등을 효율적으로 관리할 수 있는 관리자 페이지 개발
- 외부에 공개되는 프로젝트와 연동될 수 있도록 기능 확장 및 API 설계

### 4. AI 기능 비동기화
- 게시물 작성 시 ChatGPT 요약 및 태그 생성을 비동기 처리로 전환하여 사용자 경험 개선

## **9. 개발 후기**

**✏️ 프로젝트에 대한 후기 및 느낀점입니다.**

> 이번 프로젝트를 통해 **Next.js의 각종 렌더링 방식**부터, **파일 저장 구조와 경로 관리**, **암호화 처리**, **OpenAI API 연동**, 그리고 Spring Boot 환경에서의 **전역 설정 및 상수 관리**, **로그·이력 관리 방식**까지 폭넓게 다뤄볼 수 있었습니다. 특히 백엔드에서는 파일 업로드/저장 시 디렉토리 구조를 어떻게 잡을지, 경로를 어떻게 안전하게 관리할지를 직접 설계해보며 실무적인 감각을 키울 수 있었습니다. 이번 경험을 바탕으로 다음에는 더 많은 사람들과 함께 협업하며, 완성도 높은 프로젝트를 만들어보고 싶다는 생각이 들었습니다.