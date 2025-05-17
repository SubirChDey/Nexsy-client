import Banner from "../Banner/Banner"
import Coupon from "../Coupon/Coupon"
import CustomerReviews from "../CustomerReviews/CustomerReviews"
import FAQ from "../FAQ/FAQ"
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts"
import Newsletter from "../Newsletter/Newsletter"
import TrendingProducts from "../TrendingProducts/TrendingProducts"

const Home = () => {
  return (
    <div>
        <div>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>
            <Coupon></Coupon>
            <CustomerReviews></CustomerReviews>
            <FAQ></FAQ>
            <Newsletter></Newsletter>

        </div>
    </div>
  )
}

export default Home