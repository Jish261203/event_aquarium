import { SIDENAV_ITEMS } from "@/constants";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { SideBarMenuItem } from "./sidebar-menu-item";
import classNames from "classnames"
export default function SideBar({ toggleCollapse }: { toggleCollapse: boolean }) {
	const asideStyle = classNames(
		" fixed bg-[#31353d] text-gray-500 z-50 h-full shadow-lg shadow-gray-900/20 transition duration-300 ease-in-out w-[20rem]",
		{
			["sm:w-[5.4rem] sm:left-0 left-[-100%]"]:toggleCollapse,
			["w-[20rem]"]:!toggleCollapse
		}
	);
	return (
		<aside className={asideStyle}>
			<div className="flex relative items-center py-5 px-3.5">
				<Link href="/" className="w-14 mx-0 min-w-max">
					<Image
						src="/assets/images/logo1.svg"
						alt="logo"
						width={60}
						height={40}
						className="w-20 mx-0 min-h-fit"
					/>
				</Link>
				{!toggleCollapse && (
					<h3 className="pl-2 font-bold text-2xl text-[#e6e69ee] min-w-max">
						Dashboard
					</h3>
				)}
			</div>
			<nav className="flex flex-col gap-2 transition duration-300">
				<div className="flex flex-col gap-2 px-4">
					{SIDENAV_ITEMS.map((item, index) => {
						return (
							<SideBarMenuItem
								key={index}
								item={item}
								toggleCollapse={toggleCollapse}></SideBarMenuItem>
						);
					})}
				</div>
			</nav>
		</aside>
	);
}
