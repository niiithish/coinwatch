"use client";

import FinancialNews from "@/components/dashboard/financial-news";
import MarketSummary from "@/components/dashboard/market-summary";
import TrendingToday from "@/components/dashboard/trending-today";
import Watchlist from "@/components/dashboard/watchlist";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-10 p-8">
      <div className="flex h-[65vh] gap-8">
        <div className="flex flex-1 flex-col gap-4 h-full">
          <MarketSummary />
        </div>
        <div className="flex flex-1 flex-col gap-4 h-full">
          <Watchlist />
        </div>
      </div>
      <div className="flex h-[80vh] gap-8">
        <div className="flex flex-1 flex-col gap-4 h-full">
          <TrendingToday />
        </div>
        <div className="flex flex-1 flex-col gap-4 h-full">
          <FinancialNews />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
