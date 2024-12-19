---
title: '[Next.js] CSR, SSR, ISR, SSG, 하이브리드(Hybrid) 렌더링, 하이드레이션(Hydration)'
description: >+
  React.js를 활용한 웹 애플리케이션 개발에서의 렌더링 방식에 대한 설명입니다. Client-Side Rendering(CSR),
  Server-Side Rendering(SSR), Incremental Static Regeneration(ISR), Static Site
  Generation(SSG) 각각의 장단점을 비교하고, Next.js의 하이브리드 렌더링 방식과 하이드레이션 개념을 설명합니다. 각 렌더링
  방식의 특성과 적절한 사용 사례를 제시하여 개발자가 선택할 수 있도록 안내합니다. 
thumbnail: "/assets/blog/NextJs-Rendering/NextJs.jpg"
keywords: >-
  ReactJS, CSR, SSR, ISR, SSG, NextJS, HybridRendering, Hydration,
  WebDevelopment, FrontendDevelopment
author: kjsa@sjinc.co.kr
datePublished: '2024-12-07 21:08:57'
dateModified: '2024-12-07 21:08:57'
---


![1.00](/assets/blog/NextJs-Rendering/NextJs.jpg)

&nbsp;

***

&nbsp;

## CSR

React.js 만으로 애플리케이션을 개발하면 보통 이를 SPA(Single Page Application)라고 부릅니다.\
이는, CSR 로 동작합니다.

&nbsp;

**C**lient**S**ide**R**endering

* 렌더링을 하는 주체가 클라이언트(보통 웹에서 의미하는 클라이언트는 브라우저를 말합니다.)
* HTML, JS, CSS 등을 서버로부터 받아서 클라이언트측에서 DOM 요소를 조작하여 내용을 출력하는걸 클라이언트 사이드 렌더링이라고 부름

초기에, 빈 HTML 을 응답받습니다.

빈 HTML 파일 로딩이 끝나고, React.js 등에 리소스 로딩이 끝나서 실행이되면 렌더링이 일어납니다.

&nbsp;

*장점*

* 한번 로딩 되면, 빠른 UX 제공\
  Ajax 를 활용하여 부분적으로 필요한 내용만 불러와서 업데이트를 하기 때문에 마치 앱을 사용하는 경험을 제공해줌(서버 요청 이후 화면이 깜빡이면서 다시 렌더링을 하는게 아님)
* 서버의 부하가 적음\
  부분적으로 데이터를 불러와서 UI를 업데이트 하기때문에, 상대적으로 서버의 부하가 적음

&nbsp;

*단점*

* 페이지 로딩 시간이 김\
  서버로부터 필요한 자원을 응답받고나서, 렌더링을 하기 때문에 서버로 부터 응답시간이 지연되면 초기 구동 속도가 느려짐
* 자바스크립트 활성화가 필수\
  사용자가 JS 사용 옵션을 비활성화 해버린다면, React.js 로 작성된 SPA는 정상적으로 동작하지 않음
* SEO 이슈\
  초기에 빈 HTML 파일만 받아서 사용하기 때문에 크롤러(검색bot)들이 어떤 내용이 있는지 확인이 어려움 + 페이지마다 meta 태그등에 정버도 따로 설정이 불가능\
  정리하면, 크롤러가 아 해당 사이트는 그냥 비어있구나라고 인식을함\
  최근 검색엔진은 SPA도 검색엔진에 색인이 되게끔 처리를 해주고 있다.
* 보안에 취약함\
  클라이언트에 모든 코드를 내려받아 실행하기 때문에, 중요한 로직 및 key 값이 노출 될 수 있음
* CDN 캐시가 안됨\
  SPA는 클라이언트측에서 렌더링이 시시각각 변화하기 때문에 이러한 부분이 캐싱이 되지 않는다.(동적으로 생성되는 콘텐츠는 캐싱이 이루어지지 않음)

&nbsp;

![1.00](/assets/blog/NextJs-Rendering/React.jpg)

&nbsp;

React.js 로 프로젝트 생성 후, localhost 요청에 대한 응답을 보면 HTML 내용이 존재하지 않는다.\
이후에 bundle.js 등에 리소스를 다운로드 받고 로딩이 완료되면 첫 화면이 렌더링 되는것을 확인이 가능하다.

## SSR

**S**erver**S**ide**R**endering

렌더링 주체가, 서버다. 즉, 서버에서 HTML을 생성하여 이를 응답해준다.\
SSR은 우리가 예전 일체형 아키텍쳐형태로 웹개발 하던 시절에 주로 사용하는 형태였다.(Spring + JSP)

&nbsp;

*장점*

* 페이지 로딩 시간이 빠름
* 자바스크립트를 필요로 하지 않음
* SEO 에 좋음
* 보안이 뛰어남
* 실시간 데이터를 보여줌
* 사용자별 필요한 데이터를 사용(mypage 등)

&nbsp;

*단점*

* 요청 마다 HTML을 생성하기 때문에, SSG 또는 ISR에 비해 느림
* 너무 많은 요청으로 인해 서버의 과부하가 걸릴 수 있음
* CDN 캐시가 이루어지지 않음(매 요청마다 콘텐츠를 읽어와 HTML에 포함하여 렌더링 하기때문에 보통 cache를 하지 않음)
* 페이지 이동할때마다 화면이 깜빡임

&nbsp;

## ISR

**I**ncremental**S**tatic**R**egeneration

서버측에서 주기적으로 HTML을 서버에서 생성해두고 내려줌(처음 빌드 시점에 만들어두고, 설정한 주기마다 다시 렌더링하여 HTML을 생성해둔다)

&nbsp;

*장점*

* 페이지 로딩 시간이 빠름
* 자바스크립트를 필요로 하지 않음
* SEO 에 좋음
* 보안이 뛰어남
* CDN 캐시 가능
* 데이터가 주기적으로 업데이트가 이루어짐

&nbsp;

*단점*

* 실시간 데이터가 아님
* 사용자별 정보 제공의 어려움(mypage 같은걸 사용자별로 다 HTML을 미리 생성해 놓을순 없다)

&nbsp;

## SSG

**S**tatic**S**ite**G**eneration

서버에서 정적인 HTML을 미리 생성한다. 생성 시점은 Next.js 빌드시점

&nbsp;

*장점*

* 페이지 로딩 시간이 빠름
* 자바스크립트를 필요로 하지 않음
* SEO 에 좋음
* 보안이 뛰어남
* CDN 캐시 가능

&nbsp;

*단점*

* 정적인 내용
* 실시간 데이터가 아님
* 사용자별 정보 제공의 어려움(mypage 같은걸 사용자별로 다 HTML을 미리 생성해 놓을순 없다)

&nbsp;

generateStaticParams 함수를 사용하여, 데이터를 조회해와서 정적인 페이지 생성도 가능하다.

## 정리

* Next.js 는 기본적으로 SSG로 동작
* SSG와 SSR은 서버측에서 렌더링하는것은 맞지만, build 시점인지 rnntime 시점 인지에 대한 차이가 존재
* 어떤 렌더링 방식을 사용할지는 개발자가 선택하면 된다.
* 하나에 완벽한 렌더링 솔루션은 존재하지 않는다.
* Next.js 가 사랑받는 이유는 다양한 렌더링 방식 제공과 이를 적절히 혼합해서 사용이 가능하기 때문이다.

&nbsp;

## 하이브리드(Hybrid) 렌더링

Hybrid: 혼합

&nbsp;

특정 목적을 달성하기 위해 두개 이상의 기능이나 요소를 결합

Next.js 는 Hybrid Web App 이라고도 불리우는데, 성능 좋은 강력한 Web App 을 만들기 위해 두개 이상의 렌더링 방법을 사용하는것을 의미한다.

&nbsp;

예를 들어

&nbsp;

홈페이지는 ISR로\
about 페이지는 잘 변경되지 않기 때문에 SSG로\
사용자의 profile페이지는 CSR/SSR을 하이브리드해서 만들 수 있다.

&nbsp;

이처럼 한 애플리케이션에서 페이지의 특성에 따라 적절한 렌더링 방식을 체택해 만들 수 있고\
심지어는 하나의 페이지 내에서도 하이브리드가 가능하다.

&nbsp;

이렇게 처리하면 좋은점이 서버에서 HTML을 생성해서 내려주면 SEO에 유리하고, 서버에서 빠르게 HTML을 응답해줄수 있다. 그리고 CSR 로 처리되는 컴포넌트에 대한 JS만 다운이 이루어져서 동작하면 되기때문에 사용자는 좀 더 빠르게 애플리케이션 이용이 가능해진다.

&nbsp;

## 하이드레이션(Hydration)

수화시키다: 물로 가득 채우다, 물과 섞다

→ 물을 리액트로 생각하자.

&nbsp;

서버에서 사용자에게 응답해주는 HTML에 React로 채운다.

정적인 HTML을 받으면, JS가 연결이 되어있지 않기때문에 이벤트 및 인터렉션이 동작하지 않음

이후에 React 및 JS를 응답받아서 로딩이 되면 정적인 HTML에 React를 가득 채운다.

→ React 컴포넌트로 렌더링이 발생

&nbsp;

잘못 만들어진 Next.js 라던가 옛날버전 사용해보면 페이지 깜빡임이 발생을 하는데 해당 깜빡임이 리액트 컴포넌트 렌더링때문에 발생하는거임

1. Next.js 는 서버에서 컴포넌트를 읽어 HTML을 생성하고, 이를 클라이언트에 응답한다.
2. 클라이언트는 말그대로, 정적인 HTML을 전달받은거다. 여기에 React 로 작성한 자바스크립트 코드와 연결을 해줘야하는데 번들링된 JS도 같이 내려받는다.
3. 클라이언트는 전달받은 HTML을 hydrateRoot() 를 호출하여 렌더링된 HTML에 자바스크립트 코드를 연결시켜준다(React 로 채워주기)

&nbsp;

hydration 할 html과 react 렌더 트리의 불일치가 발생하면, hydration mismatch 에러를 발생 시킵니다. 수정이 되는경우 깜빡임이 발생하면서 UI가 업데이트가 이루어집니다만.. 공식문서에서는 반드시 고쳐야 하는 오류로 보고 이를 없애라고 권장하고 있습니다.

