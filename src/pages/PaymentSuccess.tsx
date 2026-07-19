import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";

import { useAppDispatch, useAppSelector } from "../hooks/hooks";
import {
  IPaymentMethod,
  verifyOnlinePaymentStatus,
} from "../features/order/OrderApi";
import { clearMessage } from "../features/order/OrderSlice";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();

  const { message, loading, error, success } = useAppSelector(
    (state) => state.order
  );

  // Build payload based on payment gateway
  const getPaymentPayload = () => {
    // =======================
    // Khalti
    // =======================
    if (searchParams.has("pidx")) {
      return {
        amount: Number(searchParams.get("total_amount") || 0),
        gatewayReferenceId:
          searchParams.get("pidx"),
        paymentMethod: IPaymentMethod.KHALTI,
      };
    }

    // =======================
    // eSewa
    // =======================
    if (searchParams.has("data")) {
      try {
        const encodedData = searchParams.get("data")!;
        const decodedData = atob(encodedData);
        const paymentData = JSON.parse(decodedData);

        return {
          amount: Number(paymentData.total_amount || 0),
          gatewayReferenceId: paymentData.transaction_uuid,
          paymentMethod: IPaymentMethod.ESEWA,
        };
      } catch (err) {
        console.error("Invalid eSewa response", err);
        return null;
      }
    }

    return null;
  };

  const payload = getPaymentPayload();

  // Verify payment
  useEffect(() => {
    if (!payload) {
      toast.error("Invalid payment response.");
      return;
    }

    dispatch(verifyOnlinePaymentStatus(payload));
  }, [dispatch]);

  // Handle verification result
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
  }, [loading, success, error, message, dispatch, navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <div className="text-center mb-6">
          {loading && (
            <>
              <div className="w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-16 h-16 text-gray-400 animate-spin"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    strokeWidth="3"
                    stroke="currentColor"
                    strokeOpacity="0.25"
                  />
                  <path
                    d="M22 12a10 10 0 00-10-10"
                    strokeWidth="3"
                    stroke="currentColor"
                  />
                </svg>
              </div>

              <h2 className="text-xl font-semibold">
                Verifying Payment...
              </h2>

              <p className="text-gray-500 mt-2">
                Please wait while we verify your payment.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;