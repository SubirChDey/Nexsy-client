import { Link } from "react-router-dom"

const Banner = () => {
    return (
        <div className="hero min-h-screen relative">
            <video
                className="absolute w-full h-full object-cover"
                src="/banner.mp4"
                autoPlay
                loop
                muted
            ></video>
            <div className="hero-content text-white text-center relative z-20">
                <div className="md:w-4/5">
                    <p className="text-[#FF3600] font-bold text-lg"> Welcome To Nexsy</p>
                    <h1 className="mb-5 md:mb-8 text-5xl md:text-7xl font-bold">Discover and Launch Tech Products</h1>
                    <p className="mb-5 text-lg">

                        Join a community of innovators discovering, sharing, and launching the next big <br /> thing in tech—from AI tools to mobile apps and beyond.
                    </p>
                    <Link to={'/products'}>
                        <button className="mt-6 px-6 py-3 font-semibold bg-gradient-to-r from-[#FF3600] to-[#ff3700d7] text-white hover:bg-gradient-to-l  duration-300 border-none rounded-lg hover:scale-105 transition-transform text-sm md:text-base lg:text-lg">View Products</button>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Banner