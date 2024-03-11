// "use client";
import { headers } from "next/headers";
import { checkRole } from "@/utils/roles";
import { headerLinks } from "@/constants";
import Link from "next/link";
import React from "react";

const NavItems = () => {
	const headersList = headers();
	const pathname = headersList.get("x-invoke-path") || "";

	return (
		<ul className="md:flex-between flex w-full flex-col items-start gap-5 md:flex-row">
			{headerLinks.map((link) => {
				const isActive = pathname === link.route;
				return (
					<li
						key={link.route}
						className={`${
							isActive ? "text-emerald-300" : "text-indigo-300"
						} flex-center p-medium-16 whitespace-nowrap text-2xl`}>
						<Link href={link.route}>{link.label}</Link>
					</li>
				);
			})}

			{checkRole("admin") && (
				<li
					key={"/admin/dashboard"}
					className={`${
						"/admin/dashboard" === pathname
							? "text-emerald-300"
							: "text-indigo-300"
					} flex-center p-medium-16 whitespace-nowrap text-2xl`}>
					<Link href={"/admin/dashboard"}>{"Dashboard"}</Link>
				</li>
			)}
		</ul>
	);
};

export default NavItems;
