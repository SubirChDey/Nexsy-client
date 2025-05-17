import { useContext } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "../providers/AuthProvider";
import {
    FaChartBar,
    FaUsersCog,
    FaTags,
    FaClipboardList,
    FaFlag,
    FaUser,
    FaPlusSquare,
    FaBoxes,
    FaHome,
    FaBoxOpen,
    FaSignOutAlt,
} from "react-icons/fa";
import useAxiosSecure from "../hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useAdmin from "../hooks/useAdmin";

const Dashboard = () => {
    const { user, logOut } = useContext(AuthContext);
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();

    const { data: currentUser = {}, isLoading } = useQuery({
        queryKey: ["currentUser", user?.email],
        enabled: !!user?.email,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            return res.data;
        },
    });

    if (isLoading) {
        return <div className="text-center py-10 text-lg text-gray-600">Loading Dashboard...</div>;
    }

    const navLinkClass = ({ isActive }) =>
        `px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all duration-150 ${isActive
            ? "bg-indigo-700 text-white"
            : "text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
        }`;

    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col bg-gray-50">
                <label htmlFor="dashboard-drawer" className="btn bg-indigo-700 text-white drawer-button lg:hidden m-4">
                    Open Menu
                </label>
                <Outlet />
            </div>

            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <div className="w-64 min-h-full bg-white shadow-xl border-r border-gray-200 flex flex-col justify-between">
                    {/* Top Section */}
                    <div>
                        <div className="px-6 py-6 bg-indigo-700 text-white">
                            <h3 className="text-2xl font-bold">Nexsy</h3>
                            <p className="text-sm mt-1 text-indigo-100">
                                All-in-One Dashboard for Tech Product Launches
                            </p>
                        </div>

                        <ul className="menu px-4 py-4 space-y-1 text-base">
                            
                            {currentUser?.role === "admin" && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/statistics" className={navLinkClass}>
                                            <FaChartBar /> Statistics
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/manageUsers" className={navLinkClass}>
                                            <FaUsersCog /> Manage Users
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/manageCoupons" className={navLinkClass}>
                                            <FaTags /> Manage Coupons
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {currentUser?.role === "moderator" && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/productQueue" className={navLinkClass}>
                                            <FaClipboardList /> Product Review Queue
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/reported" className={navLinkClass}>
                                            <FaFlag /> Reported Contents
                                        </NavLink>
                                    </li>
                                </>
                            )}

                            {currentUser?.role === "user" && (
                                <>
                                    <li>
                                        <NavLink to="/dashboard/userProfile" className={navLinkClass}>
                                            <FaUser /> My Profile
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/addProduct" className={navLinkClass}>
                                            <FaPlusSquare /> Add Product
                                        </NavLink>
                                    </li>
                                    <li>
                                        <NavLink to="/dashboard/myProducts" className={navLinkClass}>
                                            <FaBoxes /> My Products
                                        </NavLink>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>

                    {/* Bottom Section */}
                    <div className="px-4 py-4 border-t border-gray-200 space-y-2 flex flex-col">
                        <NavLink to="/" className={navLinkClass}>
                            <FaHome /> Home
                        </NavLink>
                        <NavLink to="/products" className={navLinkClass}>
                            <FaBoxOpen /> Products
                        </NavLink>
                        <button
                            onClick={() => {
                                logOut();
                                navigate("/login");
                            }}
                            className="w-full text-left px-4 py-2 rounded-md text-sm font-medium text-red-600 hover:bg-red-50 flex items-center gap-2 transition-all duration-150"
                        >
                            <FaSignOutAlt /> Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
