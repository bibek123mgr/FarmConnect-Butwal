import { useState } from "react";
import {
    User,
    Mail,
    Lock,
    Camera,
    Save,
    Eye,
    EyeOff,
    CheckCircle,
    AlertCircle,
    Phone,
    MapPin,
    Calendar,
    Edit2,
    Shield,
    LogOut,
    Loader2,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAppSelector } from "../hooks/hooks";

const UserProfile = () => {
    const [activeTab, setActiveTab] = useState('profile'); // profile, password
    
    // Get user data directly from Redux
    const { user } = useAppSelector((state) => state.auth);
    
    // Password form state
    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    // UI states
    const [isEditing, setIsEditing] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [errors, setErrors] = useState({
        name: "",
        phone: "",
        address: "",
    });
    
    // Edit form state - initialized with user data
    const [editForm, setEditForm] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });

    // Format joined date
    const joinedDate = user?.createdAt 
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
        })
        : "January 1, 2023";

    // Validation functions
    const validateName = (name: string) => {
        // Only letters and spaces allowed, minimum 2 characters
        if (!name.trim()) {
            return "Name is required";
        }
        if (name.trim().length < 2) {
            return "Name must be at least 2 characters";
        }
        if (!/^[a-zA-Z\s]+$/.test(name)) {
            return "Name can only contain letters and spaces";
        }
        return "";
    };

    const validatePhone = (phone: string) => {
        // Only numbers allowed, minimum 5 digits
        if (!phone.trim()) {
            return "Phone number is required";
        }
        if (!/^\d+$/.test(phone)) {
            return "Phone number can only contain digits";
        }
        if (phone.trim().length < 10) {
            return "Phone number must be at least 10 digits";
        }
        return "";
    };

    const validateAddress = (address: string) => {
        if (!address.trim()) {
            return "Address is required";
        }
        if (address.trim().length < 3) {
            return "Address must be at least 3 characters";
        }
        return "";
    };

    const validateForm = () => {
        const nameError = validateName(editForm.name);
        const phoneError = validatePhone(editForm.phone);
        const addressError = validateAddress(editForm.address);

        setErrors({
            name: nameError,
            phone: phoneError,
            address: addressError,
        });

        return !nameError && !phoneError && !addressError;
    };

    const handleEditClick = () => {
        setEditForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });
        setErrors({ name: "", phone: "", address: "" });
        setIsEditing(true);
    };

    const handleSaveProfile = async () => {
        // Validate form before saving
        if (!validateForm()) {
            toast.error("Please fix the errors before saving");
            return;
        }

        setIsSaving(true);
        // Simulate API call - replace with actual API
        setTimeout(() => {
            setIsEditing(false);
            setIsSaving(false);
            toast.success("Profile updated successfully!");
        }, 1500);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditForm({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
        });
        setErrors({ name: "", phone: "", address: "" });
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow letters and spaces
        if (/^[a-zA-Z\s]*$/.test(value) || value === "") {
            setEditForm({ ...editForm, name: value });
            setErrors({ ...errors, name: validateName(value) });
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        // Only allow numbers
        if (/^\d*$/.test(value) || value === "") {
            setEditForm({ ...editForm, phone: value });
            setErrors({ ...errors, phone: validatePhone(value) });
        }
    };

    const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEditForm({ ...editForm, address: value });
        setErrors({ ...errors, address: validateAddress(value) });
    };

    const handleChangePassword = async () => {
        // Validate
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            toast.error("Please fill in all password fields");
            return;
        }

        if (passwordData.newPassword.length < 6) {
            toast.error("New password must be at least 6 characters");
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error("New passwords do not match");
            return;
        }

        setIsChangingPassword(true);
        // Simulate API call - replace with actual API
        setTimeout(() => {
            setPasswordData({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
            setIsChangingPassword(false);
            toast.success("Password changed successfully!");
        }, 1500);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulate upload - replace with actual API
            toast.success("Profile picture updated!");
        }
    };

    // If user data is not loaded yet
    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="text-gray-600 mt-2">Manage your account settings and preferences</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-20">
                            {/* Avatar */}
                            <div className="text-center mb-6">
                                <div className="relative w-24 h-24 mx-auto">
                                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white">
                                        {user?.name?.charAt(0) || "U"}
                                    </div>
                                    <label className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full shadow-lg cursor-pointer hover:bg-gray-50 transition">
                                        <Camera className="w-4 h-4 text-gray-600" />
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="hidden"
                                            onChange={handleFileChange}
                                        />
                                    </label>
                                </div>
                                <h2 className="text-lg font-semibold text-gray-900 mt-3">{user?.name || "User"}</h2>
                                <p className="text-sm text-gray-500">{user?.role || "Customer"}</p>
                            </div>

                            {/* Navigation */}
                            <div className="space-y-1">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                                        activeTab === 'profile'
                                            ? 'bg-green-50 text-green-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <User className="w-5 h-5" />
                                    Profile
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${
                                        activeTab === 'password'
                                            ? 'bg-green-50 text-green-700 font-medium'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    }`}
                                >
                                    <Lock className="w-5 h-5" />
                                    Security
                                </button>
                                <button
                                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition"
                                >
                                    <LogOut className="w-5 h-5" />
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-6">
                        {activeTab === 'profile' && (
                            <>
                                {/* Profile Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                            <p className="text-sm text-gray-500">Update your personal details</p>
                                        </div>
                                        {!isEditing && (
                                            <button
                                                onClick={handleEditClick}
                                                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                                Edit Profile
                                            </button>
                                        )}
                                    </div>

                                    <div className="p-6">
                                        {isEditing ? (
                                            // Edit Mode
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Full Name <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editForm.name}
                                                            onChange={handleNameChange}
                                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                                errors.name ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                            placeholder="Enter your full name"
                                                        />
                                                        {errors.name && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400 mt-1">Letters and spaces only</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Email Address
                                                        </label>
                                                        <input
                                                            type="email"
                                                            value={editForm.email}
                                                            disabled={true}
                                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 cursor-not-allowed"
                                                        />
                                                        <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Phone Number <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editForm.phone}
                                                            onChange={handlePhoneChange}
                                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                                errors.phone ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                            placeholder="Enter phone number"
                                                            maxLength={10}
                                                        />
                                                        {errors.phone && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.phone}</p>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Address <span className="text-red-500">*</span>
                                                        </label>
                                                        <input
                                                            type="text"
                                                            value={editForm.address}
                                                            onChange={handleAddressChange}
                                                            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                                                                errors.address ? 'border-red-500' : 'border-gray-300'
                                                            }`}
                                                            placeholder="Enter your address"
                                                        />
                                                        {errors.address && (
                                                            <p className="text-xs text-red-500 mt-1">{errors.address}</p>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                                                    <button
                                                        onClick={handleCancelEdit}
                                                        className="px-4 py-2 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-lg transition"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleSaveProfile}
                                                        disabled={isSaving}
                                                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                                                    >
                                                        {isSaving ? (
                                                            <>
                                                                <Loader2 className="w-4 h-4 animate-spin" />
                                                                Saving...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Save className="w-4 h-4" />
                                                                Save Changes
                                                            </>
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            // View Mode
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div className="flex items-start gap-3">
                                                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Full Name</p>
                                                            <p className="text-gray-900 font-medium">{user?.name || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Email Address</p>
                                                            <p className="text-gray-900 font-medium">{user?.email || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Phone Number</p>
                                                            <p className="text-gray-900 font-medium">{user?.phone || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-start gap-3">
                                                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Address</p>
                                                            <p className="text-gray-900 font-medium">{user?.address || "N/A"}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-3">
                                                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Joined</p>
                                                        <p className="text-gray-900">{joinedDate}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                                <div className="p-6 border-b border-gray-200">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-6 h-6 text-green-600" />
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">Change Password</h3>
                                            <p className="text-sm text-gray-500">Update your password to keep your account secure</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Current Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter current password"
                                            />
                                            <button
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? "text" : "password"}
                                                value={passwordData.newPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter new password (min 6 characters)"
                                            />
                                            <button
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Confirm New Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showConfirmPassword ? "text" : "password"}
                                                value={passwordData.confirmPassword}
                                                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                                className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Confirm new password"
                                            />
                                            <button
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                            </button>
                                        </div>
                                        {passwordData.newPassword && passwordData.confirmPassword && (
                                            <div className="flex items-center gap-1 mt-1">
                                                {passwordData.newPassword === passwordData.confirmPassword ? (
                                                    <>
                                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                                        <span className="text-xs text-green-600">Passwords match</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <AlertCircle className="w-3 h-3 text-red-500" />
                                                        <span className="text-xs text-red-600">Passwords do not match</span>
                                                    </>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 flex justify-end">
                                        <button
                                            onClick={handleChangePassword}
                                            disabled={isChangingPassword}
                                            className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition flex items-center gap-2 disabled:opacity-50"
                                        >
                                            {isChangingPassword ? (
                                                <>
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                    Changing...
                                                </>
                                            ) : (
                                                <>
                                                    <Shield className="w-4 h-4" />
                                                    Change Password
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="flex items-start gap-2">
                                            <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-blue-800">Password Guidelines:</p>
                                                <ul className="text-sm text-blue-700 mt-1 space-y-1">
                                                    <li>• At least 6 characters long</li>
                                                    <li>• Use a combination of letters, numbers, and symbols</li>
                                                    <li>• Avoid using common words or personal information</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;