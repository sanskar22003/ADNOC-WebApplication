import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Activity,
  Clock,
  ShieldAlert,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { alerts } from "@/lib/api";
import Urls from "@/config/urls";
import { DataTableDemo } from "@/components/DataTable";

const IoTDashboard = () => {
  const [isRealTime, setIsRealTime] = useState(false);

  // 🔑 SERVER PAGINATION STATE (single source of truth)
  const [pageIndex, setPageIndex] = useState(0); // 0-based
  const [pageSize, setPageSize] = useState(10);

  // 🔑 API QUERY
  const { data: alertResponse, isLoading } = useQuery({
    queryKey: ["alerts", pageIndex + 1, pageSize],
    queryFn: alerts,
    enabled: !isRealTime,
    keepPreviousData: true,
  });

  const alertHistory = alertResponse?.data || [];
  const totalCount = alertResponse?.total || 0;

  // KPI calculations
  const totalAssetsWithAlerts = new Set(
    alertHistory.map((a) => a.asset_id)
  ).size;


// 🔑 TABLE COLUMNS (MATCHED TO BACKEND KEYS)
const columns = [
  {
    accessorKey: "asset_id",
    header: "Asset ID",
    cell: ({ row }) => (
      <span className="font-bold text-slate-700">
        {row.getValue("asset_id")}
      </span>
    ),
  },
  {
    accessorKey: "tag_name",
    header: "Tag Name",
    cell: ({ row }) => (
      <code className="text-xs text-blue-600 bg-blue-50 px-1 rounded">
        {row.getValue("tag_name")}
      </code>
    ),
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "value",
    header: "Current Value",
    cell: ({ row }) => (
      <span className="font-mono font-bold">
        {row.getValue("value")}
      </span>
    ),
  },
  {
    accessorKey: "base_value",
    header: "Target",
    cell: ({ row }) => (
      <span className="text-slate-500">
        {row.getValue("base_value")}
      </span>
    ),
  },

  // ✅ OPTIONAL: LIMIT RANGE (NEW COLUMN)
  {
    id: "limits",
    header: "Limits",
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {row.original.min_limit} – {row.original.max_limit}
      </span>
    ),
  },

  {
    accessorKey: "alert_type",
    header: "Alert Type",
    cell: ({ row }) => {
      const type = row.getValue("alert_type");
      const isLow = type?.includes("LOW");
      const isHigh = type?.includes("HIGH");

      return (
        <span
          className={`px-2 py-1 rounded text-[10px] font-black uppercase
            ${
              isHigh
                ? "bg-orange-100 text-orange-700"
                : isLow
                ? "bg-blue-100 text-blue-700"
                : "bg-slate-100 text-slate-700"
            }`}
        >
          {type?.replaceAll("_", " ")}
        </span>
      );
    },
  },

  {
    accessorKey: "severity",
    header: "Severity",
    cell: ({ row }) => {
      const sev = row.getValue("severity");
      const colors = {
        P1: "bg-red-500 text-white",
        P2: "bg-orange-400 text-white",
        P3: "bg-yellow-400 text-slate-900",
      };

      return (
        <span
          className={`px-2 py-0.5 rounded text-xs font-bold ${
            colors[sev] || "bg-slate-200"
          }`}
        >
          {sev}
        </span>
      );
    },
  },

  {
    accessorKey: "timestamp",
    header: "Reading Time",
    cell: ({ row }) => {
      const date = new Date(row.getValue("timestamp"));
      return (
        <div className="text-xs text-slate-500 flex items-center gap-1">
          <Clock size={12} />
          {date.toLocaleString()}
        </div>
      );
    },
  },

  // ✅ OPTIONAL: ALERT GENERATED TIME
  {
    accessorKey: "alert_generated_at",
    header: "Alert Generated",
    cell: ({ row }) => {
      const date = new Date(row.getValue("alert_generated_at"));
      return (
        <div className="text-xs text-slate-400">
          {date.toLocaleString()}
        </div>
      );
    },
  },
];

  // 🔑 REAL-TIME SOCKET
  const [realTimeLogs, setRealTimeLogs] = useState([]);

  useEffect(() => {
    let socket;
    if (isRealTime) {
      socket = new WebSocket(`${Urls.baseURLWeb}/ws/alerts`);
      socket.onmessage = (e) =>
        setRealTimeLogs((prev) => [
          JSON.parse(e.data),
          ...prev,
        ].slice(0, 15));
    }
    return () => socket?.close();
  }, [isRealTime]);

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* 🔁 TOGGLE */}
      <div className="flex justify-end px-6 py-4">
        <div className="flex items-center gap-3 bg-white p-2 rounded-full border shadow-sm">
          <span className={!isRealTime ? "text-blue-600 text-xs font-bold" : "text-slate-400 text-xs"}>
            REAL TIME
          </span>
          <button
            onClick={() => setIsRealTime((v) => !v)}
            className={`w-10 h-5 rounded-full transition ${
              isRealTime ? "bg-green-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`block h-3 w-3 bg-white rounded-full transform transition ${
                isRealTime ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
          <span className={isRealTime ? "text-green-600 text-xs font-bold" : "text-slate-400 text-xs"}>
            LIVE
          </span>
        </div>
      </div>

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        {isRealTime ? (
          <DataTableDemo
            data={realTimeLogs}
            columns={columns}
            isLoading={false}
            disablePagination
          />
        ) : (
          <>
            {/* KPI */}
            <div className="flex gap-4">
              <div className=" flex justify-center  gap-2 items-center">
                <h3 className="text-2xl uppercase ">Total Alerts - </h3>
                <h3 className="text-2xl font-black">{totalCount}</h3>
              </div>

              {/* <div className="bg-white p-5 rounded-xl border shadow-sm">
                <p className="text-xs uppercase text-slate-400">Affected Assets</p>
                <h3 className="text-3xl font-black">{totalAssetsWithAlerts}</h3>
              </div> */}
            </div>

            <DataTableDemo
              data={alertHistory}
              columns={columns}
              isLoading={isLoading}
              pagination={{
                pageIndex,
                pageSize,
                totalCount,
                setPageIndex,
                setPageSize,
              }}
            />
          </>
        )}
      </main>
    </div>
  );
};

export default IoTDashboard;
