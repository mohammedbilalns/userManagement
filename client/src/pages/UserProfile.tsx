import { RootState } from "../app/store";
import React, { ChangeEvent, FormEvent, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateProfile } from "../features/users/userSlice";

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  console.log("User: ", user);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [name, setName] = useState<string>(user.name);
  const [email] = useState<string>(user.email);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const dispatch = useDispatch();

  // Initialize image preview when user data changes
  useEffect(() => {
    if (user?.profileImage) {
      setImagePreview(user.profileImage);
    }
  }, [user]);

  console.log(imagePreview);
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const CLOUDINARY_API_KEY = import.meta.env.VITE_CLOUDINARY_API_KEY;
  const CLOUDINARY_UPLOAD_PRESET = import.meta.env
    .VITE_CLOUDINARY_UPLOAD_PRESET;

  const uploadToCloudinary = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", imageFile);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
    formData.append("api_key", CLOUDINARY_API_KEY);

    try {
      console.log("Uploading to Cloudinary...");
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      console.log("Upload successful:", data);
      if (!data.secure_url) {
        toast.error("Failed to upload image to Cloudinary");
        return user.profileImage || null;
      }
      console.log("Upload successful:", data.secure_url);
      return data.secure_url;
    } catch (error) {
      console.error("Error uploading to Cloudinary:", error);
      toast.error("Error uploading to Cloudinary");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const imageUrl = await uploadToCloudinary();

      const updatedUser = {
        name,
        profileImage: imageUrl || user.profileImage,
      };

      const result = await dispatch(updateProfile(updatedUser) as any);

      if (result.payload) {
        toast.success("Profile updated successfully");
        setIsEditing(false);
        setName(updatedUser.name);
        setImagePreview(imageUrl || user.profileImage);
      } else {
        toast.error("Failed to update profile");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Error submitting form");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 py-12">
      <div className="max-w-md mx-auto bg-base-100 rounded-xl shadow-xl overflow-hidden">
        <div className="bg-primary text-primary-content p-4">
          <h2 className="text-2xl font-bold text-center">User Profile</h2>
        </div>

        <div className="p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {imagePreview || user.profileImage ? (
                <img
                  src={imagePreview || user.profileImage}
                  alt="Profile"
                  className="w-32 h-32 object-cover rounded-full border-4 border-primary"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-base-300 flex items-center justify-center border-4 border-primary">
                  <span className="text-4xl text-base-content">
                    {name.charAt(0)}
                  </span>
                </div>
              )}

              {isEditing && (
                <label
                  htmlFor="profile-image"
                  className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <input
                    id="profile-image"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <h3 className="text-xl font-semibold">{name}</h3>
            <p className="text-base-content">{email}</p>
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Name</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
                  required
                  disabled={isLoading || isUploading}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="submit"
                  className={`btn btn-primary w-full ${
                    isLoading || isUploading ? "btn-disabled" : ""
                  }`}
                >
                  {isLoading || isUploading ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      {isUploading ? "Uploading..." : "Saving..."}
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-ghost w-full"
                  onClick={() => {
                    setIsEditing(false);
                    setImagePreview(null);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h4 className="font-medium text-base-content mb-2">
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm text-base-content">
                  <div className="opacity-70">Name:</div>
                  <div>{name}</div>
                  <div className="opacity-70">Email:</div>
                  <div>{email}</div>
                </div>
              </div>

              <button
                onClick={() => setIsEditing(true)}
                className="btn btn-primary w-full"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
