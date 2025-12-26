import React from "react";

const dummyActivities = Array.from({ length: 25 }, (_, index) => ({
  id: index + 1,
  event: `Activity #${index + 1}: Report status updated.`,
  time: `${(index + 1) * 3} minutes ago`,
}));

const ActivityLog = () => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-4">Activity Log</h2>
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {dummyActivities.map((activity) => (
          <div key={activity.id} className="border-l-4 border-green-500 pl-4 py-2 hover:bg-gray-100 transition">
            <p>{activity.event}</p>
            <p className="text-sm text-gray-500">{activity.time}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLog;
