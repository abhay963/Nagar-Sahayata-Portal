import React, {
  useState,
  useEffect
} from "react";

import { useAuth }
from "../context/AuthContext";

import axios from "../api/axios";

import { toast }
from "react-toastify";


const Profile = () => {

  const {

    user,

    logout,

    setUser,

    loading

  } = useAuth();


  // ================= EDIT MODE =================

  const [

    isEditing,

    setIsEditing

  ] = useState(false);


  // ================= FORM DATA =================

  const [

    formData,

    setFormData

  ] = useState({

    name: "",

    email: "",

    empId: "",

    department: "",

    city: "",

    contact: "",

    address: "",

    profileImage: null,
  });


  // ================= ERRORS =================

  const [

    errors,

    setErrors

  ] = useState({});


  // ================= LOADING =================

  const [

    saving,

    setSaving

  ] = useState(false);



  // ======================================================
  // ================= PREFILL USER DATA ==================
  // ======================================================

  useEffect(() => {

    if (user) {

      setFormData({

        name:
          user.name || "",

        email:
          user.email || "",

        empId:
          user.empId || "",

        department:
          user.department || "",

        city:
          user.city || "",

        contact:
          user.contact || "",

        address:
          user.address || "",

        profileImage: null,
      });
    }

  }, [user]);



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

      </div>
    );
  }



  // ======================================================
  // ================= VALIDATION =========================
  // ======================================================

  const validate = () => {

    const errs = {};

    if (!formData.name.trim()) {

      errs.name =
        "Name is required";
    }

    if (!formData.email.trim()) {

      errs.email =
        "Email is required";
    }

    if (!formData.empId.trim()) {

      errs.empId =
        "Employee ID required";
    }

    if (!formData.department.trim()) {

      errs.department =
        "Department required";
    }

    if (!formData.city.trim()) {

      errs.city =
        "City required";
    }

    if (!formData.contact.trim()) {

      errs.contact =
        "Contact required";
    }

    return errs;
  };



  // ======================================================
  // ================= HANDLE CHANGE ======================
  // ======================================================

  const handleChange = (e) => {

    const {

      name,

      value,

      files

    } = e.target;

    if (files) {

      setFormData((prev) => ({

        ...prev,

        [name]: files[0],
      }));

    } else {

      setFormData((prev) => ({

        ...prev,

        [name]: value,
      }));
    }
  };



  // ======================================================
  // ================= SAVE PROFILE =======================
  // ======================================================

  const handleSave = async () => {

    const errs = validate();

    setErrors(errs);

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

      const data = new FormData();

      Object.keys(formData).forEach((key) => {

        data.append(
          key,
          formData[key]
        );
      });

      const res = await axios.put(

        "/api/users/update-profile",

        data,

        {
          headers: {
            "Content-Type":
              "multipart/form-data",
          },
        }
      );

      setUser(
        res.data.updatedUser
      );

      setIsEditing(false);

      toast.success(
        "Profile updated successfully"
      );

    } catch (err) {

      console.error(err);

      toast.error(

        err.response?.data?.message ||

        "Update failed"
      );

    } finally {

      setSaving(false);
    }
  };



  // ======================================================
  // ================= CANCEL EDIT ========================
  // ======================================================

  const handleCancel = () => {

    setIsEditing(false);

    setErrors({});
  };



  // ======================================================
  // ================= USER INITIALS ======================
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
  // ================= MAIN UI ============================
  // ======================================================

  return (

    <div className="
      min-h-screen
      bg-gray-100
      py-10
      px-4
    ">

      <div className="
        max-w-6xl
        mx-auto
        bg-white
        rounded-2xl
        shadow-xl
        overflow-hidden
      ">

        {/* ================= HEADER ================= */}

        <div className="
          bg-green-700
          text-white
          text-center
          py-5
        ">

          <h1 className="
            text-3xl
            font-bold
          ">

            My Profile

          </h1>

          <p className="
            text-sm
            mt-1
          ">

            Nagar Sahayata Portal

          </p>
        </div>



        {/* ================= CONTENT ================= */}

        <div className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-8
          p-8
        ">

          {/* ================= LEFT ================= */}

          <div className="
            flex
            flex-col
            items-center
          ">

            {
              user.profileImage ? (

                <img

                  src={user.profileImage}

                  alt="Profile"

                  className="
                    w-40
                    h-40
                    rounded-full
                    object-cover
                    border-4
                    border-green-600
                    shadow-lg
                  "
                />

              ) : (

                <div className="
                  w-40
                  h-40
                  rounded-full
                  flex
                  items-center
                  justify-center
                  bg-gradient-to-br
                  from-green-300
                  to-green-700
                  text-white
                  text-5xl
                  font-bold
                ">

                  {getInitials(user.name)}

                </div>
              )
            }

            <h2 className="
              text-2xl
              font-bold
              mt-5
            ">

              {user.name}

            </h2>

            <p className="
              text-gray-600
              mt-1
            ">

              {user.role}

            </p>

            <p className="
              text-sm
              mt-2
              text-green-700
              font-semibold
            ">

              {
                user.isApproved

                  ? "Approved ✅"

                  : "Pending Approval ⏳"
              }

            </p>
          </div>



          {/* ================= RIGHT ================= */}

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
              label="City"
              name="city"
              value={formData.city}
              isEditing={isEditing}
              onChange={handleChange}
              error={errors.city}
            />

            <EditableField
              label="Contact"
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
            />


            {/* Role */}
            <DisplayField
              label="Role"
              value={user.role}
            />

            {/* Account Status */}
            <DisplayField
              label="Account Status"
              value={user.accountStatus}
            />

            {/* MongoDB ID */}
            <DisplayField
              label="User ID"
              value={user._id}
            />

            {/* Created */}
            <DisplayField
              label="Created At"
              value={
                user.createdAt

                  ? new Date(
                      user.createdAt
                    ).toLocaleString("en-IN")

                  : "N/A"
              }
            />

            {/* Joining Date */}
            <DisplayField
              label="Joining Date"
              value={
                user.joiningDate

                  ? new Date(
                      user.joiningDate
                    ).toLocaleDateString("en-IN")

                  : "N/A"
              }
            />

            {/* System */}
            <DisplayField
              label="System Status"
              value="All Good ✅"
            />


            {/* Upload Image */}
            {
              isEditing && (

                <div className="
                  sm:col-span-2
                ">

                  <p className="
                    text-xs
                    font-medium
                    text-gray-500
                    uppercase
                  ">

                    Profile Image

                  </p>

                  <input

                    type="file"

                    name="profileImage"

                    accept="image/*"

                    onChange={handleChange}

                    className="
                      mt-2
                      block
                      w-full
                    "
                  />

                </div>
              )
            }
          </div>
        </div>



        {/* ================= BUTTONS ================= */}

        <div className="
          border-t
          p-6
          flex
          flex-wrap
          gap-4
          justify-center
        ">

          {
            isEditing ? (

              <>

                <button

                  onClick={handleSave}

                  disabled={saving}

                  className="
                    bg-green-700
                    hover:bg-green-800
                    text-white
                    px-6
                    py-2
                    rounded-lg
                  "
                >

                  {
                    saving

                      ? "Saving..."

                      : "Save Profile"
                  }

                </button>

                <button

                  onClick={handleCancel}

                  className="
                    bg-gray-500
                    hover:bg-gray-700
                    text-white
                    px-6
                    py-2
                    rounded-lg
                  "
                >

                  Cancel

                </button>

              </>

            ) : (

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
                  rounded-lg
                "
              >

                Edit Profile

              </button>
            )
          }

          <button

            onClick={() => {

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
              rounded-lg
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

            <input

              type={type}

              name={name}

              value={value}

              onChange={onChange}

              className={`
                mt-1
                w-full
                border
                rounded-lg
                px-3
                py-2
                text-sm

                ${
                  error

                    ? "border-red-500"

                    : "border-gray-300"
                }
              `}
            />

            {
              error && (

                <p className="
                  text-red-600
                  text-xs
                  mt-1
                ">

                  {error}

                </p>
              )
            }

          </>

        ) : (

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



// ======================================================
// ================= DISPLAY FIELD ======================
// ======================================================

const DisplayField = ({

  label,

  value

}) => {

  return (

    <div>

      <p className="
        text-xs
        font-medium
        text-gray-500
        uppercase
      ">

        {label}

      </p>

      <p className="
        text-sm
        font-semibold
        text-gray-800
        mt-1
        break-all
      ">

        {value || "N/A"}

      </p>

    </div>
  );
};


export default Profile;