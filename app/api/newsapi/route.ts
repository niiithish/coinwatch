import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") || "crypto";
  const page = Number.parseInt(searchParams.get("page") || "1", 10);
  const pageSize = Number.parseInt(searchParams.get("pageSize") || "12", 10);

  try {
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&page=${page}&pageSize=${pageSize}&apiKey=${process.env.NEWS_API_KEY}`,
      {
        cache: "no-store", // Disable caching for fresh results
        next: { revalidate: 0 },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      articles: data.articles,
      totalResults: data.totalResults,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("News API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
