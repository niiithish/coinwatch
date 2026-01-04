"use client";

import { useEffect, useState } from "react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

interface News {
    source: {
        name: string;
    };
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}


// Helper function to format time ago
const formatTimeAgo = (dateString: string): string => {
    const now = new Date();
    const publishedDate = new Date(dateString);
    const diffInMs = now.getTime() - publishedDate.getTime();
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
        return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`;
    } else {
        return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`;
    }
};

// Helper function to truncate text
const truncateText = (text: string, maxLength: number): string => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + "...";
};

// Badge variant styles for different tickers
const getBadgeVariantClass = (index: number): string => {
    const variants = [
        "!bg-emerald-600/20 !text-emerald-400 !border-emerald-500/30",
        "!bg-amber-600/20 !text-amber-400 !border-amber-500/30",
        "!bg-blue-600/20 !text-blue-400 !border-blue-500/30",
        "!bg-purple-600/20 !text-purple-400 !border-purple-500/30",
        "!bg-rose-600/20 !text-rose-400 !border-rose-500/30",
        "!bg-cyan-600/20 !text-cyan-400 !border-cyan-500/30",
    ];
    return variants[index % variants.length];
};

const NewsCard = ({
    news,
    ticker,
    colorIndex,
}: {
    news: News;
    ticker?: string;
    colorIndex: number;
}) => {
    return (
        <Card className="group flex h-full flex-col transition-all duration-300 hover:ring-foreground/20 hover:shadow-lg hover:shadow-black/20">
            <CardHeader className="gap-3">
                {/* Ticker Badge */}
                {ticker && (
                    <Badge
                        variant="outline"
                        className={`w-fit rounded-md uppercase tracking-wide ${getBadgeVariantClass(colorIndex)}`}
                    >
                        {ticker}
                    </Badge>
                )}

                {/* Title */}
                <CardTitle className="line-clamp-2 text-sm leading-snug transition-colors group-hover:text-foreground">
                    {truncateText(news.title, 80)}
                </CardTitle>

                {/* Source and Time */}
                <CardDescription className="flex items-center gap-2">
                    <span className="font-medium">{news.source.name}</span>
                    <span className="text-muted-foreground/50">•</span>
                    <span>{formatTimeAgo(news.publishedAt)}</span>
                </CardDescription>
            </CardHeader>

            <CardContent className="flex-1">
                {/* Description */}
                <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {truncateText(news.description || news.content, 150)}
                </p>
            </CardContent>

            <CardFooter>
                {/* Read More Link */}
                <a
                    href={news.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-500 transition-all duration-200 hover:gap-2.5 hover:text-amber-400"
                >
                    Read More
                    <HugeiconsIcon icon={ArrowRight02Icon} className="h-4 w-4" />
                </a>
            </CardFooter>
        </Card>
    );
};

// Skeleton card for loading state
const NewsCardSkeleton = () => {
    return (
        <Card className="flex h-full flex-col">
            <CardHeader className="gap-3">
                <Skeleton className="h-5 w-16 rounded-md" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-4 w-3/4" />
            </CardHeader>
            <CardContent className="flex-1">
                <Skeleton className="h-16 w-full" />
            </CardContent>
            <CardFooter>
                <Skeleton className="h-5 w-24" />
            </CardFooter>
        </Card>
    );
};

const WatchlistNews = () => {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;

        const fetchNews = async () => {
            try {
                if (isMounted) setLoading(true);
                setError(null);

                const response = await fetch(
                    `/api/newsapi?q=${encodeURIComponent("crypto")}`
                );

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    throw new Error(errorData.error || "Failed to fetch news");
                }

                const data = await response.json();
                if (isMounted) {
                    setNews(data.articles?.slice(0, 8) || []);
                }
            } catch (err) {
                console.error("Error fetching news:", err);
                if (isMounted) {
                    setError(err instanceof Error ? err.message : "Failed to load news");
                    setNews([]);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        fetchNews();

        return () => {
            isMounted = false;
        };
    }, []);

    // Loading state
    if (loading) {
        return (
            <div className="w-full">
                <h2 className="mb-6 text-xl font-semibold">Latest News</h2>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {[...Array(8)].map((_, i) => (
                        <NewsCardSkeleton key={i} />
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="w-full">
                <h2 className="mb-6 text-xl font-semibold">Latest News</h2>
                <Card className="border-destructive/20 bg-destructive/5">
                    <CardContent className="flex items-center justify-center py-12">
                        <p className="text-sm text-destructive">{error}</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Empty state
    if (news.length === 0) {
        return (
            <div className="w-full">
                <h2 className="mb-6 text-xl font-semibold">Latest News</h2>
                <Card>
                    <CardContent className="flex items-center justify-center py-12">
                        <p className="text-sm text-muted-foreground">No news available</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Generate mock tickers for visual effect (in real app, this would come from data)
    const mockTickers = [
        "BTC",
        "ETH",
        "SOL",
        "XRP",
        "ADA",
        "DOGE",
        "LINK",
        "AVAX",
    ];

    return (
        <div className="w-full">
            <h2 className="mb-6 text-xl font-semibold">Latest News</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {news.map((item, index) => (
                    <NewsCard
                        key={item.url}
                        news={item}
                        ticker={mockTickers[index % mockTickers.length]}
                        colorIndex={index}
                    />
                ))}
            </div>
        </div>
    );
};

export default WatchlistNews;
