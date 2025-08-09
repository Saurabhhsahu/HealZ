import React, { useEffect } from 'react';

const Payment = ({ amount, appointmentId, onSuccess, onError, onCancel }) => {

  useEffect(() => {
    // Add PayPal script to the document
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=Ae8t5E1ogliPyUq9MxC-24PkX7S34oG7qrjCfXtuBroKPM9lx32iBqZhMEfvVmQKfcari9wSfnw0FI2-&currency=USD`; // Replace with your client ID
    script.addEventListener('load', () => {
      // Script loaded, render PayPal button
      window.paypal.Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: `Appointment Fee: ${appointmentId}`,
              amount: {
                value: amount,
                currency_code: 'USD'
              }
            }]
          });
        },
        onApprove: (data, actions) => {
          return actions.order.capture().then(details => {
            onSuccess(details);
          });
        },
        onError: (err) => {
          onError(err);
        },
        onCancel: (data) => {
          onCancel(data);
        }
      }).render('#paypal-button-container');
    });
    document.body.appendChild(script);

    // Cleanup script on component unmount
    return () => {
      document.body.removeChild(script);
    }
  }, [amount, appointmentId, onSuccess, onError, onCancel]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 shadow-2xl max-w-sm w-full">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-2">Complete Your Payment</h2>
        <p className="text-center text-gray-600 mb-6">You are paying <span className="font-bold text-lg text-[#00bf60]">${amount}</span> for your appointment.</p>
        <div id="paypal-button-container"></div>
        <button
          onClick={onCancel}
          className="w-full mt-4 text-center text-sm text-gray-500 hover:text-gray-700"
        >
          Cancel Payment
        </button>
      </div>
    </div>
  );
};

export default Payment;
