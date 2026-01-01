"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { TableBody, TableCell, TableHead, TableHeader, TableRow, Table } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface TrendingCoinItem {
  id: string;
  coin_id: number;
  name: string;
  symbol: string;
  market_cap_rank: number;
  thumb: string;
  small: string;
  large: string;
  slug: string;
  price_btc: number;
  score: number;
  data: {
    price: number;
    price_btc: string;
    price_change_percentage_24h: Record<string, number>;
    market_cap: string;
    market_cap_btc: string;
    total_volume: string;
    total_volume_btc: string;
    sparkline: string;
    content: string | null;
  };
}

interface TrendingCoin {
  item: TrendingCoinItem;
}

interface TrendingResponse {
  coins: TrendingCoin[];
}

const TrendingToday = () => {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch("/api/coingecko?endpoint=/search/trending");
        const result: TrendingResponse = await response.json();
        setTrending(result.coins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrending();
  }, []);

  return <div className="max-h-[60vh] overflow-y-scroll">
    <Card>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>24 Chart</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trending.map((coin) => (
              <TableRow key={coin.item.id} className="text-sm">
                <TableCell className="align-center">
                  <div className="flex flex-row gap-2 items-center">
                    <Image src={coin.item.small} alt={coin.item.name} width={24} height={24} className="rounded-full" />
                    {coin.item.name}
                  </div>
                </TableCell>
                <TableCell className="align-center">{coin.item.symbol}</TableCell>
                <TableCell className="align-center">${coin.item.data.price.toFixed(2)}</TableCell>
                <TableCell className={`align-center ${coin.item.data.price_change_percentage_24h.usd > 0 ? "text-green-500" : "text-red-500"}`}>{coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%</TableCell>
                <TableCell className="align-center"><Image src={coin.item.data.sparkline} alt={coin.item.name} width={120} height={120} className="rounded-full" style={{ height: "auto" }} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>;
};

export default TrendingToday;
