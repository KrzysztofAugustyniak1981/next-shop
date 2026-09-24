import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { verifySessionToken } from "@/lib/auth";

export async function GET() {
    const cookieStore = await cookies();
    const session = cookieStore.get("session");

    if (!session) {
        return NextResponse.json(
            {
                message: "Not authenticated",
            },
            {
                status: 401,
            }
        );
    }

    try {
        const user = await verifySessionToken(session.value);

        return NextResponse.json({
            user: {
                id: user.userId,
                email: user.email,
            },
        });
    } catch {
        return NextResponse.json(
            {
                message: "Invalid session",
            },
            {
                status: 401,
            }
        );
    }
}