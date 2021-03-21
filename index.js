const express = require("express");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const app = express();
app.use(express.json());

const razorpay = new Razorpay({
  key_id: "rzp_test_xOJNE2jWn0mRb2",
  key_secret: "VrMMi5d5GfTGIt8gK09pdAdX",
});

app.get("/", (req, res) => res.send("Razorpay Server"));

app.post("/createOrder", async (req, res) => {
  try {
    const order = await razorpay.orders.create({
      amount: req.body.amount,
      currency: req.body.currency,
    });
    res.send(order);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.post("/verifyPayment", (req, res) => {
  try {
    const { orderID, transaction } = req.body;
    const generatedSignature = crypto
      .createHmac("sha256", process.env.SECRETKEY)
      .update(`${orderID}|${transaction.razorpay_payment_id}`)
      .digest("hex");

    res.send({ validSignature: generatedSignature === transaction.razorpay_signature });
  } catch (e) {
    res.status(400).send(e);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Razorpay Server listening at Port ${port}`));

// key id rzp_test_xOJNE2jWn0mRb2
//key secret VrMMi5d5GfTGIt8gK09pdAdX
