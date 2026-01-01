import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { watchlist } from "@/lib/schema";

export async function GET() {
  try {
    const watchlistItems = await db.select().from(watchlist);
    return NextResponse.json(watchlistItems);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    return NextResponse.json(
      { error: "Failed to fetch watchlist" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const { coinId } = await request.json();

    if (!coinId) {
      return NextResponse.json(
        { error: "coinId is required" },
        { status: 400 }
      );
    }

    const newEntry = await db.insert(watchlist).values({ coinId }).returning();
    return NextResponse.json(newEntry[0], { status: 201 });
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    return NextResponse.json(
      { error: "Failed to add to watchlist" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { coinId } = await request.json();

    if (!coinId) {
      return NextResponse.json(
        { error: "coinId is required" },
        { status: 400 }
      );
    }

    await db.delete(watchlist).where(eq(watchlist.coinId, coinId));
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    return NextResponse.json(
      { error: "Failed to remove from watchlist" },
      { status: 500 }
    );
  }
}
