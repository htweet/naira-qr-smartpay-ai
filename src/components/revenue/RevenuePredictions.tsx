
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Brain, Target } from "lucide-react";

interface RevenuePredictionsProps {
  merchant: any;
}

const RevenuePredictions = ({ merchant }: RevenuePredictionsProps) => {
  const predictions = [
    {
      metric: "Next Month Revenue",
      predicted: "₦3,125,000",
      confidence: 89,
      trend: "up",
      factors: ["Increased customer acquisition", "Seasonal uptick", "New product launch"]
    },
    {
      metric: "Q3 Growth Rate",
      predicted: "24.8%",
      confidence: 82,
      trend: "up",
      factors: ["Market expansion", "Customer retention", "Price optimization"]
    },
    {
      metric: "Customer Churn Risk",
      predicted: "7.2%",
      confidence: 91,
      trend: "down",
      factors: ["Improved service quality", "Loyalty programs", "Support enhancement"]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-purple-500" />
          AI Revenue Predictions
        </CardTitle>
        <CardDescription>
          Machine learning insights for business growth
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {predictions.map((prediction, index) => (
            <div key={index} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-medium">{prediction.metric}</h4>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-purple-50">
                    {prediction.confidence}% confidence
                  </Badge>
                  <TrendingUp className={`h-4 w-4 ${prediction.trend === 'up' ? 'text-green-500' : 'text-red-500'}`} />
                </div>
              </div>
              <p className="text-2xl font-bold text-purple-600 mb-2">{prediction.predicted}</p>
              <div className="space-y-1">
                <p className="text-sm text-gray-600 mb-1">Key factors:</p>
                {prediction.factors.map((factor, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <Target className="h-3 w-3 text-gray-400" />
                    <span>{factor}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RevenuePredictions;
