
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Eye, 
  Activity,
  Target,
  Brain,
  Lock,
  TrendingDown,
  TrendingUp,
  Users,
  Clock
} from "lucide-react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

interface FraudDetectionProps {
  merchant: any;
}

const FraudDetection = ({ merchant }: FraudDetectionProps) => {
  const [fraudData, setFraudData] = useState<any>(null);
  const [alertSettings, setAlertSettings] = useState({
    velocityChecks: true,
    deviceFingerprinting: true,
    behavioralAnalysis: true,
    geoLocationChecks: true,
    realTimeScoring: true
  });

  useEffect(() => {
    // Comprehensive fraud detection data
    const mockData = {
      overview: {
        riskScore: 23, // Out of 100 (lower is better)
        threatsBlocked: 127,
        totalTransactions: 8420,
        fraudRate: 0.12, // Percentage
        falsePositives: 8,
        accuracyRate: 97.8
      },
      realTimeMetrics: {
        currentThreats: 3,
        activeMonitoring: 1847,
        riskLevel: "Low",
        lastUpdate: "30 seconds ago"
      },
      detectionMethods: [
        {
          name: "Velocity Checks",
          description: "Monitors transaction frequency and amounts",
          enabled: true,
          threatsBlocked: 45,
          accuracy: 96.5,
          falsePositiveRate: 2.1
        },
        {
          name: "Device Fingerprinting", 
          description: "Analyzes device characteristics and behavior",
          enabled: true,
          threatsBlocked: 32,
          accuracy: 94.8,
          falsePositiveRate: 3.2
        },
        {
          name: "Behavioral Analysis",
          description: "AI-powered user behavior pattern recognition",
          enabled: true,
          threatsBlocked: 28,
          accuracy: 98.2,
          falsePositiveRate: 1.5
        },
        {
          name: "Geo-location Verification",
          description: "Location-based fraud detection",
          enabled: true,
          threatsBlocked: 15,
          accuracy: 92.4,
          falsePositiveRate: 4.1
        },
        {
          name: "Machine Learning Scoring",
          description: "Advanced AI risk assessment",
          enabled: true,
          threatsBlocked: 7,
          accuracy: 99.1,
          falsePositiveRate: 0.8
        }
      ],
      recentAlerts: [
        {
          id: "ALERT001",
          type: "High Velocity",
          severity: "High",
          amount: 250000,
          customer: "Anonymous User",
          location: "Lagos, Nigeria",
          time: "2 minutes ago",
          status: "Blocked",
          confidence: 94
        },
        {
          id: "ALERT002", 
          type: "Device Mismatch",
          severity: "Medium",
          amount: 85000,
          customer: "John D.",
          location: "Abuja, Nigeria",
          time: "15 minutes ago", 
          status: "Under Review",
          confidence: 87
        },
        {
          id: "ALERT003",
          type: "Unusual Pattern",
          severity: "Low",
          amount: 45000,
          customer: "Sarah M.",
          location: "Port Harcourt, Nigeria",
          time: "1 hour ago",
          status: "Cleared",
          confidence: 72
        }
      ],
      weeklyTrend: [
        { day: "Mon", threats: 18, blocked: 17, cleared: 1 },
        { day: "Tue", threats: 22, blocked: 20, cleared: 2 },
        { day: "Wed", threats: 15, blocked: 14, cleared: 1 },
        { day: "Thu", threats: 28, blocked: 26, cleared: 2 },
        { day: "Fri", threats: 31, blocked: 29, cleared: 2 },
        { day: "Sat", threats: 19, blocked: 18, cleared: 1 },
        { day: "Sun", threats: 14, blocked: 13, cleared: 1 }
      ],
      fraudTypes: [
        { type: "Card Testing", count: 45, trend: -12 },
        { type: "Account Takeover", count: 32, trend: +8 },
        { type: "Synthetic Identity", count: 28, trend: -5 },
        { type: "Payment Fraud", count: 15, trend: -18 },
        { type: "Chargeback Fraud", count: 7, trend: -25 }
      ],
      aiInsights: [
        {
          type: "pattern",
          title: "Suspicious Transaction Pattern Detected",
          description: "Multiple small transactions from same device cluster within 1 hour",
          riskLevel: "Medium",
          recommendation: "Implement velocity limits for new devices",
          confidence: 89
        },
        {
          type: "geographic",
          title: "Geographic Anomaly",
          description: "Transaction locations inconsistent with historical customer behavior",
          riskLevel: "Low",
          recommendation: "Enable geo-fencing for this customer segment",
          confidence: 76
        },
        {
          type: "behavioral",
          title: "Behavioral Deviation",
          description: "Customer interaction patterns differ significantly from established baseline",
          riskLevel: "High",
          recommendation: "Require additional authentication for large transactions",
          confidence: 94
        }
      ]
    };
    setFraudData(mockData);
  }, []);

  if (!fraudData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-600">Loading fraud detection data...</p>
        </div>
      </div>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "High": return "text-red-600 bg-red-50 border-red-200";
      case "Medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "Low": return "text-blue-600 bg-blue-50 border-blue-200";
      default: return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Blocked":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "Under Review":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "Cleared":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Fraud Detection Header */}
      <Card className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 text-white">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-8 w-8" />
            <div>
              <h2 className="text-2xl font-bold">Advanced Fraud Detection</h2>
              <p className="text-red-100">AI-powered security protecting your business 24/7</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold">{fraudData.overview.riskScore}</div>
              <div className="text-red-100">Risk Score (Low)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{fraudData.overview.threatsBlocked}</div>
              <div className="text-red-100">Threats Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{fraudData.overview.accuracyRate}%</div>
              <div className="text-red-100">Detection Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">{fraudData.overview.fraudRate}%</div>
              <div className="text-red-100">Fraud Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Real-time Monitoring */}
        <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Real-time Monitoring
            </CardTitle>
            <CardDescription>Current security status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Risk Level</span>
              <Badge className="bg-green-100 text-green-700">
                {fraudData.realTimeMetrics.riskLevel}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Active Threats</span>
              <span className="text-2xl font-bold text-orange-600">
                {fraudData.realTimeMetrics.currentThreats}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Monitoring</span>
              <span className="text-lg font-bold text-blue-600">
                {fraudData.realTimeMetrics.activeMonitoring.toLocaleString()}
              </span>
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {fraudData.realTimeMetrics.lastUpdate}
            </div>
          </CardContent>
        </Card>

        {/* Overview Metrics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              Detection Performance
            </CardTitle>
            <CardDescription>Key fraud prevention metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Accuracy Rate</span>
                  <span className="text-sm font-medium">{fraudData.overview.accuracyRate}%</span>
                </div>
                <Progress value={fraudData.overview.accuracyRate} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">False Positive Rate</span>
                  <span className="text-sm font-medium">2.2%</span>
                </div>
                <Progress value={2.2} className="h-2" />
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm">Total Transactions</span>
                <span className="font-bold">{fraudData.overview.totalTransactions.toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-purple-500" />
              Security Controls
            </CardTitle>
            <CardDescription>Manage fraud detection settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.entries(alertSettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm font-medium">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </span>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setAlertSettings({...alertSettings, [key]: checked})
                  }
                />
              </div>
            ))}
            <Button className="w-full mt-4" variant="outline">
              Advanced Settings
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Detection Methods */}
      <Card>
        <CardHeader>
          <CardTitle>Fraud Detection Methods</CardTitle>
          <CardDescription>Multi-layered security approach with AI-powered analysis</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {fraudData.detectionMethods.map((method: any, index: number) => (
              <div key={index} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-medium">{method.name}</h4>
                  <Badge variant={method.enabled ? "default" : "secondary"}>
                    {method.enabled ? "Active" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{method.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Threats Blocked:</span>
                    <span className="font-medium">{method.threatsBlocked}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Accuracy:</span>
                    <span className="font-medium text-green-600">{method.accuracy}%</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>False Positive:</span>
                    <span className="font-medium text-orange-600">{method.falsePositiveRate}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Fraud Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Fraud Activity</CardTitle>
            <CardDescription>Threats detected and actions taken</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={fraudData.weeklyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="blocked" fill="#ef4444" name="Blocked" />
                <Bar dataKey="cleared" fill="#22c55e" name="Cleared" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Fraud Types Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Fraud Types Analysis</CardTitle>
            <CardDescription>Most common fraud attempts and trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fraudData.fraudTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{type.type}</p>
                    <p className="text-sm text-gray-600">{type.count} attempts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {type.trend > 0 ? (
                      <TrendingUp className="h-4 w-4 text-red-500" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-green-500" />
                    )}
                    <span className={`text-sm font-medium ${
                      type.trend > 0 ? 'text-red-600' : 'text-green-600'
                    }`}>
                      {type.trend > 0 ? '+' : ''}{type.trend}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Alerts */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Alerts</CardTitle>
          <CardDescription>Latest fraud detection activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fraudData.recentAlerts.map((alert: any) => (
              <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  {getStatusIcon(alert.status)}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{alert.type}</span>
                      <Badge className={getSeverityColor(alert.severity)}>
                        {alert.severity}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      {alert.customer} • ₦{alert.amount.toLocaleString()} • {alert.location}
                    </p>
                    <p className="text-xs text-gray-500">{alert.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant="outline" className={
                    alert.status === "Blocked" ? "border-red-200 text-red-600" :
                    alert.status === "Under Review" ? "border-yellow-200 text-yellow-600" :
                    "border-green-200 text-green-600"
                  }>
                    {alert.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{alert.confidence}% confidence</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-purple-500" />
            AI Security Insights
          </CardTitle>
          <CardDescription>Advanced pattern recognition and recommendations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {fraudData.aiInsights.map((insight: any, index: number) => (
              <Alert key={index} className={
                insight.riskLevel === "High" ? "border-red-200 bg-red-50" :
                insight.riskLevel === "Medium" ? "border-yellow-200 bg-yellow-50" :
                "border-blue-200 bg-blue-50"
              }>
                <Eye className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{insight.title}</h4>
                      <Badge variant="outline" className={
                        insight.riskLevel === "High" ? "border-red-300 text-red-700" :
                        insight.riskLevel === "Medium" ? "border-yellow-300 text-yellow-700" :
                        "border-blue-300 text-blue-700"
                      }>
                        {insight.riskLevel} Risk
                      </Badge>
                    </div>
                    <p className="text-sm">{insight.description}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-blue-600">{insight.recommendation}</p>
                      <span className="text-xs text-gray-500">{insight.confidence}% confidence</span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FraudDetection;
