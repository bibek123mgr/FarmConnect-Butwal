// SignUp.tsx
import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock, Leaf, Home, Mail, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { LoginUserWithGoogle, RegisterUser } from "../features/auth/AuthApi";
import { BsGoogle } from "react-icons/bs";

export interface SignUpPayload {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
}

declare const google: any;


const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [acceptTerms, setAcceptTerms] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<SignUpPayload>({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
    }>({});

    useEffect(() => {
        google.accounts.id.initialize({
            client_id: "131274795330-17cj5fugslri5n3q5ur99qvpbeo236c5.apps.googleusercontent.com",
            callback: (response: any) => {
                dispatch(LoginUserWithGoogle(response.credential));
            }
        });
        google.accounts.id.renderButton(
            document.getElementById("googleSignInButton"),
            { theme: "outline", size: "large", width: "100%" }
        );

    }, []);

    const { success, error, loading } = useAppSelector((state: any) => state.auth);

    useEffect(() => {
        if (success) {
            // Redirect to login page after successful registration
            setTimeout(() => {
                navigate("/login");
            }, 2000);
        }
    }, [success, navigate]);

    const validateForm = () => {
        const newErrors: typeof errors = {};

        // Validate name
        if (!formData.name) {
            newErrors.name = "Name is required";
        } else if (formData.name.length < 2) {
            newErrors.name = "Name must be at least 2 characters";
        }

        // Validate email
        if (!formData.email) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Validate password
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        } else if (!/(?=.*[A-Za-z])(?=.*\d)/.test(formData.password)) {
            newErrors.password = "Password must contain both letters and numbers";
        }

        // Validate confirm password
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        // Validate terms
        if (!acceptTerms) {
            newErrors.terms = "You must accept the terms and conditions";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (validateForm()) {
            const { confirmPassword, ...registerData } = formData;
            dispatch(RegisterUser(registerData));
        }
    };

    const handleInputChange = (field: keyof SignUpPayload, value: string) => {
        setFormData({
            ...formData,
            [field]: value
        });
        // Clear error for this field when user starts typing
        if (errors[field as keyof typeof errors]) {
            setErrors({
                ...errors,
                [field]: undefined
            });
        }
    };

    return (
        <div className="my-12 flex items-center justify-center bg-gray-50 p-4">
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
                        Create Account
                    </h2>
                    <p className="text-sm text-gray-500 mb-6">
                        Join us to buy fresh agricultural products
                    </p>

                    {/* Success Message */}
                    {success && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 text-center">
                                Account created successfully! Redirecting to login...
                            </p>
                        </div>
                    )}

                    {/* Error Message */}
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700 text-center">
                                {typeof error === 'string' ? error : 'Registration failed. Please try again.'}
                            </p>
                        </div>
                    )}

                    {/* Name Field */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Full Name <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:border-green-500 transition ${errors.name ? 'border-red-500' : 'border-gray-200'
                            }`}>
                            <User className="w-4 h-4 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full outline-none text-sm h-9"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                            />
                        </div>
                        {errors.name && (
                            <p className="text-xs text-red-500 mt-1">{errors.name}</p>
                        )}
                    </div>

                    {/* Email Field */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Email Address <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 focus-within:border-green-500 transition ${errors.email ? 'border-red-500' : 'border-gray-200'
                            }`}>
                            <Mail className="w-4 h-4 text-gray-400" />
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                className="w-full outline-none text-sm h-9"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                            />
                        </div>
                        {errors.email && (
                            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Field */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 focus-within:border-green-500 transition ${errors.password ? 'border-red-500' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center gap-2 w-full">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="w-full outline-none text-sm h-9"
                                    value={formData.password}
                                    onChange={(e) => handleInputChange("password", e.target.value)}
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
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                            Password must be at least 6 characters with letters and numbers
                        </p>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="mb-4">
                        <label className="text-sm text-gray-600 mb-1 block">
                            Confirm Password <span className="text-red-500">*</span>
                        </label>
                        <div className={`flex items-center justify-between border rounded-lg px-3 py-2 focus-within:border-green-500 transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-200'
                            }`}>
                            <div className="flex items-center gap-2 w-full">
                                <Lock className="w-4 h-4 text-gray-400" />
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    className="w-full outline-none text-sm h-9"
                                    value={formData.confirmPassword}
                                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-600"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                        {errors.confirmPassword && (
                            <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>
                        )}
                    </div>

                    {/* Terms and Conditions */}
                    <div className="mb-5">
                        <label className="flex items-start gap-2 text-sm text-gray-600 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={acceptTerms}
                                onChange={() => {
                                    setAcceptTerms(!acceptTerms);
                                    if (errors.terms) {
                                        setErrors({ ...errors, terms: undefined });
                                    }
                                }}
                                className="accent-green-600 mt-0.5"
                            />
                            <span>
                                I accept the{" "}
                                <span className="text-green-600 hover:underline cursor-pointer">
                                    Terms of Service
                                </span>{" "}
                                and{" "}
                                <span className="text-green-600 hover:underline cursor-pointer">
                                    Privacy Policy
                                </span>
                            </span>
                        </label>
                        {errors.terms && (
                            <p className="text-xs text-red-500 mt-1">{errors.terms}</p>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Creating Account...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-4 h-4" />
                                Sign Up
                            </>
                        )}
                    </button>

                    <span className="block text-center text-sm text-gray-500 my-4">or</span>

                    <button className="w-full text-center"  id="googleSignInButton">
                        <BsGoogle className="w-4 h-4 inline-block mr-3" />
                        Sign Up with Google
                    </button>

                    {/* Back to Home Link */}
                    <Link to="/" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-green-600 cursor-pointer transition">
                        <Home className="w-3.5 h-3.5" />
                        Back to Home
                    </Link>

                    {/* Login Link */}
                    <div className="text-center mt-4">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-green-600 hover:underline">
                                Login here
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;