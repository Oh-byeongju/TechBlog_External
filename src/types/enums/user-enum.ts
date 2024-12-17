// user 이름과 설명에 대한 enum
// 사용자 추가 시 사용

export const userName = {
    'admin': '관리자',
    '123@123.com': '관리자',
    'obj98@sjinc.co.kr': '오병주',
} as const;

export const profileCont = {
    'admin': '관리자 계정입니다.',
    '123@123.com': '관리자 계정입니다.',
    'obj98@sjinc.co.kr': '개발 3팀 오병주 사원',
} as const;

export const profilePicPath = {
    'admin': '/profile/adminProfile.png',
    '123@123.com': '/profile/adminProfile.png',
    'obj98@sjinc.co.kr': '/profile/obj98Profile.png',
} as const;