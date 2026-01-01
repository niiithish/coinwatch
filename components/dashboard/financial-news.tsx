import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface News {
    source: {
        name: string;
    };
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
}

const FinancialNews = () => {

    const [news, setNews] = useState<News[]>([]);

    useEffect(() => {
        const fetchNews = async () => {
            const response = await fetch("https://newsapi.org/v2/everything?q=crypto&pageSize=10&apiKey=af434bb97adf42e98541c390110e0201");
            const data = await response.json();
            setNews(data.articles);
        }
        fetchNews();
    }, []);
    return (
        <div className="max-h-[60vh] overflow-y-scroll">
            <Card>
                <CardContent className="flex flex-col gap-3">
                    {news.map((item, index) => (
                        <div className="flex flex-col gap-2 border-b border-foreground/20 py-2" key={index}>
                            <div className="flex flex-row justify-start gap-10">
                                <p className="text-xs text-muted-foreground">{item.source.name}</p>
                                <p className="text-xs text-muted-foreground"> • </p>
                                <p className="text-xs text-muted-foreground">{item.publishedAt.split("T")[0].split("-")[2] + "/" + item.publishedAt.split("T")[0].split("-")[1] + "/" + item.publishedAt.split("T")[0].split("-")[0]}</p>
                            </div>
                            <div className="flex flex-row gap-2 items-center justify-between">
                                <h2 className="text-sm font-medium cursor-pointer hover:underline" onClick={() => window.open(item.url, "_blank")}>{item.title}</h2>
                                <img src={item.urlToImage} alt={item.title} className="w-32 h-20 object-cover rounded-sm" />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

        </div>
    );
};

export default FinancialNews;
