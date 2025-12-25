from fastapi import FastAPI, APIRouter, HTTPException
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ.get('DB_NAME', 'transport_booking')]

# Create the main app without a prefix
app = FastAPI(title="Transport Booking API")

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class PickupDetails(BaseModel):
    name: str
    phone: str
    address: str
    saman_details: str  # Goods/Items details

class DropDetails(BaseModel):
    receiver_name: str
    receiver_phone: str
    drop_address: str

class BookingCreate(BaseModel):
    vehicle_type: str  # e-rickshaw or pickup
    payment_method: str  # cash or upi
    pickup: PickupDetails
    drop: DropDetails

class Booking(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    vehicle_type: str
    payment_method: str
    pickup: PickupDetails
    drop: DropDetails
    status: str = "pending"  # pending, confirmed, completed, cancelled
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BookingUpdate(BaseModel):
    status: Optional[str] = None
    driver_name: Optional[str] = None
    driver_phone: Optional[str] = None
    assigned_driver_id: Optional[str] = None


# Driver Models
class VehicleDetails(BaseModel):
    vehicle_type: str  # e-rickshaw or pickup
    vehicle_number: str
    vehicle_color: Optional[str] = None

class DriverCreate(BaseModel):
    name: str
    phone: str
    address: Optional[str] = None
    vehicle: VehicleDetails
    is_available: bool = True

class Driver(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    address: Optional[str] = None
    vehicle: VehicleDetails
    is_available: bool = True
    total_trips: int = 0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class DriverUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    vehicle: Optional[VehicleDetails] = None
    is_available: Optional[bool] = None


# Help/Contact Models
class HelpRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    name: str
    phone: str
    email: Optional[str] = None
    subject: str
    message: str
    status: str = "new"  # new, in_progress, resolved
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class HelpRequestCreate(BaseModel):
    name: str
    phone: str
    email: Optional[str] = None
    subject: str
    message: str


# Routes
@api_router.get("/")
async def root():
    return {"message": "Transport Booking API - E-Rickshaw & Pickup Service"}


# Create new booking
@api_router.post("/bookings", response_model=Booking)
async def create_booking(booking_data: BookingCreate):
    booking = Booking(**booking_data.model_dump())
    
    doc = booking.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.bookings.insert_one(doc)
    return booking


# Get all bookings (for admin)
@api_router.get("/bookings", response_model=List[Booking])
async def get_all_bookings():
    bookings = await db.bookings.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


# Get single booking
@api_router.get("/bookings/{booking_id}", response_model=Booking)
async def get_booking(booking_id: str):
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


# Update booking (for admin - assign driver, change status)
@api_router.patch("/bookings/{booking_id}", response_model=Booking)
async def update_booking(booking_id: str, update_data: BookingUpdate):
    update_dict = {k: v for k, v in update_data.model_dump().items() if v is not None}
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.bookings.update_one(
        {"id": booking_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    booking = await db.bookings.find_one({"id": booking_id}, {"_id": 0})
    if isinstance(booking.get('created_at'), str):
        booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return booking


# Delete booking
@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str):
    result = await db.bookings.delete_one({"id": booking_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Booking not found")
    
    return {"message": "Booking deleted successfully"}


# Get bookings by status
@api_router.get("/bookings/status/{status}", response_model=List[Booking])
async def get_bookings_by_status(status: str):
    bookings = await db.bookings.find({"status": status}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for booking in bookings:
        if isinstance(booking.get('created_at'), str):
            booking['created_at'] = datetime.fromisoformat(booking['created_at'])
    
    return bookings


# ============ DRIVER ROUTES ============

# Create new driver
@api_router.post("/drivers", response_model=Driver)
async def create_driver(driver_data: DriverCreate):
    driver = Driver(**driver_data.model_dump())
    
    doc = driver.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.drivers.insert_one(doc)
    return driver


# Get all drivers
@api_router.get("/drivers", response_model=List[Driver])
async def get_all_drivers():
    drivers = await db.drivers.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for driver in drivers:
        if isinstance(driver.get('created_at'), str):
            driver['created_at'] = datetime.fromisoformat(driver['created_at'])
    
    return drivers


# Get available drivers by vehicle type
@api_router.get("/drivers/available/{vehicle_type}", response_model=List[Driver])
async def get_available_drivers(vehicle_type: str):
    drivers = await db.drivers.find({
        "is_available": True,
        "vehicle.vehicle_type": vehicle_type
    }, {"_id": 0}).to_list(100)
    
    for driver in drivers:
        if isinstance(driver.get('created_at'), str):
            driver['created_at'] = datetime.fromisoformat(driver['created_at'])
    
    return drivers


# Get single driver
@api_router.get("/drivers/{driver_id}", response_model=Driver)
async def get_driver(driver_id: str):
    driver = await db.drivers.find_one({"id": driver_id}, {"_id": 0})
    
    if not driver:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    if isinstance(driver.get('created_at'), str):
        driver['created_at'] = datetime.fromisoformat(driver['created_at'])
    
    return driver


# Update driver
@api_router.patch("/drivers/{driver_id}", response_model=Driver)
async def update_driver(driver_id: str, update_data: DriverUpdate):
    update_dict = {}
    for k, v in update_data.model_dump().items():
        if v is not None:
            if k == "vehicle":
                update_dict["vehicle"] = v
            else:
                update_dict[k] = v
    
    if not update_dict:
        raise HTTPException(status_code=400, detail="No update data provided")
    
    result = await db.drivers.update_one(
        {"id": driver_id},
        {"$set": update_dict}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    driver = await db.drivers.find_one({"id": driver_id}, {"_id": 0})
    if isinstance(driver.get('created_at'), str):
        driver['created_at'] = datetime.fromisoformat(driver['created_at'])
    
    return driver


# Delete driver
@api_router.delete("/drivers/{driver_id}")
async def delete_driver(driver_id: str):
    result = await db.drivers.delete_one({"id": driver_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    return {"message": "Driver deleted successfully"}


# Increment driver trip count
@api_router.post("/drivers/{driver_id}/trip")
async def increment_driver_trip(driver_id: str):
    result = await db.drivers.update_one(
        {"id": driver_id},
        {"$inc": {"total_trips": 1}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Driver not found")
    
    return {"message": "Trip count updated"}


# ============ HELP/CONTACT ROUTES ============

# Create help request
@api_router.post("/help", response_model=HelpRequest)
async def create_help_request(help_data: HelpRequestCreate):
    help_request = HelpRequest(**help_data.model_dump())
    
    doc = help_request.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.help_requests.insert_one(doc)
    return help_request


# Get all help requests (admin)
@api_router.get("/help", response_model=List[HelpRequest])
async def get_all_help_requests():
    requests = await db.help_requests.find({}, {"_id": 0}).sort("created_at", -1).to_list(1000)
    
    for req in requests:
        if isinstance(req.get('created_at'), str):
            req['created_at'] = datetime.fromisoformat(req['created_at'])
    
    return requests


# Update help request status
@api_router.patch("/help/{request_id}")
async def update_help_request(request_id: str, status: str):
    result = await db.help_requests.update_one(
        {"id": request_id},
        {"$set": {"status": status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Help request not found")
    
    return {"message": "Status updated"}


# Delete help request
@api_router.delete("/help/{request_id}")
async def delete_help_request(request_id: str):
    result = await db.help_requests.delete_one({"id": request_id})
    
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Help request not found")
    
    return {"message": "Help request deleted"}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
