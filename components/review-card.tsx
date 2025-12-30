import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { HugeiconsIcon } from "@hugeicons/react"
import { StarIcon } from "@hugeicons/core-free-icons"
const ReviewCard = () => {
    return (
        <Card className="ring-0 w-[600px] bg-transparent">
            <CardContent>
                <p className="text-lg font-medium">
                    CoinWatch turned my watchlist into a winning list. The alerts are spot-on, and I feel more confident making moves in the market
                </p>
            </CardContent>
            <CardFooter>
                <div className="flex items-center justify-between w-full">
                    <div>
                        <p className="text-base font-semibold">— Ethan R.</p>
                        <p className="text-sm">Retail Investor</p>
                    </div>
                    <div className="flex items-center">
                        <HugeiconsIcon icon={StarIcon} size={16} color={"var(--primary)"} fill="var(--primary)" />
                        <HugeiconsIcon icon={StarIcon} size={16} color={"var(--primary)"} fill="var(--primary)" />
                        <HugeiconsIcon icon={StarIcon} size={16} color={"var(--primary)"} fill="var(--primary)" />
                        <HugeiconsIcon icon={StarIcon} size={16} color={"var(--primary)"} fill="var(--primary)" />
                        <HugeiconsIcon icon={StarIcon} size={16} color={"var(--primary)"} fill="var(--primary)" />
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}

export default ReviewCard
