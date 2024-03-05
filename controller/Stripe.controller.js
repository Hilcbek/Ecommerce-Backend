// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.
import asyncHandler from "express-async-handler";
import Stripe from "stripe";
import dotenv from "dotenv";
dotenv.config();
const stripe = Stripe(process.env.STRIPE_KEY);
export let PaymentController = asyncHandler(async (req, res, next) => {
  try {
    let line_items = req.body.products.map((product) => {
      return {
        price_data: {
          currency: "usd",
          product_data: {
            name: product?.title,
            images: [product?.img?.[0]],
            description: product.desc,
            metadata: {
              id: product._id,
            },
          },
          unit_amount: product.new_price * 100,
        },
        quantity: product.amount || 1,
      };
    });
    const session = await stripe.checkout.sessions.create({
      shipping_address_collection: {
        allowed_countries: ["US", "CA", "ET"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0,
              currency: "usd",
            },
            display_name: "Free shipping",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 5,
              },
              maximum: {
                unit: "business_day",
                value: 7,
              },
            },
          },
        },
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 1500,
              currency: "usd",
            },
            display_name: "Next day air",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 1,
              },
              maximum: {
                unit: "business_day",
                value: 1,
              },
            },
          },
        },
      ],
      phone_number_collection: {
        enabled: true,
      },
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: "https://habesha-market-hub.vercel.app/success",
      cancel_url: "https://habesha-market-hub.vercel.app/",
    });

    res.send({ url: session.url });
  } catch (error) {
    next(error);
  }
});
