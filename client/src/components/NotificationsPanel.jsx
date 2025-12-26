import React, { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import AuthContext from "../context/AuthContext";

// Fullscreen Image Component with Zoom and Drag
const FullscreenImageModal = ({ image, onClose }) => {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startDrag, setStartDrag] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Reset zoom and position when opening a new image
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [image]);

  // 🔍 Zoom in/out with mouse scroll
  const handleWheel = (e) => {
    e.preventDefault();
    const zoomSpeed = 0.1;
    setScale((prevScale) => {
      let newScale = prevScale + (e.deltaY < 0 ? zoomSpeed : -zoomSpeed);
      return Math.min(Math.max(newScale, 1), 5); // Limit between 1x and 5x
    });
  };

  // 🖱️ Start dragging
  const handleMouseDown = (e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartDrag({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  // 🖱️ Dragging
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startDrag.x,
        y: e.clientY - startDrag.y,
      });
    }
  };

  // 🖱️ Stop dragging
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 🔄 Double click to reset
  const handleDoubleClick = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
      onWheel={handleWheel}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={handleDoubleClick}
    >
      <img
        src={image}
        alt="Fullscreen"
        className="max-w-full max-h-full object-contain select-none"
        style={{
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? "none" : "transform 0.2s ease",
          cursor: scale > 1 ? (isDragging ? "grabbing" : "grab") : "zoom-in",
        }}
        onMouseDown={handleMouseDown}
        draggable={false} // Prevent default drag image behavior
      />
      <button
        className="absolute top-4 right-4 text-white text-2xl font-bold cursor-pointer"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        ✖
      </button>
    </div>
  );
};

const NotificationsPanel = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const { user: currentUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchNotificationsOrTasks = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        if (currentUser.role === "Junior Staff") {
          const assignedRes = await axios.get("/api/reports/assigned");
          const assignedNotifications = assignedRes.data.map((report) => ({
            _id: report._id,
            message: `Assigned Report: ${report.problemType} at ${
              report.location?.location || "Unknown location"
            }`,
            isRead: false,
            createdAt: report.createdAt,
            taskInfo: {
              ...report,
              image:
                report.imageUri ||
                (report.imageBase64
                  ? `data:image/jpeg;base64,${report.imageBase64}`
                  : null),
            },
          }));
          setNotifications(assignedNotifications);
        } else {
          const notifRes = await axios.get("/api/notifications");
          setNotifications(notifRes.data);
        }
      } catch (error) {
        console.error(
          "Failed to fetch notifications or assigned reports",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotificationsOrTasks();
  }, [currentUser]);

  const markAsRead = async (id) => {
    try {
      await axios.put(`/api/notifications/${id}/read`);
      setNotifications((prev) =>
        prev.map((note) =>
          note._id === id ? { ...note, isRead: true } : note
        )
      );
    } catch (error) {
      console.error("Failed to mark notification as read", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put("/api/notifications/mark-all-read");
      setNotifications((prev) =>
        prev.map((note) => ({ ...note, isRead: true }))
      );
    } catch (error) {
      console.error("Failed to mark all notifications as read", error);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axios.delete(`/api/notifications/${id}`);
      setNotifications((prev) => prev.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Failed to delete notification", error);
    }
  };

  const markAsResolved = async (id) => {
    try {
      await axios.put(`/api/reports/${id}/resolve`);
      setNotifications((prev) =>
        prev.map((note) =>
          note._id === id
            ? {
                ...note,
                taskInfo: { ...note.taskInfo, status: "Resolved" },
              }
            : note
        )
      );
    } catch (error) {
      console.error("Failed to mark as resolved", error);
    }
  };

  const formatTime = (timestamp) => {
    const now = new Date();
    const createdAt = new Date(timestamp);
    const diffInMinutes = Math.floor((now - createdAt) / (1000 * 60));
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Notifications</h2>
        <p className="text-black">Loading...</p>
      </div>
    );
  }

  const allNotesToShow = notifications; // This line already exists, making the original ternary redundant.

  return (
    <>
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4 text-black">Notifications</h2>
        <div className="flex justify-between mb-2">
          <button
            className="text-blue-600 hover:underline"
            onClick={() => setShowAll(true)}
          >
            Show All
          </button>
          <button
            className="text-blue-600 hover:underline"
            onClick={markAllAsRead}
          >
            Mark All as Read
          </button>
        </div>
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {showAll ? (
            <p className="text-black text-center py-4">
              All notifications are shown in the modal below.
            </p>
          ) : notifications.length === 0 ? (
            <p className="text-black text-center py-4">No notifications</p>
          ) : (
            notifications.slice(0, 5).map((note) => (
              <div
                key={note._id}
                className={`p-4 border border-gray-200 rounded-xl hover:shadow-md transition ${
                  !note.isRead ? "bg-blue-50" : "bg-white"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-black font-medium">{note.message}</p>
                    {note.taskInfo?.image && (
                      <img
                        src={note.taskInfo.image}
                        alt="Issue"
                        className="w-24 h-24 object-cover rounded my-2 border"
                        onClick={() => setFullscreenImage(note.taskInfo.image)}
                        style={{ cursor: "pointer" }}
                      />
                    )}
                    {note.taskInfo && (
                      <>
                        <p className="text-sm text-gray-700">
                          <strong>Status:</strong> {note.taskInfo.status}
                        </p>
                        <p className="text-sm text-gray-700">
                          <strong>Priority:</strong> {note.taskInfo.priority}
                        </p>
                        {note.taskInfo?.location?.latitude &&
                          note.taskInfo?.location?.longitude && (
                            <button
                              className="text-blue-600 hover:underline text-sm mt-1"
                              onClick={() =>
                                window.open(
                                  `https://www.google.com/maps/search/?api=1&query=${note.taskInfo.location.latitude},${note.taskInfo.location.longitude}`,
                                  "_blank"
                                )
                              }
                            >
                              📍 View Location
                            </button>
                          )}
                      </>
                    )}
                    <p className="text-sm text-gray-600 mt-1">
                      {formatTime(note.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setFullscreenImage(null)}
        >
          <FullscreenImageModal
            image={fullscreenImage}
            onClose={() => setFullscreenImage(null)}
          />
        </div>
      )}

      {showAll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl p-6 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-3xl font-bold text-black">
                All Notifications
              </h2>
              <button
                className="text-red-600 hover:underline text-xl font-bold"
                onClick={() => setShowAll(false)}
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {allNotesToShow.length === 0 ? (
                <p className="text-black text-center py-4">No notifications</p>
              ) : (
                allNotesToShow.map((note) => (
                  <div
                    key={note._id}
                    className={`p-6 border border-gray-300 rounded-xl hover:shadow-md transition ${
                      !note.isRead ? "bg-blue-50" : "bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <p className="text-black font-semibold text-lg">
                          {note.message}
                        </p>
                        {note.taskInfo?.image && (
                          <img
                            src={note.taskInfo.image}
                            alt="Issue"
                            className="w-48 h-48 object-cover rounded my-3 border"
                            onClick={() =>
                              setFullscreenImage(note.taskInfo.image)
                            }
                            style={{ cursor: "pointer" }}
                          />
                        )}
                        {note.taskInfo && (
                          <>
                            <p className="text-base text-gray-800">
                              <strong>Status:</strong> {note.taskInfo.status}
                            </p>
                            <p className="text-base text-gray-800">
                              <strong>Priority:</strong> {note.taskInfo.priority}
                            </p>
                            {note.taskInfo?.location?.latitude &&
                              note.taskInfo?.location?.longitude && (
                                <button
                                  className="text-blue-600 hover:underline"
                                  onClick={() =>
                                    window.open(
                                      `https://www.google.com/maps/search/?api=1&query=${note.taskInfo.location.latitude},${note.taskInfo.location.longitude}`,
                                      "_blank"
                                    )
                                  }
                                >
                                  View Location
                                </button>
                              )}
                          </>
                        )}
                        <p className="text-base text-gray-600 mt-2">
                          {formatTime(note.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NotificationsPanel;