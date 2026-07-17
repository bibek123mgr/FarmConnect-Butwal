import { useState } from 'react';
import {
  Store,
  Upload,
  Save,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { districtsByProvince, provinces } from './BecomeSeller';

const AdminStoreSettings = () => {
  const [storeLogo, setStoreLogo] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    storeName: 'Boxera Electronics',
    storeDescription: '',
    registrationNumber: '',
    taxNumber: '',
    storeEmail: 'support@boxera.com',
    storePhone: '+1 202 555 0173',
    district: '',
    address: '',
    province: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setStoreLogo(reader.result as string);
        toast.success('Logo uploaded successfully');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteLogo = () => {
    setStoreLogo(null);
    toast.success('Logo deleted successfully');
  };

  const handleSave = () => {
    toast.success('Settings saved successfully!');
  };

  const handleCancel = () => {
    toast.success('Changes cancelled');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">Manage your store's account and configuration settings.</p>
        </div>

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Store Identity */}
          <div className="space-y-6">
            {/* Store Identity Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Store Identity</h2>

              {/* Store Logo */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Logo <span className="text-red-500">*</span>
                </label>
                <p className="text-xs text-gray-500 mb-3">Upload your brand logo (PNG, JPG, max 5MB).</p>

                <div className="flex items-center gap-4">
                  {storeLogo ? (
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden">
                      <img src={storeLogo} alt="Store Logo" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center">
                      <Store className="w-8 h-8 text-green-600" />
                    </div>
                  )}

                  <div className="flex gap-2">
                    {storeLogo && (
                      <button
                        onClick={handleDeleteLogo}
                        className="px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                      >
                        Delete
                      </button>
                    )}
                    <label className="px-4 py-2 text-sm bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer">
                      Update
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Store Name */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Boxera Electronics"
                />
                <p className="text-xs text-gray-500 mt-1">This is the public name displayed to your customers.</p>
              </div>

              {/* Store Description */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Description
                </label>
                <div className="relative">
                  <textarea
                    name="storeDescription"
                    value={formData.storeDescription}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter description"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Briefly describe your store, products, or services.</p>
              </div>
            </div>

            {/* Business Details Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Business Details</h2>

              {/* Registration Number */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PAN Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter registration number"
                />
                <p className="text-xs text-gray-500 mt-1">Your business registration or company number.</p>
              </div>

              {/* Tax Number */}
              <div className="mb-0">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  VAT Number
                </label>
                <input
                  type="text"
                  name="taxNumber"
                  value={formData.taxNumber}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter tax number"
                />
                <p className="text-xs text-gray-500 mt-1">Your tax identification number (optional).</p>
              </div>
            </div>
          </div>

          {/* Right Column - Contact Information */}
          <div className="space-y-6">
            {/* Contact Information Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Contact Information</h2>

              {/* Store Email */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="storeEmail"
                  value={formData.storeEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="support@boxera.com"
                />
                <p className="text-xs text-gray-500 mt-1">Label</p>
              </div>


              {/* Store Phone */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Store Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="storePhone"
                  value={formData.storePhone}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="+1 202 555 0173"
                />
                <p className="text-xs text-gray-500 mt-1">Shown on invoices and customer communications.</p>
              </div>

            </div>

            {/* Address Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Address</h2>
              {/* Country */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Province
                </label>
                <select
                  name="province"
                  value={formData.province}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select Province</option>
                  {provinces.map(province => (
                    <option key={province} value={province}>{province}</option>
                  ))}
                </select>
                <p className="text-xs text-gray-500 mt-1">Select your business country.</p>
              </div>
              {/* State & Zip Code */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    District
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="">Select District</option>
                    {formData.province && districtsByProvince[formData.province]?.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter address"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminStoreSettings;