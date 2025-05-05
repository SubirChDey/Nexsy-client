import { NavLink, Outlet } from "react-router-dom";

const Dashboard = () => {
    return (
        <div className="drawer lg:drawer-open">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            
            <div className="drawer-content flex flex-col">
                <label htmlFor="dashboard-drawer" className="btn btn-primary drawer-button lg:hidden m-4">
                    Open Menu
                </label>
                <Outlet />
            </div>

            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <div className="w-64 min-h-full bg-slate-400 text-base-content">
                    <div className="px-4 py-4">
                        <h3 className="text-2xl">Nexsy</h3>
                        <p>All-in-One Dashboard for Tech Product Launches</p>
                    </div>
                    <ul className="menu p-4">
                        <li>
                            <NavLink to={'/dashboard/userProfile'}>My Profile</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/dashboard/addProduct'}>Add Product</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/dashboard/myProducts'}>My Products</NavLink>
                        </li>
                    </ul>
                    <div className="divider"></div>
                    <ul className="menu p-4">
                        <li>
                            <NavLink to={'/'}>Home</NavLink>
                        </li>
                        <li>
                            <NavLink to={'/products'}>Products</NavLink>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
