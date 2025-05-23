
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Brain } from "lucide-react";
import RevenueOverview from "@/components/revenue/RevenueOverview";
import RevenueCharts from "@/components/revenue/RevenueCharts";
import RevenuePredictions from "@/components/revenue/RevenuePredictions";

interface RevenueModelProps {
  merchant: any;
}

const RevenueModel = ({ merchant }: RevenueModelProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="predictions" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Predictions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <RevenueOverview merchant={merchant} />
        </TabsContent>

        <TabsContent value="analytics">
          <RevenueCharts merchant={merchant} />
        </TabsContent>

        <TabsContent value="predictions">
          <RevenuePredictions merchant={merchant} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueModel;
