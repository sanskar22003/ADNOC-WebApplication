import React, { useState } from "react";
import {
  AlertTriangle,
  Activity,
  Battery,
  Thermometer,
  Zap,
  Clock,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  HardDrive,
  Settings
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import {  alertsDashboard } from "@/lib/api";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. Fetch real alert data
  const { data: alertResponse, isLoading: isAlertsLoading, refetch } = useQuery({
    queryKey: ["alerts"],
    queryFn: alertsDashboard,
    refetchInterval: 30000, // Optional: auto refresh every 30s
  });

  // 2. Process the latest 3 alerts from the API response
  const latestAlerts = alertResponse?.data?.slice(0, 3) || [];
  const totalAlertCount = alertResponse?.total || 0;

  // Sample data for charts (Keeping your visual placeholders)
  const voltageData = [
    { time: "06:00", voltage: 382, threshold: 420 },
    { time: "08:00", voltage: 385, threshold: 420 },
    { time: "10:00", voltage: 390, threshold: 420 },
    { time: "12:00", voltage: 395, threshold: 420 },
    { time: "14:00", voltage: 398, threshold: 420 },
    { time: "16:00", voltage: 400, threshold: 420 },
    { time: "18:00", voltage: 403, threshold: 420 },
  ];

  const temperatureData = [
    { time: "06:00", temp: 75 },
    { time: "08:00", temp: 78 },
    { time: "10:00", temp: 82 },
    { time: "12:00", temp: 85 },
    { time: "14:00", temp: 87 },
    { time: "16:00", temp: 89 },
    { time: "18:00", temp: 86 },
  ];

  const assetStatusData = [
    { name: "Operational", value: 68, color: "#10b981" },
    { name: "Maintenance", value: 15, color: "#f59e0b" },
    { name: "Idle", value: 12, color: "#6b7280" },
    { name: "Fault", value: 5, color: "#ef4444" },
  ];

  const assetMetrics = [
    { label: "Active Assets", value: "5", change: "+0", icon: <HardDrive className="h-5 w-5" /> },
    { label: "Avg Efficiency", value: "94.2%", change: "+0.8%", icon: <BarChart3 className="h-5 w-5" /> },
    { label: "Energy Consumption", value: "2.84", unit: "MW", change: "-0.12", icon: <Zap className="h-5 w-5" /> },
    { label: "Uptime", value: "100%", change: "+0.0%", icon: <Activity className="h-5 w-5" /> },
  ];

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  // Helper to get color based on severity
  const getSeverityStyles = (severity) => {
    switch (severity) {
      case 'P1': return 'bg-red-100 text-red-800 border-red-200';
      case 'P2': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  // Helper to format ISO timestamp to HH:mm
  const formatTime = (isoString) => {
    if (!isoString) return "--:--";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      {/* HEADER */}
      <header className="mb-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">System Dashboard</h1>
            <div className="flex items-center mt-1 text-gray-600">
              <span className="text-sm flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                Last Update: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center px-4 py-2 bg-white border border-gray-300 rounded-sm text-sm font-medium text-gray-700 hover:bg-gray-50 mr-3 ${isRefreshing ? 'opacity-70' : ''}`}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              {isRefreshing ? 'Refreshing...' : 'Refresh Data'}
            </button>
            <button className="p-2 bg-white border border-gray-300 rounded-sm hover:bg-gray-50">
              <Settings className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* METRIC CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {assetMetrics.map((metric, index) => (
            <div key={index} className="bg-white rounded-sm border border-gray-200 p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-sm bg-gray-50">
                  <div className="text-gray-600">{metric.icon}</div>
                </div>
                <div className={`text-sm font-medium ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold text-gray-900">{metric.value}{metric.unit || ''}</p>
                <p className="text-sm text-gray-500 mt-1">{metric.label}</p>
              </div>
            </div>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - ALERTS & ASSET STATUS */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* ACTIVE ALERTS CARD */}
          <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center">
                <div className="p-2 rounded-sm bg-red-50 mr-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h2 className="font-bold text-lg text-gray-900">Recent Alerts</h2>
              </div>
              <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                {totalAlertCount} Total
              </span>
            </div>
            
            <div className="space-y-4">
              {isAlertsLoading ? (
                <div className="py-10 text-center text-gray-400">Loading alerts...</div>
              ) : latestAlerts.length > 0 ? (
                latestAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-4 border rounded-sm ${alert.severity === 'P1' ? 'bg-red-50 border-red-100' : 'bg-orange-50 border-orange-100'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-gray-900">{alert.asset_id}</h3>
                        <p className="text-sm text-gray-600">{alert.description}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded-sm uppercase ${getSeverityStyles(alert.severity)}`}>
                        {alert.severity}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3">
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Value</p>
                        <p className="font-bold text-lg text-red-700">{alert.value}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-gray-500 uppercase tracking-wider">Limit</p>
                        <p className="font-medium text-gray-900">
                          {alert.alert_type.includes("HIGH") ? alert.max_limit : alert.min_limit}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-gray-200/50 text-[11px] text-gray-500 flex justify-between items-center">
                      <div className="flex items-center">
                        <Clock className="h-3 w-3 mr-1" />
                        {formatTime(alert.alert_generated_at)}
                      </div>
                      <span className="italic font-medium">{alert.alert_type.replace(/_/g, ' ')}</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-10 text-center text-gray-400">No active alerts detected.</div>
              )}
              
              <Link to="/app/alerts">
              {totalAlertCount > 3 && (
                <button className="w-full py-3 text-sm text-blue-600 font-medium hover:underline text-center">
                  View All {totalAlertCount} Alerts
                </button>
              )}
              </Link>
            </div>
          </div>

          {/* ASSET STATUS DISTRIBUTION */}
          <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center mb-5">
              <div className="p-2 rounded-sm bg-blue-50 mr-3">
                <PieChartIcon className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">Asset Status</h2>
            </div>
            
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={assetStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {assetStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {assetStatusData.map((status, index) => (
                <div key={index} className="flex items-center p-2 rounded-sm bg-gray-50">
                  <div className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: status.color }}></div>
                  <span className="text-sm text-gray-700">{status.name}</span>
                  <span className="ml-auto text-sm font-medium text-gray-900">{status.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - CHARTS */}
        <div className="lg:col-span-2 space-y-6">
          {/* VOLTAGE TREND CHART */}
          <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <div>
                <div className="flex items-center mb-2">
                  <div className="p-2 rounded-sm bg-indigo-50 mr-3">
                    <Zap className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h2 className="font-bold text-lg text-gray-900">Live Trend - {latestAlerts[0]?.description || 'System Metrics'}</h2>
                </div>
                <p className="text-gray-500 text-sm">Real-time data stream from {latestAlerts[0]?.asset_id || 'Primary Asset'}</p>
              </div>
            </div>
            
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={voltageData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="time" stroke="#888" />
                  <YAxis stroke="#888" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="voltage" 
                    stroke="#4f46e5" 
                    fill="#4f46e5" 
                    fillOpacity={0.1}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ASSET METRICS SUMMARY BARS */}
          <div className="bg-white rounded-sm border border-gray-200 p-5 shadow-sm">
            <div className="flex items-center mb-6">
              <div className="p-2 rounded-sm bg-emerald-50 mr-3">
                <Activity className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-lg text-gray-900">Asset Metrics</h2>
            </div>
            
            <div className="space-y-5">
              <MetricBar label="Current" value={14} max={80} unit="A" color="blue" status="Optimal" />
              <MetricBar label="Vibration" value={2.8} max={5} unit="mm/s" color="green" status="Normal" />
              <MetricBar label="Pressure" value={4.2} max={6} unit="Bar" color="indigo" status="Optimal" />
              <MetricBar label="Battery" value={32} max={100} unit="%" color="yellow" status="Low" />
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
          <p>UltraTech Cement • Awarpur Plant • Dashboard v2.1</p>
          <p className="mt-2 md:mt-0">Data updates every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

// Reusable Metric Bar Component
const MetricBar = ({ label, value, max, unit, color, status }) => {
  const percentage = Math.min((value / max) * 100, 100);
  const colorMap = {
    blue: { bg: 'bg-blue-100', bar: 'bg-blue-600' },
    green: { bg: 'bg-green-100', bar: 'bg-green-600' },
    indigo: { bg: 'bg-indigo-100', bar: 'bg-indigo-600' },
    yellow: { bg: 'bg-yellow-100', bar: 'bg-yellow-600' },
  };
  
  const statusColor = status === 'Optimal' ? 'text-green-600' : 
                     status === 'Normal' ? 'text-blue-600' : 
                     status === 'Warning' ? 'text-yellow-600' : 'text-red-600';
  
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <div className="flex items-center">
          <span className="font-bold text-gray-900 mr-2">{value}{unit}</span>
          <span className={`text-xs font-medium ${statusColor}`}>{status}</span>
        </div>
      </div>
      <div className={`w-full h-2 rounded-full ${colorMap[color].bg}`}>
        <div 
          className={`h-2 rounded-full ${colorMap[color].bar} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default Dashboard;