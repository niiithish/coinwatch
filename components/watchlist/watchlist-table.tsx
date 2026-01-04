"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { StarIcon } from "@hugeicons/core-free-icons";

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

const formatCurrency = (value: number | undefined) => {
  if (value === undefined) return "N/A";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: value !== undefined && value < 1 ? 8 : 2,
  }).format(value);
};

const parseFormattedNumber = (value: string | undefined): number | undefined => {
  if (!value) return undefined;
  // Remove currency symbols, commas, and whitespace
  const cleaned = value.replace(/[$,\s]/g, "");
  const num = parseFloat(cleaned);
  return isNaN(num) ? undefined : num;
};

const WatchlistTable = () => {
  const [trending, setTrending] = useState<TrendingCoin[]>([]);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const response = await fetch(
          "/api/coingecko?endpoint=/search/trending"
        );
        const result: TrendingResponse = await response.json();
        setTrending(result.coins);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTrending();
  }, []);

  return (
    <Card className="overflow-y-scroll w-full">
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Symbol</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>24h Change</TableHead>
              <TableHead>Market Cap</TableHead>
              <TableHead>24h Volume</TableHead>
              <TableHead>Alert</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trending.map((coin) => (
              <TableRow className="text-sm" key={coin.item.id}>
                <TableCell className="align-center">
                  <Button variant="ghost" className="rounded-full">
                    <HugeiconsIcon icon={StarIcon} size={12} />
                  </Button>
                </TableCell>
                <TableCell className="align-center">
                  <Link href={`/coin/${coin.item.slug}`}>
                    <div className="flex flex-row items-center gap-2">
                      <p className="hover:underline">{coin.item.name}</p>
                    </div>

                  </Link>
                </TableCell>
                <TableCell className="align-center">
                  {coin.item.symbol}
                </TableCell>
                <TableCell className="align-center">
                  ${coin.item.data.price.toFixed(2)}
                </TableCell>
                <TableCell
                  className={`align-center ${coin.item.data.price_change_percentage_24h.usd > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  {coin.item.data.price_change_percentage_24h.usd.toFixed(2)}%
                </TableCell>
                <TableCell className="align-center">
                  {formatCurrency(parseFormattedNumber(coin.item.data.market_cap))}
                </TableCell>
                <TableCell className="align-center">
                  {formatCurrency(parseFormattedNumber(coin.item.data.total_volume))}
                </TableCell>
                <TableCell className="align-center">
                  <Button>Add Alert</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default WatchlistTable;
