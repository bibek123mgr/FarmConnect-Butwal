import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/hooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { IPaymentMethod, verifyOnlinePaymentStatus } from '../features/order/OrderApi';
import toast from 'react-hot-toast';
import { clearMessage } from '../features/order/OrderSlice';

const PaymentSuccess = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [searchParams] = useSearchParams();
    const { message, loading, error, success } = useAppSelector((state) => state.order);
    const encodedData = searchParams.get("data");
    const decodedData = atob(encodedData || "");
    const paymentData = JSON.parse(decodedData);
    const amount = paymentData?.total_amount || 0;
    const gatewayReferenceId = paymentData?.transaction_uuid;
    const paymentMethod = IPaymentMethod.ESEWA;

    const payload = {
        amount,
        gatewayReferenceId,
        paymentMethod
    }


    useEffect(() => {
        dispatch(verifyOnlinePaymentStatus(payload));
    }, [])

    useEffect(() => {
        if (loading) return;

        if (success && message) {
            toast.success(message);
            dispatch(clearMessage());
            setTimeout(() => {
                navigate("/orders");
            }, 2000);
        }

        if (error && message) {
            toast.error(message);
            dispatch(clearMessage());
        }
    }, [loading, success, error, message, dispatch]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
                {/* Status Icon */}
                <div className="text-center mb-6">
                    {loading && (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4">
                                <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Verifying Payment</h2>
                            <p className="text-gray-500 text-sm mt-2">Please wait while we confirm your transaction...</p>
                        </>
                    )}

                    {success && (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Payment Successful!</h2>
                            <p className="text-gray-500 text-sm mt-2">{message || "Your payment has been verified successfully."}</p>
                        </>
                    )}

                    {error && (
                        <>
                            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800">Payment Failed</h2>
                            <p className="text-gray-500 text-sm mt-2">{message || "We couldn't verify your payment. Please try again."}</p>
                        </>
                    )}
                </div>

                {/* Loading Progress Bar */}
                {loading && (
                    <div className="mb-6">
                        <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                )}

                {/* Action Buttons */}
                {!loading && (
                    <div className="space-y-3">
                        {success ? (
                            <button
                                onClick={() => navigate('/orders')}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded transition-colors"
                            >
                                View My Orders
                            </button>
                        ) : error && (
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded transition-colors"
                            >
                                Try Again
                            </button>
                        )}
                    </div>
                )}

                {/* Redirect Message */}
                {!loading && (
                    <p className="text-center text-xs text-gray-400 mt-4">
                        Redirecting...
                    </p>
                )}
            </div>
        </div>

    );
}

export default PaymentSuccess;
