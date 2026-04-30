const CategoryCardSkeleton = () => {
    return (
        <div className="flex flex-col items-center gap-2 animate-pulse">

            <div className="bg-gray-200 rounded-2xl px-4 py-5 md:px-6 md:py-6 flex flex-col items-center justify-center min-w-[120px] md:min-w-[140px]">

                <div className="w-14 h-14 md:w-18 md:h-18"></div>

                <div className="mt-3 w-20 h-3 bg-gray-300 rounded"></div>

            </div>

        </div>
    );
};

export default CategoryCardSkeleton;