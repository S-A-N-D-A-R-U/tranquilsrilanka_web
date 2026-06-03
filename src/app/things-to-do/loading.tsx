export default function Loading() {
  return (
    <div className="animate-pulse w-full">
      <div className="h-[40vh] bg-muted/80 w-full" />
      
      <div className="container-page -mt-16 relative z-10 mb-10">
        <div className="h-24 bg-white/60 dark:bg-card/60 backdrop-blur rounded-2xl shadow-sm border border-border/60" />
      </div>

      <div className="container-page pb-20 space-y-8">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="h-96 bg-muted/80 rounded-[2rem]" />)}
        </div>
      </div>
    </div>
  );
}
