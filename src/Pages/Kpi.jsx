import React from "react";
import { DataTableDemo } from "@/components/DataTable";
import { Activity, Battery, Thermometer, Zap } from "lucide-react";
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
} from "recharts";

/* ================= KPI PAGE ================= */
const Kpi = () => {
  // Empty data because API is not integrated yet
  const alertData = [];
  const lineData = [
    { time: "10:00", voltage: 380 },
    { time: "11:00", voltage: 390 },
    { time: "12:00", voltage: 400 },
    { time: "13:00", voltage: 395 },
  ];

  const pieData = [
    { name: "Healthy", value: 6 },
    { name: "Warning", value: 2 },
    { name: "Critical", value: 1 },
  ];

  const COLORS = ["#0f766e", "#facc15", "#f87171"];

  /* ===== TABLE COLUMNS ===== */
  const columns = [
    { accessorKey: "company_id", header: "Company ID" },
    { accessorKey: "company_name", header: "Company Name" },
    { accessorKey: "site_id", header: "Site ID" },
    { accessorKey: "site_name", header: "Site Name" },
    { accessorKey: "asset_id", header: "Asset ID" },
    { accessorKey: "asset_name", header: "Asset Name" },
    { accessorKey: "asset_type", header: "Asset Type" },
    {
      accessorKey: "parameter",
      header: "Parameter",
      cell: ({ row }) => (
        <span className="capitalize">{row.getValue("parameter")}</span>
      ),
    },
    { accessorKey: "value", header: "Value" },
    { accessorKey: "min_threshold", header: "Min Threshold" },
    { accessorKey: "max_threshold", header: "Max Threshold" },
    {
      accessorKey: "alert_status",
      header: "Alert Status",
    },
    {
      accessorKey: "timestamp",
      header: "Timestamp",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-800 p-6">
      <div className=" mx-auto">
        {/* ONLY TABLE */}
        <div className=" dark:bg-neutral-800  border-slate-200 p-0">
          {/* <h3 className="text-lg font-bold mb-3">Kpi Details</h3> */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <MetricCard
              label="Temperature"
              value={89}
              max={90}
              unit="°C"
              icon={<Thermometer className="text-orange-500" />}
              color="orange"
            />
            <MetricCard
              label="Voltage"
              value={398}
              max={440}
              unit="V"
              icon={<Zap className="text-yellow-500" />}
              color="yellow"
            />
            <MetricCard
              label="Current"
              value={14}
              max={80}
              unit="A"
              icon={<Activity className="text-green-500" />}
              color="green"
            />
            <MetricCard
              label="Battery"
              value={32}
              max={100}
              unit="%"
              icon={<Battery className="text-blue-500" />}
              color="blue"
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* LEFT SIDE — TABLE */}
            <div className="lg:col-span-2 bg-white dark:bg-neutral-800 rounded-sm border border-slate-200 p-4">
              <h3 className="text-lg font-bold mb-3">Alert Details</h3>

              <DataTableDemo
                data={alertData}
                columns={columns}
                emptyMessage="No alert data available"
              />
            </div>

            {/* RIGHT SIDE — CHARTS (UP & DOWN) */}
            <div className="flex flex-col gap-6">
              {/* Pie Chart */}
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-sm shadow-md">
                <h3 className="font-bold text-lg mb-2">
                  Asset Status Distribution
                </h3>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={70}
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {/* Line Chart */}
              <div className="bg-white dark:bg-neutral-800 p-4 rounded-sm shadow-md">
                <h3 className="font-bold text-lg mb-2">Voltage Over Time</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="voltage"
                      stroke="#3b82f6"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const colorMap = {
  orange: "bg-orange-500",
  yellow: "bg-yellow-500",
  green: "bg-green-500",
  blue: "bg-blue-500",
};

const MetricCard = ({ label, value, max, unit, icon, color }) => {
  const percentage = (value / max) * 100;

  return (
    <div className="text-center p-3 border rounded-sm bg-white dark:bg-neutral-800 dark:bg-neutral-900">
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-xs text-gray-500 uppercase">{label}</p>
      <p className="text-xl font-bold">
        {value}
        {unit}
      </p>
      <div className="w-full bg-gray-200 dark:bg-neutral-700 rounded-full h-1.5 mt-2">
        <div
          className={`${colorMap[color]} h-1.5 rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Kpi;
