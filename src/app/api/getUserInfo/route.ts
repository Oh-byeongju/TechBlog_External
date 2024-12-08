import { NextRequest, NextResponse } from 'next/server';

import {userName, profileCont, profilePicPath} from "@/types/enums/user-enum";

export async function GET(req: NextRequest) {
    const userId = req.nextUrl.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'Query parameter "userId" is required and should be a string' }, { status: 400 });
    }

    try {
        const name = userName[userId as keyof typeof userName];
        const profileContent = profileCont[userId as keyof typeof profileCont];
        const profilePicture = profilePicPath[userId as keyof typeof profilePicPath];

        if (!name || !profileContent || !profilePicture) {
            return NextResponse.json({ error: `User with userId "${userId}" not found` }, { status: 404 });
        }

        const user = {
            userId: userId,
            userName: name,
            profilePicPath: profilePicture,
            profileCont: profileContent
        };

        return NextResponse.json(user, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
    }
}
