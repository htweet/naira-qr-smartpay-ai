
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BarChart3, TrendingUp, Brain, DollarSign, Users, Target } from "lucide-react";
import RevenueOverview from "@/components/revenue/RevenueOverview";
import RevenueCharts from "@/components/revenue/RevenueCharts";
import RevenuePredictions from "@/components/revenue/RevenuePredictions";
import RevenueStreams from "@/components/revenue/RevenueStreams";
import SubscriptionRevenue from "@/components/revenue/SubscriptionRevenue";
import AIFeatures from "@/components/revenue/AIFeatures";
import MerchantValue from "@/components/revenue/MerchantValue";
import RevenueProjections from "@/components/revenue/RevenueProjections";

interface RevenueModelProps {
  merchant: any;
}

const RevenueModel = ({ merchant }: RevenueModelProps) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="streams" className="flex items-center gap-2">
            <DollarSign className="h-4 w-4" />
            Revenue Streams
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Subscriptions
          </TabsTrigger>
          <TabsTrigger value="ai-features" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            AI Features
          </TabsTrigger>
          <TabsTrigger value="merchant-value" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Merchant Value
          </TabsTrigger>
          <TabsTrigger value="projections" className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            Projections
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="space-y-6">
            <RevenueOverview merchant={merchant} />
            <RevenueCharts merchant={merchant} />
          </div>
        </TabsContent>

        <TabsContent value="streams">
          <RevenueStreams merchant={merchant} />
        </TabsContent>

        <TabsContent value="subscriptions">
          <SubscriptionRevenue merchant={merchant} />
        </TabsContent>

        <TabsContent value="ai-features">
          <AIFeatures merchant={merchant} />
        </TabsContent>

        <TabsContent value="merchant-value">
          <MerchantValue merchant={merchant} />
        </TabsContent>

        <TabsContent value="projections">
          <RevenueProjections merchant={merchant} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RevenueModel;
