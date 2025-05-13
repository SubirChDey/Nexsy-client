import { useContext, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";

const Login = () => {
    const axiosPublic = useAxiosPublic();
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const { userLogin, setUser, googleLogin } = useContext(AuthContext);
    const location = useLocation();
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = e.target;
        const email = form.email.value;
        const password = form.password.value;

        userLogin(email, password)
            .then((result) => {
                const user = result.user;
                setUser(user);
                Swal.fire({
                    icon: "success",
                    title: "Login Successfully",
                    showConfirmButton: false,
                    timer: 1500,
                });
                navigate(location?.state ? location.state : '/');
            })
            .catch(error => {
                if (error?.code === "auth/invalid-credential") {
                    setErrorMessage("Invalid email or password. Please check again!");
                    toast.error("Invalid email or password. Please check again!");
                } else if (error?.code === "auth/too-many-requests") {
                    setErrorMessage("Too many failed attempts. Please try again later!");
                    toast.error("Too many failed attempts. Please try again later!");
                } else {
                    setErrorMessage(`Error: ${error.message}`);
                    toast.error(`Error: ${error.message}`);
                }
            });
    };

    const handleGoogleLogin = () => {
        googleLogin()
            .then((result) => {
                const userInfo = {
                    email: result.user?.email,
                    name: result.user?.displayName,
                    role: 'user',
                };
                axiosPublic.post('/users', userInfo)
                    .then(res => {
                        Swal.fire({
                            position: "top-center",
                            icon: "success",
                            title: "Login Successful",
                            showConfirmButton: false,
                            timer: 1500,
                        });
                        navigate(location?.state ? location.state : '/');
                    });
            })
            .catch(error => toast.error(error.message));
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4 pt-20">
            <div className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8">
                <div className="text-center mb-6">
                    <h1 className="text-4xl font-extrabold text-[#FF6A00]">
                        Welcome Back
                    </h1>

                    <p className="text-gray-600 mt-2">Login to access your personalized dashboard and insights.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input name="email" type="email" placeholder="Enter your email" className="input input-bordered w-full text-gray-800" required />
                    </div>

                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            className="input input-bordered w-full text-gray-800"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-[42px] right-3 text-gray-500 hover:text-gray-700"
                        >
                            {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                        </button>
                        <div className="text-right mt-1">
                            <Link to='/reset' className="text-sm text-blue-600 hover:underline">Forgot password?</Link>
                        </div>
                    </div>

                    {errorMessage && (
                        <div className="text-red-500 text-sm text-center">{errorMessage}</div>
                    )}

                    <button type="submit" className="btn w-full bg-gradient-to-r from-[#FF3600] to-[#FF6A00] text-white hover:bg-gradient-to-l duration-300 border-none rounded-lg hover:scale-105 transition-transform text-sm md:text-base lg:text-lg shadow-lg font-bold mt-2">
                        Login
                    </button>
                </form>

                <div className="divider my-6">OR</div>

                <button onClick={handleGoogleLogin} className="btn w-full flex items-center justify-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700">
                    <img width="24" height="24" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
                    Continue with Google
                </button>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link to='/registration' className="text-blue-600 font-medium hover:underline">Register</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
