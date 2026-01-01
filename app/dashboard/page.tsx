"use client";

import FinancialNews from "@/components/dashboard/financial-news";
import MarkerSummary from "@/components/dashboard/marker-summary";
import TrendingToday from "@/components/dashboard/trending-today";
import Watchlist from "@/components/dashboard/watchlist";
import { Button } from "@/components/ui/button";

const Dashboard2Page = () => {
  return (
    <div className="flex flex-col gap-10 p-8">
      <div className="flex flex-1 flex-row gap-10">
        <div className="flex flex-1 flex-col gap-4">
          <h2 className="font-bold text-xl">Market Summary</h2>
          <MarkerSummary />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Your Watchlist</h2>
            <Button variant="link">View All</Button>
          </div>
          <Watchlist />
        </div>
      </div>
      <div className="flex flex-1 flex-row gap-10">
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Trending Today</h2>
            <Button variant="link">View All</Button>
          </div>
          <TrendingToday />
        </div>
        <div className="flex flex-1 flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-xl">Today's Financial News</h2>
            <Button variant="link">View All</Button>
          </div>
          <FinancialNews />
        </div>
      </div>
    </div>
  );
};

export default Dashboard2Page;
