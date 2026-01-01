"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Card, CardContent } from "@/components/ui/card";

interface CoinData {
    id: string;
    symbol: string;
    name: string;
    image: {
        large: string;
    };
    market_data: {
        current_price: {
            usd: number;
        };
        price_change_24h: number;
        price_change_percentage_24h: number;
    };
}

const Watchlist = () => {
    const [coin, setCoin] = useState<CoinData | null>(null);

    useEffect(() => {
        const fetchWatchlist = async () => {
            try {
                const response = await fetch("/api/coingecko?endpoint=/coins/dogecoin");
                const data: CoinData = await response.json();
                setCoin(data);
            } catch (error) {
                console.log(error);
            }
        };
        fetchWatchlist();
    }, []);

    if (!coin) return null;

    return (
        <Card className="grid grid-cols-3 gap-4 p-4 h-full items-start">
            <Card className="bg-secondary/20">
                <CardContent className="flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                        <div className="rounded-2xl">
                            <Image src={coin.image.large} alt={coin.name} width={32} height={32} className="rounded-lg" />
                        </div>
                        <div className="rounded-full">
                            <HugeiconsIcon icon={StarIcon} size={20} />
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <h3 className="text-foreground/80 font-regular text-sm">{coin.name}</h3>
                        <div className="text-2xl font-semibold">
                            ${coin.market_data.current_price.usd.toFixed(4)}
                        </div>
                        <div className={`flex items-center gap-1.5 text-sm font-medium ${coin.market_data.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}`}>
                            <span>{coin.market_data.price_change_percentage_24h > 0 ? "+" : ""}{coin.market_data.price_change_24h.toFixed(4)}</span>
                            <span className="opacity-90">({coin.market_data.price_change_percentage_24h > 0 ? "+" : ""}{coin.market_data.price_change_percentage_24h.toFixed(4)}%)</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Card>
    );
};

export default Watchlist;