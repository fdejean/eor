import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock PCA data (PC1, PC2) for subreddits
// Clusters: 0=Music, 1=Gaming, 2=Sports, 3=Tech, 4=Movies, 13=Politics
const mockData = [
  // Cluster 0: Music (Cyan)
  { x: -15, y: 8, z: 150, cluster: 0, name: "music" },
  { x: -18, y: 12, z: 80, cluster: 0, name: "metal" },
  { x: -12, y: 5, z: 60, cluster: 0, name: "trap" },
  { x: -14, y: 9, z: 90, cluster: 0, name: "hiphopheads" },
  
  // Cluster 1: Gaming (Magenta)
  { x: 25, y: -10, z: 380, cluster: 1, name: "gaming" },
  { x: 28, y: -15, z: 220, cluster: 1, name: "pcgaming" },
  { x: 22, y: -8, z: 180, cluster: 1, name: "PS4" },
  { x: 26, y: -12, z: 150, cluster: 1, name: "xboxone" },
  
  // Cluster 2: Sports (Green)
  { x: 5, y: 25, z: 285, cluster: 2, name: "sports" },
  { x: 8, y: 28, z: 200, cluster: 2, name: "nba" },
  { x: 3, y: 22, z: 190, cluster: 2, name: "nfl" },
  { x: 6, y: 26, z: 160, cluster: 2, name: "soccer" },
  
  // Cluster 13: Politics (Yellow)
  { x: -20, y: -20, z: 465, cluster: 13, name: "politics" },
  { x: -25, y: -25, z: 320, cluster: 13, name: "worldnews" },
  { x: -18, y: -15, z: 150, cluster: 13, name: "conservative" },
  { x: -22, y: -18, z: 180, cluster: 13, name: "liberal" },
  
  // Cluster 3: Tech (Purple)
  { x: 15, y: 5, z: 420, cluster: 3, name: "technology" },
  { x: 18, y: 8, z: 250, cluster: 3, name: "gadgets" },
  { x: 12, y: 2, z: 300, cluster: 3, name: "apple" },
  { x: 16, y: 6, z: 280, cluster: 3, name: "android" },
];

const getColor = (cluster: number) => {
  switch(cluster) {
    case 0: return "oklch(0.7 0.2 200)"; // Cyan
    case 1: return "oklch(0.7 0.25 330)"; // Magenta
    case 2: return "oklch(0.75 0.2 150)"; // Green
    case 13: return "oklch(0.75 0.22 60)"; // Yellow
    default: return "oklch(0.7 0.22 280)"; // Purple
  }
};

export default function GalaxyPreviewWidget() {
  return (
    <Card className="relative overflow-hidden">
      <CardHeader>
        <CardTitle>Subreddit Galaxy (2D Map)</CardTitle>
        <CardDescription>
          Semantic map of communities based on hyperlink patterns
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="h-[300px] w-full bg-card/30 rounded-lg border border-border/50">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" hide domain={[-30, 30]} />
              <YAxis type="number" dataKey="y" hide domain={[-30, 30]} />
              <ZAxis type="number" dataKey="z" range={[50, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover/90 backdrop-blur-md border border-border p-3 rounded-lg shadow-xl">
                        <p className="font-bold text-foreground">r/{data.name}</p>
                        <p className="text-xs text-muted-foreground">Cluster {data.cluster}</p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Subreddits" data={mockData}>
                {mockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.cluster)} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <p className="font-data">PCA Projection</p>
            <p className="text-xs">Closer nodes = stronger connections</p>
          </div>
          <Button 
            className="glow-cyan"
            asChild
          >
            <a href="/galaxy">Expand Map →</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
