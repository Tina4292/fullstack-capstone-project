import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './Profile.css'
import {urlConfig} from '../../config';
import { useAppContext } from '../../context/AuthContext';

const Profile = () => {
  const [userDetails, setUserDetails] = useState({});
 const [updatedDetails, setUpdatedDetails] = useState({});
 const {setUserName} = useAppContext();
 const [changed, setChanged] = useState("");

 const [editMode, setEditMode] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const authtoken = sessionStorage.getItem("auth-token");
    if (!authtoken) {
      navigate("/app/login");
    } else {
      fetchUserProfile();
    }
  }, [navigate]);

  const fetchUserProfile = async () => {
    try {
      const authtoken = sessionStorage.getItem("auth-token");
      const email = sessionStorage.getItem("email");
      const name=sessionStorage.getItem('name');
      if (name || authtoken) {
                const storedUserDetails = {
                  name: name,
                  email:email
                };

                setUserDetails(storedUserDetails);
                setUpdatedDetails(storedUserDetails);
              }
} catch (error) {
  console.error(error);
  // Handle error case
}
};

const handleEdit = () => {
setEditMode(true);
};

const handleInputChange = (e) => {
setUpdatedDetails({
  ...updatedDetails,
  [e.target.name]: e.target.value,
});
};
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const authtoken = sessionStorage.getItem("auth-token");
    const email = sessionStorage.getItem("user-email");

    if (!authtoken || !email) {
      navigate("/app/login");
      return;
    }

    // Extract first and last name from updatedDetails.name
    const [firstName, ...lastParts] = updatedDetails.name.split(" ");
    const lastName = lastParts.join(" ");
    const password = updatedDetails.password || ""; // Optional if field is blank

    const response = await fetch(`${urlConfig.backendUrl}/api/auth/update`, {
      method: "PUT", // ✅ Task 1
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authtoken}`,
        email: email // ✅ Task 2
      },
      body: JSON.stringify({
        firstName,
        lastName,
        password // ✅ Task 3
      })
    });

    if (response.ok) {
      const updatedName = `${firstName} ${lastName}`;

      sessionStorage.setItem("user-name", updatedName); // ✅ Task 4
      setUserDetails({ ...updatedDetails, name: updatedName }); // ✅ Task 5
      setEditMode(false);
      setChanged("Name Changed Successfully!");

      setTimeout(() => {
        setChanged("");
        navigate("/");
      }, 1000);
    } else {
      throw new Error("Failed to update profile");
    }
  } catch (error) {
    console.error("Error updating profile:", error.message);
  }
};

return (
<div className="profile-container">
  {editMode ? (
<form onSubmit={handleSubmit}>
<label>
  Email
  <input
    type="email"
    name="email"
    value={userDetails.email}
    disabled // Disable the email field
  />
</label>
<label>
   Name
   <input
     type="text"
     name="name"
     value={updatedDetails.name}
     onChange={handleInputChange}
   />
</label>
<label>
  Password
  <input
    type="password"
    name="password"
    value={updatedDetails.password || ""}
    onChange={handleInputChange}
  />
</label>

<button type="submit">Save</button>
</form>
) : (
<div className="profile-details">
<h1>Hi, {userDetails.name}</h1>
<p> <b>Email:</b> {userDetails.email}</p>
<button onClick={handleEdit}>Edit</button>
<span style={{color:'green',height:'.5cm',display:'block',fontStyle:'italic',fontSize:'12px'}}>{changed}</span>
</div>
)}
</div>
);
};

export default Profile;
