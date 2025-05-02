import { NavLink, Outlet } from "react-router-dom"

const Dashboard = () => {
    return (
        <div className="flex">
            <div className="w-64 min-h-screen bg-slate-400">
                <div>
                    <h3 className="text-2xl pt-4 pb-2 px-4">Nexsy</h3>
                    <p className="px-4">All-in-One Dashboard for Tech Product Launches</p>
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
            <div>
                <Outlet></Outlet>
            </div>

            {/* <div className="drawer lg:drawer-open">
                <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content flex flex-col items-center justify-center">

                    <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button lg:hidden">
                        Open drawer
                    </label>
                </div>
                <div className="drawer-side">
                    <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                    <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">

                        <li><a>Sidebar Item 1</a></li>
                        <li><a>Sidebar Item 2</a></li>
                    </ul>
                </div>
            </div> */}
        </div>
    )
}

export default Dashboard