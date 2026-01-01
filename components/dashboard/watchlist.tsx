"use client";

import { Add01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

interface CoinData {
  id: string;
  symbol: string;
  name: string;
  image?:
  | {
    thumb?: string;
    small?: string;
    large?: string;
  }
  | string;
  market_data?: {
    current_price?: {
      usd?: number;
    };
    price_change_24h?: number;
    price_change_percentage_24h?: number;
  };
}

interface WatchlistItem {
  id: number;
  coinId: string;
}

const Watchlist = () => {
  const [coins, setCoins] = useState<CoinData[]>([]);

  const getImageUrl = (coin: CoinData): string => {
    if (typeof coin.image === "string") {
      return coin.image;
    }
    if (coin.image) {
      return coin.image.small || coin.image.large || coin.image.thumb || "";
    }
    return "";
  };
  const [watchlistItems, setWatchlistItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCoinId, setNewCoinId] = useState("");
  const [addingCoin, setAddingCoin] = useState(false);

  const fetchWatchlist = async () => {
    try {
      const response = await fetch("/api/watchlist");
      const items: WatchlistItem[] = await response.json();
      setWatchlistItems(items);
    } catch (error) {
      console.error("Error fetching watchlist:", error);
    }
  };

  const fetchCoinDetails = async () => {
    if (watchlistItems.length === 0) {
      setCoins([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const coinPromises = watchlistItems.map(async (item) => {
      try {
        const response = await fetch(
          `/api/coingecko?endpoint=/coins/${item.coinId}`
        );
        const data: CoinData = await response.json();
        return data;
      } catch (error) {
        console.error(`Error fetching coin ${item.coinId}:`, error);
        return null;
      }
    });

    const results = await Promise.all(coinPromises);
    const validCoins = results.filter(
      (coin): coin is CoinData =>
        coin !== null &&
        coin.id !== undefined &&
        coin.name !== undefined &&
        coin.market_data?.current_price?.usd !== undefined
    );
    setCoins(validCoins);
    setLoading(false);
  };

  useEffect(() => {
    fetchWatchlist();
  }, []);

  useEffect(() => {
    if (watchlistItems.length > 0) {
      fetchCoinDetails();
    } else {
      setLoading(false);
    }
  }, [watchlistItems]);

  const handleAddCoin = async () => {
    if (!newCoinId.trim()) return;

    setAddingCoin(true);
    try {
      const response = await fetch("/api/watchlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinId: newCoinId.toLowerCase() }),
      });

      if (response.ok) {
        setDialogOpen(false);
        setNewCoinId("");
        await fetchWatchlist();
      } else {
        console.error("Failed to add coin. Please check the coin ID.");
      }
    } catch (error) {
      console.error("Error adding coin:", error);
    } finally {
      setAddingCoin(false);
    }
  };

  const handleRemoveCoin = async (coinId: string) => {
    try {
      const response = await fetch("/api/watchlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ coinId }),
      });

      if (response.ok) {
        await fetchWatchlist();
      }
    } catch (error) {
      console.error("Error removing coin:", error);
    }
  };


  return (
    <Card className="grid h-full grid-cols-3 items-start gap-4 p-4">
      {coins.map((coin) => (
        <Card key={coin.id} className="bg-secondary/20">
          <CardContent className="flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="rounded-sm">
                <Image
                  alt={coin.name}
                  className="rounded-sm"
                  height={32}
                  src={getImageUrl(coin)}
                  width={32}
                />
              </div>
              <div className="flex gap-2">
                <div className="rounded-full">
                  <HugeiconsIcon icon={StarIcon} size={20} />
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-regular text-foreground/80 text-sm">
                {coin.name}
              </h3>
              {coin.market_data?.current_price?.usd ? (
                <div className="font-semibold text-xl">
                  ${coin.market_data.current_price.usd.toFixed(2)}
                </div>
              ) : (
                <div className="font-semibold text-xl">Loading...</div>
              )}
              {coin.market_data?.price_change_percentage_24h !== undefined ? (
                <div
                  className={`flex items-center gap-1.5 font-medium text-sm ${coin.market_data.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}`}
                >
                  <span>
                    {coin.market_data.price_change_percentage_24h > 0 ? "+" : ""}
                    {coin.market_data.price_change_24h?.toFixed(2)}
                  </span>
                  <span className="opacity-90">
                    ({coin.market_data.price_change_percentage_24h > 0 ? "+" : ""}
                    {coin.market_data.price_change_percentage_24h.toFixed(2)}%)
                  </span>
                </div>
              ) : null}
            </div>
          </CardContent>
        </Card>
      ))}
      {watchlistItems.length < 6 && (
        <Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
          <DialogTrigger className="cursor-pointer rounded-sm bg-primary">
            Add Coin
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add to Watchlist</DialogTitle>
              <DialogDescription>
                Enter the CoinGecko coin ID (e.g., "bitcoin", "ethereum",
                "dogecoin")
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <Input
                onChange={(e) => setNewCoinId(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleAddCoin();
                  }
                }}
                placeholder="Coin ID (e.g., bitcoin)"
                value={newCoinId}
              />
            </div>
            <DialogFooter>
              <Button
                disabled={addingCoin || !newCoinId.trim()}
                onClick={handleAddCoin}
              >
                {addingCoin ? "Adding..." : "Add Coin"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>)}
    </Card>
  );
};

export default Watchlist;
