"use client";
import React, { useState, useEffect, ChangeEvent } from "react";
import { FaPlus, FaTrash, FaEye, FaUserCheck } from "react-icons/fa";
import { useTheme } from "../utils/ThemeContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Types
interface CustomBooking {
  id: number;
  bookingDate: string;
  bookingTime: string;
  bookingStatus: string;
  bookingType: string;
  bookingDetails: string;
  bookingAmount: string;
  customerName: string;
  customerMobileNo: string;
  pickupLocation: string;
  dropLocation: string;
  pickUpDate: string;
  pickUpTime: string;
  carType: string;
  returnDate: string;
  tripType: string;
}

interface Vendor {
  id: number;
  name: string;
  info: string;
  contactNo: string;
  email: string;
  address: string;
}

const dummyVendors: Vendor[] = [
  {
    id: 1,
    name: "jaywant",
    info: "Sedan Specialist",
    contactNo: "9857357",
    email: "jaywant61495@gmail.com",
    address: "pune"
  },
  {
    id: 27,
    name: "Padmavati tours and travels",
    info: "SUV Fleet",
    contactNo: "9881831823",
    email: "padmavatitravel1984@gmail.com",
    address: "Pune"
  },
  {
    id: 39,
    name: "Swami Samarth Tours & Travels",
    info: "Luxury Cars",
    contactNo: "8237381430",
    email: "akshaybhilare2212@gmail.com",
    address: "Pune & Mumbai"
  },
  {
    id: 43,
    name: "Jay Shri Krishna Tours And Travels",
    info: "",
    contactNo: "8976315540",
    email: "chavansantosh873@gmail.com",
    address: "Pune & Mumbai"
  },
  {
    id: 44,
    name: "gautam",
    info: "",
    contactNo: "8888999900",
    email: "pramukh100s@gmail.com",
    address: "Pune"
  },
  {
    id: 45,
    name: "Gautam",
    info: "",
    contactNo: "8888999900",
    email: "ranagautam12121@gmail.com",
    address: "Pune"
  }
];

const initialForm: Omit<CustomBooking, "id"> = {
  bookingDate: "",
  bookingTime: "",
  bookingStatus: "",
  bookingType: "",
  bookingDetails: "",
  bookingAmount: "",
  customerName: "",
  customerMobileNo: "",
  pickupLocation: "",
  dropLocation: "",
  pickUpDate: "",
  pickUpTime: "",
  carType: "",
  returnDate: "",
  tripType: ""
};

const dummyBookings: CustomBooking[] = [
  {
    id: 1,
    customerName: "John Doe",
    bookingAmount: "1200",
    bookingStatus: "Pending",
    bookingDate: "2025-06-09",
    bookingTime: "10:00",
    bookingType: "Local",
    bookingDetails: "Airport drop",
    customerMobileNo: "9998887771",
    pickupLocation: "Downtown",
    dropLocation: "Airport",
    pickUpDate: "2025-06-09",
    pickUpTime: "09:30",
    carType: "sedan",
    returnDate: "2025-06-09",
    tripType: "one-way"
  },
  {
    id: 2,
    customerName: "Jane Smith",
    bookingAmount: "900",
    bookingStatus: "Confirmed",
    bookingDate: "2025-06-10",
    bookingTime: "14:00",
    bookingType: "Outstation",
    bookingDetails: "Business trip",
    customerMobileNo: "8887776662",
    pickupLocation: "City Center",
    dropLocation: "Industrial Area",
    pickUpDate: "2025-06-10",
    pickUpTime: "13:45",
    carType: "suv",
    returnDate: "2025-06-12",
    tripType: "round trip"
  },
  {
    id: 3,
    customerName: "Alice Brown",
    bookingAmount: "1500",
    bookingStatus: "Completed",
    bookingDate: "2025-06-08",
    bookingTime: "09:00",
    bookingType: "Local",
    bookingDetails: "Wedding guest pickup",
    customerMobileNo: "7776665553",
    pickupLocation: "Hotel Grand",
    dropLocation: "Banquet Hall",
    pickUpDate: "2025-06-08",
    pickUpTime: "08:30",
    carType: "hatchback",
    returnDate: "2025-06-08",
    tripType: "one-way"
  }
];

export default function CustomBookingPage() {
  // --- Modal and Booking State ---
  const [selectedBooking, setSelectedBooking] = useState<CustomBooking | null>(null);
  const [showActionModal, setShowActionModal] = useState<boolean>(false);
  const [assignVendorModal, setAssignVendorModal] = useState<boolean>(false);
  const [assignedVendors, setAssignedVendors] = useState<Record<number, Vendor>>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('assignedVendors');
      return saved ? JSON.parse(saved) : {};
    }
    return {};
  });
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState<Omit<CustomBooking, 'id'>>(initialForm);
  const [pendingVendor, setPendingVendor] = useState<Vendor | null>(null);
  const [showChangeVendorConfirm, setShowChangeVendorConfirm] = useState(false);
  // ... other states like bookings, vendorPage, etc.

  useEffect(() => {
    if (showActionModal && selectedBooking && !editMode) {
      setEditForm({ ...selectedBooking });
    }
  }, [showActionModal, selectedBooking, editMode]);

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBooking) return;
    setBookings(bookings.map(b => b.id === selectedBooking.id ? { ...editForm, id: selectedBooking.id } : b));
    setEditMode(false);
    setShowActionModal(false);
    toast.success('Booking updated successfully!');
  };

  // --- Vendor Assign Handlers ---
  const handleVendorAssignClick = (vendor: Vendor) => {
    if (selectedBooking) {
      const assignedId = assignedVendors[selectedBooking.id]?.id;
      if (assignedId && assignedId !== vendor.id) {
        setPendingVendor(vendor);
        setShowChangeVendorConfirm(true);
      } else {
        assignVendorNow(vendor);
        setAssignVendorModal(false);
      }
    }
  };

  const assignVendorNow = (vendor: Vendor) => {
    if (selectedBooking) {
      const updated = { ...assignedVendors, [selectedBooking.id]: vendor };
      setAssignedVendors(updated);
      localStorage.setItem('assignedVendors', JSON.stringify(updated));
      setAssignVendorModal(false);
      setShowActionModal(true);
      setShowChangeVendorConfirm(false);
      setPendingVendor(null);
      setSelectedVendor(null);
      toast.success('Vendor assigned successfully!');
    }
  };

  const [vendorPage, setVendorPage] = useState(0); // For vendor pagination
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [editBookingId, setEditBookingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<CustomBooking, "id">>(initialForm);
  const [bookings, setBookings] = useState<CustomBooking[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('customBookings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return Array.isArray(parsed) && parsed.length > 0 ? parsed : dummyBookings;
      } else {
        localStorage.setItem('customBookings', JSON.stringify(dummyBookings));
        return dummyBookings;
      }
    }
    return dummyBookings;
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAddBooking = () => {
    setBookings([
      ...bookings,
      { ...form, id: Date.now() }
    ]);
    setForm(initialForm);
    setShowModal(false);
  };

  const handleDelete = (id: number) => {
    setBookings(bookings.filter((b) => b.id !== id));
    toast.success('Booking deleted successfully!');
  };

  const handleAction = (booking: CustomBooking) => {
    setSelectedBooking(booking);
    setShowActionModal(true);
    setSelectedVendor(null);
  };

  const handleAssignVendor = () => {
    if (selectedBooking && selectedVendor) {
      const updated = { ...assignedVendors, [selectedBooking.id]: selectedVendor };
      setAssignedVendors(updated);
      localStorage.setItem('assignedVendors', JSON.stringify(updated));
      setAssignVendorModal(false);
      setShowActionModal(false);
      setSelectedVendor(null);
      toast.success('Vendor assigned successfully!');
    }
  };

  // Persist assigned vendors on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('assignedVendors', JSON.stringify(assignedVendors));
    }
  }, [assignedVendors]);

  const openEditModal = (booking: CustomBooking) => {
    console.log('openEditModal called with:', booking);
    setEditBookingId(booking.id);
    setForm({ ...booking });
    setShowEditModal(true);
  };

  const handleEditBooking = () => {
    console.log('handleEditBooking called. Form:', form, 'EditBookingId:', editBookingId);
    setBookings(bookings.map(b => b.id === editBookingId ? { ...form, id: editBookingId! } : b));
    setShowEditModal(false);
    setShowActionModal(false);
    toast.success('Booking updated successfully!');
  };

  // All hooks and handlers are defined above
  return (
    <div className={`min-h-screen py-6 px-2 md:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <ToastContainer position="top-right" autoClose={2000} />
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Custom Bookings</h1>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => setShowModal(true)}
        >
          <FaPlus /> Add Custom Booking
        </button>
      </div>
      <table className={`min-w-full rounded shadow border border-gray-300 ${isDark ? 'bg-slate-800 border-slate-700 text-white' : 'bg-white border-gray-200 text-gray-900'}`}>
        <thead>
          <tr>
            <th className="py-2 px-4 border-b text-center">ID</th>
            <th className="py-2 px-4 border-b text-center">Customer Name</th>
            <th className="py-2 px-4 border-b text-center">Amount</th>
            <th className="py-2 px-4 border-b text-center">Status</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
            <th className="py-2 px-4 border-b text-center">Assign Vendor</th>
          </tr>
        </thead>
        <tbody>
           {bookings.map((booking) => {
            const assigned = assignedVendors[booking.id];
            return (
              <tr key={booking.id} className="border-b border-gray-300">
                <td className="py-2 px-4 text-center align-middle">{booking.id}</td>
                <td className="py-2 px-4 text-center align-middle">{booking.customerName}</td>
                <td className="py-2 px-4 text-center align-middle">{booking.bookingAmount}</td>
                <td className="py-2 px-4 text-center align-middle">{booking.bookingStatus}</td>
                <td className="py-2 px-4 text-center align-middle" style={{minWidth:'100px'}}>
                  <div className="flex justify-center items-center gap-3">
                    <button className="text-red-500 hover:text-red-700 transition-colors text-lg" title="Delete" onClick={() => handleDelete(booking.id)}><FaTrash /></button>
                    <button className="text-blue-500 hover:text-blue-700 transition-colors text-lg" title="View Details" onClick={() => handleAction(booking)}><FaEye /></button>
                  </div>
                </td>
                <td className="py-2 px-4 text-center align-middle" style={{minWidth:'120px'}}>
                  {assigned
                    ? <span className="bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">{assigned.name} (id: {assigned.id})</span>
                    : <span className="text-gray-400 text-xs">Not Assigned</span>
                  }
                </td>
              </tr>
            );
          })}
          {/* Full-width bottom border row */}
          <tr>
            <td colSpan={7} className="p-0">
              <div className="w-full border-b border-gray-300"></div>
            </td>
          </tr>
        </tbody>
      </table>

      {/* Assign Vendor Modal */}
      {assignVendorModal && (
        <div className="fixed inset-0 z-60 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setAssignVendorModal(false); setShowActionModal(true); }}></div>
          <div
            className={`relative z-70 flex flex-col ${isDark ? 'bg-slate-900 text-white' : 'bg-white text-gray-900'} rounded-lg shadow-xl transition-all duration-300 max-w-lg w-full mx-4`}
            style={{ maxHeight: '90vh' }}
          >
            <div className="p-6">
              <table className="min-w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg">
                <thead>
                  <tr className="bg-gray-100 dark:bg-slate-700">
                    <th className="py-2 px-3 text-left">Vendor Id</th>
                    <th className="py-2 px-3 text-left">Vendor Company Name</th>
                    <th className="py-2 px-3 text-left">Contact No</th>
                    <th className="py-2 px-3 text-left">Email</th>
                    <th className="py-2 px-3 text-left">Address</th>
                    <th className="py-2 px-3 text-center">Assign</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyVendors.slice(vendorPage * 4, vendorPage * 4 + 4).map((vendor) => {
                    const assignedId = assignedVendors[selectedBooking?.id || -1]?.id;
                    const isAssigned = assignedId === vendor.id;
                    return (
                      <tr key={vendor.id} className="border-b border-gray-200 dark:border-slate-700">
                        <td className="py-2 px-3">{vendor.id}</td>
                        <td className="py-2 px-3">{vendor.name}</td>
                        <td className="py-2 px-3">{vendor.contactNo || '-'}</td>
                        <td className="py-2 px-3">{vendor.email || '-'}</td>
                        <td className="py-2 px-3">{vendor.address || '-'}</td>
                        <td className="py-2 px-3 text-center">
                          {isAssigned ? (
                            <button className="px-4 py-1 rounded bg-red-600 text-white font-semibold cursor-not-allowed" disabled>Assigned</button>
                          ) : (
                            <button
                              className="px-4 py-1 rounded bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-gray-200 hover:bg-green-600 hover:text-white transition font-medium"
                              onClick={() => {
                                if (assignedId && assignedId !== vendor.id) {
                                  setPendingVendor(vendor);
                                  setShowChangeVendorConfirm(true);
                                } else {
                                  assignVendorNow(vendor);
                                  setAssignVendorModal(false);
                                  setShowActionModal(true);
                                }
                              }}
                            >
                              Assign
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="border-t border-gray-200 dark:border-slate-700">
                    <td colSpan={6} className="pt-4 pb-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex gap-2">
                          <button
                            className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold disabled:opacity-40"
                            onClick={() => setVendorPage(p => Math.max(0, p - 1))}
                            disabled={vendorPage === 0}
                          >Previous</button>
                          <button
                            className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 text-gray-900 dark:text-white font-semibold disabled:opacity-40"
                            onClick={() => setVendorPage(p => Math.min(Math.ceil(dummyVendors.length / 4) - 1, p + 1))}
                            disabled={vendorPage >= Math.ceil(dummyVendors.length / 4) - 1}
                          >Next</button>
                        </div>
                        <button
                          className="px-4 py-2 rounded-md bg-gray-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-slate-600 transition font-medium"
                          onClick={() => { setAssignVendorModal(false); setShowActionModal(true); }}
                        >
                          Close
                        </button>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      )}
      {/* Booking Details Modal */}
      {showActionModal && selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => { setShowActionModal(false); setEditMode(false); }}></div>
          <div className={`z-60 bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl border border-gray-300 dark:border-slate-700 w-full max-w-2xl`}>
            <h2 className="text-xl font-bold mb-4">Booking Details</h2>
            {editMode ? (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4" onSubmit={handleEditSave}>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-1">Booking ID</label>
                  <input className="input w-full bg-gray-100 cursor-not-allowed" name="id" value={selectedBooking?.id || ''} readOnly />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Name</label>
                  <input className="input w-full" name="customerName" value={editForm.customerName} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking Amount</label>
                  <input className="input w-full" name="bookingAmount" value={editForm.bookingAmount} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Status</label>
                  <input className="input w-full" name="bookingStatus" value={editForm.bookingStatus} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking Date</label>
                  <input className="input w-full" name="bookingDate" value={editForm.bookingDate} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking Time</label>
                  <input className="input w-full" name="bookingTime" value={editForm.bookingTime} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking Type</label>
                  <input className="input w-full" name="bookingType" value={editForm.bookingType} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Booking Details</label>
                  <input className="input w-full" name="bookingDetails" value={editForm.bookingDetails} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Customer Mobile No</label>
                  <input className="input w-full" name="customerMobileNo" value={editForm.customerMobileNo} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Pickup Location</label>
                  <input className="input w-full" name="pickupLocation" value={editForm.pickupLocation} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Drop Location</label>
                  <input className="input w-full" name="dropLocation" value={editForm.dropLocation} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Pickup Date</label>
                  <input className="input w-full" name="pickUpDate" value={editForm.pickUpDate} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Pickup Time</label>
                  <input className="input w-full" name="pickUpTime" value={editForm.pickUpTime} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Car Type</label>
                  <input className="input w-full" name="carType" value={editForm.carType} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Return Date</label>
                  <input className="input w-full" name="returnDate" value={editForm.returnDate} onChange={handleEditInputChange} />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1">Trip Type</label>
                  <input className="input w-full" name="tripType" value={editForm.tripType} onChange={handleEditInputChange} />
                </div>
                <div className="col-span-2 flex justify-end gap-2 mt-4">
                  <button type="button" className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium" onClick={() => { setEditMode(false); }}>
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
                    Save Changes
                  </button>
                </div>
              </form>
            ) : (
              <div className="space-y-2">
                <div><b>Booking ID:</b> {selectedBooking.id}</div>
                <div><b>Customer:</b> {selectedBooking.customerName}</div>
                <div><b>Booking Amount:</b> {selectedBooking.bookingAmount}</div>
                <div><b>Status:</b> {selectedBooking.bookingStatus}</div>
                <div><b>Date:</b> {selectedBooking.bookingDate}</div>
                <div><b>Time:</b> {selectedBooking.bookingTime}</div>
                <div><b>Type:</b> {selectedBooking.bookingType}</div>
                <div><b>Details:</b> {selectedBooking.bookingDetails}</div>
                <div><b>Mobile:</b> {selectedBooking.customerMobileNo}</div>
                <div><b>Pickup:</b> {selectedBooking.pickupLocation}</div>
                <div><b>Drop:</b> {selectedBooking.dropLocation}</div>
                <div><b>Pickup Date:</b> {selectedBooking.pickUpDate}</div>
                <div><b>Pickup Time:</b> {selectedBooking.pickUpTime}</div>
                <div><b>Car Type:</b> {selectedBooking.carType}</div>
                <div><b>Return Date:</b> {selectedBooking.returnDate}</div>
                <div><b>Trip Type:</b> {selectedBooking.tripType}</div>
              </div>
            )}
            {!editMode && (
              <div className="flex gap-2 mt-6">
                <button className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" onClick={() => setEditMode(true)}>Edit</button>
                <button className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700" onClick={() => { setAssignVendorModal(true); setShowActionModal(false); }}>Assign Vendor</button>
                <button className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-slate-600" onClick={() => setShowActionModal(false)}>Close</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* Confirmation Modal */}
      {showChangeVendorConfirm && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-xl border border-gray-300 dark:border-slate-700 flex flex-col items-center">
            <p className="mb-6 text-lg text-gray-900 dark:text-white">A vendor is already assigned to this booking. Do you want to change the assigned vendor?</p>
            <div className="flex gap-4">
              <button
                className="px-4 py-2 rounded bg-green-600 text-white font-semibold hover:bg-green-700"
                onClick={() => { if (pendingVendor) assignVendorNow(pendingVendor); }}
              >
                Yes, Change
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-300 dark:bg-slate-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-slate-600"
                onClick={() => { setShowChangeVendorConfirm(false); setPendingVendor(null); }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* End root div for CustomBookingPage */}
    </div>
  );
}

