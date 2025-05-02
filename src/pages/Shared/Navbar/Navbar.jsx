import { Link } from "react-router-dom"
import { useContext, useState } from "react"
import { AuthContext } from "../../../providers/AuthProvider"
import { FaUserTie } from "react-icons/fa"

const Navbar = () => {
    const { user, logOut } = useContext(AuthContext)
    const [showMenu, setShowMenu] = useState(false);

    const navOptions = <>
        <li><Link to={'/'}>HOME</Link></li>
        <li><Link to={'/products'}>PRODUCTS </Link></li>
        <li><Link>CONTACT US </Link></li>
        {/* <li><Link>DASHBOARD</Link></li> */}
    </>

    const handleClickOutside = () => setShowMenu(false);

    return (
        <div className="">
            <div className="navbar bg-base-100 shadow-sm fixed z-50">
                <div className="navbar-start">
                    <div className="dropdown">
                        <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /> </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow">
                            {navOptions}
                        </ul>
                    </div>
                    <a className="btn btn-ghost text-xl">Nexsy</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        {navOptions}
                    </ul>
                </div>                
                <div className="navbar-end">
                    {/* {
                        user && user?.email ? <div className="flex gap-2 items-center"> <img className="rounded-full w-10 h-10 hidden md:block" 
                            src={user?.photoURL} alt="" /> <Link to='/' className="btn text-white bg-gradient-to-r from-[#FF3600] to-[#ff3700d7]  hover:bg-[#ff3700b4]" onClick={logOut}> Log Out</Link></div> : <div className="flex gap-2 items-center"><FaUserTie className="w-10 h-10 hidden md:block"></FaUserTie> <Link to='/login' className="btn btn-success text-white bg-gradient-to-r from-[#FF3600] to-[#ff3700d7] hover:bg-[#ff3700b4]">Login</Link></div>
                    } */}
                    {user && user.email ? (
                        <div className="flex items-center gap-2">
                            <img
                                onClick={() => setShowMenu(!showMenu)}
                                className="rounded-full w-10 h-10 cursor-pointer"
                                src={user?.photoURL}
                                alt="User"
                            />                            
                            {showMenu && (
                                <div
                                    className="absolute top-12 right-0 flex flex-col bg-white  rounded-lg shadow-lg w-40 z-50"
                                    onMouseLeave={handleClickOutside}
                                >
                                    <span className="px-4 py-2 text-sm font-semibold  cursor-default">
                                        {user.displayName || "User"}
                                    </span>
                                    <Link
                                        to="/dashboard"
                                        className="px-4 py-2 hover:bg-gray-100 text-sm "
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => {
                                            logOut();
                                            setShowMenu(false);
                                        }}
                                        className="px-4 py-2 hover:bg-gray-100 text-sm text-left cursor-pointer"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <FaUserTie className="w-10 h-10 hidden md:block" />
                            <Link
                                to="/login"
                                className="btn btn-success text-white bg-gradient-to-r from-[#FF3600] to-[#ff3700d7] hover:bg-[#ff3700b4]"
                            >
                                Login
                            </Link>
                        </div>
                    )}


                </div>
            </div>
        </div>
    )
}

export default Navbar