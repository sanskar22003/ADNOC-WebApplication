import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Server,
  Database,
  MessageCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { healthapi } from "@/lib/api";

/* =========================
   HEALTH CHECK CARD
========================= */
const HealthCard = ({ title, description, status, icon }) => {
  const isUp = status === "UP";

  return (
    <div className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 rounded-2xl p-6 shadow-md hover:shadow-xl transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div
            className={`p-4 rounded-xl ${
              isUp
                ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                : "bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-400"
            }`}
          >
            {icon || <Server size={24} />}
          </div>

          <div>
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              {title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          </div>
        </div>

        {isUp ? (
          <CheckCircle
            className="text-blue-500 dark:text-blue-400"
            size={24}
          />
        ) : (
          <XCircle className="text-red-500 dark:text-red-400" size={24} />
        )}
      </div>

      <div className="flex justify-between items-center">
        <span
          className={`font-semibold ${
            isUp
              ? "text-blue-600 dark:text-blue-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {isUp ? "Healthy" : "Down"}
        </span>

        <span className="text-xs text-gray-400 dark:text-gray-500">
          Last checked: {new Date().toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};

/* =========================
   TOOLS PAGE
========================= */
const Tools = () => {
  const {
    data: healthResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["health"],
    queryFn: healthapi,
    refetchInterval: 10000,
  });

  const services = [];

  if (healthResponse) {
    services.push({
      key: "overall",
      title: "Overall System Health",
      description: `Status: ${healthResponse.status}`,
      status: healthResponse.status,
      icon: <Server size={24} />,
    });

    Object.entries(healthResponse.services || {}).forEach(([key, value]) => {
      services.push({
        key,
        title:
          key === "kafka"
            ? "Kafka Broker"
            : key === "mongodb"
            ? "MongoDB"
            : key,
        description:
          value.status === "UP"
            ? value.latency_ms
              ? `Latency: ${value.latency_ms} ms`
              : "Running"
            : value.error || "Service Down",
        status: value.status,
        icon:
          key === "kafka" ? (
            <MessageCircle size={24} />
          ) : (
            <Database size={24} />
          ),
      });
    });
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-900 p-6">
      <div className=" mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Tools & System Health
        </h2>

        {isLoading && (
          <p className="text-gray-600 dark:text-gray-400">
            Loading health status...
          </p>
        )}

        {isError && (
          <p className="text-red-500 dark:text-red-400">
            {error?.message || "Failed to fetch health data"}
          </p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <HealthCard
              key={service.key}
              title={service.title}
              // description={service.description}
              status={service.status}
              icon={service.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Tools;
