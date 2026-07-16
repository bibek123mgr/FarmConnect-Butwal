import { useEffect, useState } from "react";
import { Eye, EyeOff, User, Lock, Leaf, Home } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import { getUserProfile, LoginUser, LoginUserWithGoogle } from "../features/auth/AuthApi";
import { BsGoogle } from "react-icons/bs";
export interface LoginPayload {
    email: string;
    password: string;
}

declare const google: any;


const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [remember, setRemember] = useState(false);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState<LoginPayload>({
        email: "",
        password: ""
    });

    const { success, error } = useAppSelector((state: any) => state.auth);

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

    useEffect(() => {
        if (success) {
            dispatch(getUserProfile())
                .unwrap()
                .then((res) => {
                    const user = res.user;
                    const userRole = user.role.trim();
                    if (userRole === "superadmin" || userRole === "farmer") {
                        navigate("/admin/dashboard");
                        return;
                    }
                    navigate("/");
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }, [success, error, dispatch, navigate]);

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!formData.email || !formData.password) return
        dispatch(
            LoginUser(formData)
        );
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
                                type="email"
                                placeholder="Enter username or email"
                                className="w-full outline-none text-sm h-9"
                                onChange={(e) => setFormData({
                                    ...formData,
                                    email: e.target.value
                                })}
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
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        password: e.target.value
                                    })}
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

                    <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition-all duration-200"
                        onClick={(e) => handleSubmit(e)}
                    >
                        Login
                    </button>

                    <span className="block text-center text-sm text-gray-500 my-4">or</span>

                    <button className="w-full text-center" id="googleSignInButton">
                        <BsGoogle className="w-4 h-4 inline-block mr-3" />
                        Sign Up with Google
                    </button>

                    <Link to="/" className="flex items-center justify-center gap-2 mt-4 text-sm text-gray-500 hover:text-green-600 cursor-pointer transition">
                        <Home className="w-3.5 h-3.5" />
                        Back to Home
                    </Link>

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