import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Camera, Hammer, Heart, Globe, AlertTriangle, MessageSquare } from "lucide-react"

const COLORS = ['#E69F00', '#56B4E9', '#009E73', '#F0E442', '#0072B2', '#D55E00', '#CC79A7', '#999999'];

export function LiwcClusterInsights() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-l-4" style={{ borderLeftColor: COLORS[0] }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" style={{ color: COLORS[0], borderColor: COLORS[0] }}>Cluster 0</Badge>
            <Camera className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2">Visual Curiosities</CardTitle>
          <CardDescription>The "Family" Hidden in the Memes</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-4">
            High amount of <Badge variant="secondary" className="mx-1">Family</Badge> related words in aesthetic humor subreddits.
          </p>
          <p>
            Driven by some subreddits like <strong>r/blunderyears</strong>, where captions of funny pictures are inherently related to family embarrassment 
            ("My mom made me wear this"). The source of humor is often family-related.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4" style={{ borderLeftColor: COLORS[1] }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" style={{ color: COLORS[1], borderColor: COLORS[1] }}>Cluster 1</Badge>
            <Hammer className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2">Practical Lifestyle & DIY</CardTitle>
          <CardDescription>The "Me, Myself, and I" of Problem Solving</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-4 leading-7">
            We see high usage of <Badge variant="secondary">I</Badge>, <Badge variant="secondary">Ipron</Badge> (first-person pronouns), <Badge variant="secondary">Past</Badge> tense, and <Badge variant="secondary">Tentat</Badge> (tentative) words.
          </p>
          <p>
            "Adulting" is introspective. When fixing a sink or budgeting, users narrate their own history. 
            The high tentative score reveals users are not experts lecturing, but regular people admitting they don't know the answer.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4" style={{ borderLeftColor: COLORS[4] }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" style={{ color: COLORS[4], borderColor: COLORS[4] }}>Cluster 4</Badge>
            <Heart className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2">Adult Content</CardTitle>
          <CardDescription>The Anomaly of "Friends"</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-4 leading-7">
            High scores for <Badge variant="secondary">Body</Badge>, <Badge variant="secondary">Sexual</Badge>, <Badge variant="secondary">Swear</Badge>... and <Badge variant="secondary">Friends</Badge>???
          </p>
          <p>
            Why is a pornography cluster talking about friendship? It's likely a <strong>framing device</strong>. 
            Titles rely on social transgression (e.g., "My best friend sent me this") to generate interest.
          </p>
        </CardContent>
      </Card>

      <Card className="border-l-4" style={{ borderLeftColor: COLORS[6] }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <Badge variant="outline" style={{ color: COLORS[6], borderColor: COLORS[6] }}>Cluster 6</Badge>
            <Globe className="h-5 w-5 text-muted-foreground" />
          </div>
          <CardTitle className="mt-2">Activism & Global Affairs</CardTitle>
          <CardDescription>The "Us vs. Them" of Activism</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p className="mb-4 leading-7">
            High concentration of <Badge variant="secondary">They</Badge> and <Badge variant="secondary">Inhib</Badge> (inhibition) words.
          </p>
          <p>
            A stark contrast to Cluster 1. The conversation is rarely about the poster (first person), but rather about external forces and institutions (third person).
            The high inhibition score (block, stop, prevent) paints a picture of resistance against barriers.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
