const StoreCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">

            {/* Image skeleton */}
            <div className="h-40 w-full bg-gray-200" />

            {/* Body */}
            <div className="p-4">

                {/* Title */}
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />

                {/* Description */}
                <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                <div className="h-3 bg-gray-200 rounded w-5/6 mb-4" />

                {/* Address */}
                <div className="flex items-center gap-2 mb-4">
                    <div className="h-3 w-3 bg-gray-200 rounded-full" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>

                {/* Button */}
                <div className="flex justify-end">
                    <div className="h-8 w-8 bg-gray-200 rounded-full" />
                </div>
            </div>
        </div>
    );
};

export default StoreCardSkeleton;