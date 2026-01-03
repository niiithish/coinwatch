"use client";

import type { ChartData } from "chart.js";
import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { LineChart } from "@/components/ui/line-chart";

interface PriceChartProps {
    coinId: string;
    coinName?: string;
    coinSymbol?: string;
    coinImage?: string;
    currentPrice?: number;
    priceChange24h?: number;
    priceChangePercentage24h?: number;
}

type TimeFrame = "1" | "7" | "30" | "365";

const timeFrameLabels: Record<TimeFrame, string> = {
    "1": "1D",
    "7": "5D",
    "30": "1M",
    "365": "1Y",
};

const formatCurrency = (value: number | undefined) => {
    if (value === undefined) return "N/A";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: value < 1 ? 6 : 2,
    }).format(value);
};

const formatPriceChange = (value: number | undefined) => {
    if (value === undefined) return { text: "N/A", isPositive: true };
    const isPositive = value >= 0;
    const text = `${isPositive ? "+" : ""}${value.toFixed(2)}`;
    return { text, isPositive };
};

const formatPercentage = (value: number | undefined) => {
    if (value === undefined) return { text: "N/A", isPositive: true };
    const isPositive = value >= 0;
    const text = `(${isPositive ? "+" : ""}${value.toFixed(2)}%)`;
    return { text, isPositive };
};

const PriceChart = ({
    coinId,
    coinName,
    coinSymbol,
    coinImage,
    currentPrice,
    priceChange24h,
    priceChangePercentage24h,
}: PriceChartProps) => {
    const [selectedTimeFrame, setSelectedTimeFrame] = useState<TimeFrame>("7");
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [chartData, setChartData] = useState<ChartData<"line">>({
        labels: [],
        datasets: [
            {
                label: "Price",
                data: [],
                fill: false,
                borderColor: "#0FEDBE",
                backgroundColor: "#0FEDBE",
                tension: 0.4,
                pointRadius: 0,
                pointHoverRadius: 4,
            },
        ],
    });

    const fetchChartData = useCallback(async () => {
        if (!coinId) return;

        try {
            setIsLoading(true);
            setError(null);

            // Determine interval based on timeframe
            const interval = selectedTimeFrame === "1" ? "" : "&interval=daily";

            const response = await fetch(
                `/api/coingecko?endpoint=/coins/${coinId}/market_chart&vs_currency=usd&days=${selectedTimeFrame}${interval}`
            );

            if (!response.ok) {
                throw new Error("Failed to fetch chart data");
            }

            const result = await response.json();

            if (!(result.prices && Array.isArray(result.prices))) {
                throw new Error("Invalid response format");
            }

            // Format labels based on timeframe
            let labels = result.prices.map((item: [number, number]) => {
                const date = new Date(item[0]);
                if (selectedTimeFrame === "1") {
                    return date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                    });
                }
                return date.toLocaleDateString("en-US", {
                    day: "numeric",
                    month: "short",
                });
            });

            let prices = result.prices.map((item: [number, number]) => item[1]);

            // Remove duplicate last data point if it has same date as previous
            if (labels.length > 1 && labels.at(-1) === labels.at(-2)) {
                labels = labels.slice(0, -1);
                prices = prices.slice(0, -1);
            }

            const lineColor = "#0FEDBE";

            setChartData({
                labels,
                datasets: [
                    {
                        label: "Price",
                        data: prices,
                        fill: false,
                        borderColor: lineColor,
                        backgroundColor: lineColor,
                        tension: 0.4,
                        pointRadius: 0,
                        pointHoverRadius: 4,
                    },
                ],
            });
        } catch (err) {
            console.error("Error fetching chart data:", err);
            setError("Failed to load chart data");
        } finally {
            setIsLoading(false);
        }
    }, [coinId, selectedTimeFrame, priceChangePercentage24h]);

    useEffect(() => {
        fetchChartData();
    }, [fetchChartData]);

    const priceChangeFormatted = formatPriceChange(priceChange24h);
    const percentageFormatted = formatPercentage(priceChangePercentage24h);
    const isPositive = priceChangePercentage24h !== undefined ? priceChangePercentage24h >= 0 : true;

    return (
        <Card className="w-full border-none bg-card/50 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                {/* Left side - Coin info */}
                <div className="flex items-center gap-4">
                    {coinImage && (
                        <img
                            src={coinImage}
                            alt={coinName ?? "Coin"}
                            className="h-12 w-12 rounded-lg"
                        />
                    )}
                    <div className="flex flex-col">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">
                                {coinName}
                            </span>
                            <span>•</span>
                            <span className="uppercase">{coinSymbol}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-2xl font-bold text-foreground">
                                {formatCurrency(currentPrice)}
                            </span>
                            <span
                                className={`text-sm font-medium ${priceChangeFormatted
                                    ? "text-[#0FEDBE]"
                                    : "text-[#FF495B]"
                                    }`}
                            >
                                {priceChangeFormatted.text}{" "}
                                {percentageFormatted.text}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right side - Time frame selector */}
                <div className="flex items-center gap-1 rounded-lg bg-background/50 p-1">
                    {(Object.keys(timeFrameLabels) as TimeFrame[]).map(
                        (timeFrame) => (
                            <button
                                key={timeFrame}
                                type="button"
                                onClick={() => setSelectedTimeFrame(timeFrame)}
                                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200 ${selectedTimeFrame === timeFrame
                                    ? "bg-primary text-primary-foreground"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    }`}
                            >
                                {timeFrameLabels[timeFrame]}
                            </button>
                        )
                    )}
                </div>
            </CardHeader>

            <CardContent className="p-4">
                {isLoading && (
                    <div className="flex h-[45vh] items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <div className="h-8 w-8 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                            <span>Loading chart...</span>
                        </div>
                    </div>
                )}

                {error && !isLoading && (
                    <div className="flex h-[45vh] items-center justify-center">
                        <div className="text-center text-muted-foreground">
                            <p className="text-lg font-medium text-destructive">
                                {error}
                            </p>
                            <button
                                type="button"
                                onClick={() => fetchChartData()}
                                className="mt-2 text-sm text-primary hover:underline"
                            >
                                Try again
                            </button>
                        </div>
                    </div>
                )}

                {!isLoading && !error && (
                    <div style={{ height: "45vh" }}>
                        <LineChart
                            className="h-full w-full"
                            data={chartData}
                            gradientColor="#0FEDBE"
                        />
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default PriceChart;