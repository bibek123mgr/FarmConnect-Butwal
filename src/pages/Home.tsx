import CategorySection from '../components/CategorySection';
import HeroSection from '../components/HeroSection';
import Newsletter from '../components/NewsLetter';
import ProductSection from '../components/ProductSection';

const Home = () => {
    return (
        <div >
            <HeroSection />
            <div className="container mx-auto px-5">
                <CategorySection />
                <ProductSection />
w            </div>

        </div>
    );
}

export default Home;
