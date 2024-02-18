import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import "./globals.css";

const poppins = Poppins({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-poppins ",
});

export const metadata: Metadata = {
	title: "EVENT AQUARIUM",
	description: "EventAquarium is a platform for event hosting and managing.",
	icons: {
		icon: "/assets/images/logo1.svg",
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ClerkProvider
			appearance={{
				baseTheme: neobrutalism,
			}}>
			<html lang="en">
				<body className={poppins.variable}>{children}</body>
			</html>
		</ClerkProvider>
	);
}
