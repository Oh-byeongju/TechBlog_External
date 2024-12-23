---
title: Next.js 서버 사이드 렌더링 구현 전략
description: >+
  NEXT.js 14버전의 app router를 기준으로 SSG, ISR, SSR의 서버 사이드 렌더링 기법에 대한 적절한 사용 방법을
  설명합니다. SSG는 정적 페이지를 생성하고, ISR은 주기적으로 데이터를 갱신하며, SSR은 요청 시마다 페이지를 동적으로 생성합니다. 각
  기법에 따라 API 호출 시 fetch 사용을 권장하며, 빌드 시 .next 디렉토리 관리에 주의해야 합니다. 또한, 페이지 구성 시
  layout.tsx에서 클라이언트 사이드 요소 사용을 피하고, SSR 요소가 포함된 경우 페이지는 동적으로 처리됩니다. 동적 라우팅 시
  slug 사용에 따른 성능 최적화 방법도 언급됩니다. 

thumbnail: >-
  /assets/blog/Nextjs-ServerSide/Rendering.png
keywords: 'NEXTjs, SSR, SSG, ISR, 서버사이드렌더링, 프론트엔드개발, 웹개발, API'
author: obj98@sjinc.co.kr
datePublished: '2024-12-23 16:40:03'
dateModified: '2024-12-23 16:40:03'
---

#### ※ NEXT.js의 서버 사이드 렌더링 기법(SSG, ISR, SSR)에 대한 적절한 사용 방법

* 이 문서는 **NEXT.js 14버전의 app router**를 기준으로 작성하였으며, 페이지 갱신에 의한 렌더링인 SSG, ISR, SSR 즉 서버사이드 렌더링 기법에 대한 자세한 내용을 작성해둔 문서입니다.
* CSR(Client Side Rendering) 같은 경우 Next.js의 핵심 기법이 아닌 SPA(Single Page Application)의 핵심 개념이고 서버가 아닌 클라이언트에게 렌더링을 전가하는 방식이기 때문에 컴포넌트만 분리하여 사용하면 SSG, ISR, SSR 페이지 및 컴포넌트에 영향을 주지 않습니다.

&nbsp;

### ※ 렌더링 로드맵

* 문서를 정독하기전 먼저 NEXT.js의 렌더링 방식을 이해하시고, 아래의 사진을 참고하시면서 문서를 읽어주시면 감사하겠습니다.

![1.00](/assets/blog/Nextjs-ServerSide/Rendering.png)

&nbsp;

* 페이지 구성 시 필수사항

  * layout.tsx에 할당되는 값의 경우 라우터를 이용하여 페이지를 이동할 때 변경이 안되는 값입니다.
  * 페이지에서 전역으로 사용하는 상태관리 함수, 팝업 화면, 특정 컴포넌트(TopButton, Footer) 등을 layout.tsx에 서버 사이드 개념으로 할당합니다.

    * 만약 Recoil과 같은 클라이언트 사이드 개념인 요소를 사용하려는 경우 Wrapper를 사용하여 서버사이드 개념으로 변환이 필요합니다.
    * 참고 : [![](https://static.velog.io/favicons/favicon-16x16.png)\[Next.js\] Recoil 적용하기.](https://velog.io/@khakisage/Next.js-Recoil-%EC%A0%81%EC%9A%A9%ED%95%98%EA%B8%B0)
  * **결론 : 'use client'를 사용한 클라이언트 사이드 개념을 사용하는 것은 layout.tsx 에서는 삼가해야 합니다.**

&nbsp;

### ※ 구현 시 참고사항

1. Fetch 옵션

   1. SSG : { cache: 'force-cache' })
   2. ISR : { next: { revalidate: 3600 }});
   3. SSR : { cache: 'no-store' });

&nbsp;

* API 호출

  * 서버사이드 렌더링 기법에서는 API 자원을 사용하는 경우 axios 라이브러리 사용을 삼가해야 하며 프레임워크에서 제공하는 fetch 함수를 사용하여야 합니다.
  * axios를 사용하여 API 자원을 호출할 수 있으나 캐싱 기능을 제대로 사용하지 못하기 때문에 SSG 컴포넌트 기능만을 구현할 수 있습니다.
  * 물론 export const dynamic = "force-dynamic" 또는 export const revalidate = 10 등을 page.tsx 최상단에 삽입하여 페이지 자체를 매번 새롭게 불러와 ISR, SSR 기능을 비슷하게 구현할 수 있지만, 이럴 경우 컴포넌트별 개별 제어가 어렵기 때문에 axios를 사용하지 않는것을 추천합니다.

&nbsp;

* NEXT.js 빌드

  * NEXT.js는 빌드를 실행하는 경우 .next 디렉토리가 생성됩니다. 해당 디렉토리에 페이지 렌더링 시 필요한 데이터가 들어가 있습니다.
  * 빌드 실행 시 .next 디렉토리를 삭제 안하고 빌드를 진행하면 SSG에 해당하는 부분이 갱신이 안되는 이슈가 있을수도 있습니다.

    * .next 디렉토리 삭제 X : SSG 갱신안됨, ISR, SSR 갱신됨
    * .next 디렉토리 삭제 O : SSG, ISR, SSR 모두 갱신
  * 프로젝트를 기준으로 보았을 때 SSG로 구현된 부분이 극히 드물것으로 예상되나 디렉토리 제거 없이 빌드하는 경우 제대로된 배포가 이루어지지 않을 수 있기 때문에 유의하셔야 합니다.
  * 디렉토리 제거에 대한 반감이 있을 경우, ISR을 사용하여 revalidate 시간을 엄청 길게 잡으면 SSG과 비슷한 기능을 구현 가능할 것으로도 예상됩니다.

&nbsp;

* API 호출 시 try-catch 사용

  * SSG : API 서버와 통신이 안될 경우 빌드 타임에 에러가 발생합니다. (사실상 try-catch에 대한 의미가 없음)
  * ISR : API 서버와 빌드 타임에 통신을 실패하는 경우 빌드 에러가 발생하고, 빌드를 무사히 성공한 뒤 운영을 하고 있는 단계에서 API 서버와 통신이 안될 경우 데이터 갱신이 안됩니다. (try-catch가 되지만 revalidate 시간이 되어 데이터를 갱신하려고 할 때, 통신이 실패하는 경우 가장 직전의 데이터를 표출해주는 오류가 존재)
  * SSR : API 서버와 통신이 안될 경우 임의의 데이터를 사용 가능합니다.

  ```TypeScript
  // SSR 데이터 가져오기
  async function getSpringDataSSR() {
      console.log('SSR 첫번째 페이지 동작');

      try {
          const res = await fetch(`http://localhost:8080/message/SSR`, { cache: 'no-store' });
          if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
          }
          const data = await res.json();
          console.log('SSR -> ' + data.msg);
          return data; // 데이터를 JSON 문자열로 변환하여 반환
      } catch (error) {
          console.error('Error fetching SSR data:', error);
          return null; // 오류 발생 시 null 반환
      }
  }

  export default async function SSR() {
      const SSR = await getSpringDataSSR();

      return (
          <>
              <h2>SSR</h2>
              <p>{SSR ? SSR.msg : '없음3'}</p> {/* SSR 데이터 출력 */}
          </>
      );
  }

  ```

  * **위의 내용을 참고하시고, 빌드 에러를 막기 위해선 fetch를 사용해 API 자원을 사용하는 경우 try-catch를 사용하여 예외를 처리하는 것을 권고합니다.**

&nbsp;

* NEXT.js의 정적 페이지와 동적 페이지

  * 하나의 page.tsx에서 모든 자식 요소를 기준으로 SSG, ISR, SSR 요소의 존재 유무에 따라 해당 페이지가 정적인지 동적인지 결정됩니다.
  * **SSG와 ISR로만 구성되어 있는 경우 해당 페이지는 정적 페이지로 빌드** 되고 **SSR 요소가 단 하나라도 존재하는 경우 해당 페이지는 동적 페이지로 빌드**됩니다.
  * **따라서 불필요한 SSR 요소를 제거해야 하며, 빌드 타임에 해당 페이지가 개발자의 의도대로 빌드되었는지 로그를 확인해야 합니다. (6번 항목에서 이어서 진행)**

&nbsp;

* NEXT.js의 페이지 별 렌더링&#x20;

  * 만약 page.tsx에서 SSR 요소 및 컴포넌트 등을 사용하는 경우 캐시에 대한 오류메시지가 출력될 수 있습니다.

    1. 이런 경우 page.tsx 최상단에 export const dynamic = "force-dynamic"를 적어주면 해당 페이지는 항상 캐시를 무시하기 때문에 이슈가 사라집니다. (동적 페이지로 인정)
    2. [![](https://nextjs.org/favicon.ico)File Conventions: Route Segment Config](https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config) 문서 참고
    3. SSR 요소를 사용한다는 것으로 페이지 내 정적인 요소는 그대로 있으나 동적인 요소는 바뀔 수 있다는 것을 명시해주기 위한 코드로 이해 바랍니다.

&nbsp;

* 빌드된 .next > server > app 디렉토리를 확인하였을 때, page.tsx URL을 기준으로 html 파일이 있으면 SSG와 ISR로만 구현된 정적 페이지이고, page.js만 존재한다면 항상 페이지를 만들어내는 동적 페이지라고 판단할 수 있습니다.

  1. 이 내용은 빌드 타임에 나오는 로그에서도 확인이 가능합니다.

  ```
  Route (app)               Size     First Load JS
    ├ ○ /                     1.41 kB  95.2 kB
    ├ ○ /_not-found            871 B    87.9 kB
    ├ ƒ /about                408 B    94.2 kB
    ├ ○ /ISR                  408 B    94.2 kB
    ├ ○ /main                 171 B     94 kB
    ├ ○ /SSG                  742 B    94.6 kB
    ├ ƒ /SSR                  408 B    94.2 kB
    └ ƒ /SSR2                 408 B    94.2 kB

    First Load JS shared by all        87.1 kB
    ├ chunks/23-9e48354688865fa0.js    31.5 kB
    ├ chunks/fd9d1056-62aaf4b921c84028.js  53.6 kB
    └ other shared chunks (total)       1.91 kB

    ○ (Static)   prerendered as static content  
    ƒ (Dynamic)  server-rendered on demand
  ```

&nbsp;
* 당연하게도 사용자가 페이지를 요청할 때 사전에 생성된 html을 그대로 준다고 가정하면 사용자 입장에서 더 빠르게 페이지를 볼 수 있습니다.

  1. SSG와 ISR로만 구현된 경우 : 사용자 Request > 노드서버에서 사전에 만들어둔 html Response
  2. SSR 요소가 들어간 경우 :\*\*\*\* 사용자 Request > 노드서버에서 자바스크립트 파일을 기준으로 html 생성(이 과정에서 API 요청을 할수도 있고 노드 자원을 사용하기도 함) > html Response

&nbsp;
* **여기서 가장 중요한 내용은 page.tsx 파일 내부의 SSR 요소가 단 하나라도 존재하는 경우 정적 html을 Response 해주는 것이 아닌 동적 페이지를 생성하여 Response 해준다는 것입니다.**

  1. SSR 요소가 많은 경우 페이지 생성이 느려질 수 밖에 없고, 그만큼 사용자에게 페이지를 늦게 전달해준다는 의미로 해석됩니다.

&nbsp;
* 빌드된 page.js 파일을 확인해보면 고정값인 태그들이나 정적 요소는 하드 타이핑 된 것을 확인 가능합니다. 이 부분은 페이지 생성에 시간을 최대한 아끼려고 하는 NEXT.js의 의도로 추측됩니다.

  1. **("div",{children:\[s.jsx("h1",{children:"About Page"}),(0,s.jsxs)** 이런 식으로 js에서 바로 html로 변경이 가능하게끔 되어 있습니다.
  2. 하지만 동적인 요소가 필요한 경우에는 항상 API를 요청 또는 자원을 사용하는것을 확인할 수 있습니다.
  3. **따라서 동적인 요소라 할지라도 노드JS의 자원 즉, 프로젝트 디렉토리 내부의 저장된 자원을 사용하는 경우 API 요청 없이 내부 자원을 사용하는 개념이기 때문에 API 호출 단계가 생략되어 더욱 빠르게 페이지를 렌더링 할 수 있게 됩니다. 현재 프로젝트에서 포스팅 내용을 출력할 때 API 요청이 아닌 저장된 MD파일을 가지고 페이지를 렌더링 하는 방식의 경우 시간을 절약하여 렌더링을 하는 효율적인 기법으로 설명이 됩니다.**

&nbsp;
* ISR의 작동 방식

  1. ISR 렌더링의 경우 주기에 맞춰 동적으로 페이지를 생성하여 저장합니다.
  2. page.tsx 내부에 ISR 요소가 존재한다면 주기마다 해당 데이터를 갱신한 뒤 이미 생성된 파일 html 또는 js의 값을 자동으로 바꿔줍니다.
  3. SSR보다 매우 효율적인 기법이 될 수 있기 때문에, 적극적으로 사용하는 것을 추천합니다.

&nbsp;

* slug를 사용한 동적 라우팅

  * NEXT.js 에서 slug를 사용하여 동적 라우팅을 구현하는 경우 해당 페이지는 무조건 동적 페이지로 구성되어 요청마다 새롭게 페이지를 생성하는 개념이 됩니다.
  * 동적 페이지로 구성되어 있어 퍼포먼스가 떨어 질 것으로 예상되지만 NEXT.js에서 빌드 타임 때 정적요소는 하드 타이핑된 고정값으로 설정해주기 때문에 퍼포먼스 저하가 적습니다.
  * **다만, slug를 사용하였을 때 페이지 자체를 정적 페이지로 구성하고 싶다면 generateStaticParams을 사용하여 빌드 타임 때 보여주고 싶은 정적 페이지를 모두 생성해야 합니다. (이 방법은 추후 외부 사용자가 접근하여 블로그 포스팅을 조회할 때 사용될 기법입니다.)**

&nbsp;
