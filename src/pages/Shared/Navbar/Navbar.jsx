import { NavLink, Link } from "react-router-dom";
import { useContext, useEffect, useRef, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaUserTie } from "react-icons/fa";
import useAxiosPublic from "../../../hooks/useAxiosPublic";
import { useQuery } from "@tanstack/react-query";
import logoimg from "../../../assets/logoimg.webp";

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef();
  const axiosPublic = useAxiosPublic();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: roleData = {}, isLoading } = useQuery({
    queryKey: ["userRole", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosPublic.get(
        `${import.meta.env.VITE_API_URL}/users/role/${user.email}`
      );
      return res.data;
    },
  });

  const dashboardRoute =
    roleData.role === "admin"
      ? "/dashboard/statistics"
      : roleData.role === "moderator"
      ? "/dashboard/productQueue"
      : "/dashboard/userProfile";

  const navOptions = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "text-[#3F51B5] font-semibold underline"
              : "hover:text-[#009688] transition"
          }
        >
          HOME
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/products"
          className={({ isActive }) =>
            isActive
              ? "text-[#3F51B5] font-semibold underline"
              : "hover:text-[#009688] transition"
          }
        >
          PRODUCTS
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            isActive
              ? "text-[#3F51B5] font-semibold underline"
              : "hover:text-[#009688] transition"
          }
        >
          CONTACT US
        </NavLink>
      </li>
    </>
  );

  return (
    <div className="bg-[#FAFAFA] shadow-sm fixed w-full z-50 border-b border-[#E0E0E0]">
      <div className="navbar max-w-7xl mx-auto px-4 py-2">
        {/* Navbar Start */}
        <div className="navbar-start">
          {/* Mobile Dropdown */}
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-[#212121]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </label>
            <ul className="menu menu-sm dropdown-content mt-3 z-[60] p-2 shadow bg-white rounded-box w-52">
              {navOptions}
            </ul>
          </div>

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-indigo-700 font-bold text-2xl">
            <img src={logoimg} alt="Nexsy" className="w-6 h-6" />
            Nexsy
          </Link>
        </div>

        {/* Navbar Center */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-4 font-medium text-[#212121]">
            {navOptions}
          </ul>
        </div>

        {/* Navbar End */}
        <div className="navbar-end relative">
          {user?.email ? (
            <div className="relative flex items-center" ref={menuRef}>
              <img
                src={user.photoURL}
                alt="User"
                onClick={() => setShowMenu(!showMenu)}
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#3F51B5] hover:shadow-md transition"
              />
              {showMenu && (
                <div className="absolute top-14 right-0 bg-white border border-gray-200 shadow-lg rounded-md w-44 z-[60]">
                  <div className="px-4 py-2 text-sm font-semibold border-b text-[#212121]">
                    {user.displayName || "User"}
                  </div>
                  <Link
                    to={dashboardRoute}
                    className="block px-4 py-2 text-sm hover:bg-[#F5F5F5] text-[#3F51B5]"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      logOut();
                      setShowMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-[#FBE9E7] text-[#F44336]"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <FaUserTie className="w-8 h-8 text-[#3F51B5] hidden md:block" />
              <Link
                to="/login"
                className="btn btn-sm bg-[#3F51B5] hover:bg-[#303F9F] text-white px-4 font-semibold"
              >
                Login
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
