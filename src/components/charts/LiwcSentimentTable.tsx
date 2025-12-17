import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const data = [
  { property: "LIWC_Anger", coefficient: -0.840873, pValue: "0.00e+00" },
  { property: "LIWC_Verbs", coefficient: -0.239561, pValue: "1.73e-38" },
  { property: "LIWC_Prep", coefficient: -0.239237, pValue: "0.00e+00" },
  { property: "LIWC_Sad", coefficient: -0.233130, pValue: "0.00e+00" },
  { property: "LIWC_Article", coefficient: -0.223001, pValue: "0.00e+00" },
  { property: "LIWC_Body", coefficient: -0.198740, pValue: "0.00e+00" },
  { property: "LIWC_Conj", coefficient: -0.178434, pValue: "1.92e-273" },
  { property: "LIWC_Ipron", coefficient: -0.173482, pValue: "0.00e+00" },
  { property: "LIWC_SheHe", coefficient: -0.163998, pValue: "0.00e+00" },
  { property: "LIWC_Anx", coefficient: -0.155521, pValue: "0.00e+00" },
  { property: "LIWC_Dissent", coefficient: -0.145686, pValue: "2.36e-298" },
  { property: "LIWC_Humans", coefficient: -0.139318, pValue: "0.00e+00" },
  { property: "LIWC_They", coefficient: -0.113352, pValue: "9.04e-263" },
  { property: "LIWC_Health", coefficient: -0.107878, pValue: "1.83e-205" },
  { property: "LIWC_Posemo", coefficient: 0.105530, pValue: "3.46e-84" },
]

export function LiwcSentimentTable() {
  return (
    <div className="rounded-md border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[150px]">LIWC Property</TableHead>
            <TableHead className="text-right">Coefficient</TableHead>
            <TableHead className="text-right">P-Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item) => (
            <TableRow key={item.property}>
              <TableCell className="font-medium">{item.property}</TableCell>
              <TableCell className={`text-right ${item.coefficient < 0 ? "text-red-500" : "text-green-500"}`}>
                {item.coefficient.toFixed(4)}
              </TableCell>
              <TableCell className="text-right text-muted-foreground">{item.pValue}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
