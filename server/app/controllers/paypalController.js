const fetch = require('node-fetch');

const paypalController = {
  payment: async (req, res) => {
    try {
      const requestBody1 = new URLSearchParams();
      requestBody1.append('grant_type', 'client_credentials');

      const clientId = 'YOUR_CLIENT_ID';
      const secret = 'YOUR_SECRET';
      const credentials = Buffer.from(`${clientId}:${secret}`).toString('base64');

      const response1 = await fetch('https://api.sandbox.paypal.com/v1/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${credentials}`,
        },
        body: requestBody1,
      });

      const { access_token } = await response1.json();

      const { price, description, return_url, cancel_url } = req.body;

      const requestBody = {
        intent: 'sale',
        payer: {
          payment_method: 'paypal',
        },
        transactions: [
          {
            amount: {
              currency: 'USD',
              total: price,
            },
            description,
          },
        ],
        redirect_urls: {
          return_url,
          cancel_url,
        },
      };

      const response = await fetch('https://api.sandbox.paypal.com/v1/payments/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access_token}`,
        },
        body: JSON.stringify(requestBody),
      });

      const { links } = await response.json();
      const approvalUrl = links.find((link) => link.rel === 'approval_url').href;

      return res.json({ approvalUrl, access_token });
    } catch (error) {
      console.error('Error creating PayPal payment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },

  executePayment: async (req, res) => {
    try {
      const { paymentId, token, PayerID } = req.query;

      const requestBody2 = {
        payer_id: PayerID,
      };

      const response2 = await fetch(
        `https://api.sandbox.paypal.com/v1/payments/payment/${paymentId}/execute`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(requestBody2),
        }
      );

      const { state } = await response2.json();
      if (state === 'approved') {
        return res.json({ message: 'Payment successful' });
      } else {
        return res.json({ message: 'Payment failed' });
      }
    } catch (error) {
      console.error('Error executing PayPal payment:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  },
};

module.exports = paypalController;
