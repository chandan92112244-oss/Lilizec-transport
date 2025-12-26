
‎/app/backend/server.py
‎from fastapi import FastAPI, APIRouter
‎from dotenv import load_dotenv
‎from starlette.middleware.cors import CORSMiddleware
‎from motor.motor_asyncio import AsyncIOMotorClient
‎import os
‎import logging
‎from pathlib import Path
‎from pydantic import BaseModel, Field, ConfigDict
‎from typing import List
‎import uuid
‎from datetime import datetime, timezone
‎
‎
‎ROOT_DIR = Path(__file__).parent
‎load_dotenv(ROOT_DIR / '.env')
‎
‎# MongoDB connection
‎mongo_url = os.environ['MONGO_URL']
‎client = AsyncIOMotorClient(mongo_url)
‎db = client[os.environ['DB_NAME']]
‎
‎# Create the main app without a prefix
‎app = FastAPI()
‎
‎# Create a router with the /api prefix
‎api_router = APIRouter(prefix="/api")
‎
‎
‎# Define Models
‎class StatusCheck(BaseModel):
‎    model_config = ConfigDict(extra="ignore")
‎    
‎    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
‎    client_name: str
‎    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
‎
‎class StatusCheckCreate(BaseModel):
‎    client_name: str
‎
‎# Booking Models
‎class BookingCreate(BaseModel):
‎    customerName: str
‎    phoneNumber: str
‎    pickupAddress: str
‎    itemDetails: str
‎    receiverName: str
‎    receiverPhone: str
‎    dropAddress: str
‎    vehicleType: str
‎    paymentMethod: str
‎
‎class Booking(BaseModel):
‎    model_config = ConfigDict(extra="ignore")
‎    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
‎    customerName: str
‎    phoneNumber: str
‎    pickupAddress: str
‎    itemDetails: str
‎    receiverName: str
‎    receiverPhone: str
‎    dropAddress: str
‎    vehicleType: str
‎    paymentMethod: str
‎    status: str = "pending"
‎    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
‎
‎# Driver Models
‎class DriverCreate(BaseModel):
‎    name: str
‎    phone: str
‎    vehicleType: str
‎    vehicleNumber: str
‎
‎class Driver(BaseModel):
‎    model_config = ConfigDict(extra="ignore")
‎    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
‎    name: str
‎    phone: str
‎    vehicleType: str
‎    vehicleNumber: str
‎    status: str = "available"
‎    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
‎
‎# Help Request Models
‎class HelpRequestCreate(BaseModel):
‎    name: str
‎    phone: str
‎    message: str
‎
‎class HelpRequest(BaseModel):
‎    model_config = ConfigDict(extra="ignore")
‎    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
‎    name: str
‎    phone: str
‎    message: str
‎    status: str = "open"
‎    createdAt: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
‎
‎# Admin Login Model
‎class AdminLogin(BaseModel):
‎    password: str
‎
‎# Add your routes to the router instead of directly to app
‎@api_router.get("/")
‎async def root():
‎    return {"message": "Hello World"}
‎
‎@api_router.post("/status", response_model=StatusCheck)
‎async def create_status_check(input: StatusCheckCreate):
‎    status_dict = input.model_dump()
‎    status_obj = StatusCheck(**status_dict)
‎    
‎    doc = status_obj.model_dump()
‎    doc['timestamp'] = doc['timestamp'].isoformat()
‎    
‎    _ = await db.status_checks.insert_one(doc)
‎    return status_obj
‎
‎@api_router.get("/status", response_model=List[StatusCheck])
‎async def get_status_checks():
‎    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
‎    
‎    for check in status_checks:
‎        if isinstance(check['timestamp'], str):
‎            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
‎    
‎    return status_checks
‎
‎# Booking Routes
‎@api_router.post("/bookings", response_model=Booking)
‎async def create_booking(booking_data: BookingCreate):
‎    booking = Booking(**booking_data.model_dump())
‎    doc = booking.model_dump()
‎    doc['createdAt'] = doc['createdAt'].isoformat()
‎    await db.bookings.insert_one(doc)
‎    return booking
‎
‎@api_router.get("/bookings", response_model=List[Booking])
‎async def get_bookings():
‎    bookings = await db.bookings.find({}, {"_id": 0}).to_list(1000)
‎    for booking in bookings:
‎        if isinstance(booking['createdAt'], str):
‎            booking['createdAt'] = datetime.fromisoformat(booking['createdAt'])
‎    return bookings
‎
‎@api_router.patch("/bookings/{booking_id}")
‎async def update_booking_status(booking_id: str, status: str):
‎    result = await db.bookings.update_one(
‎        {"id": booking_id},
‎        {"$set": {"status": status}}
‎    )
‎    if result.modified_count == 0:
‎        return {"success": False, "message": "Booking not found"}
‎    return {"success": True, "message": "Status updated"}
‎
‎# Driver Routes
‎@api_router.post("/drivers", response_model=Driver)
‎async def create_driver(driver_data: DriverCreate):
‎    driver = Driver(**driver_data.model_dump())
‎    doc = driver.model_dump()
‎    doc['createdAt'] = doc['createdAt'].isoformat()
‎    await db.drivers.insert_one(doc)
‎    return driver
‎
‎@api_router.get("/drivers", response_model=List[Driver])
‎async def get_drivers():
‎    drivers = await db.drivers.find({}, {"_id": 0}).to_list(1000)
‎    for driver in drivers:
‎        if isinstance(driver['createdAt'], str):
‎            driver['createdAt'] = datetime.fromisoformat(driver['createdAt'])
‎    return drivers
‎
‎@api_router.patch("/drivers/{driver_id}")
‎async def update_driver_status(driver_id: str, status: str):
‎    result = await db.drivers.update_one(
‎        {"id": driver_id},
‎        {"$set": {"status": status}}
‎    )
‎    if result.modified_count == 0:
‎        return {"success": False, "message": "Driver not found"}
‎    return {"success": True, "message": "Status updated"}
‎
‎# Help Request Routes
‎@api_router.post("/help-requests", response_model=HelpRequest)
‎async def create_help_request(help_data: HelpRequestCreate):
‎    help_request = HelpRequest(**help_data.model_dump())
‎    doc = help_request.model_dump()
‎    doc['createdAt'] = doc['createdAt'].isoformat()
‎    await db.help_requests.insert_one(doc)
‎    return help_request
‎
‎@api_router.get("/help-requests", response_model=List[HelpRequest])
‎async def get_help_requests():
‎    requests = await db.help_requests.find({}, {"_id": 0}).to_list(1000)
‎    for req in requests:
‎        if isinstance(req['createdAt'], str):
‎            req['createdAt'] = datetime.fromisoformat(req['createdAt'])
‎    return requests
‎
‎@api_router.patch("/help-requests/{request_id}")
‎async def update_help_request_status(request_id: str, status: str):
‎    result = await db.help_requests.update_one(
‎        {"id": request_id},
‎        {"$set": {"status": status}}
‎    )
‎    if result.modified_count == 0:
‎        return {"success": False, "message": "Request not found"}
‎    return {"success": True, "message": "Status updated"}
‎
‎# Admin Login Route
‎@api_router.post("/admin/login")
‎async def admin_login(login_data: AdminLogin):
‎    # Simple password check - you can change this password
‎    if login_data.password == "admin123":
‎        return {"success": True, "message": "Login successful"}
‎    return {"success": False, "message": "Invalid password"}
‎
‎# Include the router in the main app
‎app.include_router(api_router)
‎
‎app.add_middleware(
‎    CORSMiddleware,
‎    allow_credentials=True,
‎    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
‎    allow_methods=["*"],
‎    allow_headers=["*"],
‎)
‎
‎# Configure logging
‎logging.basicConfig(
‎    level=logging.INFO,
‎    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
‎)
‎logger = logging.getLogger(__name__)
‎
‎@app.on_event("shutdown")
‎async def shutdown_db_client():
‎    client.close()
‎import { useState, useEffect } from 'react';
‎import axios from 'axios';
‎import { Button } from '@/components/ui/button';
‎import { Input } from '@/components/ui/input';
‎import { Textarea } from '@/components/ui/textarea';
‎import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
‎import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
‎import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
‎import { toast } from 'sonner';
‎import { Truck, MapPin, Phone, User, Package, CreditCard, Wallet, TruckIcon, HelpCircle, RefreshCw, LogOut } from 'lucide-react';
‎import '@/App.css';
‎
‎const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
‎const API = `${BACKEND_URL}/api`;
‎
‎function App() {
‎  const [currentStep, setCurrentStep] = useState(1);
‎  const [selectedVehicle, setSelectedVehicle] = useState('');
‎  const [selectedPayment, setSelectedPayment] = useState('');
‎  const [showAdminPanel, setShowAdminPanel] = useState(false);
‎  const [showAdminLogin, setShowAdminLogin] = useState(false);
‎  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
‎  const [adminPassword, setAdminPassword] = useState('');
‎  const [activeAdminTab, setActiveAdminTab] = useState('bookings');
‎  
‎  // Form Data
‎  const [formData, setFormData] = useState({
‎    customerName: '',
‎    phoneNumber: '',
‎    pickupAddress: '',
‎    itemDetails: '',
‎    receiverName: '',
‎    receiverPhone: '',
‎    dropAddress: ''
‎  });
‎
‎  // Admin Data
‎  const [bookings, setBookings] = useState([]);
‎  const [drivers, setDrivers] = useState([]);
‎  const [helpRequests, setHelpRequests] = useState([]);
‎  const [newDriver, setNewDriver] = useState({
‎    name: '',
‎    phone: '',
‎    vehicleType: '',
‎    vehicleNumber: ''
‎  });
‎  const [showAddDriver, setShowAddDriver] = useState(false);
‎
‎  const handleInputChange = (e) => {
‎    setFormData({ ...formData, [e.target.name]: e.target.value });
‎  };
‎
‎  const handleDriverInputChange = (e) => {
‎    setNewDriver({ ...newDriver, [e.target.name]: e.target.value });
‎  };
‎
‎  const submitBooking = async () => {
‎    if (!selectedVehicle || !selectedPayment) {
‎      toast.error('कृपया Vehicle Type और Payment Method चुनें');return;
‎    }
‎
‎    if (!formData.customerName || !formData.phoneNumber || !formData.pickupAddress || !formData.receiverName || !formData.dropAddress) {
‎      toast.error('कृपया सभी जरूरी fields भरें');
‎      return;
‎    }
‎
‎    try {
‎      const bookingData = {
‎        ...formData,
‎        vehicleType: selectedVehicle,
‎        paymentMethod: selectedPayment
‎      };
‎
‎      await axios.post(`${API}/bookings`, bookingData);
‎      toast.success('बुकिंग सफलतापूर्वक submit हो गई!');
‎      
‎      // Reset form
‎      setFormData({
‎        customerName: '',
‎        phoneNumber: '',
‎        pickupAddress: '',
‎        itemDetails: '',
‎        receiverName: '',
‎        receiverPhone: '',
‎        dropAddress: ''
‎      });
‎      setSelectedVehicle('');
‎      setSelectedPayment('');
‎      setCurrentStep(1);
‎    } catch (error) {
‎      toast.error('Booking submit करने में error आई');
‎      console.error(error);
‎    }
‎  };
‎
‎  const handleAdminLogin = async () => {
‎    try {
‎      const response = await axios.post(`${API}/admin/login`, { password: adminPassword });
‎      if (response.data.success) {
‎        setIsAdminLoggedIn(true);
‎        setShowAdminLogin(false);
‎        setShowAdminPanel(true);
‎        setAdminPassword('');
‎        toast.success('Admin login successful!');
‎        fetchAdminData();
‎      } else {
‎        toast.error('Invalid password!');
‎      }
‎    } catch (error) {
‎      toast.error('Login failed!');
‎      console.error(error);
‎    }
‎  };
‎
‎  const fetchAdminData = async () => {
‎    try {
‎      const [bookingsRes, driversRes, helpRes] = await Promise.all([
‎        axios.get(`${API}/bookings`),
‎        axios.get(`${API}/drivers`),
‎        axios.get(`${API}/help-requests`)
‎      ]);
‎      setBookings(bookingsRes.data);
‎      setDrivers(driversRes.data);
‎      setHelpRequests(helpRes.data);
‎    } catch (error) {
‎      console.error('Error fetching admin data:', error);
‎    }
‎  };const updateBookingStatus = async (bookingId, status) => {
‎    try {
‎      await axios.patch(`${API}/bookings/${bookingId}?status=${status}`);
‎      toast.success('Status updated!');
‎      fetchAdminData();
‎    } catch (error) {
‎      toast.error('Error updating status');
‎    }
‎  };
‎
‎  const updateDriverStatus = async (driverId, status) => {
‎    try {
‎      await axios.patch(`${API}/drivers/${driverId}?status=${status}`);
‎      toast.success('Driver status updated!');
‎      fetchAdminData();
‎    } catch (error) {
‎      toast.error('Error updating status');
‎    }
‎  };
‎
‎  const addDriver = async () => {
‎    if (!newDriver.name || !newDriver.phone || !newDriver.vehicleType || !newDriver.vehicleNumber) {
‎      toast.error('Please fill all driver details');
‎      return;
‎    }
‎
‎    try {
‎      await axios.post(`${API}/drivers`, newDriver);
‎      toast.success('Driver added successfully!');
‎      setNewDriver({ name: '', phone: '', vehicleType: '', vehicleNumber: '' });
‎      setShowAddDriver(false);
‎      fetchAdminData();
‎    } catch (error) {
‎      toast.error('Error adding driver');
‎    }
‎  };
‎
‎  const handleAdminLogout = () => {
‎    setIsAdminLoggedIn(false);
‎    setShowAdminPanel(false);
‎    toast.success('Logged out successfully');
‎  };
‎
‎  return (
‎    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-white">
‎      {/* Header */}
‎      <header className="bg-white shadow-sm border-b border-orange-100">
‎        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
‎          <div className="flex items-center gap-3">
‎            <div className="bg-orange-500 p-3 rounded-2xl">
‎              <Truck className="w-8 h-8 text-white" />
‎            </div>
‎            <div>
‎              <h1 className="text-2xl font-bold text-gray-900">Lilizec Transport</h1>
‎              <p className="text-sm text-gray-600">lilizec.com</p>
‎            </div>
‎          </div>
‎          <div className="flex items-center gap-3">
‎            <button
‎              onClick={() => window.location.href = 'https://lilizec.com'}
‎              className="text-gray-600 hover:text-orange-500"
‎            >
‎              <HelpCircle className="w-6 h-6" />
‎            </button>
‎            <button
‎              onClick={() => {
‎                if (isAdminLoggedIn) {
‎                  setShowAdminPanel(true);
‎                } else {
‎                  setShowAdminLogin(true);
‎                }
‎              }}className="bg-orange-100 text-orange-600 p-2 rounded-lg hover:bg-orange-200"
‎            >
‎              <User className="w-6 h-6" />
‎            </button>
‎          </div>
‎        </div>
‎      </header>
‎
‎      {/* Main Content */}
‎      {!showAdminPanel && (
‎        <main className="max-w-4xl mx-auto px-4 py-8">
‎          <div className="text-center mb-8">
‎            <div className="flex items-center justify-center gap-2 mb-2">
‎              <TruckIcon className="w-6 h-6 text-orange-500" />
‎              <h2 className="text-xl font-semibold text-gray-800">सामान भेजना है?</h2>
‎            </div>
‎            <p className="text-gray-600">E-Rickshaw या Pickup से अपना सामान आसानी से भेजें</p>
‎          </div>
‎
‎          <Card className="shadow-lg">
‎            <CardContent className="p-6">
‎              {/* Step 1: Vehicle Type */}
‎              <div className="mb-8">
‎                <div className="flex items-center gap-2 mb-4">
‎                  <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">1</div>
‎                  <h3 className="text-lg font-semibold">Vehicle Type चुनें</h3>
‎                </div>
‎                <div className="grid grid-cols-2 gap-4">
‎                  <button
‎                    onClick={() => setSelectedVehicle('E-Rickshaw')}
‎                    className={`p-6 rounded-xl border-2 transition-all ${
‎                      selectedVehicle === 'E-Rickshaw'
‎                        ? 'border-green-500 bg-green-50'
‎                        : 'border-gray-200 hover:border-green-300'
‎                    }`}
‎                  >
‎                    <div className="bg-green-100 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
‎                      <Truck className="w-8 h-8 text-green-600" />
‎                    </div>
‎                    <h4 className="font-bold text-lg mb-1">E-Rickshaw</h4>
‎                    <p className="text-sm text-gray-600">छोटा सामान</p>
‎                  </button>
‎                  <button
‎                    onClick={() => setSelectedVehicle('Pickup')}
‎                    className={`p-6 rounded-xl border-2 transition-all ${
‎                      selectedVehicle === 'Pickup'
‎                        ? 'border-blue-500 bg-blue-50'
‎                        : 'border-gray-200 hover:border-blue-300'
‎                    }`}
‎                  >
‎                    <div className="bg-blue-100 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
‎                      <TruckIcon className="w-8 h-8 text-blue-600" />
‎                    </div>
‎                    <h4 className="font-bold text-lg mb-1">Pickup</h4>
‎                    <p className="text-sm text-gray-600">बड़ा सामान</p>
‎                  </button>
‎                </div>
‎              </div>
‎
‎              {/* Step 2: Payment Method */}
‎              <div className="mb-8">
‎                <div className="flex items-center gap-2 mb-4">
‎                  <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">2</div>
‎                  <h3 className="text-lg font-semibold">Payment Method चुनें</h3>
‎                </div>
‎                <div className="grid grid-cols-2 gap-4">
‎                  <button
‎                    onClick={() => setSelectedPayment('Cash')}
‎                    className={`p-6 rounded-xl border-2 transition-all ${
‎                      selectedPayment === 'Cash'
‎                        ? 'border-yellow-500 bg-yellow-50'
‎                        : 'border-gray-200 hover:border-yellow-300'
‎                    }`}
‎                  ><div className="bg-purple-100 w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center">
‎                      <CreditCard className="w-8 h-8 text-purple-600" />
‎                    </div>
‎                    <h4 className="font-bold text-lg mb-1">UPI</h4>
‎                    <p className="text-sm text-gray-600">Online भुगतान</p>
‎                  </button>
‎                </div>
‎              </div>
‎
‎              {/* Step 3: Pickup Details */}
‎              <div className="mb-8">
‎                <div className="flex items-center gap-2 mb-4">
‎                  <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">3</div>
‎                  <h3 className="text-lg font-semibold">Pickup Details (सामान कहाँ से लेना है)</h3>
‎                </div>
‎                <div className="space-y-4">
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">आपका नाम *</label>
‎                    <Input
‎                      name="customerName"
‎                      value={formData.customerName}
‎                      onChange={handleInputChange}
‎                      placeholder="अपना नाम लिखें"
‎                      className="w-full"
‎                    />
‎                  </div>
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">Phone Number *</label>
‎                    <Input
‎                      name="phoneNumber"
‎                      value={formData.phoneNumber}
‎                      onChange={handleInputChange}
‎                      placeholder="10 digit mobile number"
‎                      maxLength={10}
‎                      className="w-full"
‎                    />
‎                  </div>
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">Pickup Address *</label>
‎                    <Textarea
‎                      name="pickupAddress"
‎                      value={formData.pickupAddress}
‎                      onChange={handleInputChange}
‎                      placeholder="पूरा पता लिखें - गली, मोहल्ला, landmark"
‎                      className="w-full min-h-20"
‎                    />
‎                  </div>
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">सामान की Details *</label>
‎                    <Textarea
‎                      name="itemDetails"
‎                      value={formData.itemDetails}
‎                      onChange={handleInputChange}
‎                      placeholder="क्या-क्या सामान है, कितना वजन है"
‎                      className="w-full min-h-20"
‎                    />
‎                  </div>
‎                </div>
‎              </div>
‎
‎              {/* Step 4: Drop Details */}
‎              <div className="mb-8">
‎                <div className="flex items-center gap-2 mb-4">
‎                  <div className="bg-orange-100 text-orange-600 rounded-full w-8 h-8 flex items-center justify-center font-bold">4</div>
‎                  <h3 className="text-lg font-semibold">Drop Details (सामान कहाँ पहुँचाना है)</h3>
‎                </div>
‎                <div className="space-y-4">
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">Receiver का नाम *</label>
‎                    <Input
‎                      name="receiverName"
‎                      value={formData.receiverName}
‎                      onChange={handleInputChange}
‎                      placeholder="जिसे सामान मिलेगा उसका नाम"className="w-full"
‎                    />
‎                  </div>
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">Receiver Phone Number</label>
‎                    <Input
‎                      name="receiverPhone"
‎                      value={formData.receiverPhone}
‎                      onChange={handleInputChange}
‎                      placeholder="10 digit mobile number"
‎                      maxLength={10}
‎                      className="w-full"
‎                    />
‎                  </div>
‎                  <div>
‎                    <label className="block text-sm font-medium mb-2">Drop Address *</label>
‎                    <Textarea
‎                      name="dropAddress"
‎                      value={formData.dropAddress}
‎                      onChange={handleInputChange}
‎                      placeholder="पूरा पता लिखें - गली, मोहल्ला, landmark"
‎                      className="w-full min-h-20"
‎                    />
‎                  </div>
‎                </div>
‎              </div>
‎
‎              {/* Submit Button */}
‎              <Button
‎                onClick={submitBooking}
‎                className="w-full bg-orange-500 hover:bg-orange-600 text-white py-6 text-lg font-semibold"
‎              >
‎                बुकिंग Submit करें
‎              </Button>
‎            </CardContent>
‎          </Card>
‎
‎          {/* Footer */}
‎          <footer className="text-center mt-12 text-gray-600">
‎            <h3 className="text-xl font-bold text-gray-800 mb-2">Lilizec Transport</h3>
‎            <p className="mb-2">E-Rickshaw & Pickup Delivery Service</p>
‎            <div className="flex items-center justify-center gap-2 text-sm">
‎              <span>🌐 lilizec.com</span>
‎            </div>
‎            <p className="mt-4 text-xs">© 2025 Lilizec Transport. All rights reserved.</p>
‎            <div className="mt-2 flex items-center justify-center gap-1 text-xs">
‎              <span>Made with</span>
‎              <span className="text-orange-500">❤️</span>
‎              <span>Emergent</span>
‎            </div>
‎          </footer>
‎        </main>
‎      )}
‎
‎      {/* Admin Login Dialog */}
‎      <Dialog open={showAdminLogin} onOpenChange={setShowAdminLogin}>
‎        <DialogContent>
‎          <DialogHeader>
‎            <DialogTitle>Admin Login</DialogTitle>
‎          </DialogHeader>
‎          <div className="space-y-4">
‎            <Input
‎              type="password"
‎              placeholder="Enter admin password"
‎              value={adminPassword}
‎              onChange={(e) => setAdminPassword(e.target.value)}
‎              onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
‎            />
‎            <Button onClick={handleAdminLogin} className="w-full bg-orange-500 hover:bg-orange-600">
‎              Login
‎            </Button>
‎          </div>
‎        </DialogContent>
‎      </Dialog>
‎      {/* Admin Panel */}
‎      {showAdminPanel && isAdminLoggedIn && (
‎        <div className="max-w-7xl mx-auto px-4 py-8">
‎          <div className="flex items-center justify-between mb-6">
‎            <h2 className="text-2xl font-bold">Admin Panel</h2>
‎            <div className="flex gap-2">
‎              <Button
‎                onClick={fetchAdminData}
‎                variant="outline"
‎                className="flex items-center gap-2"
‎              >
‎                <RefreshCw className="w-4 h-4" />
‎                Refresh
‎              </Button>
‎              <Button
‎                onClick={handleAdminLogout}
‎                variant="destructive"
‎                className="flex items-center gap-2"
‎              >
‎                <LogOut className="w-4 h-4" />
‎                Logout
‎              </Button>
‎            </div>
‎          </div>
‎
‎          <Tabs value={activeAdminTab} onValueChange={setActiveAdminTab}>
‎            <TabsList className="grid w-full grid-cols-3">
‎              <TabsTrigger value="bookings" className="flex items-center gap-2">
‎                <Package className="w-4 h-4" />
‎                Bookings ({bookings.length})
‎              </TabsTrigger>
‎              <TabsTrigger value="drivers" className="flex items-center gap-2">
‎                <Truck className="w-4 h-4" />
‎                Drivers ({drivers.length})
‎              </TabsTrigger>
‎              <TabsTrigger value="help" className="flex items-center gap-2">
‎                <HelpCircle className="w-4 h-4" />
‎                Help Requests ({helpRequests.length})
‎              </TabsTrigger>
‎            </TabsList>
‎
‎            {/* Bookings Tab */}
‎            <TabsContent value="bookings">
‎              <div className="space-y-4">
‎                <div className="flex gap-4 mb-4">
‎                  <Button
‎                    variant={activeAdminTab === 'bookings' ? 'default' : 'outline'}
‎                    className="bg-orange-500 text-white"
‎                  >
‎                    All ({bookings.length})
‎                  </Button>
‎                  <Button variant="outline">
‎                    Pending ({bookings.filter(b => b.status === 'pending').length})
‎                  </Button>
‎                  <Button variant="outline">
‎                    Confirmed ({bookings.filter(b => b.status === 'confirmed').length})
‎                  </Button>
‎                </div>
‎
‎                {bookings.length === 0 ? (
‎                  <Card>
‎                    <CardContent className="py-12 text-center text-gray-500">
‎                      कोई booking नहीं है
‎                    </CardContent>
‎                  </Card>
‎                ) : (
‎                  bookings.map((booking) => (
‎                    <Card key={booking.id}>
‎                      <CardContent className="p-6">
‎                        <div className="grid md:grid-cols-2 gap-4">
‎                          <div>
‎                            <h4 className="font-semibold mb-2">Customer Details</h4>
‎                            <p className="text-sm"><strong>Name:</strong> {booking.customerName}</p>
‎                            <p className="text-sm"><strong>Phone:</strong> {booking.phoneNumber}</p>
‎                            <p className="text-sm"><strong>Pickup:</strong> {booking.pickupAddress}</p>
‎                            <p className="text-sm"><strong>Items:</strong> {booking.itemDetails}</p>
‎                          </div>
‎                          <div>
‎                            <h4 className="font-semibold mb-2">Delivery Details</h4>
‎                            <p className="text-sm"><strong>Receiver:</strong> {booking.receiverName}</p>
‎                            <p className="text-sm"><strong>Phone:</strong> {booking.receiverPhone}</p>
‎                            <p className="text-sm"><strong>Drop:</strong> {booking.dropAddress}</p>
‎                            <p className="text-sm"><strong>Vehicle:</strong> {booking.vehicleType}</p>
‎                            <p className="text-sm"><strong>Payment:</strong> {booking.paymentMethod}</p>
‎                          </div>
‎                        </div>
‎                        <div className="mt-4 flex gap-2">
‎                          <Button
‎                            onClick={() => updateBookingStatus(booking.id, 'confirmed')}
‎                            className="bg-green-500 hover:bg-green-600"
‎                            size="sm"
‎                          >
‎                            Confirm
‎                          </Button>
‎                          <Button
‎                            onClick={() => updateBookingStatus(booking.id, 'completed')}
‎                            className="bg-blue-500 hover:bg-blue-600"
‎                            size="sm"
‎                          >
‎                            Complete
‎                          </Button>
‎                          <Button
‎                            onClick={() => updateBookingStatus(booking.id, 'cancelled')}
‎                            variant="destructive"
‎                            size="sm"
‎                          >
‎                            Cancel
‎                          </Button>
‎                          <span className={`ml-auto px-3 py-1 rounded-full text-xs font-semibold ${
‎                            booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
‎                            booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
‎                            booking.status === 'completed' ? 'bg-blue-100 text-blue-700' :
‎                            'bg-red-100 text-red-700'
‎                          }`}>
‎                            {booking.status.toUpperCase()}
‎                          </span>
‎                        </div>
‎                      </CardContent>
‎                    </Card>
‎                  ))
‎                )}
‎              </div>
‎            </TabsContent>{/* Drivers Tab */}
‎            <TabsContent value="drivers">
‎              <div className="space-y-4">
‎                <Button
‎                  onClick={() => setShowAddDriver(!showAddDriver)}
‎                  className="bg-orange-500 hover:bg-orange-600"
‎                >
‎                  Add New Driver
‎                </Button>
‎
‎                {showAddDriver && (
‎                  <Card>
‎                    <CardContent className="p-6 space-y-4">
‎                      <Input
‎                        name="name"
‎                        placeholder="Driver Name"
‎                        value={newDriver.name}
‎                        onChange={handleDriverInputChange}
‎                      />
‎                      <Input
‎                        name="phone"
‎                        placeholder="Phone Number"
‎                        value={newDriver.phone}
‎                        onChange={handleDriverInputChange}
‎                      />
‎                      <Input
‎                        name="vehicleType"
‎                        placeholder="Vehicle Type (E-Rickshaw/Pickup)"
‎                        value={newDriver.vehicleType}
‎                        onChange={handleDriverInputChange}
‎                      />
‎                      <Input
‎                        name="vehicleNumber"
‎                        placeholder="Vehicle Number"
‎                        value={newDriver.vehicleNumber}
‎                        onChange={handleDriverInputChange}
‎                      />
‎                      <Button onClick={addDriver} className="w-full bg-green-500 hover:bg-green-600">
‎                        Add Driver
‎                      </Button>
‎                    </CardContent>
‎                  </Card>
‎                )}
‎
‎                {drivers.length === 0 ? (
‎                  <Card>
‎                    <CardContent className="py-12 text-center text-gray-500">
‎                      No drivers added yet
‎                    </CardContent>
‎                  </Card>
‎                ) : (
‎                  drivers.map((driver) => (
‎                    <Card key={driver.id}>
‎                      <CardContent className="p-6">
‎                        <div className="flex items-center justify-between">
‎                          <div>
‎                            <h4 className="font-semibold text-lg">{driver.name}</h4>
‎                            <p className="text-sm text-gray-600">📞 {driver.phone}</p>
‎                            <p className="text-sm text-gray-600">🚗 {driver.vehicleType} - {driver.vehicleNumber}</p>
‎                          </div>
‎                          <div className="flex items-center gap-2">
‎                            <Button
‎                              onClick={() => updateDriverStatus(driver.id, 'available')}
‎                              className="bg-green-500 hover:bg-green-600"
‎                              size="sm"
‎                            >
‎                              Available
‎                            </Button>
‎                            <Button
‎                              onClick={() => updateDriverStatus(driver.id, 'busy')}
‎                              className="bg-yellow-500 hover:bg-yellow-600"
‎                              size="sm">
‎                              Available
‎                            </Button>
‎                            <Button
‎                              onClick={() => updateDriverStatus(driver.id, 'busy')}
‎                              className="bg-yellow-500 hover:bg-yellow-600"
‎                              size="sm"
‎                            >
‎                              Busy
‎                            </Button>
‎                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
‎                              driver.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
‎                            }`}>
‎                              {driver.status.toUpperCase()}
‎                            </span>
‎                          </div>
‎                        </div>
‎                      </CardContent>
‎                    </Card>
‎                  ))
‎                )}
‎              </div>
‎            </TabsContent>
‎
‎            {/* Help Requests Tab */}
‎            <TabsContent value="help">
‎              {helpRequests.length === 0 ? (
‎                <Card>
‎                  <CardContent className="py-12 text-center text-gray-500">
‎                    No help requests
‎                  </CardContent>
‎                </Card>
‎              ) : (
‎                <div className="space-y-4">
‎                  {helpRequests.map((request) => (
‎                    <Card key={request.id}>
‎                      <CardContent className="p-6">
‎                        <h4 className="font-semibold text-lg">{request.name}</h4>
‎                        <p className="text-sm text-gray-600">📞 {request.phone}</p>
‎                        <p className="mt-2">{request.message}</p>
‎                        <div className="mt-4">
‎                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
‎                            request.status === 'open' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
‎                          }`}>
‎                            {request.status.toUpperCase()}
‎                          </span>
‎                        </div>
‎                      </CardContent>
‎                    </Card>
‎                  ))}
‎                </div>
‎              )}
‎            </TabsContent>
‎          </Tabs>
‎        </div>
‎      )}
‎    </div>
‎  );
‎}
‎
‎export default App;
‎‎.App {
‎  min-height: 100vh;
‎}
‎
‎.App-header {
‎  background-color: #0f0f10;
‎  min-height: 100vh;
‎  display: flex;
‎  flex-direction: column;
‎  align-items: center;
‎  justify-content: center;
‎  font-size: calc(10px + 2vmin);
‎  color: white;
‎}
‎
‎.App-link {
‎  color: #61dafb;
‎}
‎
‎/* Custom scrollbar */
‎::-webkit-scrollbar {
‎  width: 8px;
‎}
‎
‎::-webkit-scrollbar-track {
‎  background: #f1f1f1;
‎}
‎
‎::-webkit-scrollbar-thumb {
‎  background: #f97316;
‎  border-radius: 4px;
‎}
‎
‎::-webkit-scrollbar-thumb:hover {
‎  background: #ea580c;
‎}
‎import React from "react";
‎import ReactDOM from "react-dom/client";
‎import "@/index.css";
‎import App from "@/App";
‎import { Toaster } from "sonner";
‎
‎const root = ReactDOM.createRoot(document.getElementById("root"));
‎root.render(
‎  <React.StrictMode>
‎    <App />
‎    <Toaster position="top-right" richColors />
‎  </React.StrictMode>,
‎);
‎
