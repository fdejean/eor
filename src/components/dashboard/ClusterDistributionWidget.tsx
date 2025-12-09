import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

// Mock data: 20 K-Means clusters with labels
const mockData = [
  { cluster_id: 0, label: "Music & Audio", count: 150, examples: ["music", "metal", "trap", "hiphopheads"] },
  { cluster_id: 1, label: "Gaming", count: 380, examples: ["gaming", "pcgaming", "PS4", "xboxone"] },
  { cluster_id: 2, label: "Sports", count: 285, examples: ["sports", "nfl", "nba", "soccer"] },
  { cluster_id: 3, label: "Technology", count: 420, examples: ["technology", "gadgets", "apple", "android"] },
  { cluster_id: 4, label: "Movies & TV", count: 310, examples: ["movies", "television", "netflix", "gameofthrones"] },
  { cluster_id: 5, label: "Science", count: 245, examples: ["science", "space", "physics", "biology"] },
  { cluster_id: 6, label: "Food & Cooking", count: 195, examples: ["food", "cooking", "recipes", "foodporn"] },
  { cluster_id: 7, label: "Fitness & Health", count: 220, examples: ["fitness", "health", "loseit", "bodybuilding"] },
  { cluster_id: 8, label: "Art & Design", count: 175, examples: ["art", "design", "drawing", "photography"] },
  { cluster_id: 9, label: "Books & Writing", count: 165, examples: ["books", "writing", "fantasy", "scifi"] },
  { cluster_id: 10, label: "News & Current Events", count: 340, examples: ["news", "worldnews", "ukpolitics", "canada"] },
  { cluster_id: 11, label: "Humor & Memes", count: 425, examples: ["funny", "memes", "dankmemes", "me_irl"] },
  { cluster_id: 12, label: "Animals & Pets", count: 290, examples: ["aww", "cats", "dogs", "animals"] },
  { cluster_id: 13, label: "Politics", count: 465, examples: ["politics", "conservative", "liberal", "libertarian"] },
  { cluster_id: 14, label: "Education & Learning", count: 185, examples: ["education", "learnprogramming", "askscience", "eli5"] },
  { cluster_id: 15, label: "DIY & Crafts", count: 155, examples: ["diy", "crafts", "woodworking", "homeimprovement"] },
  { cluster_id: 16, label: "Travel & Places", count: 205, examples: ["travel", "earthporn", "cityporn", "europe"] },
  { cluster_id: 17, label: "Fashion & Beauty", count: 140, examples: ["fashion", "malefashionadvice", "makeup", "beauty"] },
  { cluster_id: 18, label: "Relationships & Advice", count: 255, examples: ["relationships", "dating_advice", "askmen", "askwomen"] },
  { cluster_id: 19, label: "Finance & Career", count: 230, examples: ["personalfinance", "investing", "jobs", "entrepreneur"] },
];

// Color scale for bars
const getColor = (count: number) => {
  if (count > 400) return "oklch(0.7 0.25 330)"; // Magenta for largest
  if (count > 300) return "oklch(0.7 0.2 200)"; // Cyan
  if (count > 200) return "oklch(0.7 0.22 280)"; // Purple
  return "oklch(0.75 0.2 150)"; // Green for smallest
};

export default function ClusterDistributionWidget() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subreddit Clusters (K=20)</CardTitle>
        <CardDescription>
          Distribution of communities across semantic topic clusters
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={500}>
          <BarChart 
            data={mockData} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 120, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.05 250 / 20%)" />
            <XAxis 
              type="number"
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '12px', fontFamily: 'Geist Mono, monospace' }}
            />
            <YAxis 
              type="category"
              dataKey="label" 
              stroke="oklch(0.65 0.02 250)"
              style={{ fontSize: '11px', fontFamily: 'Inter, sans-serif' }}
              width={110}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(0.18 0.05 250 / 90%)', 
                border: '1px solid oklch(0.3 0.05 250 / 30%)',
                borderRadius: '8px',
                backdropFilter: 'blur(12px)'
              }}
              labelStyle={{ color: 'oklch(0.985 0 0)', fontWeight: 600 }}
              formatter={(value: number, name: string, props: any) => {
                const examples = props.payload.examples.join(", ");
                return [
                  <div key="tooltip">
                    <div className="font-data">{value} subreddits</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      Examples: {examples}
                    </div>
                  </div>,
                  ""
                ];
              }}
            />
            <Bar dataKey="count" radius={[0, 4, 4, 0]}>
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.count)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
