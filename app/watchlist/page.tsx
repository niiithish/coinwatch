import WatchlistTable from "@/components/watchlist/watchlist-table";
import AlertList from "@/components/watchlist/alert-list";
import WatchlistNews from "@/components/watchlist/watchlist-news";

const WatchlistPage = () => {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-row gap-10 h-full min-h-[60vh] max-h-[60vh]">
        <div className="flex flex-3 w-full">
          <WatchlistTable />
        </div>
        <div className="flex flex-1 w-full">
          <AlertList />
        </div>
      </div>
      <div>
        <WatchlistNews />
      </div>
    </div>
  );
};

export default WatchlistPage;
