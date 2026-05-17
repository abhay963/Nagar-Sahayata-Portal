import React, {
  useEffect,
  useState,
} from "react";

import axios from "../api/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Environment,
  Float,
} from "@react-three/drei";

const AcceptedTasks = () => {

  const [tasks, setTasks] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ============================================
  // STORE DESCRIPTION + IMAGE SEPARATELY
  // FOR EACH TASK
  // ============================================

  const [taskInputs, setTaskInputs] =
    useState({});

  // ============================================
  // FETCH TASKS
  // ============================================

  const fetchTasks = async () => {

    try {

      const res = await axios.get(
        "/api/reports/my-assigned-tasks"
      );

      const acceptedTasks =
        res.data.reports.filter(
          (task) =>
            task.status === "In Progress"
        );

      setTasks(acceptedTasks);

    } catch (error) {

      console.error(error);

      toast.error(
        "Failed to fetch tasks"
      );

    } finally {

      setLoading(false);

    }
  };

  // ============================================
  // CONVERT IMAGE TO BASE64
  // ============================================

  const convertToBase64 = (file) => {

    return new Promise(
      (resolve, reject) => {

        // CHECK FILE EXISTS

        if (!file) {

          reject(
            "No file selected"
          );

          return;
        }

        // CHECK FILE TYPE

        if (
          !file.type.startsWith(
            "image/"
          )
        ) {

          reject(
            "Only image files allowed"
          );

          return;
        }

        const reader =
          new FileReader();

        reader.readAsDataURL(file);

        reader.onload = () => {

          resolve(reader.result);

        };

        reader.onerror = (
          error
        ) => {

          reject(error);

        };
      }
    );
  };

  // ============================================
  // HANDLE IMAGE CHANGE
  // ============================================

  const handleImageChange =
    async (e, taskId) => {

      try {

        const file =
          e.target.files[0];

        if (!file) return;

        const base64 =
          await convertToBase64(
            file
          );

        setTaskInputs((prev) => ({
          ...prev,

          [taskId]: {
            ...prev[taskId],

            imageBase64:
              base64,
          },
        }));

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to upload image"
        );
      }
    };

  // ============================================
  // HANDLE DESCRIPTION
  // ============================================

  const handleDescriptionChange =
    (value, taskId) => {

      setTaskInputs((prev) => ({
        ...prev,

        [taskId]: {
          ...prev[taskId],

          description:
            value,
        },
      }));
    };

  // ============================================
  // UPDATE TASK
  // ============================================

  const updateTask = async (
    reportId,
    action
  ) => {

    try {

      const currentTask =
        taskInputs[reportId];

      if (
        !currentTask?.description ||
        !currentTask?.imageBase64
      ) {

        return toast.error(
          "Please add description and image"
        );
      }

      const token =
        localStorage.getItem(
          "token"
        );

      await axios.put(
        "/api/reports/update-task-progress",

        {
          reportId,

          action,

          description:
            currentTask.description,

          imageBase64:
            currentTask.imageBase64,
        },

        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      toast.success(
        "Task updated successfully"
      );

      // CLEAR INPUTS OF THAT TASK

      setTaskInputs((prev) => ({

        ...prev,

        [reportId]: {
          description: "",
          imageBase64: "",
        },
      }));

      fetchTasks();

    } catch (error) {

      console.error(error);

      toast.error(
        error?.response?.data
          ?.message ||
          "Failed to update task"
      );
    }
  };

  // ============================================
  // USE EFFECT
  // ============================================

  useEffect(() => {

    fetchTasks();

  }, []);

  // ============================================
  // LOADING
  // ============================================

  if (loading) {

    return (

      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">

        <div className="flex flex-col items-center">

          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />

          <p className="text-emerald-700 mt-6 text-lg font-medium">
            Loading tasks...
          </p>

        </div>

      </div>
    );
  }

  // ============================================
  // 3D ORB
  // ============================================

  const TaskOrb = () => (

    <Canvas
      className="w-20 h-20"
      camera={{
        position: [0, 0, 6],
      }}
    >

      <ambientLight intensity={0.8} />

      <pointLight
        position={[10, 10, 10]}
        intensity={1.2}
      />

      <Float
        speed={3}
        rotationIntensity={0.6}
        floatIntensity={1}
      >

        <mesh>

          <sphereGeometry
            args={[1.6, 64, 64]}
          />

          <meshStandardMaterial
            color="#4ade80"
            metalness={0.4}
            roughness={0.3}
          />

        </mesh>

      </Float>

      <Environment preset="sunset" />

      <OrbitControls
        enablePan={false}
        enableZoom={false}
        autoRotate
        autoRotateSpeed={0.8}
      />

    </Canvas>
  );

  // ============================================
  // UI
  // ============================================

  return (

    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 pb-20">

      {/* HEADER */}

      <motion.div
        initial={{
          opacity: 0,
          y: -20,
        }}

        animate={{
          opacity: 1,
          y: 0,
        }}

        className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-emerald-100 py-7 px-8 flex items-center justify-between"
      >

        <div className="flex items-center gap-4">

          <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center shadow">

            <TaskOrb />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Accepted Tasks
            </h1>

            <p className="text-emerald-600 font-medium">
              In Progress
            </p>

          </div>

        </div>

        <div className="px-6 py-3 bg-emerald-100 text-emerald-700 rounded-2xl text-sm font-semibold flex items-center gap-2">

          <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />

          {tasks.length} Active Task
          {tasks.length !== 1
            ? "s"
            : ""}

        </div>

      </motion.div>

      {/* MAIN */}

      <div className="max-w-5xl mx-auto px-6 pt-10">

        <AnimatePresence mode="wait">

          {tasks.length === 0 && (

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}

              animate={{
                opacity: 1,
                y: 0,
              }}

              className="bg-white border border-emerald-100 rounded-3xl p-20 text-center shadow-xl"
            >

              <div className="mx-auto w-32 h-32 mb-8">

                <TaskOrb />

              </div>

              <h3 className="text-3xl font-semibold text-gray-800 mb-3">
                No Active Tasks
              </h3>

              <p className="text-gray-600 text-lg">
                You're all caught up!
                Great job.
              </p>

            </motion.div>
          )}

        </AnimatePresence>

        <div className="space-y-10">

          {tasks.map(
            (task, index) => (

              <motion.div
                key={task._id}

                initial={{
                  opacity: 0,
                  y: 40,
                }}

                animate={{
                  opacity: 1,
                  y: 0,
                }}

                transition={{
                  delay:
                    index * 0.07,
                }}

                whileHover={{
                  y: -6,
                  transition: {
                    duration: 0.2,
                  },
                }}

                className="bg-white border border-emerald-100 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300"
              >

                <div className="p-9">

                  {/* TASK HEADER */}

                  <div className="flex justify-between items-start mb-6">

                    <div>

                      <div className="inline-flex items-center px-4 py-2 bg-emerald-100 text-emerald-700 text-sm font-semibold rounded-2xl">
                        IN PROGRESS
                      </div>

                      <h2 className="text-3xl font-bold text-gray-900 mt-4">
                        {
                          task.problemType
                        }
                      </h2>

                    </div>

                    <div className="text-right text-sm text-gray-500">

                      ID:
                      <span className="font-mono">
                        {" "}
                        {task._id.slice(
                          -8
                        )}
                      </span>

                    </div>

                  </div>

                  <p className="text-gray-700 leading-relaxed text-[17px]">
                    {task.description}
                  </p>

                  {/* ISSUE IMAGE */}

                  {task.imageBase64 && (

                    <div className="mt-8 rounded-2xl overflow-hidden border border-emerald-100">

                      <img
                        src={
                          task.imageBase64
                        }

                        alt="Issue"

                        className="w-full max-h-[360px] object-cover"
                      />

                    </div>
                  )}

                  {/* FORM */}

                  <div className="mt-10 space-y-8">

                    {/* DESCRIPTION */}

                    <div>

                      <label className="block text-emerald-700 font-medium mb-2">
                        Work Description
                      </label>

                      <textarea
                        placeholder="Describe what you did..."

                        value={
                          taskInputs[
                            task._id
                          ]
                            ?.description ||
                          ""
                        }

                        onChange={(e) =>
                          handleDescriptionChange(
                            e.target
                              .value,

                            task._id
                          )
                        }

                        className="w-full h-36 border border-emerald-200 focus:border-emerald-500 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all resize-y"
                      />

                    </div>

                    {/* IMAGE */}

                    <div>

                      <label className="block text-emerald-700 font-medium mb-2">
                        Progress Photo
                      </label>

                      <label className="block border-2 border-dashed border-emerald-200 hover:border-emerald-400 rounded-2xl p-10 text-center cursor-pointer transition-colors">

                        <input
                          type="file"

                          accept="image/*"

                          onChange={(e) =>
                            handleImageChange(
                              e,

                              task._id
                            )
                          }

                          className="hidden"
                        />

                        <div className="mx-auto text-5xl mb-3">
                          📸
                        </div>

                        <p className="text-emerald-700 font-medium">

                          {taskInputs[
                            task._id
                          ]
                            ?.imageBase64
                            ? "✓ Image Selected"
                            : "Upload Before/After Photo"}

                        </p>

                      </label>

                    </div>

                  </div>

                </div>

                {/* BUTTONS */}

                <div className="border-t border-emerald-100 bg-emerald-50/50 px-9 py-6 flex gap-4">

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}

                    whileTap={{
                      scale: 0.98,
                    }}

                    onClick={() =>
                      updateTask(
                        task._id,
                        "resolved"
                      )
                    }

                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg shadow"
                  >

                    ✅ Mark as Resolved

                  </motion.button>

                  <motion.button
                    whileHover={{
                      scale: 1.02,
                    }}

                    whileTap={{
                      scale: 0.98,
                    }}

                    onClick={() =>
                      updateTask(
                        task._id,
                        "unable"
                      )
                    }

                    className="flex-1 bg-white border-2 border-red-300 hover:border-red-500 text-gray-700 hover:text-red-600 font-semibold py-5 rounded-2xl transition-all flex items-center justify-center gap-3"
                  >

                    ⚠️ Can't Complete

                  </motion.button>

                </div>

              </motion.div>
            )
          )}

        </div>

      </div>

    </div>
  );
};

export default AcceptedTasks;