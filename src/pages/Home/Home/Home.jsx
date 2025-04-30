import Banner from "../Banner/Banner"
import FeaturedProducts from "../FeaturedProducts/FeaturedProducts"
import TrendingProducts from "../TrendingProducts/TrendingProducts"

const Home = () => {
  return (
    <div>
        <div>
            <Banner></Banner>
            <FeaturedProducts></FeaturedProducts>
            <TrendingProducts></TrendingProducts>

        </div>
    </div>
  )
}

export default Home