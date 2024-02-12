import { createRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "./core";

// Placeholder config object
const config = {};

// Export routes for Next App Router
export const { GET, POST } = createRouteHandler({
	router: ourFileRouter,
	config: { ...config },
});
