import { useState } from "react";
import { Eye, EyeOff, User, Lock, Leaf, Home } from "lucide-react";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">

            <div className="w-full max-w-md bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">

                {/* HEADER */}
                <div className="bg-green-600 text-white p-6 text-center">

                    <div className="flex justify-center mb-2">
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                            <Leaf className="w-6 h-6" />
                        </div>
                    </div>

                    <h1 className="text-xl font-semibold">
                        FarmeConnect Butwal
                    </h1>

                    <p className="text-xs text-green-100">
                        Agro Marketplace • Fresh Farm Products
                    </p>
                </div>

                <div className="p-6">

                    <h2 className="text-lg font-semibold text-gray-800 mb-1">
                        Welcome Back !
                    </h2>

                    <p className="text-sm text-gray-500 mb-6">
                        Login to buy fresh agricultural products
                    </p>

                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Email Address
                        </label>

                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500 transition">
                            <User className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter username or email"
                                className="w-full outline-none text-sm h-9"
                            />
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Password
                        </label>

                        <div className="flex items-center justify-between border border-gray-200 rounded-lg px-3 py-2 focus-within:border-green-500 transition">

                            <div className="flex items-center gap-2 w-full">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                    className="w-full outline-none text-sm h-9"
                                />
                            </div>

                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-5">

                        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={remember}
                                onChange={() => setRemember(!remember)}
                                className="accent-green-600"
                            />
                            Remember me
                        </label>

                        <span className="text-sm text-green-600 cursor-pointer hover:underline">
                            Forgot password?
                        </span>
                    </div>

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200">
                        Login
                    </button>

                    <div className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-green-600 cursor-pointer transition">
                        <Home className="w-3.5 h-3.5" />
                        Back to Home
                    </div>

                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            New to FarmeConnect ?.{" "}
                            <span className="text-green-600 cursor-pointer hover:underline">
                                Create account
                            </span>
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Login;