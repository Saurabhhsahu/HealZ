import React, { useEffect, useRef } from "react";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID; // sandbox or live
const BACKEND_URI = import.meta.env.VITE_BACKEND_URI;

const Payment = ({ amount, appointmentId, onSuccess, onError, onCancel }) => {
  const paypalRef = useRef(null);

  useEffect(() => {
    if (!PAYPAL_CLIENT_ID) {
      onError("PayPal client ID not configured. Please set VITE_PAYPAL_CLIENT_ID in your .env file.");
      return;
    }

    if (window.paypal) {
      renderButtons();
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
    script.async = true;
    script.onload = renderButtons;
    script.onerror = () => onError("PayPal SDK failed to load");
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [amount]);

  const renderButtons = () => {
    window.paypal.Buttons({
      createOrder: async () => {
        const res = await fetch(`${BACKEND_URI}/api/paypal/create-order`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount,
            appointmentId,
          }),
        });

        const data = await res.json();
        return data.id;
      },

      onApprove: async (data) => {
        const res = await fetch(
          `${BACKEND_URI}/api/paypal/capture-order/${data.orderID}`,
          { method: "POST" }
        );
        const details = await res.json();
        onSuccess(details);
      },

      onError: (err) => {
        console.error(err);
        onError(err);
      },

      onCancel: () => {
        onCancel();
      },
    }).render(paypalRef.current);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-center mb-2">
          Complete Your Payment
        </h2>

        <p className="text-center mb-6">
          Pay <span className="font-bold text-green-600">${amount}</span> for
          appointment <b>{appointmentId}</b>
        </p>

        <div ref={paypalRef}></div>

        <button
          onClick={onCancel}
          className="w-full mt-4 text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
