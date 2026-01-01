"use client";

import MarkerSummary from "@/components/dashboard/marker-summary";
import TrendingToday from "@/components/dashboard/trending-today";
import FinancialNews from "@/components/dashboard/financial-news";
import Watchlist from "@/components/dashboard/watchlist";
import { Button } from "@/components/ui/button";

const Dashboard2Page = () => {
  return (
    <div className="p-8 flex flex-col gap-10">
      <div className="flex-1 flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-4">
          <h2 className="text-xl font-bold">Market Summary</h2>
          <MarkerSummary />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Your Watchlist</h2>
            <Button variant="link">View All</Button>
          </div>
          <Watchlist />
        </div>
      </div>
      <div className="flex-1 flex flex-row gap-10">
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Trending Today</h2>
            <Button variant="link">View All</Button>
          </div>
          <TrendingToday />
        </div>
        <div className="flex-1 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Today's Financial News</h2>
            <Button variant="link">View All</Button>
          </div>
          <FinancialNews />
        </div>
      </div>

    </div>
  );
};

export default Dashboard2Page;
