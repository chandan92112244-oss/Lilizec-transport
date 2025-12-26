import { useState, useEffect } from "react";
import "@/App.css";
import axios from "axios";
const ADMIN_PASSWORD = "Lilizec2025chandan";//
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Business Info
const BUSINESS_NAME = "Lilizec Transport";
const BUSINESS_EMAIL = "lilizectransport@gmail.com";
const BUSINESS_DOMAIN = "lilizec.com";

// Icons
const TruckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
    <path d="M15 18H9"/>
    <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
    <circle cx="17" cy="18" r="2"/>
    <circle cx="7" cy="18" r="2"/>
  </svg>
);

const RickshawIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="17" r="2"/>
    <circle cx="18" cy="17" r="2"/>
    <path d="M4 17h-2v-6l3-4h5l2 4h8v6h-2"/>
    <path d="M10 17h4"/>
    <path d="M7 7v4"/>
  </svg>
);

const CashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <line x1="2" x2="22" y1="10" y2="10"/>
  </svg>
);

const UpiIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="14" x="2" y="5" rx="2"/>
    <path d="M12 12h.01"/>
    <path d="M17 9h.01"/>
    <path d="M7 15h.01"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const MailIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2"/>
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
  </svg>
);

const HelpIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <path d="M12 17h.01"/>
  </svg>
);

const UserIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

const PlusIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/>
    <path d="M12 5v14"/>
  </svg>
);

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18"/>
    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
  </svg>
);

const EditIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
  </svg>
);

// Booking Form Component
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

  useEffect(() => {
    localStorage.setItem("booking_form_data", JSON.stringify(formData));
    setSavedData(formData);
  }, [formData, setSavedData]);

  const handleInputChange = (section, field, value) => {
    if (section === "pickup" || section === "drop") {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${API}/bookings`, formData);
      setSuccess(true);
      onBookingSuccess(response.data);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Booking submit nahi ho paya. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Vehicle Type Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="vehicle-selection">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">1</span>
            Vehicle Type चुनें
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              data-testid="vehicle-erickshaw"
              onClick={() => handleInputChange(null, "vehicle_type", "e-rickshaw")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.vehicle_type === "e-rickshaw"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 hover:border-green-300"
              }`}
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <RickshawIcon />
              </div>
              <span className="font-medium">E-Rickshaw</span>
              <span className="text-xs text-gray-500">छोटा सामान</span>
            </button>
            <button
              type="button"
              data-testid="vehicle-pickup"
              onClick={() => handleInputChange(null, "vehicle_type", "pickup")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.vehicle_type === "pickup"
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-gray-200 hover:border-blue-300"
              }`}
            >
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                <TruckIcon />
              </div>
              <span className="font-medium">Pickup</span>
              <span className="text-xs text-gray-500">बड़ा सामान</span>
            </button>
          </div>
        </div>

        {/* Payment Method Selection */}
        <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="payment-selection">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">2</span>
            Payment Method चुनें
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              data-testid="payment-cash"
              onClick={() => handleInputChange(null, "payment_method", "cash")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.payment_method === "cash"
                  ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                  : "border-gray-200 hover:border-yellow-300"
              }`}
            >
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <CashIcon />
              </div>
              <span className="font-medium">Cash</span>
              <span className="text-xs text-gray-500">नकद भुगतान</span>
            </button>
            <button
              type="button"
              data-testid="payment-upi"
              onClick={() => handleInputChange(null, "payment_method", "upi")}
              className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                formData.payment_method === "upi"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-200 hover:border-purple-300"
              }`}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <UpiIcon />
              </div>
              <span className="font-medium">UPI</span>
              <span className="text-xs text-gray-500">Online भुगतान</span>
            </button>
          </div>
        </div>

        {/* Pickup Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="pickup-details">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">3</span>
            Pickup Details (सामान कहां से लेना है)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">आपका नाम *</label>
              <input
                type="text"
                data-testid="pickup-name"
                value={formData.pickup.name}
                onChange={(e) => handleInputChange("pickup", "name", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="अपना नाम लिखें"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                data-testid="pickup-phone"
                value={formData.pickup.phone}
                onChange={(e) => handleInputChange("pickup", "phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10 digit mobile number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Address *</label>
              <textarea
                data-testid="pickup-address"
                value={formData.pickup.address}
                onChange={(e) => handleInputChange("pickup", "address", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="पूरा पता लिखें - गली, मोहल्ला, landmark"
                rows="2"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">सामान की Details *</label>
              <textarea
                data-testid="pickup-saman"
                value={formData.pickup.saman_details}
                onChange={(e) => handleInputChange("pickup", "saman_details", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="क्या-क्या सामान है, कितना वजन है"
                rows="2"
                required
              />
            </div>
          </div>
        </div>

        {/* Drop Details */}
        <div className="bg-white rounded-2xl shadow-lg p-6" data-testid="drop-details">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">4</span>
            Drop Details (सामान कहां पहुंचाना है)
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver का नाम *</label>
              <input
                type="text"
                data-testid="drop-name"
                value={formData.drop.receiver_name}
                onChange={(e) => handleInputChange("drop", "receiver_name", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="जिसे सामान मिलेगा उसका नाम"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Receiver का Phone *</label>
              <input
                type="tel"
                data-testid="drop-phone"
                value={formData.drop.receiver_phone}
                onChange={(e) => handleInputChange("drop", "receiver_phone", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="10 digit mobile number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Drop Address *</label>
              <textarea
                data-testid="drop-address"
                value={formData.drop.drop_address}
                onChange={(e) => handleInputChange("drop", "drop_address", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="पूरा पता लिखें - गली, मोहल्ला, landmark"
                rows="2"
                required
              />
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg text-center" data-testid="error-message">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="bg-green-50 text-green-600 p-4 rounded-lg text-center" data-testid="success-message">
            ✅ Booking successful! हम जल्दी ही आपसे WhatsApp पर contact करेंगे।
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          data-testid="submit-booking"
          disabled={loading || !formData.vehicle_type || !formData.payment_method}
          className="w-full py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-semibold rounded-xl shadow-lg hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {loading ? (
            <span>Booking हो रही है...</span>
          ) : (
            <>
              <span>Booking करें</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14"/>
                <path d="m12 5 7 7-7 7"/>
              </svg>
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// Help Section Component
const HelpSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/help`, formData);
      setSuccess(true);
      setFormData({ name: "", phone: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError("Message send nahi ho paya. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto" data-testid="help-section">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          🆘 मदद चाहिए?
        </h2>
        <p className="text-gray-600">
          कोई भी समस्या हो, हमसे संपर्क करें
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">📞 संपर्क करें</h3>
            
            <div className="space-y-4">
              <a
                href={`mailto:${BUSINESS_EMAIL}`}
                className="flex items-center gap-3 p-4 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
              >
                <div className="w-12 h-12 bg-orange-500 text-white rounded-full flex items-center justify-center">
                  <MailIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Email करें</p>
                  <p className="text-sm text-orange-600">{BUSINESS_EMAIL}</p>
                </div>
              </a>

              <a
                href={`https://wa.me/919999999999?text=Hello, I need help with ${BUSINESS_NAME}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-green-50 rounded-xl hover:bg-green-100 transition-colors"
              >
                <div className="w-12 h-12 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <WhatsAppIcon />
                </div>
                <div>
                  <p className="font-medium text-gray-800">WhatsApp करें</p>
                  <p className="text-sm text-green-600">Quick Response</p>
                </div>
              </a>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl shadow-lg p-6 text-white">
            <h3 className="text-lg font-semibold mb-2">🚚 {BUSINESS_NAME}</h3>
            <p className="text-orange-100 text-sm mb-4">
              E-Rickshaw और Pickup से आपका सामान सुरक्षित पहुंचाएं
            </p>
            <p className="text-sm">
              🌐 <span className="font-medium">{BUSINESS_DOMAIN}</span>
            </p>
          </div>
        </div>

        {/* Contact Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">✉️ Message भेजें</h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">नाम *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="आपका नाम"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Mobile number"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Email (optional)"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
              <input
                type="text"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="क्या समस्या है?"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="पूरी details लिखें"
                rows="3"
                required
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">✅ Message भेज दिया गया!</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
            >
              {loading ? "भेज रहे हैं..." : "Message भेजें"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Driver Panel Component
const DriverPanel = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    vehicle: {
      vehicle_type: "e-rickshaw",
      vehicle_number: "",
      vehicle_color: "",
    },
    is_available: true,
  });

  const fetchDrivers = async () => {
    try {
      const response = await axios.get(`${API}/drivers`);
      setDrivers(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDriver) {
        await axios.patch(`${API}/drivers/${editingDriver.id}`, formData);
      } else {
        await axios.post(`${API}/drivers`, formData);
      }
      fetchDrivers();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      phone: "",
      address: "",
      vehicle: {
        vehicle_type: "e-rickshaw",
        vehicle_number: "",
        vehicle_color: "",
      },
      is_available: true,
    });
    setEditingDriver(null);
    setShowForm(false);
  };

  const handleEdit = (driver) => {
    setFormData({
      name: driver.name,
      phone: driver.phone,
      address: driver.address || "",
      vehicle: driver.vehicle,
      is_available: driver.is_available,
    });
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDelete = async (driverId) => {
    if (window.confirm("क्या आप इस driver को delete करना चाहते हैं?")) {
      try {
        await axios.delete(`${API}/drivers/${driverId}`);
        fetchDrivers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleAvailability = async (driver) => {
    try {
      await axios.patch(`${API}/drivers/${driver.id}`, {
        is_available: !driver.is_available,
      });
      fetchDrivers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto" data-testid="driver-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">🚗 Driver Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          <PlusIcon />
          New Driver
        </button>
      </div>

      {/* Add/Edit Driver Form */}
      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            {editingDriver ? "✏️ Edit Driver" : "➕ Add New Driver"}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Driver का नाम *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="Driver का नाम"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="Mobile number"
                required
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="Driver का पता"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type *</label>
              <select
                value={formData.vehicle.vehicle_type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, vehicle_type: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
              >
                <option value="e-rickshaw">E-Rickshaw</option>
                <option value="pickup">Pickup</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Number *</label>
              <input
                type="text"
                value={formData.vehicle.vehicle_number}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, vehicle_number: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="UP XX AB 1234"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Color</label>
              <input
                type="text"
                value={formData.vehicle.vehicle_color}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    vehicle: { ...formData.vehicle, vehicle_color: e.target.value },
                  })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500"
                placeholder="गाड़ी का रंग"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_available"
                checked={formData.is_available}
                onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
                className="w-5 h-5 text-orange-500 rounded"
              />
              <label htmlFor="is_available" className="text-sm text-gray-700">Available है?</label>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingDriver ? "Update" : "Save"} Driver
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Drivers List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : drivers.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <p className="text-gray-500">कोई driver नहीं है। New Driver add करें।</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {drivers.map((driver) => (
            <div
              key={driver.id}
              className={`bg-white rounded-2xl shadow-lg p-5 border-l-4 ${
                driver.is_available ? "border-green-500" : "border-red-500"
              }`}
              data-testid={`driver-${driver.id}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    driver.vehicle.vehicle_type === "e-rickshaw" ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    {driver.vehicle.vehicle_type === "e-rickshaw" ? <RickshawIcon /> : <TruckIcon />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{driver.name}</h4>
                    <p className="text-sm text-gray-500">{driver.phone}</p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    driver.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {driver.is_available ? "Available" : "Busy"}
                </span>
              </div>

              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p><strong>Vehicle:</strong> {driver.vehicle.vehicle_type}</p>
                <p><strong>Number:</strong> {driver.vehicle.vehicle_number}</p>
                {driver.vehicle.vehicle_color && (
                  <p><strong>Color:</strong> {driver.vehicle.vehicle_color}</p>
                )}
                <p><strong>Total Trips:</strong> {driver.total_trips || 0}</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => toggleAvailability(driver)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium ${
                    driver.is_available
                      ? "bg-red-100 text-red-700 hover:bg-red-200"
                      : "bg-green-100 text-green-700 hover:bg-green-200"
                  }`}
                >
                  {driver.is_available ? "Mark Busy" : "Mark Available"}
                </button>
                <button
                  onClick={() => handleEdit(driver)}
                  className="p-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => handleDelete(driver.id)}
                  className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Admin Panel Component
const AdminPanel = ({ onBack, activeTab, setActiveTab }) => {
  const [bookings, setBookings] = useState([]);
  const [helpRequests, setHelpRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const fetchBookings = async () => {
    try {
      const response = await axios.get(`${API}/bookings`);
      setBookings(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHelpRequests = async () => {
    try {
      const response = await axios.get(`${API}/help`);
      setHelpRequests(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchHelpRequests();
    const interval = setInterval(() => {
      fetchBookings();
      fetchHelpRequests();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.patch(`${API}/bookings/${bookingId}`, { status });
      fetchBookings();
    } catch (err) {
      console.error(err);
    }
  };

  const sendWhatsApp = (booking) => {
    const message = `🚚 *${BUSINESS_NAME} - Booking Confirmed*\n\n*Vehicle:* ${booking.vehicle_type}\n*Payment:* ${booking.payment_method}\n\n*Pickup:*\nName: ${booking.pickup.name}\nPhone: ${booking.pickup.phone}\nAddress: ${booking.pickup.address}\nSaman: ${booking.pickup.saman_details}\n\n*Drop:*\nReceiver: ${booking.drop.receiver_name}\nPhone: ${booking.drop.receiver_phone}\nAddress: ${booking.drop.drop_address}`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${booking.pickup.phone}?text=${encodedMessage}`, "_blank");
  };

  const filteredBookings = filter === "all" 
    ? bookings 
    : bookings.filter(b => b.status === filter);

  const getStatusColor = (status) => {
    switch(status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (activeTab === "drivers") {
    return <DriverPanel />;
  }

  if (activeTab === "help") {
    return (
      <div className="max-w-6xl mx-auto" data-testid="help-requests-panel">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">📩 Help Requests</h2>
        {helpRequests.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl shadow">
            <p className="text-gray-500">कोई help request नहीं है</p>
          </div>
        ) : (
          <div className="space-y-4">
            {helpRequests.map((req) => (
              <div key={req.id} className="bg-white rounded-2xl shadow-lg p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-800">{req.name}</h4>
                    <p className="text-sm text-gray-500">{req.phone} • {req.email}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    req.status === "new" ? "bg-red-100 text-red-700" :
                    req.status === "in_progress" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>
                    {req.status}
                  </span>
                </div>
                <p className="font-medium text-gray-700 mb-1">{req.subject}</p>
                <p className="text-gray-600 text-sm">{req.message}</p>
                <div className="flex gap-2 mt-4">
                  <a
                    href={`mailto:${req.email || BUSINESS_EMAIL}?subject=Re: ${req.subject}`}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
                  >
                    Reply Email
                  </a>
                  <a
                    href={`https://wa.me/${req.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 text-sm"
                  >
                    WhatsApp
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto" data-testid="admin-panel">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-800">📋 Bookings</h2>
        <button
          onClick={fetchBookings}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-medium capitalize whitespace-nowrap ${
              filter === status
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-600 hover:bg-gray-100"
            }`}
          >
            {status} ({status === "all" ? bookings.length : bookings.filter(b => b.status === status).length})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-2xl shadow">
          <p className="text-gray-500">कोई booking नहीं है</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((booking) => (
            <div key={booking.id} className="bg-white rounded-2xl shadow-lg p-6" data-testid={`booking-${booking.id}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.vehicle_type === "e-rickshaw" ? "bg-green-100 text-green-800" : "bg-blue-100 text-blue-800"
                  }`}>
                    {booking.vehicle_type === "e-rickshaw" ? "🛺 E-Rickshaw" : "🚛 Pickup"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    booking.payment_method === "cash" ? "bg-yellow-100 text-yellow-800" : "bg-purple-100 text-purple-800"
                  }`}>
                    {booking.payment_method === "cash" ? "💵 Cash" : "📱 UPI"}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                    {booking.status}
                  </span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(booking.created_at).toLocaleString("hi-IN")}
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-xl p-4">
                  <h4 className="font-semibold text-green-800 mb-2">📍 Pickup</h4>
                  <p><strong>Name:</strong> {booking.pickup.name}</p>
                  <p><strong>Phone:</strong> <a href={`tel:${booking.pickup.phone}`} className="text-green-600">{booking.pickup.phone}</a></p>
                  <p><strong>Address:</strong> {booking.pickup.address}</p>
                  <p><strong>Saman:</strong> {booking.pickup.saman_details}</p>
                </div>

                <div className="bg-blue-50 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">📦 Drop</h4>
                  <p><strong>Receiver:</strong> {booking.drop.receiver_name}</p>
                  <p><strong>Phone:</strong> <a href={`tel:${booking.drop.receiver_phone}`} className="text-blue-600">{booking.drop.receiver_phone}</a></p>
                  <p><strong>Address:</strong> {booking.drop.drop_address}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <button
                  onClick={() => sendWhatsApp(booking)}
                  className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </button>
                {booking.status === "pending" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "confirmed")}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                  >
                    ✅ Confirm
                  </button>
                )}
                {booking.status === "confirmed" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "completed")}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    ✔️ Complete
                  </button>
                )}
                {booking.status !== "cancelled" && booking.status !== "completed" && (
                  <button
                    onClick={() => updateBookingStatus(booking.id, "cancelled")}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                  >
                    ❌ Cancel
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const ADMIN_PASSWORD = "Lilizec2025chandan";
  const [currentPage, setCurrentPage] = useState("home");
  const [adminTab, setAdminTab] = useState("bookings");
  const [savedData, setSavedData] = useState(() => {
    const saved = localStorage.getItem("booking_form_data");
    return saved ? JSON.parse(saved) : null;
  });
  const [lastBooking, setLastBooking] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  // 🔒 HARD ADMIN GUARD
useEffect(() => {
  if (currentPage === "admin" && !isAdmin) {
    setCurrentPage("home");
  }
}, [currentPage, isAdmin]);

const handleAdminAccess = () => {
  const password = prompt("Enter admin password");

  if (password === ADMIN_PASSWORD) {
    setIsAdmin(true);
    setCurrentPage("admin");
    setAdminTab("bookings");
  } else {
    alert("Wrong password");
  }
};
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-3 cursor-pointer" 
              onClick={() => { setCurrentPage("home"); setAdminTab("bookings"); }}
              data-testid="logo"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                <TruckIcon />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">{BUSINESS_NAME}</h1>
                <p className="text-xs text-gray-500">{BUSINESS_DOMAIN}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage("help")}
                data-testid="help-button"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === "help" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <HelpIcon />
                <span className="hidden sm:inline">Help</span>
              </button>
              <button
                onClick={handleAdminAccess}
                data-testid="admin-toggle"
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  currentPage === "admin" ? "bg-orange-100 text-orange-600" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <UserIcon />
                <span className="hidden sm:inline">Admin</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Tabs */}
      {currentPage === "admin" && isAdmin && (
        <div className="bg-white border-b">
          <div className="max-w-6xl mx-auto px-4">
            <div className="flex gap-1 py-2">
              <button
                onClick={() => setAdminTab("bookings")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  adminTab === "bookings" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📋 Bookings
              </button>
              <button
                onClick={() => setAdminTab("drivers")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  adminTab === "drivers" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                🚗 Drivers
              </button>
              <button
                onClick={() => setAdminTab("help")}
                className={`px-4 py-2 rounded-lg font-medium ${
                  adminTab === "help" ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                📩 Help Requests
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
  {currentPage === "home" ? (
    <>
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">
          सामान पहुंचाना है?
        </h2>
        <p className="text-gray-600">
          E-Rickshaw या Pickup से अपना सामान आसानी से भेजें
        </p>
      </div>

      {/* Last Booking Info */}
      {lastBooking && (
        <div className="max-w-2xl mx-auto mb-6 bg-green-50 border rounded-lg p-4">
          <p className="text-green-800 font-medium">✅ आपकी Last Booking</p>
          <p className="text-sm text-green-600">
            Booking ID: {lastBooking.id}
          </p>
        </div>
      )}

      {/* Booking Form */}
      <BookingForm
        onBookingSuccess={handleBookingSuccess}
        savedData={savedData}
        setSavedData={setSavedData}
      />
    </>
  ) : currentPage === "help" ? (
    <HelpSection />
</main>

      {/* Footer */}
      <footer className="bg-white border-t mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-center md:text-left">
              <p className="font-semibold text-gray-800">{BUSINESS_NAME}</p>
              <p className="text-sm text-gray-500">E-Rickshaw & Pickup Delivery Service</p>
            </div>
            <div className="flex items-center gap-4">
              <a href={`mailto:${BUSINESS_EMAIL}`} className="text-gray-500 hover:text-orange-500">
                <MailIcon />
              </a>
              <span className="text-sm text-gray-500">🌐 {BUSINESS_DOMAIN}</span>
            </div>
          </div>
          <p className="text-center text-xs text-gray-400 mt-4">© 2025 {BUSINESS_NAME}. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
