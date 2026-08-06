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
import { MapPin, Navigation, ExternalLink } from "lucide-react";

// ======================================================
// JAMSHEDPUR LOCATION
// ======================================================
const JAMSHEDPUR_CENTER = [22.8046, 86.2029];

// ======================================================
// MAP SECTION
// ======================================================
const MapSection = ({ isGuest = false }) => {
  const [reports, setReports] = useState([]);

  // ======================================================
  // FETCH REPORTS
  // ======================================================
  useEffect(() => {
    const fetchReports = async () => {
      try {
        if (isGuest) {
          const guestReports = [
            {
              _id: "1",
              problemType: "Pothole",
              location: { latitude: 22.8046, longitude: 86.2029 },
              address: "Sakchi, Jamshedpur",
              priority: "High",
              image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400",
            },
            {
              _id: "2",
              problemType: "Garbage Overflow",
              location: { latitude: 22.7995, longitude: 86.1910 },
              address: "Bistupur, Jamshedpur",
              priority: "Medium",
              image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b4b5?w=400",
            },
            {
              _id: "3",
              problemType: "Street Light",
              location: { latitude: 22.8165, longitude: 86.2100 },
              address: "Kadma, Jamshedpur",
              priority: "Low",
              image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400",
            },
            {
              _id: "4",
              problemType: "Water Leakage",
              location: { latitude: 22.7900, longitude: 86.2055 },
              address: "Sonari, Jamshedpur",
              priority: "High",
              image: "https://images.unsplash.com/photo-1581579186913-45ac3e6efe93?w=400",
            },
            {
              _id: "5",
              problemType: "Drainage Issue",
              location: { latitude: 22.8212, longitude: 86.2180 },
              address: "Telco, Jamshedpur",
              priority: "High",
              image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400",
            },
            {
              _id: "6",
              problemType: "Broken Road",
              location: { latitude: 22.8100, longitude: 86.1850 },
              address: "Mango, Jamshedpur",
              priority: "Medium",
              image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
            },
            {
              _id: "7",
              problemType: "Traffic Signal",
              location: { latitude: 22.8300, longitude: 86.2070 },
              address: "Golmuri, Jamshedpur",
              priority: "Low",
              image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400",
            },
            {
              _id: "8",
              problemType: "Open Manhole",
              location: { latitude: 22.7980, longitude: 86.2200 },
              address: "Adityapur, Jamshedpur",
              priority: "High",
              image: "https://images.unsplash.com/photo-1590674899484-d5640e854abe?w=400",
            },
          ];
          setReports(guestReports);
          return;
        }

        const response = await axios.get("/api/reports");
        const backendReports = response.data.reports || [];
        setReports(backendReports);
      } catch (error) {
        console.error("❌ Error fetching reports:", error);
      }
    };

    fetchReports();
  }, [isGuest]);

  // ======================================================
  // USER LOCATION BUTTON
  // ======================================================
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
        className="absolute top-4 right-4 z-[1000] bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 font-medium"
      >
        <Navigation className="w-5 h-5" />
        My Location
      </motion.button>
    );
  };

  // ======================================================
  // CUSTOM MARKER (WITH BLINKING FOR HIGH PRIORITY)
  // ======================================================
  const getCustomIcon = (priority) => {
    const isHigh = priority === "High" || priority === "Critical";

    return L.divIcon({
      className: "",
      html: `
        <div class="relative flex flex-col items-center">
          ${
            isHigh
              ? `
                <div
                  class="
                    absolute
                    w-11
                    h-11
                    bg-red-500
                    rounded-full
                    animate-ping
                    opacity-75
                  "
                ></div>
              `
              : ""
          }

          <img
            src="https://cdn-icons-png.flaticon.com/512/684/684908.png"
            class="w-10 h-10 relative z-10 drop-shadow-md"
          />
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 45],
      popupAnchor: [0, -45],
    });
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 overflow-hidden relative z-0">
      {/* Header */}
      <div className="px-6 md:px-8 py-5 border-b border-emerald-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-100 p-3 rounded-2xl">
            <MapPin className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900">
              Live Issues Map
            </h2>
            <p className="text-emerald-600 text-sm">
              Jamshedpur Smart City Reports
            </p>
          </div>
        </div>

        <div className="text-sm text-gray-500 font-medium">
          {reports.length} Reports
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[520px] z-0">
        <MapContainer
          center={JAMSHEDPUR_CENTER}
          zoom={13}
          style={{ height: "100%", width: "100%" }}
          className="rounded-b-3xl z-0"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {reports
            .filter(
              (report) =>
                report?.location &&
                report.location.latitude &&
                report.location.longitude
            )
            .map((report, index) => {
              const lat = parseFloat(report.location.latitude);
              const lng = parseFloat(report.location.longitude);

              if (isNaN(lat) || isNaN(lng)) return null;

              const offset = index * 0.00008;

              return (
                <Marker
                  key={report._id || index}
                  position={[lat + offset, lng + offset]}
                  icon={getCustomIcon(report.priority)}
                >
                  <Popup>
                    <div className="min-w-[240px] max-w-[280px]">
                      {/* Problem Type */}
                      <h3 className="text-base font-bold text-gray-900 mb-1">
                        {report.problemType}
                      </h3>

                      {/* Address */}
                      <p className="text-sm text-gray-600 mb-3">
                        {report.address ||
                          report.locationName ||
                          report.location?.locationName ||
                          "Location not specified"}
                      </p>

                      {/* Image */}
                      {report.image && (
                        <div className="mb-3 overflow-hidden rounded-xl">
                          <img
                            src={report.image}
                            alt={report.problemType}
                            className="w-full h-36 object-cover"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>
                      )}

                      {/* Open in Google Maps */}
                      <a
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Open in Maps
                      </a>
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