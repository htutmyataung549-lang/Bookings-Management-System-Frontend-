import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SkeletonCard() {
  return (
    <div>
      <Card className="flex flex-col justify-between overflow-hidden border-zinc-200/80 dark:border-zinc-800 shadow-2xs bg-card">
        <CardHeader className="pb-3">
          {/* Title နှင့် Badge Skeleton */}
          <div className="flex justify-between items-start gap-2 mb-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-6 w-16" />
          </div>
          {/* Date Skeleton */}
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>

        <CardContent className="pb-4">
          {/* Price and Capacity Skeleton */}
          <div className="space-y-2 border-t border-dashed border-zinc-100 dark:border-zinc-800 pt-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </CardContent>

        <CardFooter className="pt-0">
          {/* Button Skeleton */}
          <Skeleton className="h-10 w-full rounded-md" />
        </CardFooter>
      </Card>
    </div>
  );
}
