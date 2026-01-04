"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { PencilEdit01Icon, Delete02Icon } from "@hugeicons/core-free-icons";
import { getAlerts, deleteAlert, type Alert } from "@/lib/alerts";
import { toast } from "sonner";
import Image from "next/image";

// Helper to format condition for display
const formatCondition = (condition: string): string => {
    switch (condition) {
        case "greater_than":
            return ">";
        case "less_than":
            return "<";
        case "equal_to":
            return "=";
        case "greater_than_or_equal":
            return "≥";
        case "less_than_or_equal":
            return "≤";
        default:
            return condition;
    }
};

// Helper to format frequency for display
const formatFrequency = (frequency: string): string => {
    switch (frequency) {
        case "once":
            return "Once";
        case "once_per_day":
            return "Once per day";
        case "every_time":
            return "Every time";
        default:
            return frequency;
    }
};

// Coin price data (mock - in real app this would come from API)
interface CoinPriceData {
    currentPrice: number;
    priceChange24h: number;
    image?: string;
}

const AlertList = () => {
    const [alerts, setAlerts] = useState<Alert[]>([]);
    const [coinPrices, setCoinPrices] = useState<Record<string, CoinPriceData>>({});
    const [loading, setLoading] = useState(true);

    // Fetch alerts from localStorage
    useEffect(() => {
        const loadAlerts = () => {
            const storedAlerts = getAlerts();
            setAlerts(storedAlerts);

            // Fetch coin prices for all unique coins
            const uniqueCoinIds = [...new Set(storedAlerts.map(a => a.coinId))];
            fetchCoinPrices(uniqueCoinIds);
        };

        loadAlerts();
    }, []);

    // Fetch coin prices from CoinGecko API
    const fetchCoinPrices = async (coinIds: string[]) => {
        if (coinIds.length === 0) {
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(
                `https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${coinIds.join(",")}&price_change_percentage=24h`
            );

            if (response.ok) {
                const data = await response.json();
                const priceMap: Record<string, CoinPriceData> = {};

                for (const coin of data) {
                    priceMap[coin.id] = {
                        currentPrice: coin.current_price,
                        priceChange24h: coin.price_change_percentage_24h || 0,
                        image: coin.image,
                    };
                }

                setCoinPrices(priceMap);
            }
        } catch (error) {
            console.error("Error fetching coin prices:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAlert = (alertId: string, alertName: string) => {
        deleteAlert(alertId);
        setAlerts(alerts.filter(a => a.id !== alertId));
        toast.success(`Alert "${alertName}" deleted`);
    };

    const handleEditAlert = (alertId: string) => {
        // TODO: Implement edit functionality
        toast.info("Edit functionality coming soon!");
    };

    if (loading) {
        return (
            <Card className="w-full h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Price Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-center py-8">
                        <p className="text-muted-foreground text-sm">Loading alerts...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    if (alerts.length === 0) {
        return (
            <Card className="w-full h-full">
                <CardHeader>
                    <CardTitle className="text-lg font-bold">Price Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col items-center justify-center py-8 gap-2">
                        <p className="text-muted-foreground text-sm">No alerts created yet</p>
                        <p className="text-muted-foreground text-xs">Create alerts from any coin page</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full h-full overflow-y-auto">
            <CardHeader className="border-b">
                <CardTitle className="text-lg font-bold">Price Alerts</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
                {alerts.map((alert) => {
                    const priceData = coinPrices[alert.coinId];
                    const currentPrice = priceData?.currentPrice ?? 0;
                    const priceChange = priceData?.priceChange24h ?? 0;
                    const coinImage = priceData?.image;

                    return (
                        <div
                            key={alert.id}
                            className="flex flex-col gap-3 p-4 bg-[#1a1f2e] rounded-lg border border-input"
                        >
                            {/* Coin Info Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {coinImage ? (
                                        <Image
                                            src={coinImage}
                                            alt={alert.coinName}
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center">
                                            <span className="text-xs font-bold">{alert.coinSymbol.charAt(0)}</span>
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium text-foreground">
                                            {alert.coinName}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end">
                                    <span className="text-sm font-medium text-muted-foreground">
                                        {alert.coinSymbol}
                                    </span>
                                    <span className={`text-xs font-medium ${priceChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                                        {priceChange >= 0 ? "+" : ""}{priceChange.toFixed(2)}%
                                    </span>
                                </div>
                            </div>

                            {/* Alert Info Row */}
                            <div className="flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs text-muted-foreground">Alert:</span>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => handleEditAlert(alert.id)}
                                            className="h-5 w-5"
                                        >
                                            <HugeiconsIcon icon={PencilEdit01Icon} size={12} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon-xs"
                                            onClick={() => handleDeleteAlert(alert.id, alert.alertName)}
                                            className="h-5 w-5 text-destructive hover:text-destructive"
                                        >
                                            <HugeiconsIcon icon={Delete02Icon} size={12} />
                                        </Button>
                                    </div>
                                    <span className="text-sm font-semibold text-foreground">
                                        Price {formatCondition(alert.condition)} ${alert.thresholdValue}
                                    </span>
                                </div>
                                <Badge variant="outline" className="text-[10px] px-2 py-0.5">
                                    {formatFrequency(alert.frequency)}
                                </Badge>
                            </div>
                        </div>
                    );
                })}
            </CardContent>
        </Card>
    );
};

export default AlertList;