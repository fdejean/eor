import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export function LiwcClusterInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Cluster 1: Practical Lifestyle & DIY</CardTitle>
          <CardDescription>The "Me, Myself, and I" of Problem Solving</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            High usage of <strong>I</strong>, <strong>Ipron</strong>, <strong>Past</strong> tense, and <strong>Tentat</strong> (tentative) words.
          </p>
          <p>
            "Adulting" is introspective. When fixing a sink or budgeting, users narrate their own history. 
            The high tentative score reveals users are not experts lecturing, but regular people admitting they don't know the answer.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cluster 6: Activism & Global Affairs</CardTitle>
          <CardDescription>The "Us vs. Them" of Activism</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            High concentration of <strong>They</strong> and <strong>Inhib</strong> (inhibition) words.
          </p>
          <p>
            A stark contrast to Cluster 1. The conversation is rarely about the poster, but about external forces and institutions.
            The high inhibition score (block, stop, prevent) paints a picture of resistance against barriers.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cluster 4: Adult Content</CardTitle>
          <CardDescription>The Anomaly of "Friends"</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            High scores for <strong>Body</strong>, <strong>Sexual</strong>, <strong>Swear</strong>... and surprisingly <strong>Friends</strong>.
          </p>
          <p>
            Why is a porn cluster talking about friendship? It's likely a framing device. 
            Titles rely on social transgression (e.g., "My best friend sent me this") to generate interest.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cluster 0: Visual Curiosities</CardTitle>
          <CardDescription>The "Family" Hidden in the Memes</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-2">
            High amount of <strong>Family</strong> words in aesthetic humor subreddits.
          </p>
          <p>
            Driven by subreddits like <strong>r/blunderyears</strong>, where captions are inherently related to family embarrassment 
            ("My mom made me wear this"). The source of humor is often family-related.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
