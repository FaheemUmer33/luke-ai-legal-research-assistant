import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="min-h-screen p-8">
      <Skeleton className="h-12 w-72" />
      <Skeleton className="mt-6 h-96 w-full" />
    </div>
  );
}

