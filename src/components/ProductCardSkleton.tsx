const ProductCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">

            <div className="aspect-square bg-gray-200 p-4 relative">
            </div>

            <div className="p-4 space-y-3">

                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>

                <div className="h-3 bg-gray-300 rounded w-1/3"></div>

                <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="w-4 h-4 bg-gray-300 rounded"></div>
                    ))}
                    <div className="w-10 h-3 bg-gray-300 rounded ml-2"></div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex gap-2 items-center">
                        <div className="w-16 h-5 bg-gray-300 rounded"></div>
                        <div className="w-12 h-4 bg-gray-300 rounded"></div>
                        <div className="w-8 h-4 bg-gray-300 rounded"></div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ProductCardSkeleton;