"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "../ui/badge";
import type { ChartData } from "chart.js";
import { LineChart } from "@/components/ui/line-chart";

interface Coin {
    id: string;
    name: string;
    symbol: string;
    current_price: number;
    price_change_percentage_24h: number;
    image: string;
}


const MarkerSummary = () => {
    const [id, setId] = useState("smart-contract-platform");
    const [coins, setCoins] = useState<Coin[]>([]);
    const [coin, setCoin] = useState('bitcoin');

    const [chartData, setChartData] = useState<ChartData<'line'>>({
        labels: [],
        datasets: [
            {
                label: "Price",
                data: [],
                fill: false,
                borderColor: "#46B49E",
                backgroundColor: "#46B49E",
                tension: 0,
                pointRadius: 0,
                pointHoverRadius: 0,
            },
        ],
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `/api/coingecko?endpoint=/coins/markets&category=${id}&vs_currency=usd&per_page=3&page=1`
                );
                const result = await response.json();
                console.log(result);
                // Validate that result is an array before setting state
                if (Array.isArray(result)) {
                    setCoins(result);
                    if (result.length > 0) {
                        setCoin(result[0].id);
                    }
                } else {
                    console.error("API returned non-array response:", result);
                    setCoins([]);
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
                console.log(id);
                setCoins([]);
            }
        };
        fetchData();
    }, [id]);

    useEffect(() => {
        const fetchPrice = async (coin: string) => {
            try {
                const response = await fetch(
                    `/api/coingecko?endpoint=/coins/${coin}/market_chart&vs_currency=usd&days=7&interval=daily`
                );
                const result = await response.json();

                let labels = result.prices.map((item: [number, number]) => {
                    const date = new Date(item[0]);
                    return date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
                });

                let prices = result.prices.map((item: [number, number]) => item[1]);

                // Remove last data point if it has same date as previous (API returns duplicate for current day)
                if (labels.length > 1 && labels[labels.length - 1] === labels[labels.length - 2]) {
                    labels = labels.slice(0, -1);
                    prices = prices.slice(0, -1);
                }

                setChartData({
                    labels: labels,
                    datasets: [
                        {
                            label: "Price",
                            data: prices,
                            fill: false,
                            borderColor: "#46B49E",
                            backgroundColor: "#46B49E",
                            tension: 0,
                            pointRadius: 0,
                            pointHoverRadius: 0,
                        },
                    ],
                });
            } catch (error) {
                console.error("Failed to fetch data:", error);
            }
        };
        fetchPrice(coin);
    }, [coin]);

    return (
        <div className="flex flex-1 w-full">
            <Card className="w-full">
                <CardHeader>
                    <Tabs value={id}>
                        <TabsList className="shadow-sm">
                            <TabsTrigger
                                value="smart-contract-platform"
                                onClick={() => setId("smart-contract-platform")}
                            >
                                Layer 1
                            </TabsTrigger>
                            <TabsTrigger value="artificial-intelligence" onClick={() => setId("artificial-intelligence")}>
                                Artificial Intelligence
                            </TabsTrigger>
                            <TabsTrigger value="decentralized-perpetuals" onClick={() => setId("decentralized-perpetuals")}>
                                Perpetuals Platform
                            </TabsTrigger>
                            <TabsTrigger
                                value="proof-of-stake-pos"
                                onClick={() => setId("proof-of-stake-pos")}
                            >
                                Proof of Stake (PoS)
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value={id} className="flex flex-col w-full gap-5">
                            <div className="flex">
                                <LineChart
                                    data={chartData}
                                    className="h-52 w-full"
                                />
                            </div>
                            <div className="flex justify-between gap-5 items-center">
                                {coins.map((item: Coin) => (
                                    <Card className={`border-0 cursor-pointer w-full ${item.id === coin ? "bg-secondary/20 shadow-sm" : ""}`} key={item.id} onClick={() => {
                                        setCoin(item.id);
                                    }}>
                                        <CardHeader className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Image
                                                    src={item.image}
                                                    alt={item.name}
                                                    width={20}
                                                    height={20}
                                                />
                                                <p>{item.name}</p>
                                            </div>
                                            <Badge className="uppercase" variant="secondary">
                                                {item.symbol}
                                            </Badge>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="flex gap-2 items-center">
                                                <p className="font-semibold text-lg">
                                                    ${item.current_price}
                                                </p>
                                                <p
                                                    className={`${item.price_change_percentage_24h > 0 ? "text-green-500" : "text-red-500"}`}
                                                >
                                                    {item.price_change_percentage_24h.toFixed(2)}%
                                                </p>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>
                    </Tabs>
                </CardHeader>
            </Card>
        </div >
    );
};

export default MarkerSummary;