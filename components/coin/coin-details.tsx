"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    Copy01Icon,
    Tick02Icon,
    ArrowUpRight01Icon,
    GlobeIcon,
    NewTwitterIcon,
    TelegramIcon,
    GithubIcon,
    LegalDocument01Icon,
} from "@hugeicons/core-free-icons";

interface CoinDetailsProps {
    coinData: any;
}

const CoinDetails = ({ coinData }: CoinDetailsProps) => {
    const [copied, setCopied] = useState(false);
    const [expanded, setExpanded] = useState(false);

    if (!coinData) {
        return (
            <Card className="animate-pulse">
                <CardHeader>
                    <div className="h-6 w-24 bg-muted rounded"></div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="h-4 w-full bg-muted rounded"></div>
                        <div className="h-4 w-3/4 bg-muted rounded"></div>
                        <div className="h-4 w-1/2 bg-muted rounded"></div>
                    </div>
                </CardContent>
            </Card>
        );
    }

    const {
        name,
        symbol,
        image,
        description,
        links,
        contract_address,
        asset_platform_id,
        categories,
        sentiment_votes_up_percentage,
        sentiment_votes_down_percentage,
        market_cap_rank,
        community_data,
    } = coinData;

    const descriptionText = description?.en || "";
    const truncatedDescription = descriptionText.length > 300
        ? descriptionText.substring(0, 300) + "..."
        : descriptionText;

    const homepage = links?.homepage?.[0] || "";
    const twitterHandle = links?.twitter_screen_name || "";
    const telegramChannel = links?.telegram_channel_identifier || "";
    const githubRepos = links?.repos_url?.github || [];
    const whitepaper = links?.whitepaper || "";
    const blockchainSites = links?.blockchain_site?.filter((site: string) => site) || [];

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const truncateAddress = (address: string) => {
        if (!address) return "";
        return `${address.slice(0, 12)}...${address.slice(-6)}`;
    };

    // Remove HTML tags from description
    const cleanDescription = (html: string) => {
        return html.replace(/<[^>]*>/g, "");
    };

    return (
        <Card className="h-[80vh] overflow-y-scroll">
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    {image?.large && (
                        <Image
                            src={image.large}
                            alt={name}
                            width={32}
                            height={32}
                            className="rounded-full"
                        />
                    )}
                    <div>
                        <h1 className="text-base font-semibold">{name}</h1>
                        <span className="text-xs text-muted-foreground uppercase">{symbol}</span>
                    </div>
                    {market_cap_rank && (
                        <span className="ml-auto px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
                            Rank #{market_cap_rank}
                        </span>
                    )}
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Description */}
                <div className="space-y-2">
                    <h3 className="text-xs font-medium text-muted-foreground">About {name}</h3>
                    <p className="text-xs leading-relaxed text-foreground/90">
                        {expanded ? cleanDescription(descriptionText) : cleanDescription(truncatedDescription)}
                    </p>
                    {descriptionText.length > 300 && (
                        <button
                            onClick={() => setExpanded(!expanded)}
                            className="text-sm text-primary hover:underline"
                        >
                            {expanded ? "Show less" : "Read more"}
                        </button>
                    )}
                </div>

                {/* Contract Address */}
                {contract_address && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Contract Address</h3>
                        <div className="flex items-center gap-2 p-1 px-2 bg-muted/50 rounded-lg">
                            <code className="flex-1 text-xs font-mono">
                                {truncateAddress(contract_address)}
                            </code>
                            <button
                                onClick={() => copyToClipboard(contract_address)}
                                className="p-1.5 hover:bg-muted rounded-md transition-colors cursor-pointer"
                                title="Copy address"
                            >
                                {copied ? (
                                    <HugeiconsIcon icon={Tick02Icon} size={16} className="text-green-500" />
                                ) : (
                                    <HugeiconsIcon icon={Copy01Icon} size={16} className="text-muted-foreground" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Categories */}
                {categories && categories.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">Categories</h3>
                        <div className="flex flex-wrap gap-2">
                            {categories.slice(0, 5).map((category: string, index: number) => (
                                <span
                                    key={index}
                                    className="px-2 py-1 text-xs bg-secondary text-secondary-foreground rounded-full"
                                >
                                    {category}
                                </span>
                            ))}
                            {categories.length > 5 && (
                                <span className="px-2 py-1 text-xs text-muted-foreground">
                                    +{categories.length - 5} more
                                </span>
                            )}
                        </div>
                    </div>
                )}
                {/* Links */}
                <div className="space-y-2">
                    <h3 className="text-sm font-medium text-muted-foreground">Links</h3>
                    <div className="flex flex-wrap gap-2">
                        {homepage && (
                            <Link
                                href={homepage}
                                target="_blank"
                                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-sm"
                            >
                                <HugeiconsIcon icon={GlobeIcon} size={16} />
                                Website
                            </Link>
                        )}
                        {twitterHandle && (
                            <Link
                                href={`https://twitter.com/${twitterHandle}`}
                                target="_blank"
                                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-xs"
                            >
                                <HugeiconsIcon icon={NewTwitterIcon} size={16} />
                                Twitter
                            </Link>
                        )}
                        {whitepaper && (
                            <Link
                                href={whitepaper}
                                target="_blank"
                                className="flex items-center gap-2 px-3 py-2 bg-muted/50 hover:bg-muted rounded-lg transition-colors text-xs"
                            >
                                <HugeiconsIcon icon={LegalDocument01Icon} size={16} />
                                Whitepaper
                            </Link>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default CoinDetails;