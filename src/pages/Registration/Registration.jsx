import { useContext, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { AuthContext } from "../../providers/AuthProvider";
import useAxiosPublic from "../../hooks/useAxiosPublic";
import Lottie from "lottie-react";
import signupAnimation from "../../assets/lotties/signup-tech.json";

const Registration = () => {
  const axiosPublic = useAxiosPublic();
  const { createNewUser, setUser, googleLogin, manageProfile } = useContext(AuthContext);
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const form = e.target;
    const name = form.name.value;
    const photo = form.photo.value;
    const email = form.email.value;
    const password = form.password.value;

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z]).{6,}$/;

    if (!passwordRegex.test(password)) {
      setError("The password must be at least 6 characters long and include at least one uppercase letter and one lowercase letter.");
      toast.error('Please, fill up password requirements');
      return;
    }

    createNewUser(email, password)
      .then(result => {
        const user = result.user;
        manageProfile(name, photo);
        setUser(user);
        const userInfo = { name, email, photo,  role: 'user', isSubscribed: false };
        axiosPublic.post('/users', userInfo)
          .then(res => {
            if (res.data.insertedId) {
              Swal.fire({
                position: "top-center",
                icon: "success",
                title: "Registration Successful",
                showConfirmButton: false,
                timer: 1500
              });
              navigate(location?.state ? location.state : '/');
            }
          });
      });
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
        const userInfo = {
          email: result.user?.email,
          name: result.user?.displayName,
          photo: result.user?.photoURL,
          role: 'user',
          isSubscribed: false,
        };
        axiosPublic.post('/users', userInfo)
          .then(res => {
            // console.log(res)
            Swal.fire({
              position: "top-center",
              icon: "success",
              title: "Registration Successful",
              showConfirmButton: false,
              timer: 1500
            });
            navigate(location?.state ? location.state : '/');
          });
      })
      .catch(error => toast.error(error.message));
  };

  return (
    <div className="lg:flex items-center pt-[40px] justify-evenly w-11/12 max-w-[1340px] mx-auto mb-10 bg-white rounded-xl shadow-lg">
      {/* Lottie Animation Section */}
      <div className="flex-1 hidden lg:block p-10">
        <Lottie animationData={signupAnimation} loop={true} />
      </div>

      {/* Form Section */}
      <div className="flex-1 p-10">
        <div className="md:w-10/12 mx-auto text-center">
          <h1 className="text-4xl font-extrabold text-indigo-600">
            Create Account
          </h1>
          <p className="text-gray-700 mt-2 mb-6">Join now to get personalized content and game insights tailored just for you.</p>

          <div className="bg-gray-50 p-6 rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input name="name" type="text" placeholder="Enter your name" className="input input-bordered w-full placeholder-gray-400 text-gray-800" required />
              </div>
              <div>
                <input name="email" type="email" placeholder="Enter your email" className="input input-bordered w-full placeholder-gray-400 text-gray-800" required />
              </div>
              <div>
                <input name="photo" type="text" placeholder="Profile picture URL" className="input input-bordered w-full placeholder-gray-400 text-gray-800" required />
              </div>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input input-bordered w-full placeholder-gray-400 text-gray-800"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-10 right-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                </button>
              </div>

              {error && <p className="text-red-600 text-sm">{error}</p>}
                 
              <button type="submit" className="btn w-full bg-indigo-600 text-white hover:bg-gradient-to-l duration-300 border-none rounded-lg hover:scale-105 transition-transform text-sm md:text-base lg:text-lg shadow-lg font-bold mt-2">
                Create Account
              </button>             

            </form>

            <div className="divider my-6">OR</div>

            <button onClick={handleGoogleLogin} className="btn w-full flex justify-center items-center gap-3 bg-white border border-gray-300 hover:bg-gray-100 text-gray-700">
              <img width="24" height="24" src="https://img.icons8.com/color/48/google-logo.png" alt="google-logo" />
              Continue with Google
            </button>

            <p className="mt-4 text-center text-sm text-gray-600">
              Already have an account? <Link to="/login" className="text-blue-600 font-medium hover:underline">Login</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
