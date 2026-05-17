import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "../api/axios";
import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";

const MapSection = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Dummy Data
        const dummyData = [
          {
            _id: "1",
            problemType: "Pothole",
            description: "Large pothole blocking road.",
            location: { latitude: 23.3441, longitude: 85.3096 },
            priority: "High",
            status: "Pending",
          },
          {
            _id: "2",
            problemType: "Street Light",
            description: "Street light not working.",
            location: { latitude: 23.3501, longitude: 85.3196 },
            priority: "Medium",
            status: "In Progress",
          },
          {
            _id: "3",
            problemType: "Garbage",
            description: "Garbage not cleaned.",
            location: { latitude: 23.3391, longitude: 85.3056 },
            priority: "High",
            status: "Pending",
          },
        ];

        const response = await axios.get("/api/reports");
        const backendReports = response.data.reports || [];

        const actualData = backendReports.map((report) => ({
          ...report,
        }));

        setReports([...dummyData, ...actualData]);
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  // Get User Location Button
  const GetLocationButton = () => {
    const map = useMap();

    const handleClick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            map.setView([latitude, longitude], 15);

            if (map._userLocationMarker) {
              map.removeLayer(map._userLocationMarker);
            }

            const userMarker = L.marker([latitude, longitude], {
              icon: L.icon({
                iconUrl: "https://cdn-icons-png.flaticon.com/512/854/854878.png",
                iconSize: [40, 40],
                iconAnchor: [20, 40],
              }),
            })
              .addTo(map)
              .bindPopup("📍 You are here")
              .openPopup();

            map._userLocationMarker = userMarker;
          },
          (error) => console.error("Location error:", error),
          { enableHighAccuracy: true }
        );
      }
    };

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className="absolute top-4 right-4 z-[1000] bg-emerald-600 hover:bg-emerald-700 
                   text-white px-5 py-3 rounded-2xl shadow-lg flex items-center gap-2 
                   font-medium transition-all active:scale-95"
      >
        <Navigation className="w-5 h-5" />
        My Location
      </motion.button>
    );
  };

  // Custom Icon
  const getCustomIcon = (priority, status) => {
    const isHigh = priority === "High";
    const statusColor = 
      status === "Pending" ? "bg-amber-500" : 
      status === "In Progress" ? "bg-blue-500" : "bg-emerald-600";

    return L.divIcon({
      className: "",
      html: `
        <div class="relative flex flex-col items-center">
          ${isHigh ? 
            `<div class="absolute w-11 h-11 bg-red-500 rounded-full animate-ping opacity-75"></div>` : ''}
          <span class="absolute -top-3 text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${statusColor} shadow">
            ${status}
          </span>
          <img src="https://cdn-icons-png.flaticon.com/512/684/684908.png" 
               class="w-10 h-10 relative z-10 drop-shadow-md" />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 45],
      popupAnchor: [0, -45],
    });
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden">
      <div className="px-8 py-6 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <MapPin className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Live Issues Map</h2>
            <p className="text-emerald-600 text-sm">Real-time reported problems in your area</p>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          {reports.length} Reports
        </div>
      </div>

      <div className="relative h-[520px]">
        <MapContainer
          center={[23.3441, 85.3096]}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="rounded-b-3xl"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
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
                <Popup className="custom-popup">
                  <div className="min-w-[220px] space-y-2">
                    <h3 className="font-bold text-lg text-gray-900">
                      {report.problemType}
                    </h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                    
                    <div className="flex gap-4 text-sm">
                      <div>
                        <strong>Priority:</strong> 
                        <span className={`ml-1 px-2 py-0.5 rounded text-xs font-medium ${
                          report.priority === "High" ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                        }`}>
                          {report.priority}
                        </span>
                      </div>
                      <div>
                        <strong>Status:</strong> 
                        <span className="ml-1 text-emerald-600 font-medium">
                          {report.status}
                        </span>
                      </div>
                    </div>
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