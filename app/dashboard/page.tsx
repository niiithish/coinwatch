"use client";

import FinancialNews from "@/components/dashboard/financial-news";
import MarketSummary from "@/components/dashboard/market-summary";
import TrendingToday from "@/components/dashboard/trending-today";
import Watchlist from "@/components/dashboard/watchlist";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-6 p-4 md:gap-10 md:p-8">
      <div className="flex flex-col gap-6 lg:h-[65vh] lg:flex-row lg:gap-8">
        <div className="flex min-h-[400px] flex-1 flex-col gap-4 lg:h-full lg:min-h-0">
          <MarketSummary />
        </div>
        <div className="flex min-h-[350px] flex-1 flex-col gap-4 lg:h-full lg:min-h-0">
          <Watchlist />
        </div>
      </div>
      <div className="flex flex-col gap-6 lg:h-[80vh] lg:flex-row lg:gap-8">
        <div className="flex min-h-[400px] flex-1 flex-col gap-4 lg:h-full lg:min-h-0">
          <TrendingToday />
        </div>
        <div className="flex min-h-[400px] flex-1 flex-col gap-4 lg:h-full lg:min-h-0">
          <FinancialNews />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
