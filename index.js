const express = require('express');
const app = express();
app.use(express.json());
app.post('/create-payment', (req, res) => {
  const order = req.body;
  // TODO: 在這裡串你的付款系統，建立付款會話，回傳付款導向 URL
  const paymentUrl = 'https://example.com/mock-payment?orderId=demo-' + Date.now();
  res.json({ paymentUrl });
});
app.listen(process.env.PORT || 3000, () => console.log('Listening'));
