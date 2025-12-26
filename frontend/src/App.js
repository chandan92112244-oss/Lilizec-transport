import React, { useState, useEffect } from "react";
import "./App.css";
import axios from "axios";

/* ================= ADMIN ================= */
const ADMIN_PASSWORD = "Lilizec2025chandan";

/* ================= BACKEND ================= */
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/* ================= BUSINESS INFO ================= */
const BUSINESS_NAME = "Lilizec Transport";
const BUSINESS_EMAIL = "lilizectransport@gmail.com";
const BUSINESS_DOMAIN = "lilizce.com";

/* ================= ICONS ================= */

const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h1"/>
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.63L18.4 9.6a1 1 0 0 0-.8-.4H14"/>
    <circle cx="7" cy="18" r="2"/>
    <circle cx="17" cy="18" r="2"/>
  </svg>
);

const RickshawIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="6" cy="17" r="2"/>
    <circle cx="18" cy="17" r="2"/>
    <path d="M4 17h16l-2-6H6z"/>
  </svg>
);

const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <line x1="2" y1="10" x2="22" y2="10"/>
  </svg>
);

const UpiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="5" width="20" height="14" rx="2"/>
    <path d="M12 12h.01"/>
    <path d="M17 9h.01"/>
    <path d="M7 15h.01"/>
  </svg>
);

const WhatsappIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="currentColor">
    <path d="M16.72 13.5c-.3-.15-1.8-.9-2.08-1s-.5-.15-.7.15-.8 1-.98 1.2-.36.23-.66.08a8.2 8.2 0 0 1-2.4-1.5 9 9 0 0 1-1.7-2.1c-.18-.3 0-.46.14-.6.14-.14.3-.36.46-.54a.6.6 0 0 0 .1-.7c-.1-.15-.7-1.7-.96-2.3-.26-.6-.52-.52-.7-.53h-.6a1.15 1.15 0 0 0-.82.38c-.28.3-1.08 1.05-1.08 2.55s1.1 3 1.26 3.2a11.7 11.7 0 0 0 4.5 4c.56.24 1 .38 1.34.5.56.18 1.06.15 1.46.1.44-.07 1.8-.74 2.06-1.46.26-.72.26-1.34.18-1.46-.08-.12-.28-.18-.58-.33z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="4" width="20" height="15" rx="2"/>
    <path d="M22 7l-10 6L2 7"/>
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 1 1 5.82 1c0 2-3 2-3 4"/>
    <line x1="12" y1="17" x2="12" y2="17"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="7" r="4"/>
    <path d="M5.5 21a6.5 6.5 0 0 1 13 0"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
    viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const BookingForm = ({ onBookingSuccess, savedData, setSavedData }) => {
  const [formData, setFormData] = useState({
    vehicle_type: savedData?.vehicle_type || "",
    payment_method: savedData?.payment_method || "",

    pickup: {
      name: savedData?.pickup?.name || "",
      phone: savedData?.pickup?.phone || "",
      address: savedData?.pickup?.address || "",
      saman_details: savedData?.pickup?.saman_details || "",
    },

    drop: {
      receiver_name: savedData?.drop?.receiver_name || "",
      receiver_phone: savedData?.drop?.receiver_phone || "",
      drop_address: savedData?.drop?.drop_address || "",
    },
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  /* ===== SAVE FORM DATA ===== */
  useEffect(() => {
    localStorage.setItem("booking_form_data", JSON.stringify(formData));
    setSavedData(formData);
  }, [formData, setSavedData]);

  /* ===== HANDLE INPUT CHANGE ===== */
  const handleInputChange = (section, field, value) => {
    if (section === "pickup" || section === "drop") {
      setFormData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  /* ===== SUBMIT ===== */
  const handleSubmit = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${API}/booking`, formData);
      setSuccess(true);
      onBookingSuccess(res.data);
      localStorage.removeItem("booking_form_data");
    } catch (err) {
      setError("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h3>Booking Form</h3>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {success && <p style={{ color: "green" }}>Booking Successful</p>}

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Submitting..." : "Submit Booking"}
      </button>
    </div>
  );
};
