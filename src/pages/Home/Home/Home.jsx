import Banner from "../Banner/Banner"
import Coupon from "../Coupon/Coupon"
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts"
import TrendingProducts from "../TrendingProducts/TrendingProducts"

const Home = () => {
  return (
    <div>
        <div>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>
            <Coupon></Coupon>

        </div>
    </div>
  )
}

export default Home