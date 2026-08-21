const skeletonItems = ['first', 'second', 'third', 'fourth']

export function LibrarySkeleton() {
  return (
    <div
      aria-label="Loading video library"
      className="grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
    >
      {skeletonItems.map((item) => (
        <div className="animate-pulse" key={item}>
          <div className="aspect-video rounded-3xl bg-black/8" />
          <div className="mt-4 h-5 w-2/3 rounded-full bg-black/8" />
          <div className="mt-3 h-4 w-full rounded-full bg-black/6" />
        </div>
      ))}
    </div>
  )
}
