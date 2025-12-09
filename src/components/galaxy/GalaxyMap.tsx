import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock Data
const mockData = [
  // Cluster 0: Music (Cyan)
  { x: -15, y: 8, z: 150, cluster: 0, name: "music", label: "Music" },
  { x: -18, y: 12, z: 80, cluster: 0, name: "metal", label: "Music" },
  { x: -12, y: 5, z: 60, cluster: 0, name: "trap", label: "Music" },
  { x: -14, y: 9, z: 90, cluster: 0, name: "hiphopheads", label: "Music" },
  { x: -16, y: 7, z: 70, cluster: 0, name: "electronicmusic", label: "Music" },
  
  // Cluster 1: Gaming (Magenta)
  { x: 25, y: -10, z: 380, cluster: 1, name: "gaming", label: "Gaming" },
  { x: 28, y: -15, z: 220, cluster: 1, name: "pcgaming", label: "Gaming" },
  { x: 22, y: -8, z: 180, cluster: 1, name: "PS4", label: "Gaming" },
  { x: 26, y: -12, z: 150, cluster: 1, name: "xboxone", label: "Gaming" },
  { x: 24, y: -9, z: 200, cluster: 1, name: "steam", label: "Gaming" },
  
  // Cluster 2: Sports (Green)
  { x: 5, y: 25, z: 285, cluster: 2, name: "sports", label: "Sports" },
  { x: 8, y: 28, z: 200, cluster: 2, name: "nba", label: "Sports" },
  { x: 3, y: 22, z: 190, cluster: 2, name: "nfl", label: "Sports" },
  { x: 6, y: 26, z: 160, cluster: 2, name: "soccer", label: "Sports" },
  { x: 7, y: 24, z: 140, cluster: 2, name: "hockey", label: "Sports" },
  
  // Cluster 13: Politics (Yellow)
  { x: -20, y: -20, z: 465, cluster: 13, name: "politics", label: "Politics" },
  { x: -25, y: -25, z: 320, cluster: 13, name: "worldnews", label: "Politics" },
  { x: -18, y: -15, z: 150, cluster: 13, name: "conservative", label: "Politics" },
  { x: -22, y: -18, z: 180, cluster: 13, name: "liberal", label: "Politics" },
  { x: -23, y: -22, z: 250, cluster: 13, name: "news", label: "Politics" },
  
  // Cluster 3: Tech (Purple)
  { x: 15, y: 5, z: 420, cluster: 3, name: "technology", label: "Tech" },
  { x: 18, y: 8, z: 250, cluster: 3, name: "gadgets", label: "Tech" },
  { x: 12, y: 2, z: 300, cluster: 3, name: "apple", label: "Tech" },
  { x: 16, y: 6, z: 280, cluster: 3, name: "android", label: "Tech" },
  { x: 14, y: 4, z: 220, cluster: 3, name: "programming", label: "Tech" },
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

export default function GalaxyMap() {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>Subreddit Universe</CardTitle>
            <CardDescription>
              PCA projection of subreddit embeddings. Closer nodes share more semantic connections and user overlap.
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-3 h-3 rounded-full bg-[oklch(0.7_0.2_200)]"></span> Music
              <span className="w-3 h-3 rounded-full bg-[oklch(0.7_0.25_330)]"></span> Gaming
              <span className="w-3 h-3 rounded-full bg-[oklch(0.75_0.2_150)]"></span> Sports
              <span className="w-3 h-3 rounded-full bg-[oklch(0.75_0.22_60)]"></span> Politics
              <span className="w-3 h-3 rounded-full bg-[oklch(0.7_0.22_280)]"></span> Tech
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-0 pt-4">
        <div className="w-full h-full min-h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <XAxis type="number" dataKey="x" name="PC1" unit="" stroke="oklch(0.65 0.02 250)" />
              <YAxis type="number" dataKey="y" name="PC2" unit="" stroke="oklch(0.65 0.02 250)" />
              <ZAxis type="number" dataKey="z" range={[100, 800]} name="Size" />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-popover/90 backdrop-blur-md border border-border p-4 rounded-lg shadow-xl min-w-[200px]">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-lg text-foreground">r/{data.name}</p>
                          <span className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground">
                            {data.label}
                          </span>
                        </div>
                        <div className="space-y-1 text-xs text-muted-foreground">
                          <p>Cluster ID: <span className="font-data text-foreground">{data.cluster}</span></p>
                          <p>Centrality: <span className="font-data text-foreground">{data.z}</span></p>
                          <p>Coordinates: <span className="font-data">[{data.x}, {data.y}]</span></p>
                        </div>
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
      </CardContent>
    </Card>
  );
}
