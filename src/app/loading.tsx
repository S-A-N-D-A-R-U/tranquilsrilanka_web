export default function Loading() {
  return (
    <div className="animate-pulse w-full">
      <div className="h-[100dvh] bg-muted/80 w-full" />
      <div className="container-page py-20 space-y-16">
        <div className="space-y-4">
          <div className="h-4 w-32 bg-muted/80 rounded-full" />
          <div className="h-12 w-3/4 max-w-lg bg-muted/80 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1,2,3].map(i => <div key={i} className="h-64 bg-muted/80 rounded-3xl" />)}
        </div>
        
        <div className="space-y-4 pt-10">
          <div className="h-4 w-32 bg-muted/80 rounded-full" />
          <div className="h-12 w-3/4 max-w-lg bg-muted/80 rounded-full" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1,2,3,4].map(i => <div key={i} className="h-80 bg-muted/80 rounded-3xl" />)}
        </div>
      </div>
    </div>
  );
}
