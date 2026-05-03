import CategorySection from '../components/CategorySection';
import HeroSection from '../components/HeroSection';
import ProductSection from '../components/ProductSection';

const Home = () => {
    return (
        <div >
            <HeroSection />
            <div className="container mx-auto px-5">
                <CategorySection />
                <ProductSection />
            </div>

        </div>
    );
}

export default Home;
