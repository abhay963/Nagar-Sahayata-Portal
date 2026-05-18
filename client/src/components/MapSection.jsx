import React, {
  useEffect,
  useState,
} from "react";

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

import {
  MapPin,
  Navigation,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPinned,
} from "lucide-react";



// ======================================================
// ================= MAP SECTION ========================
// ======================================================

const MapSection = ({ isGuest = false }) => {

  const [reports, setReports] =
    useState([]);




  // ======================================================
  // ================= FETCH REPORTS ======================
  // ======================================================

  useEffect(() => {

    const fetchReports = async () => {

      try {

        // ======================================================
        // ================= GUEST USER =========================
        // ======================================================

        if (isGuest) {

          const guestReports = [

            {
              _id: "1",
              problemType: "Pothole",
              location: {
                latitude: 23.3448,
                longitude: 85.3105,
              },
              priority: "High",
              status: "Pending",
            },

            {
              _id: "2",
              problemType: "Garbage Overflow",
              location: {
                latitude: 23.3429,
                longitude: 85.3079,
              },
              priority: "Medium",
              status: "In Progress",
            },

            {
              _id: "3",
              problemType: "Street Light",
              location: {
                latitude: 23.3460,
                longitude: 85.3122,
              },
              priority: "Low",
              status: "Resolved",
            },

            {
              _id: "4",
              problemType: "Water Leakage",
              location: {
                latitude: 23.3415,
                longitude: 85.3130,
              },
              priority: "High",
              status: "Pending",
            },

            {
              _id: "5",
              problemType: "Drainage Issue",
              location: {
                latitude: 23.3475,
                longitude: 85.3058,
              },
              priority: "High",
              status: "Pending",
            },

            {
              _id: "6",
              problemType: "Broken Road",
              location: {
                latitude: 23.3407,
                longitude: 85.3045,
              },
              priority: "Medium",
              status: "In Progress",
            },

            {
              _id: "7",
              problemType: "Traffic Signal",
              location: {
                latitude: 23.3490,
                longitude: 85.3140,
              },
              priority: "Low",
              status: "Resolved",
            },

            {
              _id: "8",
              problemType: "Open Manhole",
              location: {
                latitude: 23.3430,
                longitude: 85.3160,
              },
              priority: "High",
              status: "Pending",
            },
          ];

          setReports(guestReports);

          return;
        }



        // ======================================================
        // ================= REAL BACKEND DATA ==================
        // ======================================================

        const response =
          await axios.get(
            "/api/reports"
          );

        const backendReports =
          response.data.reports || [];

        setReports(
          backendReports
        );

      } catch (error) {

        console.error(
          "❌ Error fetching reports:",
          error
        );
      }
    };

    fetchReports();

  }, [isGuest]);




  // ======================================================
  // ================= USER LOCATION ======================
  // ======================================================

  const GetLocationButton =
    () => {

      const map =
        useMap();

      const handleClick =
        () => {

          if (
            navigator.geolocation
          ) {

            navigator.geolocation.getCurrentPosition(

              (position) => {

                const {
                  latitude,
                  longitude,
                } = position.coords;

                map.setView(
                  [latitude, longitude],
                  15
                );



                // Remove old marker

                if (
                  map._userLocationMarker
                ) {

                  map.removeLayer(
                    map._userLocationMarker
                  );
                }



                // Add user marker

                const userMarker =
                  L.marker(
                    [latitude, longitude],

                    {
                      icon: L.icon({

                        iconUrl:
                          "https://cdn-icons-png.flaticon.com/512/854/854878.png",

                        iconSize: [
                          40,
                          40,
                        ],

                        iconAnchor: [
                          20,
                          40,
                        ],
                      }),
                    }
                  )

                    .addTo(map)

                    .bindPopup(
                      "📍 You are here"
                    )

                    .openPopup();

                map._userLocationMarker =
                  userMarker;
              },

              (error) =>

                console.error(
                  "Location error:",
                  error
                ),

              {
                enableHighAccuracy:
                  true,
              }
            );
          }
        };



      return (

        <motion.button

          whileHover={{
            scale: 1.05,
          }}

          whileTap={{
            scale: 0.95,
          }}

          onClick={handleClick}

          className="
            absolute
            top-4
            right-4
            z-[1000]
            bg-emerald-600
            hover:bg-emerald-700
            text-white
            px-5
            py-3
            rounded-2xl
            shadow-xl
            flex
            items-center
            gap-2
            font-medium
          "
        >

          <Navigation
            className="
              w-5
              h-5
            "
          />

          My Location

        </motion.button>
      );
    };




  // ======================================================
  // ================= CUSTOM MARKER ======================
  // ======================================================

  const getCustomIcon =
    (
      priority,
      status
    ) => {

      const isHigh =
        priority === "High";

      const statusColor =

        status === "Pending"

          ? "bg-amber-500"

          : status ===
            "In Progress"

          ? "bg-blue-500"

          : "bg-emerald-600";



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

            <span
              class="
                absolute
                -top-3
                text-[10px]
                font-bold
                text-white
                px-2
                py-0.5
                rounded-full
                ${statusColor}
                shadow
              "
            >
              ${status}
            </span>

            <img
              src="
                https://cdn-icons-png.flaticon.com/512/684/684908.png
              "

              class="
                w-10
                h-10
                relative
                z-10
                drop-shadow-md
              "
            />

          </div>
        `,

        iconSize: [50, 50],

        iconAnchor: [25, 45],

        popupAnchor: [0, -45],
      });
    };




  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      bg-white
      rounded-3xl
      shadow-xl
      border
      border-emerald-100
      overflow-hidden
      relative
      z-0
    ">

      {/* HEADER */}

      <div className="
        px-8
        py-6
        border-b
        border-emerald-100
        flex
        items-center
        justify-between
      ">

        <div className="
          flex
          items-center
          gap-3
        ">

          <div className="
            bg-emerald-100
            p-3
            rounded-2xl
          ">

            <MapPin
              className="
                w-7
                h-7
                text-emerald-600
              "
            />

          </div>

          <div>

            <h2 className="
              text-2xl
              font-bold
              text-gray-900
            ">

              Live Issues Map

            </h2>

            <p className="
              text-emerald-600
              text-sm
            ">

              Real-time reported civic issues

            </p>

          </div>

        </div>

        <div className="
          text-sm
          text-gray-500
          font-medium
        ">

          {reports.length} Reports

        </div>

      </div>



      {/* MAP */}

      <div className="
        relative
        h-[520px]
        z-0
      ">

        <MapContainer

          center={[
            23.3441,
            85.3096
          ]}

          zoom={14}

          style={{
            height: "100%",
            width: "100%",
          }}

          className="
            rounded-b-3xl
            z-0
          "
        >

          {/* TILE */}

          <TileLayer

            url="
              https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
            "

            attribution="
              &copy;
              OpenStreetMap contributors
            "
          />



          {/* REPORT MARKERS */}

          {
            reports

              .filter((report) =>

                report?.location &&
                report.location.latitude &&
                report.location.longitude
              )

              .map((report, index) => {

                const lat =
                  parseFloat(
                    report.location.latitude
                  );

                const lng =
                  parseFloat(
                    report.location.longitude
                  );

                if (
                  isNaN(lat) ||
                  isNaN(lng)
                ) {

                  return null;
                }

                const offset =
                  index * 0.00008;

                return (

                  <Marker

                    key={
                      report._id || index
                    }

                    position={[
                      lat + offset,
                      lng + offset,
                    ]}

                    icon={
                      getCustomIcon(
                        report.priority,
                        report.status
                      )
                    }
                  >

                    {/* ====================================================== */}
                    {/* =============== AUTHORIZED USER DETAILS ============== */}
                    {/* ====================================================== */}

                    {
                      !isGuest && (

                        <Popup>

                          <div className="
                            min-w-[260px]
                            space-y-4
                          ">

                            {/* TITLE */}

                            <div>

                              <h3 className="
                                text-xl
                                font-bold
                                text-gray-900
                              ">

                                {
                                  report.problemType ||
                                  "Issue"
                                }

                              </h3>

                              <p className="
                                text-sm
                                text-gray-500
                              ">

                                Complaint Details
                              </p>

                            </div>



                            {/* STATUS */}

                            <div className="
                              flex
                              gap-2
                              flex-wrap
                            ">

                              <span className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                text-white

                                ${
                                  report.status === "Pending"

                                    ? "bg-amber-500"

                                    : report.status === "In Progress"

                                    ? "bg-blue-500"

                                    : "bg-emerald-600"
                                }
                              `}>

                                {
                                  report.status || "Pending"
                                }

                              </span>



                              <span className={`
                                px-3
                                py-1
                                rounded-full
                                text-xs
                                font-semibold
                                text-white

                                ${
                                  report.priority === "High"

                                    ? "bg-red-500"

                                    : report.priority === "Medium"

                                    ? "bg-orange-500"

                                    : "bg-gray-500"
                                }
                              `}>

                                {
                                  report.priority || "Low"
                                } Priority

                              </span>

                            </div>



                            {/* DETAILS */}

                            <div className="
                              space-y-3
                              text-sm
                            ">

                              <div className="
                                flex
                                items-start
                                gap-2
                              ">

                                <AlertTriangle
                                  className="
                                    w-4
                                    h-4
                                    text-emerald-600
                                    mt-0.5
                                  "
                                />

                                <span className="
                                  text-gray-700
                                ">

                                  {
                                    report.description ||
                                    "No description available."
                                  }

                                </span>

                              </div>



                              <div className="
                                flex
                                items-start
                                gap-2
                              ">

                                <MapPinned
                                  className="
                                    w-4
                                    h-4
                                    text-emerald-600
                                    mt-0.5
                                  "
                                />

                                <span className="
                                  text-gray-700
                                ">

                                  {
                                    report.address ||
                                    "Ranchi, Jharkhand"
                                  }

                                </span>

                              </div>



                              <div className="
                                flex
                                items-start
                                gap-2
                              ">

                                <Building2
                                  className="
                                    w-4
                                    h-4
                                    text-emerald-600
                                    mt-0.5
                                  "
                                />

                                <span className="
                                  text-gray-700
                                ">

                                  Department:

                                  {" "}

                                  {
                                    report.department ||
                                    "Municipal Department"
                                  }

                                </span>

                              </div>



                              <div className="
                                flex
                                items-start
                                gap-2
                              ">

                                {
                                  report.status === "Resolved"

                                    ? (

                                      <CheckCircle2
                                        className="
                                          w-4
                                          h-4
                                          text-emerald-600
                                          mt-0.5
                                        "
                                      />
                                    )

                                    : (

                                      <Clock3
                                        className="
                                          w-4
                                          h-4
                                          text-amber-500
                                          mt-0.5
                                        "
                                      />
                                    )
                                }

                                <span className="
                                  text-gray-700
                                ">

                                  {
                                    report.status === "Resolved"

                                      ? "Issue resolved successfully."

                                      : "Issue currently under processing."
                                  }

                                </span>

                              </div>

                            </div>



                            {/* GOOGLE MAP LINK */}

                            <a

                              href={`
                                https://www.google.com/maps?q=${lat},${lng}
                              `}

                              target="_blank"

                              rel="noreferrer"

                              className="
                                flex
                                items-center
                                justify-center
                                gap-2
                                w-full
                                bg-emerald-600
                                hover:bg-emerald-700
                                text-white
                                py-3
                                rounded-xl
                                font-medium
                                transition-all
                              "
                            >

                              <ExternalLink
                                className="
                                  w-4
                                  h-4
                                "
                              />

                              Open in Google Maps

                            </a>

                          </div>

                        </Popup>
                      )
                    }

                  </Marker>
                );
              })
          }



          {/* USER LOCATION BUTTON */}

          <GetLocationButton />

        </MapContainer>

      </div>

    </div>
  );
};

export default MapSection;