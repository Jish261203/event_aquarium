import { IEvent } from "@/lib/database/models/event.model";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

import { loadStripe } from "@stripe/stripe-js";
import { checkoutOrder } from "@/lib/actions/order.action";

loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const Checkout = ({ event, userId }: { event: IEvent; userId: string }) => {
  const [quantity, setQuantity] = useState(1);
  const maxTickets = 5;

  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);
    if (query.get("success")) {
      console.log("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      console.log(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);

  const totalPrice = event.isFree
    ? "0"
    : (parseFloat(event.price) * quantity).toFixed(2);

  const onCheckout = async () => {
    const order = {
      eventTitle: event.title,
      eventId: event._id,
      price: totalPrice,
      isFree: event.isFree,
      buyerId: userId,
      quantity: quantity,
    };

    await checkoutOrder(order);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onCheckout();
  };

  const handleIncrement = () => {
    if (quantity < maxTickets) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          {/* Quantity Selector */}
          <div className="flex items-center gap-4 p-4 bg-grey-50 rounded-2xl">
            <label className="font-semibold text-grey-600">Tickets:</label>
            <div className="flex items-center gap-2 border border-grey-200 rounded-lg">
              <button
                type="button"
                onClick={handleDecrement}
                disabled={quantity === 1}
                className="px-3 py-2 text-lg hover:bg-grey-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                −
              </button>
              <span className="px-4 py-2 font-semibold text-center w-12">
                {quantity}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                disabled={quantity === maxTickets}
                className="px-3 py-2 text-lg hover:bg-grey-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                +
              </button>
            </div>
            <span className="text-sm text-grey-600">(Max {maxTickets})</span>
          </div>

          {/* Price Display */}
          <div className="flex justify-between items-center p-4 bg-grey-50 rounded-2xl">
            <span className="font-semibold text-grey-600">Total Price:</span>
            <span className="text-2xl font-bold text-primary-500">
              ₹{totalPrice}
            </span>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            size="lg"
            className="button w-full bg-gradient-to-r from-purple-800 via-blue-900 to-gray-900 text-white border-blue-500 transition-all duration-300 hover:bg-gray-800 hover:text-pink-500"
          >
            {event.isFree ? "Get Tickets" : "Buy Tickets"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
