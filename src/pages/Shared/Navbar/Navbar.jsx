import { NavLink, Link } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../../providers/AuthProvider";
import { FaUserTie } from "react-icons/fa";

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext);
    const [showMenu, setShowMenu] = useState(false);
    const handleClickOutside = () => setShowMenu(false);

    const navOptions = (
        <>
            <li>
                <NavLink
                    to="/"
                    className={({ isActive }) =>
                        isActive
                            ? "text-[#3F51B5] font-semibold underline"
                            : "hover:text-[#009688] transition-colors duration-200"
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
                            : "hover:text-[#009688] transition-colors duration-200"
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
                            : "hover:text-[#009688] transition-colors duration-200"
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
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content mt-3 z-50 p-2 shadow bg-white rounded-box w-52"
                        >
                            {navOptions}
                        </ul>
                    </div>

                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-[#FF5722] tracking-tight">
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
                    {user && user.email ? (
                        <div className="flex items-center gap-2 relative">
                            <img
                                src={user?.photoURL}
                                alt="User"
                                onClick={() => setShowMenu(!showMenu)}
                                className="w-10 h-10 rounded-full cursor-pointer border-2 border-[#3F51B5] hover:shadow-md transition-shadow duration-200"
                            />
                            {showMenu && (
                                <div
                                    className="absolute top-14 right-0 bg-white border border-gray-200 shadow-lg rounded-md w-44 z-50"
                                    onMouseLeave={handleClickOutside}
                                >
                                    <div className="px-4 py-2 text-sm font-semibold border-b text-[#212121]">
                                        {user.displayName || "User"}
                                    </div>
                                    <Link
                                        to="/dashboard"
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
                                className="btn btn-sm bg-[#3F51B5] hover:bg-[#303F9F] text-white px-4 font-semibold transition"
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
