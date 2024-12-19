// user 이름과 설명에 대한 enum
// 사용자 추가 시 사용

export const userName = {
    'admin': '관리자',
    '123@123.com': '관리자',
    'obj98@sjinc.co.kr': '오병주',
    'kjsa@sjinc.co.kr': '사경진',
    'dade@naver.com': '집사21년차'
} as const;

export const profileCont = {
    'admin': '관리자 계정입니다.',
    '123@123.com': '관리자 계정입니다.',
    'obj98@sjinc.co.kr': '개발 3팀 오병주 사원',
    'kjsa@sjinc.co.kr': '세정아이앤씨 개발3팀',
    'dade@naver.com': '카피바라 페이스트바라'
} as const;

export const profilePicPath = {
    'admin': '/profile/adminProfile.png',
    '123@123.com': '/profile/adminProfile.png',
    'obj98@sjinc.co.kr': '/profile/obj98Profile.png',
    'kjsa@sjinc.co.kr': '/profile/kjsaProfile.jpg',
    'dade@naver.com': '/profile/dadeProfile.png'
} as const;