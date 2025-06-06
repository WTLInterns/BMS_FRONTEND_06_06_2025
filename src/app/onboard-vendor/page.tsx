"use client";
import React, { useState, useEffect } from 'react';
import { getVendorsFromStorage, setVendorsToStorage } from '../utils/vendorStorage';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PencilSquareIcon, TrashIcon, EnvelopeIcon } from "@heroicons/react/24/outline";
import { useTheme } from '../utils/ThemeContext';
import { FaMoon, FaSun } from 'react-icons/fa';

export const DUMMY_VENDORS = [
  {
    id: 1,
    vendorCompanyName: "John Doe Pvt Ltd",
    contactNo: "1234567890",
    alternateMobileNo: "9876543210",
    city: "New York",
    vendorEmail: "john@example.com",
    bankName: "Bank of America",
    bankAccountNo: "123456789",
    ifscCode: "BOFA0001234",
    aadharNo: "111122223333",
    panNo: "ABCDE1234F",
    udyogAadharNo: "UAN1234567",
    govtApprovalCertificate: null,
    vendorDocs: null,
    vendorImage: null,
    aadharPhoto: null,
    panPhoto: null,
    vendorOtherDetails: "First vendor dummy data.",
    govtApprovalCertificateUrl: "",
    vendorDocsUrl: "",
    vendorImageUrl: "",
    aadharPhotoUrl: "",
    panPhotoUrl: ""
  },
  {
    id: 2,
    vendorCompanyName: "Jane Smith Supplies",
    contactNo: "2222333344",
    alternateMobileNo: "5555666677",
    city: "Los Angeles",
    vendorEmail: "jane@example.com",
    bankName: "Chase",
    bankAccountNo: "987654321",
    ifscCode: "CHASE0005678",
    aadharNo: "444455556666",
    panNo: "FGHIJ5678K",
    udyogAadharNo: "UAN7654321",
    govtApprovalCertificate: null,
    vendorDocs: null,
    vendorImage: null,
    aadharPhoto: null,
    panPhoto: null,
    vendorOtherDetails: "Second vendor dummy data.",
    govtApprovalCertificateUrl: "",
    vendorDocsUrl: "",
    vendorImageUrl: "",
    aadharPhotoUrl: "",
    panPhotoUrl: ""
  },
  {
    id: 3,
    vendorCompanyName: "Vendor X Corp",
    contactNo: "3333444455",
    alternateMobileNo: "8888999900",
    city: "Chicago",
    vendorEmail: "vendorx@example.com",
    bankName: "Wells Fargo",
    bankAccountNo: "555555555",
    ifscCode: "WF0009999",
    aadharNo: "777788889999",
    panNo: "KLMNO9012P",
    udyogAadharNo: "UAN9998887",
    govtApprovalCertificate: null,
    vendorDocs: null,
    vendorImage: null,
    aadharPhoto: null,
    panPhoto: null,
    vendorOtherDetails: "Third vendor dummy data.",
    govtApprovalCertificateUrl: "",
    vendorDocsUrl: "",
    vendorImageUrl: "",
    aadharPhotoUrl: "",
    panPhotoUrl: "",
    status: "Active"
  }
];

export default function OnboardVendorPage() {
  const { isDark, toggleTheme } = useTheme();
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editVendorId, setEditVendorId] = useState<number | null>(null);
  // Load vendors from localStorage if present, else use DUMMY_VENDORS
  const [vendors, setVendors] = useState(getVendorsFromStorage());
  const [confirmModal, setConfirmModal] = useState<null | { type: 'delete' | 'email', vendor: any }>(null);
  const [form, setForm] = useState<any>({
    vendorFullName: "",
    vendorCompanyName: "",
    contactNo: "",
    alternateMobileNo: "",
    city: "",
    vendorEmail: "",
    bankName: "",
    bankAccountNo: "",
    ifscCode: "",
    aadharNo: "",
    panNo: "",
    gstNo: "",
    gstNoImage: null,
    udyogAadharNo: "",
    govtApprovalCertificate: null,
    vendorDocs: null,
    vendorImage: null,
    aadharPhoto: null,
    panPhoto: null,
    vendorOtherDetails: "",
    // For preview URLs
    govtApprovalCertificateUrl: "",
    vendorDocsUrl: "",
    vendorImageUrl: "",
    aadharPhotoUrl: "",
    panPhotoUrl: "",
    gstNoImageUrl: "",
    status: "Active"
  });

  const filteredVendors = vendors.filter(
    v =>
      (v.vendorCompanyName?.toLowerCase().includes(search.toLowerCase()) ||
       v.vendorEmail?.toLowerCase().includes(search.toLowerCase()))
  );

  const handleAddOrEditVendor = (e: React.FormEvent) => {
    e.preventDefault();
    let updated;
    if (editVendorId !== null) {
      updated = vendors.map(v => v.id === editVendorId ? { ...v, ...form } : v);
      setVendors(updated);
      toast.success('Updated successfully!');
    } else {
      updated = [...vendors, { id: vendors.length + 1, ...form }];
      setVendors(updated);
      toast.success('Added successfully!');
    }
    setVendorsToStorage(updated);
    setForm({
      vendorCompanyName: "",
      contactNo: "",
      alternateMobileNo: "",
      city: "",
      vendorEmail: "",
      bankName: "",
      bankAccountNo: "",
      ifscCode: "",
      aadharNo: "",
      panNo: "",
      udyogAadharNo: "",
      govtApprovalCertificate: null,
      vendorDocs: null,
      vendorImage: null,
      aadharPhoto: null,
      panPhoto: null,
      vendorOtherDetails: "",
      govtApprovalCertificateUrl: "",
      vendorDocsUrl: "",
      vendorImageUrl: "",
      aadharPhotoUrl: "",
      panPhotoUrl: "",
      status: "Active"
    });
    setEditVendorId(null);
    setShowModal(false);
  };

  // Helper to handle file/image changes
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: string, urlField: string) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setForm((prev: any) => ({
        ...prev,
        [field]: file,
        [urlField]: URL.createObjectURL(file)
      }));
    }
  };

  const openAddModal = () => {
    setForm({
      vendorFullName: "",
      vendorCompanyName: "",
      contactNo: "",
      alternateMobileNo: "",
      city: "",
      vendorEmail: "",
      bankName: "",
      bankAccountNo: "",
      ifscCode: "",
      aadharNo: "",
      panNo: "",
      gstNo: "",
      gstNoImage: null,
      udyogAadharNo: "",
      govtApprovalCertificate: null,
      vendorDocs: null,
      vendorImage: null,
      aadharPhoto: null,
      panPhoto: null,
      vendorOtherDetails: "",
      govtApprovalCertificateUrl: "",
      vendorDocsUrl: "",
      vendorImageUrl: "",
      aadharPhotoUrl: "",
      panPhotoUrl: "",
      gstNoImageUrl: "",
      status: "" // Show 'Select Status' by default when adding
    });
    setEditVendorId(null);
    setShowModal(true);
  };

  const openEditModal = (vendor: any) => {
    setForm({
      vendorFullName: vendor.vendorFullName || "",
      vendorCompanyName: vendor.vendorCompanyName || "",
      contactNo: vendor.contactNo || "",
      alternateMobileNo: vendor.alternateMobileNo || "",
      city: vendor.city || "",
      vendorEmail: vendor.vendorEmail || "",
      bankName: vendor.bankName || "",
      bankAccountNo: vendor.bankAccountNo || "",
      ifscCode: vendor.ifscCode || "",
      aadharNo: vendor.aadharNo || "",
      panNo: vendor.panNo || "",
      gstNo: vendor.gstNo || "",
      gstNoImage: vendor.gstNoImage || null,
      udyogAadharNo: vendor.udyogAadharNo || "",
      govtApprovalCertificate: vendor.govtApprovalCertificate || null,
      vendorDocs: vendor.vendorDocs || null,
      vendorImage: vendor.vendorImage || null,
      aadharPhoto: vendor.aadharPhoto || null,
      panPhoto: vendor.panPhoto || null,
      vendorOtherDetails: vendor.vendorOtherDetails || "",
      govtApprovalCertificateUrl: vendor.govtApprovalCertificateUrl || (typeof vendor.govtApprovalCertificate === 'string' ? vendor.govtApprovalCertificate : ""),
      vendorDocsUrl: vendor.vendorDocsUrl || (typeof vendor.vendorDocs === 'string' ? vendor.vendorDocs : ""),
      vendorImageUrl: vendor.vendorImageUrl || (typeof vendor.vendorImage === 'string' ? vendor.vendorImage : ""),
      aadharPhotoUrl: vendor.aadharPhotoUrl || (typeof vendor.aadharPhoto === 'string' ? vendor.aadharPhoto : ""),
      panPhotoUrl: vendor.panPhotoUrl || (typeof vendor.panPhoto === 'string' ? vendor.panPhoto : ""),
      gstNoImageUrl: vendor.gstNoImageUrl || (typeof vendor.gstNoImage === 'string' ? vendor.gstNoImage : ""),
      status: vendor.status || "Active"
    });
    setEditVendorId(vendor.id);
    setShowModal(true);
  };

  const handleDeleteVendor = (id: number) => {
    const updated = vendors.filter((v: any) => v.id !== id);
    setVendors(updated);
    setVendorsToStorage(updated);
    setConfirmModal(null);
  };

  const handleSendEmail = (vendor: any) => {
    // Implement your email logic here
    alert(`Details sent to ${vendor.vendorCompanyName} (${vendor.vendorEmail})`);
    setConfirmModal(null);
  };

  return (
    <div className={`min-h-screen py-6 px-2 md:px-8 transition-colors duration-300 ${isDark ? 'bg-slate-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Onboard Vendor</h1>

      </div>
      <div className={`mb-6 p-4 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-md border flex flex-col sm:flex-row gap-4`}>
        <input
          type="text"
          placeholder="Search vendors..."
          className={`w-full max-w-xs p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 mb-4 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black placeholder-gray-500 border-gray-300'} transition-colors`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button
           className={`px-1.5 py-1 ${isDark ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-md shadow-lg hover:scale-105 transition-transform font-semibold flex items-center gap-1 text-xs min-h-[28px] min-w-[80px]`}
           style={{ height: '28px', minWidth: '80px', fontSize: '0.85rem' }}
           onClick={openAddModal}
         >
           <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
           Add Vendor
         </button>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className={`relative ${isDark ? 'bg-slate-800 border-slate-600' : 'bg-white border-gray-300'} rounded-lg shadow-xl border p-8 w-full max-w-lg animate-fade-in max-h-[90vh] flex flex-col justify-start items-center`}>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className={`absolute top-3 right-3 text-2xl font-bold focus:outline-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-red-500'}`}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className={`text-2xl font-extrabold mb-6 text-center tracking-tight ${isDark ? 'text-blue-400' : 'text-blue-700'}`} style={{ textAlign: 'center' }}>
              {editVendorId !== null ? "Edit Vendor" : "Add Vendor"}
            </h2>
            <form onSubmit={handleAddOrEditVendor} className="space-y-4 overflow-y-auto flex-1 py-2 flex flex-col items-center">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full justify-items-center">
                <div className="md:col-span-2 w-full">
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Vendor Full Name</label>
                  <input
                    type="text"
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`}
                    value={form.vendorFullName}
                    onChange={e => setForm((f: any) => ({ ...f, vendorFullName: e.target.value }))}
                    required
                  />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Status</label>
                  <select
                    className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`}
                    value={form.status}
                    onChange={e => setForm((f: any) => ({ ...f, status: e.target.value }))}
                    required
                  >
                    <option value="" disabled>Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Company Name</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.vendorCompanyName} onChange={e => setForm((f: any) => ({ ...f, vendorCompanyName: e.target.value }))} required />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Contact No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.contactNo} onChange={e => setForm((f: any) => ({ ...f, contactNo: e.target.value }))} required />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Alternate Mobile No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.alternateMobileNo} onChange={e => setForm((f: any) => ({ ...f, alternateMobileNo: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>City</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.city} onChange={e => setForm((f: any) => ({ ...f, city: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Email</label>
                  <input type="email" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.vendorEmail} onChange={e => setForm((f: any) => ({ ...f, vendorEmail: e.target.value }))} required />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bank Name</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.bankName} onChange={e => setForm((f: any) => ({ ...f, bankName: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Bank Account No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.bankAccountNo} onChange={e => setForm((f: any) => ({ ...f, bankAccountNo: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>IFSC Code</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.ifscCode} onChange={e => setForm((f: any) => ({ ...f, ifscCode: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Aadhar No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.aadharNo} onChange={e => setForm((f: any) => ({ ...f, aadharNo: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PAN No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.panNo} onChange={e => setForm((f: any) => ({ ...f, panNo: e.target.value }))} />
                </div>
                <div>
  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>GST No</label>
  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.gstNo} onChange={e => setForm((f: any) => ({ ...f, gstNo: e.target.value }))} />
</div>
<div>
  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>GST No Image</label>
  <input
    type="file"
    accept="image/*"
    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`}
    onChange={e => handleFileChange(e, 'gstNoImage', 'gstNoImageUrl')}
  />
  {form.gstNoImageUrl && (
    <div className="mt-2">
      <a href={form.gstNoImageUrl} target="_blank" rel="noopener noreferrer">
        <img src={form.gstNoImageUrl} alt="GST" className="h-16 w-16 object-cover border rounded cursor-pointer" />
      </a>
    </div>
  )}
</div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Udyog Aadhar No</label>
                  <input type="text" className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-100 text-black border-gray-300 placeholder-gray-500'} transition-colors`} value={form.udyogAadharNo} onChange={e => setForm((f: any) => ({ ...f, udyogAadharNo: e.target.value }))} />
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Govt. Approval Certificate</label>
                  <input type="file" accept="image/*,application/pdf" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} onChange={e => handleFileChange(e, 'govtApprovalCertificate', 'govtApprovalCertificateUrl')} />
                  {form.govtApprovalCertificateUrl && (
                    <div className="mt-2">
                      <a href={form.govtApprovalCertificateUrl} target="_blank" rel="noopener noreferrer">
                        <img src={form.govtApprovalCertificateUrl} alt="Govt Approval" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Vendor Docs</label>
                  <input type="file" accept="image/*,application/pdf" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} onChange={e => handleFileChange(e, 'vendorDocs', 'vendorDocsUrl')} />
                  {form.vendorDocsUrl && (
                    <div className="mt-2">
                      <a href={form.vendorDocsUrl} target="_blank" rel="noopener noreferrer">
                        <img src={form.vendorDocsUrl} alt="Vendor Docs" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Vendor Image</label>
                  <input type="file" accept="image/*" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} onChange={e => handleFileChange(e, 'vendorImage', 'vendorImageUrl')} />
                  {form.vendorImageUrl && (
                    <div className="mt-2">
                      <a href={form.vendorImageUrl} target="_blank" rel="noopener noreferrer">
                        <img src={form.vendorImageUrl} alt="Vendor" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Aadhar Photo</label>
                  <input type="file" accept="image/*" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} onChange={e => handleFileChange(e, 'aadharPhoto', 'aadharPhotoUrl')} />
                  {form.aadharPhotoUrl && (
                    <div className="mt-2">
                      <a href={form.aadharPhotoUrl} target="_blank" rel="noopener noreferrer">
                        <img src={form.aadharPhotoUrl} alt="Aadhar" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                      </a>
                    </div>
                  )}
                </div>
                <div>
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>PAN Photo</label>
                  <input type="file" accept="image/*" className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} onChange={e => handleFileChange(e, 'panPhoto', 'panPhotoUrl')} />
                  {form.panPhotoUrl && (
                    <div className="mt-2">
                      <a href={form.panPhotoUrl} target="_blank" rel="noopener noreferrer">
                        <img src={form.panPhotoUrl} alt="PAN" className="h-16 w-16 object-cover border rounded cursor-pointer" />
                      </a>
                    </div>
                  )}
                </div>
                <div className="md:col-span-2">
                  <label className={`block mb-1 text-sm font-medium ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>Other Details</label>
                  <textarea className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${isDark ? 'bg-slate-700 border-slate-600 text-white placeholder-gray-400' : 'bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500'} transition-colors`} value={form.vendorOtherDetails} onChange={e => setForm((f: any) => ({ ...f, vendorOtherDetails: e.target.value }))} rows={2} />
                </div>
              </div>
              <div className="flex gap-3 mt-6 justify-center">
                <button
                  type="submit"
                  className={`w-36 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-base ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                  style={{ display: 'block' }}
                >
                  {editVendorId !== null ? "Update" : "Add"}
                </button>
                <button
                  type="button"
                  className={`w-36 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transition-transform focus:outline-none focus:ring-2 focus:ring-blue-400 text-white text-base ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'}`}
                  onClick={() => { setShowModal(false); setEditVendorId(null); }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal for Delete/Email */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setConfirmModal(null)}></div>
          <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-8 w-full max-w-md shadow-2xl animate-fade-in max-h-[90vh] flex flex-col justify-start">
            <button
              type="button"
              onClick={() => setConfirmModal(null)}
              className={`absolute top-3 right-3 text-2xl font-bold focus:outline-none ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-red-500'}`}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-center text-red-600 dark:text-red-400">
              {confirmModal.type === 'delete' ? 'Delete Vendor?' : 'Send Details?'}
            </h2>
            <div className="mb-6 text-center">
              <div className="font-semibold text-lg mb-1">{confirmModal.vendor.vendorCompanyName}</div>
              <div className="text-gray-600 dark:text-gray-300 mb-2">{confirmModal.vendor.vendorEmail}</div>
              {confirmModal.type === 'delete' ? (
                <div>Are you sure you want to <span className="font-bold text-red-600">delete</span> this vendor? This action cannot be undone.</div>
              ) : (
                <div>Do you want to <span className="font-bold text-blue-600">send details</span> to this vendor?</div>
              )}
            </div>
            <div className="flex gap-3 mt-4">
              <button
                className={`flex-1 py-3 rounded-lg font-semibold shadow-lg focus:outline-none focus:ring-2 transition ${confirmModal.type === 'delete' ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
                onClick={() => confirmModal.type === 'delete' ? handleDeleteVendor(confirmModal.vendor.id) : handleSendEmail(confirmModal.vendor)}
              >
                {confirmModal.type === 'delete' ? 'Delete' : 'Send'}
              </button>
              <button
                className={`flex-1 py-3 rounded-lg shadow transition ${isDark ? 'bg-slate-700 text-gray-200 hover:bg-slate-600' : 'bg-gray-300 text-gray-800 hover:bg-gray-400'}`}
                onClick={() => setConfirmModal(null)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Table */}
      <div className={`overflow-x-auto mb-8 ${isDark ? 'bg-slate-800 border border-slate-700' : 'bg-white border border-gray-200'} rounded-lg shadow-md`}>
        <table className="min-w-full rounded-lg overflow-hidden">
          <thead>
            <tr className={`${isDark ? 'bg-slate-700 text-gray-200' : 'bg-gray-100 text-gray-700'}`}>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Sr No.</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Company Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Email</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">Status</th>
              <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor, idx) => (
              <tr key={vendor.id} className={`border-t ${isDark ? 'border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200' : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-900'} transition-colors`}>
                <td className="px-4 py-3">{idx + 1}</td>
                <td className="px-4 py-3 font-medium">{vendor.vendorCompanyName}</td>
                <td className="px-4 py-3">{vendor.vendorEmail}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${vendor.status === 'Active' ? (isDark ? 'bg-green-800 text-green-200' : 'bg-green-100 text-green-800') : (isDark ? 'bg-red-800 text-red-200' : 'bg-red-100 text-red-800')}`}>{vendor.status}</span>
                </td>
                <td className="px-4 py-3 text-center flex justify-center items-center gap-3">
                  <button onClick={() => openEditModal(vendor)} className={`p-1.5 rounded-full ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white transition-all duration-200 hover:scale-110 flex items-center justify-center`} style={{ width: '30px', height: '30px' }} title="Edit Vendor"><PencilSquareIcon className="h-4 w-4" /></button>
                  <button onClick={() => setConfirmModal({ type: 'delete', vendor })} className="p-1.5 rounded-full bg-red-600 hover:bg-red-700 text-white shadow transition-all duration-200 hover:scale-110 flex items-center justify-center" style={{ width: '30px', height: '30px' }} title="Delete Vendor"><TrashIcon className="h-4 w-4" /></button>
                  <button onClick={() => setConfirmModal({ type: 'email', vendor })} className="p-1.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow transition-all duration-200 hover:scale-110 flex items-center justify-center" style={{ width: '30px', height: '30px' }} title="Send Email"><EnvelopeIcon className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
