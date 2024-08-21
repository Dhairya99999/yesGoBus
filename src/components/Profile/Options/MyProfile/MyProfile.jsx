import { useEffect, useState } from "react";
import "./MyProfile.scss";
//import axiosInstance from "../../../../utils/service";
import axios from "axios";

export default function MyProfile() {
  let translateElement;

  const googleTranslateElementInit = () => {
    translateElement = new window.google.translate.TranslateElement(
      {
        pageLanguage: "en",
        includedLanguages: "en,kn,te,ta,ml,hi",
        layout: window.google.translate.TranslateElement.InlineLayout.TOP_RIGHT,
      },
      "google_translate_element"
    );
  };

  function changeLanguage(languageCode) {
    translateElement.showInvisible();
    translateElement.selectLanguage(languageCode);
  }
  useEffect(() => {
    const translateElement = document.getElementById(
      "google_translate_element"
    );
    if (translateElement) {
      translateElement.innerHTML = "";
    }

    const buttonElement = document.getElementById("your_button_id");
    if (buttonElement) {
      // Check if the button element is already present
      return;
    }

    // Your existing script loading logic

    window.googleTranslateElementInit = googleTranslateElementInit;

    // Additional logic to prevent multiple renderings of the button
    const yourButton = document.createElement("button");
    yourButton.id = "your_button_id"; // Replace with the actual ID for your button
    yourButton.style.display = "none";
    document.querySelector(".right").appendChild(yourButton);

    // Clean up the button on component unmount
    return () => {
      const buttonToRemove = document.getElementById("your_button_id");
      if (buttonToRemove) {
        buttonToRemove.remove();
      }
    };
  }, []);
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const [formData, setFormData] = useState({
    fullName: loggedInUser?.fullName || "",
    email: loggedInUser?.email || "",
    phoneNumber: loggedInUser?.phoneNumber || "",
    gender: loggedInUser?.gender || "Select Gender",
  });

  function handleInputChange(e) {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token")
      const { data: updatedUser } = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/user/updateProfile/${
          loggedInUser._id
        }`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set the content type to JSON
          },
        }
      );
      if (updatedUser.status === 200) {
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser?.data));
        alert("Profile Updated");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="my__profile">
      <h1>Profile Info</h1>
      <form onSubmit={handleSubmit} autoComplete="off" className="info__grid">
        <input
          type="Name"
          id="userId"
          name="userId"
          className={`profile__input ${loggedInUser?.isAgent ? "agent" : ""}`}
          value={loggedInUser?.userId}
          disabled
        />
        <input
          type="Name"
          id="name"
          name="fullName"
          placeholder="Enter Name"
          className="profile__input"
          value={formData?.fullName}
          onChange={handleInputChange}
        />

        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter Email"
          className="profile__input"
          value={formData?.email}
          onChange={handleInputChange}
        />

        <input
          type="tel"
          name="phoneNumber"
          id="mobile"
          placeholder="Mobile Number"
          className="profile__input"
          value={formData?.phoneNumber}
          onChange={handleInputChange}
        />

        <select
          name="gender"
          id="gender"
          className="profile__input select"
          value={formData?.gender}
          onChange={handleInputChange}
        >
          <option
            value="Select Gender"
            disabled
            style={{ color: "rgba(121, 121, 121, 1)" }}
          >
            Select Gender
          </option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>

        {/* <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          className="profile__input"
          autoComplete="new-password"
          value={formData?.password}
          onChange={handleInputChange}
        /> */}

        <button type="submit" className="save-btn orange__button">
          Save
        </button>
      </form>
      <div className="container">
        <h1>Change Language:</h1>
         <div className="md:block" id="google_translate_element"></div>
      </div>
    </div>
  );
}
