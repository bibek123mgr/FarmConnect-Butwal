import CategorySection from '../components/CategorySection';
import ProductSection from '../components/ProductSection';

const Home = () => {
    return (
        <div >
            <div className="container mx-auto px-5">
                <h1>Home</h1>
                <CategorySection />
                <ProductSection />
            </div>

        </div>
    );
}

export default Home;
