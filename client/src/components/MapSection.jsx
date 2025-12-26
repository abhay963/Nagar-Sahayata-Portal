import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../api/axios";

const MapSection = () => {
  const [reports, setReports] = useState([]);
  const [actualReports, setActualReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const dummyData = [
          {
            _id: "1",
            problemType: "Pothole",
            description: "Large pothole blocking half the road.",
            location: { latitude: 23.3441, longitude: 85.3096 },
            priority: "High",
            status: "Pending",
            type: "dummy",
          },
          {
            _id: "2",
            problemType: "Street Light",
            description: "Street light not working for a week.",
            location: { latitude: 23.3501, longitude: 85.3196 },
            priority: "Medium",
            status: "In Progress",
            type: "dummy",
          },
          {
            _id: "3",
            problemType: "Garbage Dump",
            description: "Unattended garbage causing foul smell.",
            location: { latitude: 23.3391, longitude: 85.3056 },
            priority: "High",
            status: "Pending",
            type: "dummy",
          },
          {
            _id: "4",
            problemType: "Broken Traffic Signal",
            description: "Traffic signal near Kutchery Chowk not working.",
            location: { latitude: 23.3621, longitude: 85.3156 },
            priority: "Medium",
            status: "In Progress",
            type: "dummy",
          },
          {
            _id: "5",
            problemType: "Water Leakage",
            description: "Water pipeline leaking near Morabadi.",
            location: { latitude: 23.3701, longitude: 85.3256 },
            priority: "Normal",
            status: "Resolved",
            type: "dummy",
          },
        ];

        await new Promise((res) => setTimeout(res, 500));
        setReports(dummyData);
        
        // Fetch actual reports from backend
        const response = await axios.get("/api/reports");
        const actualData = response.data.map((report) => ({
          ...report,
          type: "actual",
        }));

        // Combine dummy and actual reports
        setReports([...dummyData, ...actualData]);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };
    fetchReports();
  }, []);

  // 🔹 User Location Button
  const GetLocationButton = () => {
    const map = useMap();
    const handleClick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            // Fix: Use map.setView instead of flyTo for immediate update
            map.setView([latitude, longitude], 15);

            // Remove previous user location marker if any
            if (map._userLocationMarker) {
              map.removeLayer(map._userLocationMarker);
            }

            const userMarker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
                iconSize: [32, 32],
                iconAnchor: [16, 32],
              }),
            })
              .addTo(map)
              .bindPopup("📍 You are here")
              .openPopup();

            // Store marker reference on map object for future removal
            map._userLocationMarker = userMarker;
          },
          (error) => console.error("Location error:", error),
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      }
    };

    return (
      <button
        onClick={handleClick}
        className="absolute top-4 right-4 px-4 py-2 rounded-full bg-green-600 text-white font-semibold shadow-lg hover:scale-105 transition duration-300 z-[1000] cursor-pointer"
      >
        📍 My Location
      </button>
    );
  };

  // 🔥 Custom Marker with Priority + Status
  const getCustomIcon = (priority, status) => {
    const pinUrl =
      "https://cdn-icons-png.flaticon.com/512/684/684908.png"; // Map pin

    // Badge colors for status
    const statusColor =
      status === "Pending"
        ? "bg-yellow-500"
        : status === "In Progress"
        ? "bg-blue-500"
        : "bg-green-600"; // Resolved

    // 🔴 High Priority = Red Alert Animation
    if (priority === "High") {
      return L.divIcon({
        className: "",
        html: `
          <div class="relative flex flex-col items-center">
            <div class="absolute w-10 h-10 bg-red-500 rounded-full animate-ping opacity-75"></div>
            <span class="absolute -top-3 text-[10px] text-white px-1 rounded ${statusColor}">
              ${status}
            </span>
            <img src="${pinUrl}" class="w-9 h-9 relative z-10" />
          </div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 40],
        popupAnchor: [0, -40],
      });
    }

    // 🟢 Other Priority = Gentle Bounce
    return L.divIcon({
      className: "",
      html: `
        <div class="flex flex-col items-center animate-bounce">
          <span class="absolute -top-3 text-[10px] text-white px-1 rounded ${statusColor}">
            ${status}
          </span>
          <img src="${pinUrl}" class="w-9 h-9" />
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 40],
      popupAnchor: [0, -40],
    });
  };

  return (
    <div className="relative z-10 bg-white shadow-md rounded-2xl p-5">
      <h2 className="text-xl font-bold mb-4">Reported Issues Map (Ranchi)</h2>
      <div className="h-[400px] w-full rounded-xl overflow-hidden relative z-0">
        <MapContainer
          center={[23.3441, 85.3096]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="rounded-xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />
          {reports.map((report) => {
            const lat = report.location?.latitude || 23.3441;
            const lng = report.location?.longitude || 85.3096;

            return (
              <Marker
                key={report._id}
                position={[lat, lng]}
                icon={getCustomIcon(report.priority, report.status)}
              >
                <Popup>
                  <div>
                    <strong>{report.problemType}</strong>
                    <br />
                    <em>Priority: {report.priority}</em>
                    <br />
                    <em>Status: {report.status}</em>
                    <br />
                    <em>Type: {report.type}</em>
                    <br />
                    <span>{report.description}</span>
                  </div>
                </Popup>
              </Marker>
            );
          })}
          <GetLocationButton />
        </MapContainer>
      </div>
    </div>
  );
};

export default MapSection;
