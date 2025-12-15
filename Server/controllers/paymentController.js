import axios from "axios";

const PAYPAL_BASE = "https://api-m.sandbox.paypal.com"; // live: api-m.paypal.com

const getAccessToken = async () => {
  const res = await axios.post(
    `${PAYPAL_BASE}/v1/oauth2/token`,
    "grant_type=client_credentials",
    {
      auth: {
        username: process.env.PAYPAL_CLIENT_ID,
        password: process.env.PAYPAL_SECRET,
      },
    }
  );
  return res.data.access_token;
};

// CREATE ORDER
const createOrder = async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    const token = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders`,
      {
        intent: "CAPTURE",
        purchase_units: [
          {
            description: `Appointment Fee: ${appointmentId}`,
            amount: {
              currency_code: "USD",
              value: amount,
            },
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// CAPTURE ORDER
const captureOrder = async (req, res) => {
  try {
    const { orderID } = req.params;
    const token = await getAccessToken();

    const response = await axios.post(
      `${PAYPAL_BASE}/v2/checkout/orders/${orderID}/capture`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { createOrder, captureOrder };
