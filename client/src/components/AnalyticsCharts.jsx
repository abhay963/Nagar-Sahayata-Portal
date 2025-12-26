import React, { useState, useEffect, useRef } from "react";
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

// Sample Data
const issueTrendData = [
  { month: "Jan", reports: 120, high: 40 },
  { month: "Feb", reports: 98, high: 35 },
  { month: "Mar", reports: 150, high: 50 },
  { month: "Apr", reports: 200, high: 70 },
  { month: "May", reports: 170, high: 60 },
  { month: "Jun", reports: 220, high: 80 },
];

const issueStatusData = [
  { name: "Resolved", value: 980 },
  { name: "Pending", value: 265 },
  { name: "In Progress", value: 120 },
];

const departmentData = [
  { department: "Sanitation", Resolved: 320, Pending: 40, InProgress: 20 },
  { department: "Roads", Resolved: 450, Pending: 50, InProgress: 30 },
  { department: "Water", Resolved: 210, Pending: 30, InProgress: 20 },
  { department: "Electricity", Resolved: 120, Pending: 20, InProgress: 10 },
];

const COLORS = ["#16a34a", "#dc2626", "#facc15"]; // Green, Red, Yellow
const PRIORITY_COLORS = { High: "#dc2626", Medium: "#facc15", Low: "#16a34a" };

const AnalyticsCharts = () => {
  const [barVisible, setBarVisible] = useState(false);
  const [pieVisible, setPieVisible] = useState(false);
  const [deptVisible, setDeptVisible] = useState(false);
  const [highTrendVisible, setHighTrendVisible] = useState(false);

  const barRef = useRef(null);
  const pieRef = useRef(null);
  const deptRef = useRef(null);
  const highTrendRef = useRef(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.3 };

    const observer = (ref, setVisible) =>
      new IntersectionObserver(([entry], observerInstance) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observerInstance.disconnect();
        }
      }, observerOptions);

    if (barRef.current) observer(barRef.current, setBarVisible).observe(barRef.current);
    if (pieRef.current) observer(pieRef.current, setPieVisible).observe(pieRef.current);
    if (deptRef.current) observer(deptRef.current, setDeptVisible).observe(deptRef.current);
    if (highTrendRef.current) observer(highTrendRef.current, setHighTrendVisible).observe(highTrendRef.current);
  }, []);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* KPI Cards */}
      <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <h4>Total Reports</h4>
          <span className="text-2xl font-bold text-blue-600">
            <CountUp start={0} end={1245} duration={2} separator="," />
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <h4>Resolved</h4>
          <span className="text-2xl font-bold text-green-600">
            <CountUp start={0} end={980} duration={2} separator="," />
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <h4>Pending</h4>
          <span className="text-2xl font-bold text-yellow-500">
            <CountUp start={0} end={265} duration={2} separator="," />
          </span>
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-center">
          <h4>High Priority</h4>
          <span className="text-2xl font-bold text-red-600">
            <CountUp start={0} end={80} duration={2} separator="," />
          </span>
        </div>
      </div>

      {/* Reports Over Time */}
      <div ref={barRef} className="bg-white shadow-md rounded-2xl p-5 min-h-[350px]">
        <h2 className="text-xl font-bold mb-4">Reports Over Time</h2>
        {barVisible ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={issueTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="reports" fill="#16a34a" radius={[6, 6, 0, 0]} isAnimationActive />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">Scroll to load chart...</div>
        )}
      </div>

      {/* High Priority Trend */}
      <div ref={highTrendRef} className="bg-white shadow-md rounded-2xl p-5 min-h-[350px]">
        <h2 className="text-xl font-bold mb-4">High Priority Reports Trend</h2>
        {highTrendVisible ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={issueTrendData}>
              <XAxis dataKey="month" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="high"
                stroke="#dc2626"
                strokeWidth={3}
                activeDot={{ r: 8 }}
                isAnimationActive
                animationDuration={1500}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">Scroll to load chart...</div>
        )}
      </div>

      {/* Department-wise Status */}
      <div ref={deptRef} className="bg-white shadow-md rounded-2xl p-5 min-h-[350px]">
        <h2 className="text-xl font-bold mb-4">Department-wise Issues</h2>
        {deptVisible ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentData}>
              <XAxis dataKey="department" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="Resolved" stackId="a" fill="#16a34a" />
              <Bar dataKey="Pending" stackId="a" fill="#facc15" />
              <Bar dataKey="InProgress" stackId="a" fill="#dc2626" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">Scroll to load chart...</div>
        )}
      </div>

      {/* Pie Chart */}
      <div ref={pieRef} className="bg-white shadow-md rounded-2xl p-5 min-h-[350px]">
        <h2 className="text-xl font-bold mb-4">Issue Status Distribution</h2>
        {pieVisible ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={issueStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
                isAnimationActive
              >
                {issueStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[300px] flex items-center justify-center text-gray-400">Scroll to load chart...</div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsCharts;
