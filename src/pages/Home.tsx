import CategorySection from '../components/CategorySection';
import HeroSection from '../components/HeroSection';
import ProductSection from '../components/ProductSection';
import TopSellingStoreSection from '../components/StoreSection';
import TopSellingProductSection from '../components/TopSellingProductSection';

const Home = () => {
    return (
        <div >
            <HeroSection />
            <div className="container mx-auto px-5">
                <CategorySection />
                <TopSellingStoreSection />
                <TopSellingProductSection />
                <ProductSection />
            </div>

        </div>
    );
}

export default Home;
