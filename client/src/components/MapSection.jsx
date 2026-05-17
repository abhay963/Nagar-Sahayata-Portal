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
  ExternalLink,
} from "lucide-react";



// ======================================================
// ================= MAP SECTION ========================
// ======================================================

const MapSection = () => {

  const [reports, setReports] =
    useState([]);




  // ======================================================
  // ================= FETCH REPORTS ======================
  // ======================================================

  useEffect(() => {

    const fetchReports = async () => {

      try {

        // ======================================================
        // ================= DUMMY DATA ==========================
        // ======================================================

        const dummyData = [

          {
            _id: "1",

            problemType:
              "Pothole",

            description:
              "Large pothole blocking road.",

            address:
              "Main Road Ranchi",

            location: {
              latitude: 23.3441,
              longitude: 85.3096,
            },

            priority: "High",

            status: "Pending",
          },

          {
            _id: "2",

            problemType:
              "Street Light",

            description:
              "Street light not working.",

            address:
              "Kanke Road Ranchi",

            location: {
              latitude: 23.3501,
              longitude: 85.3196,
            },

            priority: "Medium",

            status: "In Progress",
          },

          {
            _id: "3",

            problemType:
              "Garbage",

            description:
              "Garbage not cleaned.",

            address:
              "Morabadi Ground Ranchi",

            location: {
              latitude: 23.3391,
              longitude: 85.3056,
            },

            priority: "High",

            status: "Pending",
          },
        ];



        // ======================================================
        // ================= BACKEND REPORTS ====================
        // ======================================================

        const response =
          await axios.get(
            "/api/reports"
          );

        const backendReports =
          response.data.reports || [];



        setReports([
          ...dummyData,
          ...backendReports,
        ]);

      } catch (error) {

        console.error(
          "❌ Error fetching reports:",
          error
        );
      }
    };

    fetchReports();

  }, []);




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



                // Add new marker

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
  // ================= CUSTOM ICON ========================
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

              Real-time reported problems

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
            85.3096,
          ]}

          zoom={13}

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

                // ======================================================
                // ================= SAFE COORDINATES ===================
                // ======================================================

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



                // ======================================================
                // ============== PREVENT OVERLAPPING ===================
                // ======================================================

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

                    <Popup
                      className="
                        custom-popup
                      "
                    >

                      <div className="
                        min-w-[250px]
                        space-y-3
                      ">

                        {/* TITLE */}

                        <h3 className="
                          font-bold
                          text-lg
                          text-gray-900
                        ">

                          {
                            report.problemType ||
                            "Issue"
                          }

                        </h3>



                        {/* DESCRIPTION */}

                        <p className="
                          text-sm
                          text-gray-600
                        ">

                          {
                            report.description ||
                            "No description"
                          }

                        </p>



                        {/* ADDRESS */}

                        <div className="
                          bg-gray-100
                          rounded-xl
                          px-3
                          py-2
                          text-sm
                          text-gray-700
                        ">

                          📍
                          {" "}

                          {
                            report.address ||

                            report.locationName ||

                            "Location not available"
                          }

                        </div>



                        {/* PRIORITY + STATUS */}

                        <div className="
                          flex
                          flex-wrap
                          gap-3
                          text-sm
                        ">

                          {/* PRIORITY */}

                          <div>

                            <strong>
                              Priority:
                            </strong>

                            <span

                              className={`
                                ml-1
                                px-2
                                py-1
                                rounded-full
                                text-xs
                                font-semibold

                                ${
                                  report.priority ===
                                  "High"

                                    ? `
                                      bg-red-100
                                      text-red-700
                                    `

                                    : report.priority ===
                                      "Medium"

                                    ? `
                                      bg-amber-100
                                      text-amber-700
                                    `

                                    : `
                                      bg-green-100
                                      text-green-700
                                    `
                                }
                              `}
                            >

                              {
                                report.priority ||
                                "Low"
                              }

                            </span>

                          </div>



                          {/* STATUS */}

                          <div>

                            <strong>
                              Status:
                            </strong>

                            <span

                              className={`
                                ml-1
                                px-2
                                py-1
                                rounded-full
                                text-xs
                                font-semibold

                                ${
                                  report.status ===
                                  "Pending"

                                    ? `
                                      bg-yellow-100
                                      text-yellow-700
                                    `

                                    : report.status ===
                                      "In Progress"

                                    ? `
                                      bg-blue-100
                                      text-blue-700
                                    `

                                    : `
                                      bg-emerald-100
                                      text-emerald-700
                                    `
                                }
                              `}
                            >

                              {
                                report.status ||
                                "Pending"
                              }

                            </span>

                          </div>

                        </div>



                        {/* GOOGLE MAP BUTTON */}

                        <button

                          onClick={() =>

                            window.open(

                              `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,

                              "_blank"
                            )
                          }

                          className="
                            w-full
                            mt-2
                            bg-emerald-600
                            hover:bg-emerald-700
                            text-white
                            py-2.5
                            rounded-xl
                            flex
                            items-center
                            justify-center
                            gap-2
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

                          Open Location

                        </button>



                        {/* COORDINATES */}

                        <div className="
                          text-xs
                          text-gray-400
                          pt-2
                          border-t
                        ">

                          Lat:
                          {" "}
                          {lat.toFixed(5)}

                          {" | "}

                          Lng:
                          {" "}
                          {lng.toFixed(5)}

                        </div>

                      </div>

                    </Popup>

                  </Marker>
                );
              })
          }



          {/* LOCATION BUTTON */}

          <GetLocationButton />

        </MapContainer>

      </div>

    </div>
  );
};

export default MapSection;