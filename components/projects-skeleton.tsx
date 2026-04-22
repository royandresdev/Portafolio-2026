import { Skeleton } from "./ui/skeleton"

export function ProjectsSkeleton() {
  return (
    <section className="container mx-auto max-w-[1280px] px-6 space-y-4">
      {/* Header Skeleton */}
      <div className="space-y-3">
        <Skeleton className="h-5 w-32" /> {/* Caption */}
        <Skeleton className="h-10 w-64 lg:h-12 lg:w-96" /> {/* Title */}
        <Skeleton className="h-4 w-full max-w-[600px]" /> {/* Description line 1 */}
        <Skeleton className="h-4 w-full max-w-[400px]" /> {/* Description line 2 */}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 py-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="bg-black-3 rounded-[32px] overflow-hidden border border-black-3 custom-shadow flex flex-col h-full">
            {/* Image Skeleton */}
            <Skeleton className="w-full aspect-video rounded-none" />
            
            {/* Content Skeleton */}
            <div className="p-6 space-y-4 flex-1">
              <Skeleton className="h-7 w-3/4" /> {/* Name */}
              <Skeleton className="h-5 w-1/3" /> {/* Category */}
              
              <div className="flex gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-14" />
              </div>

              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Buttons Skeleton */}
            <div className="grid grid-cols-2 gap-2 px-6 pb-6 mt-auto">
              <Skeleton className="h-11 w-full rounded-md" />
              <Skeleton className="h-11 w-full rounded-md" />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
