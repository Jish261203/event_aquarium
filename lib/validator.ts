import * as z from "zod";

export const eventFormSchema = z.object({
	title: z.string().min(3, "Title must at least 3 characters"),
	description: z
		.string()
		.min(3, "Description must at least 3 characters")
		.max(400, "Description must less than 400 characters"),
	location: z
		.string()
		.min(3, "Location must at least 3 characters")
		.max(400, "Location must less than 400 characters"),
	imageUrl: z.string(),
	startDateTime: z.date(),
	endDateTime: z.date(),
	categoryId: z.string(),
	price: z.string(),
	isFree: z.boolean(),
	url: z.string().url(),
});
