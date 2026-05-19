import React, { useState, useEffect } from "react";

import axios from "../api/axios";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";

import CountUp from "react-countup";

const COLORS = [
  "#16a34a",
  "#dc2626",
  "#facc15",
  "#2563eb",
  "#9333ea",
  "#ea580c",
];

const AnalyticsCharts = () => {

  // ======================================================
  // STATE
  // ======================================================

  const [loading, setLoading] =
    useState(true);

  const [analytics, setAnalytics] =
    useState({

      totalReports: 0,

      resolvedReports: 0,

      pendingReports: 0,

      highPriority: 0,

      issueTrendData: [],

      issueStatusData: [],

      departmentData: [],
    });

  // ======================================================
  // FETCH ANALYTICS
  // ======================================================

  useEffect(() => {

    fetchAnalytics();

  }, []);

  const fetchAnalytics = async () => {

    try {

      setLoading(true);

      const res =
        await axios.get(
          "/api/reports/analytics"
        );

      setAnalytics(
        res.data.analytics
      );

    } catch (error) {

      console.error(
        "Analytics Error:",
        error
      );

    } finally {

      setLoading(false);
    }
  };

  // ======================================================
  // LOADING
  // ======================================================

  if (loading) {

    return (

      <div className="min-h-[500px] flex items-center justify-center">

        <div className="text-center">

          <div className="w-14 h-14 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>

          <p className="mt-4 text-lg font-medium text-gray-600">

            Loading Analytics...

          </p>

        </div>

      </div>
    );
  }

  // ======================================================
  // UI
  // ======================================================

  return (

    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">

      {/* ====================================================== */}
      {/* KPI CARDS */}
      {/* ====================================================== */}

      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {/* TOTAL REPORTS */}

        <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-3xl shadow-xl">

          <h4 className="text-lg font-medium">

            Total Reports

          </h4>

          <span className="text-4xl font-black mt-3 block">

            <CountUp
              start={0}
              end={analytics.totalReports}
              duration={2}
              separator=","
            />

          </span>

        </div>

        {/* RESOLVED */}

        <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-3xl shadow-xl">

          <h4 className="text-lg font-medium">

            Resolved

          </h4>

          <span className="text-4xl font-black mt-3 block">

            <CountUp
              start={0}
              end={analytics.resolvedReports}
              duration={2}
              separator=","
            />

          </span>

        </div>

        {/* PENDING */}

        <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 text-white p-6 rounded-3xl shadow-xl">

          <h4 className="text-lg font-medium">

            Pending

          </h4>

          <span className="text-4xl font-black mt-3 block">

            <CountUp
              start={0}
              end={analytics.pendingReports}
              duration={2}
              separator=","
            />

          </span>

        </div>

        {/* HIGH PRIORITY */}

        <div className="bg-gradient-to-br from-red-500 to-red-700 text-white p-6 rounded-3xl shadow-xl">

          <h4 className="text-lg font-medium">

            High Priority

          </h4>

          <span className="text-4xl font-black mt-3 block">

            <CountUp
              start={0}
              end={analytics.highPriority}
              duration={2}
              separator=","
            />

          </span>

        </div>

      </div>

      {/* ====================================================== */}
      {/* REPORTS OVER TIME */}
      {/* ====================================================== */}

      <div className="bg-white shadow-lg rounded-3xl p-6 min-h-[380px]">

        <h2 className="text-2xl font-bold mb-5 text-gray-800">

          Reports Over Time

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={
              analytics.issueTrendData
            }
          >

            <XAxis dataKey="month" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="reports"
              fill="#16a34a"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ====================================================== */}
      {/* HIGH PRIORITY TREND */}
      {/* ====================================================== */}

      <div className="bg-white shadow-lg rounded-3xl p-6 min-h-[380px]">

        <h2 className="text-2xl font-bold mb-5 text-gray-800">

          High Priority Trend

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <LineChart
            data={
              analytics.issueTrendData
            }
          >

            <XAxis dataKey="month" />

            <YAxis />

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="high"
              stroke="#dc2626"
              strokeWidth={4}
              activeDot={{ r: 8 }}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>

      {/* ====================================================== */}
      {/* DEPARTMENT CHART */}
      {/* ====================================================== */}

      <div className="bg-white shadow-lg rounded-3xl p-6 min-h-[380px]">

        <h2 className="text-2xl font-bold mb-5 text-gray-800">

          Department-wise Issues

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart
            data={
              analytics.departmentData
            }
          >

            <XAxis
              dataKey="department"
            />

            <YAxis />

            <Tooltip />

            <Legend />

            <Bar
              dataKey="Resolved"
              stackId="a"
              fill="#16a34a"
            />

            <Bar
              dataKey="Pending"
              stackId="a"
              fill="#facc15"
            />

            <Bar
              dataKey="InProgress"
              stackId="a"
              fill="#dc2626"
            />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* ====================================================== */}
      {/* STATUS DISTRIBUTION */}
      {/* ====================================================== */}

      <div className="bg-white shadow-lg rounded-3xl p-6 min-h-[380px]">

        <h2 className="text-2xl font-bold mb-5 text-gray-800">

          Status Distribution

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={
                analytics.issueStatusData
              }

              dataKey="value"

              nameKey="name"

              cx="50%"

              cy="50%"

              outerRadius={100}

              label
            >

              {analytics.issueStatusData.map(

                (entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index %
                        COLORS.length
                      ]
                    }
                  />
                )
              )}

            </Pie>

            <Tooltip />

            <Legend />

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>
  );
};

export default AnalyticsCharts;