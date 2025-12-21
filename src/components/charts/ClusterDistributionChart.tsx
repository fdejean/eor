"use client"

import { useState } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import data from "@/data/preprocessing/cluster_distribution.json"
import clusterDetails from "@/data/preprocessing/cluster_details.json"
import subredditClusters from "@/data/preprocessing/subreddit_clusters.json"

const COLORS = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export function ClusterDistributionChart() {
    const [selectedClusterId, setSelectedClusterId] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState<typeof subredditClusters>([]);
    const [searchedSubreddit, setSearchedSubreddit] = useState<string | null>(null);
    const [showUnclassified, setShowUnclassified] = useState(false);

    const filteredData = showUnclassified ? data : data.filter(d => d.cluster_id !== 2);

    const selectedCluster = selectedClusterId !== null 
        ? clusterDetails.find(c => c.cluster_id === selectedClusterId) 
        : null;

    const handleSearch = (term: string) => {
        setSearchTerm(term);
        if (term.length < 2) {
            setSearchResults([]);
            return;
        }
        //limit to 5 results
        const results = subredditClusters
            .filter(item => item.subreddit.toLowerCase().includes(term.toLowerCase()))
            .slice(0, 5);
        setSearchResults(results);
    };

    const handleSelectSubreddit = (subreddit: string, clusterId: number) => {
        setSelectedClusterId(clusterId);
        setSearchedSubreddit(subreddit);
        setSearchTerm("");
        setSearchResults([]);
    };

    return (
        <Card className="w-full flex flex-col">
            <CardHeader>
                <CardTitle>Distribution of Subreddits Across Clusters</CardTitle>
                <CardDescription>
                    Number of subreddits in each identified cluster. <strong>Click</strong> a bar to see details or <strong>search</strong> for a subreddit.
                </CardDescription>
                <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mt-2">
                    <div className="relative max-w-sm w-full">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input 
                            placeholder="Find a subreddit's cluster..." 
                            className="pl-8" 
                            value={searchTerm}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                        {searchResults.length > 0 && (
                            <div className="absolute z-20 w-full bg-popover border rounded-md shadow-md mt-1 overflow-hidden">
                                {searchResults.map((result) => (
                                    <div 
                                        key={result.subreddit}
                                        className="p-2 hover:bg-muted cursor-pointer text-sm flex justify-between items-center"
                                        onClick={() => handleSelectSubreddit(result.subreddit, result.cluster)}
                                    >
                                        <span className="font-medium">r/{result.subreddit}</span>
                                        <Badge variant="secondary" className="text-xs">Cluster {result.cluster}</Badge>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch 
                            id="show-unclassified" 
                            checked={showUnclassified}
                            onCheckedChange={setShowUnclassified}
                        />
                        <Label htmlFor="show-unclassified">Show Cluster 2 (Non-Specific)</Label>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pb-4 flex flex-col gap-4">
                <div className="h-[300px] w-full shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={filteredData} 
                            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            onClick={(state) => {
                                if (state && state.activePayload && state.activePayload.length > 0) {
                                    setSelectedClusterId(state.activePayload[0].payload.cluster_id);
                                    setSearchedSubreddit(null);
                                }
                            }}
                        >
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="cluster_id" stroke="#888888" tickLine={false} axisLine={false} />
                            <YAxis stroke="#888888" tickLine={false} axisLine={false} />
                            <Tooltip 
                                cursor={{ fill: 'var(--muted)', opacity: 0.3 }}
                                contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)' }}
                                itemStyle={{ color: 'var(--foreground)' }}
                            />
                            <Bar dataKey="count" radius={[4, 4, 0, 0]} style={{ cursor: 'pointer' }}>
                                {filteredData.map((entry, index) => (
                                    <Cell 
                                        key={`cell-${entry.cluster_id}`} 
                                        fill={COLORS[entry.cluster_id % COLORS.length]} 
                                        stroke={selectedClusterId === entry.cluster_id ? "var(--foreground)" : "none"}
                                        strokeWidth={selectedClusterId === entry.cluster_id ? 3 : 0}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="border rounded-md p-4 bg-muted/20">
                    {selectedCluster ? (
                        <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center justify-between">
                                <h4 className="text-lg font-bold flex items-center gap-2">
                                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: COLORS[selectedCluster.cluster_id % COLORS.length] }}></span>
                                    {selectedCluster.name}
                                </h4>
                                <Badge variant="outline">Cluster {selectedCluster.cluster_id}</Badge>
                            </div>
                            
                            {searchedSubreddit && (
                                <div className="bg-background border p-2 rounded-md text-sm flex items-center gap-2 mb-2">
                                    <Search className="h-3 w-3 text-muted-foreground" />
                                    <span>
                                        Found <strong>r/{searchedSubreddit}</strong> in this cluster.
                                    </span>
                                </div>
                            )}

                            <p className="text-sm text-muted-foreground">
                                {selectedCluster.description}
                            </p>

                            <div className="flex flex-col gap-4 text-sm">
                                <div>
                                    <span className="font-semibold block mb-1">Centroid:</span>
                                    <Badge variant="secondary" className="text-xs">r/{selectedCluster.centroid}</Badge>
                                </div>
                                <div>
                                    <span className="font-semibold block mb-1">Top Subreddits:</span>
                                    <div className="flex flex-wrap gap-1">
                                        {selectedCluster.top_subreddits
                                            .filter(sub => sub !== selectedCluster.centroid)
                                            .map(sub => (
                                                <Badge key={sub} variant="secondary" className="text-xs">r/{sub}</Badge>
                                            ))
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="h-24 flex items-center justify-center text-muted-foreground text-sm italic">
                            Select a cluster bar to view details
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
