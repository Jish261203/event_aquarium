import { Schema, model, models } from "mongoose";

export interface IOrder extends Document {
	createdAT: Date;
	stripeId: string;
	totalAmount: string;
	event: {
		_id: string;
		title: string;
	};
	buyer: {
		_id: string;
		firstname: string;
		lastname: string;
	};
}

export type IOrderItem = {
	_id: string;
	totalAmount: string;
	createdAT: Date;
	eventTitle: string;
	eventId: string;
	buyer: string;
};

const OrderSchema = new Schema({
	createdAT: {
		type: Date,
		default: Date.now,
	},
	stripeId: {
		type: String,
		required: true,
		unique: true,
	},
	totalAmount: {
		type: String,
	},
	event: {
		type: Schema.Types.ObjectId,
		ref: "Event",
	},
	buyer: {
		type: Schema.Types.ObjectId,
		ref: "User",
	},
});

const Order = models.Order || model("Order", OrderSchema);

export default Order;
