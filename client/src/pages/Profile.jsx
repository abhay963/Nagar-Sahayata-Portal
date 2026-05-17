// Import React hooks
import React, {
  useState,
  useEffect
} from "react";

// Auth context
import { useAuth }
from "../context/AuthContext";

// Axios instance
import axios from "../api/axios";

// Toast notifications
import { toast }
from "react-toastify";






const Profile = () => {

  // Get auth data/functions
  const {

    user,

    logout,

    setUser,

    loading

  } = useAuth();


  // ================= EDIT MODE =================

  // Controls edit mode
  const [

    isEditing,

    setIsEditing

  ] = useState(false);


  // ================= FORM DATA =================

  // User form fields
  const [

    formData,

    setFormData

  ] = useState({

    name: "",

    email: "",

    empId: "",

    department: "",

    contact: "",

    address: "",
  });


  // ================= VALIDATION ERRORS =================

  const [

    errors,

    setErrors

  ] = useState({});


  // ================= SAVE BUTTON LOADING =================

  const [

    saving,

    setSaving

  ] = useState(false);



  // ======================================================
  // ================= LOADING SCREEN =====================
  // ======================================================

  if (loading) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-lg
      ">

        Loading Profile...

      </div>
    );
  }



  // ======================================================
  // ================= USER NOT FOUND =====================
  // ======================================================

  if (!user) {

    return (

      <div className="
        min-h-screen
        flex
        items-center
        justify-center
        text-lg
      ">

        You are not logged in.

        <a

          href="/login"

          className="
            text-blue-600
            underline
            ml-2
          "
        >

          Login

        </a>

      </div>
    );
  }



  // ======================================================
  // =============== PREFILL USER DATA ====================
  // ======================================================

  useEffect(() => {

    if (user) {

      // Fill form with current user data
      setFormData({

        name:
          user.name || "",

        email:
          user.email || "",

        empId:
          user.empId || "",

        department:
          user.department || "",

        contact:
          user.contact || "",

        address:
          user.address || "",
      });
    }

  }, [user]);



  // ======================================================
  // ================= FORM VALIDATION ====================
  // ======================================================

  const validate = () => {

    const errs = {};


    // Name validation
    if (!formData.name.trim()) {

      errs.name =
        "Name is required";
    }


    // Email validation
    if (!formData.email.trim()) {

      errs.email =
        "Email is required";

    } else if (

      !/^\S+@\S+\.\S+$/.test(
        formData.email
      )

    ) {

      errs.email =
        "Email is invalid";
    }


    // Employee ID validation
    if (!formData.empId.trim()) {

      errs.empId =
        "Employee ID is required";
    }


    // Department validation
    if (!formData.department.trim()) {

      errs.department =
        "Department is required";
    }


    // Contact validation
    if (!formData.contact.trim()) {

      errs.contact =
        "Contact number is required";
    }


    // Address validation
    if (!formData.address.trim()) {

      errs.address =
        "Address is required";
    }


    return errs;
  };



  // ======================================================
  // ================= HANDLE INPUT CHANGE ================
  // ======================================================

  const handleChange = (e) => {

    const {

      name,

      value

    } = e.target;


    // Update field dynamically
    setFormData((prev) => ({

      ...prev,

      [name]: value,
    }));
  };



  // ======================================================
  // ===================== SAVE PROFILE ===================
  // ======================================================

  const handleSave = async () => {

    // Validate form
    const errs = validate();

    setErrors(errs);


    // Stop if validation fails
    if (

      Object.keys(errs).length > 0

    ) {

      toast.error(
        "Please fix validation errors"
      );

      return;
    }


    try {

      setSaving(true);

      console.log(
        "📤 Updating profile:",
        formData
      );


      // API request
      const res = await axios.put(

        "/api/users/update-profile",

        formData
      );


      console.log(
        "✅ Profile Updated:",
        res.data
      );


      // Update user globally
      setUser(
        res.data.updatedUser
      );


      // Exit edit mode
      setIsEditing(false);


      // Success toast
      toast.success(
        "Profile updated successfully"
      );

    } catch (err) {

      console.error(
        "❌ Update failed:",
        err
      );


      // Backend error
      toast.error(

        err.response?.data?.message ||

        "Failed to update profile."
      );

    } finally {

      setSaving(false);
    }
  };



  // ======================================================
  // ==================== CANCEL EDIT =====================
  // ======================================================

  const handleCancel = () => {

    // Exit edit mode
    setIsEditing(false);


    // Reset form data
    setFormData({

      name:
        user.name || "",

      email:
        user.email || "",

      empId:
        user.empId || "",

      department:
        user.department || "",

      contact:
        user.contact || "",

      address:
        user.address || "",
    });


    // Clear validation errors
    setErrors({});
  };



  // ======================================================
  // ==================== USER INITIALS ===================
  // ======================================================

  const getInitials = (name) => {

    if (!name) return "U";


    return name

      .split(" ")

      .map((word) => word[0])

      .join("")

      .toUpperCase();
  };



  // ======================================================
  // ======================= UI ===========================
  // ======================================================

  return (

    <div className="
      min-h-screen
      bg-[#f4f4f4]
      py-10
      px-4
      font-sans
    ">

      <div className="
        max-w-5xl
        mx-auto
        bg-white
        border
        border-gray-300
        rounded-md
        shadow-md
      ">

        {/* ================= HEADER ================= */}

        <div className="
          bg-[#006400]
          text-white
          text-center
          py-4
          rounded-t-md
          border-b
          border-green-800
        ">

          <h1 className="
            text-2xl
            font-semibold
            uppercase
            tracking-wide
          ">

            Profile

          </h1>

          <p className="
            text-sm
            font-light
          ">

            Government of Jharkhand

          </p>
        </div>



        {/* ================= PROFILE CONTENT ================= */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-6
          px-6
          py-8
        ">

          {/* ================= LEFT SIDE ================= */}

          <div className="
            flex
            flex-col
            items-center
          ">

            {/* User initials avatar */}
            <div className="
              w-36
              h-36
              rounded-full
              flex
              items-center
              justify-center
              mb-4
              bg-gradient-to-br
              from-green-200
              to-green-500
              text-white
              text-5xl
              font-bold
              uppercase
              shadow-inner
            ">

              {getInitials(user.name)}

            </div>


            {/* User name */}
            <p className="
              text-lg
              font-semibold
              mt-2
            ">

              {user.name}

            </p>


            {/* User role */}
            <p className="
              text-sm
              text-gray-700
            ">

              {user.role}

            </p>
          </div>



          {/* ================= RIGHT SIDE FORM ================= */}

          <div className="
            md:col-span-2
            grid
            grid-cols-1
            sm:grid-cols-2
            gap-6
          ">

            <EditableField
              label="Full Name"
              name="name"
              value={formData.name}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.name}
            />

            <EditableField
              label="Email"
              name="email"
              value={formData.email}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.email}
            />

            <EditableField
              label="Employee ID"
              name="empId"
              value={formData.empId}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.empId}
            />

            <EditableField
              label="Department"
              name="department"
              value={formData.department}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.department}
            />

            <EditableField
              label="Phone"
              name="contact"
              value={formData.contact}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.contact}
            />

            <EditableField
              label="Address"
              name="address"
              value={formData.address}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.address}
            />


            {/* Joining date */}
            <div>

              <p className="
                text-xs
                font-medium
                text-gray-500
                uppercase
              ">

                Joining Date

              </p>

              <p className="
                text-sm
                font-semibold
                text-gray-800
                mt-1
              ">

                {
                  user.joiningDate

                    ? new Date(
                        user.joiningDate
                      ).toLocaleDateString("en-IN")

                    : "N/A"
                }

              </p>
            </div>
          </div>
        </div>



        {/* ================= BUTTONS ================= */}

        <div className="
          border-t
          border-gray-300
          p-4
          text-center
          space-x-4
        ">

          {
            isEditing ? (

              <>

                {/* Save button */}
                <button

                  onClick={handleSave}

                  disabled={saving}

                  className="
                    bg-green-700
                    hover:bg-green-900
                    text-white
                    px-5
                    py-2
                    rounded
                    text-sm
                    cursor-pointer
                    disabled:opacity-50
                  "
                >

                  {
                    saving

                      ? "Saving..."

                      : "Save"
                  }

                </button>


                {/* Cancel button */}
                <button

                  onClick={handleCancel}

                  className="
                    bg-gray-500
                    hover:bg-gray-700
                    text-white
                    px-5
                    py-2
                    rounded
                    text-sm
                    cursor-pointer
                  "
                >

                  Cancel

                </button>

              </>

            ) : (

              // Edit button
              <button

                onClick={() =>
                  setIsEditing(true)
                }

                className="
                  bg-blue-600
                  hover:bg-blue-800
                  text-white
                  px-6
                  py-2
                  rounded
                  text-sm
                  cursor-pointer
                "
              >

                Edit Profile

              </button>
            )
          }


          {/* Logout button */}
          <button

            onClick={() => {

              console.log(
                "🚪 User logged out"
              );

              logout();

              window.location.href =
                "/login";
            }}

            className="
              bg-red-600
              hover:bg-red-800
              text-white
              px-6
              py-2
              rounded
              text-sm
              cursor-pointer
            "
          >

            Logout

          </button>
        </div>
      </div>
    </div>
  );
};



// ======================================================
// ================= EDITABLE FIELD =====================
// ======================================================

const EditableField = ({

  label,

  value,

  isEditing,

  name,

  onChange,

  error,

  type = "text"

}) => {

  return (

    <div>

      {/* Field label */}
      <p className="
        text-xs
        font-medium
        text-gray-500
        uppercase
      ">

        {label}

      </p>


      {
        isEditing ? (

          <>

            {/* Editable input */}
            <input

              type={type}

              name={name}

              value={value}

              onChange={onChange}

              className={`
                mt-1
                w-full
                border
                rounded
                px-3
                py-1
                text-sm
                focus:outline-none
                focus:ring-2
                focus:ring-green-700

                ${
                  error

                    ? "border-red-500"

                    : "border-gray-300"
                }
              `}
            />


            {/* Error text */}
            {
              error && (

                <p className="
                  text-xs
                  text-red-600
                  mt-1
                ">

                  {error}

                </p>
              )
            }

          </>

        ) : (

          // Read-only text
          <p className="
            text-sm
            font-semibold
            text-gray-800
            mt-1
          ">

            {value || "N/A"}

          </p>
        )
      }

    </div>
  );
};


// Export component
export default Profile;