"use client"
import AdminHeader from "@/components/shared/AdminHeader";
import PageWrapper from "@/components/shared/PageWrapper";
import SideBar from "@/components/shared/SideBar";
import { useState } from "react";

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
	}) {
	const [toggleCollapse,setToggleCollapse]=useState(false)
	
	return (
		<>
			<SideBar toggleCollapse={toggleCollapse} />
			<div className="flex flex-col h-full w-full">
				<AdminHeader toggleCollapse={toggleCollapse} setToggleCollapse={setToggleCollapse} />
				<PageWrapper children={children} />
			</div>
		</>
	);
}
