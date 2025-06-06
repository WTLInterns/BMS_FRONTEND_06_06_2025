"use client";
import { useState, ChangeEvent, useEffect } from "react";

interface ProfileData {
  name: string;
  email: string;
  image?: string;
}

export default function ProfileDrawer({
  open,
  onClose,
  profile,
  onEdit,
  onLogout,
}: {
  open: boolean;
  onClose: () => void;
  profile: ProfileData;
  onEdit: (data: ProfileData) => void;
  onLogout: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState(profile);
  const [imagePreview, setImagePreview] = useState(profile.image || "");
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // Keep drawer UI in sync with updated profile from props
  useEffect(() => {
    setEditData(profile);
    setImagePreview(profile.image || "");
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setError(""); // Clear error on any change
    if (name === "image" && files && files[0]) {
      const file = files[0];
      if (file.size > 200 * 1024) { // 200KB limit
        setError("Image is too large. Please select an image under 200KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        setEditData({ ...editData, image: base64 });
      };
      reader.readAsDataURL(file);
    } else {
      setEditData({ ...editData, [name]: value });
    }
  };

  const handleSave = () => {
    onEdit(editData);
    setEditMode(false);
    setSuccess("Profile updated successfully!");
    if (typeof window !== "undefined") {
      localStorage.setItem("profile", JSON.stringify(editData));
    }
    setTimeout(() => {
      setSuccess("");
    }, 2000);
  };

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 backdrop-blur-sm bg-black/20 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-900 shadow-lg z-50 flex flex-col p-6 transition-transform duration-300 transform translate-x-0 border-l border-gray-200 dark:border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Profile</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-sm">Close</button>
        </div>
        <div className="flex flex-col items-center gap-2 mb-4">
          {imagePreview ? (
            <img src={imagePreview} alt="Profile" className="w-20 h-20 object-cover rounded-full border-2 border-blue-500" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center font-bold text-3xl text-blue-700 border border-blue-200">
              {profile.name?.[0]?.toUpperCase() || 'M'}
            </div>
          )}
          {/* Edit button always visible when not in edit mode */}
          {!editMode && (
            <button
              className="mt-2 px-4 py-1 rounded bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 flex items-center gap-2 shadow-sm transition-colors"
              onClick={() => setEditMode(true)}
              title="Edit Profile"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13h3l7-7a2 2 0 00-2.828-2.828l-7 7v3z" /></svg>
              Edit
            </button>
          )}
        </div>
        {error && (
          <div className="mb-2 text-red-500 text-sm font-semibold">{error}</div>
        )}
        {editMode ? (
          <>
            <div className="w-full">
              <label className="block text-sm font-semibold mb-1">Full Name</label>
              <input
                type="text"
                name="name"
                value={editData.name}
                onChange={handleChange}
                className="mb-3 px-3 py-2 w-full border rounded focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Full Name"
              />
              <label className="block text-sm font-semibold mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="mb-3 px-3 py-2 w-full border rounded focus:ring-2 focus:ring-blue-400 dark:bg-slate-800 dark:border-slate-700 dark:text-white"
                placeholder="Email"
              />
              <label className="block text-sm font-semibold mb-1">Profile Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                className="mb-4"
                onChange={handleChange}
              />
            </div>
            <button
              className="w-full py-2 rounded bg-green-600 text-white font-bold hover:bg-green-700 flex items-center justify-center gap-2 shadow-sm transition-colors mt-2"
              onClick={handleSave}
              type="button"
              title="Update"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Update
            </button>
            {success && (
              <div className="mt-4 text-green-600 font-semibold text-center flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                {success}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-2 text-center">
              <div className="font-bold text-lg text-blue-700 dark:text-blue-300">{profile.name}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{profile.email}</div>
            </div>
            <button
              className="w-full py-2 rounded bg-red-500 text-white font-bold hover:bg-red-600 mt-2 flex items-center justify-center gap-2 shadow-sm transition-colors"
              onClick={onLogout}
              title="Logout"
            >
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1" /></svg>
              Logout
            </button>
          </>
        )}
      </div>
    </>
  );
}
