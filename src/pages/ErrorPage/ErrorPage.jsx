import { useEffect } from "react";
import { NavLink } from 'react-router-dom';

const ErrorPage = () => {
    useEffect(() => {
        document.title = "Error | Nexsy";
    }, []);
    return (
        <div className="bg-[url('../error.jpg')] bg-cover h-screen w-full">
            <div className="text-center items-center pt-24 justify-center min-h-[calc(100vh-20px)]">
                <div className=" h-64 w-full text-black">
                    <p className='text-2xl text-yellow-800 font-semibold'>ERROR</p>
                    <h2 className='text-9xl items-center text-center p-6 font-bold text-red-800'>
                        404
                    </h2>
                    <h3 className='p-2 text-xl '>This page is outside of the universe</h3>
                    <p className='p-2 text-yellow-800'>The page you are trying to access doesnt exist or has been moved. <br />
                        Try going back to our homepage.</p>
                        <NavLink to={'/'}><button className='btn btn-warning mt-6'>Back to Home </button></NavLink>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage