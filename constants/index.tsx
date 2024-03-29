import { SideNavItems } from "@/types";
import { BsHouseDoor } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";

export const headerLinks = [
	{
		label: "Home",
		route: "/",
	},
	{
		label: "Create Event",
		route: "/events/create",
	},
	{
		label: "My Profile",
		route: "/profile",
	},

	// {
	// 	label: "Dashboard",
	// 	route: "/admin/dashboard",
	// },
];

export const SIDENAV_ITEMS: SideNavItems[] = [
	{
		title: "Dashboard",
		path: "/admin/dashboard",
		icon: <BsHouseDoor size={20} />,
	},
	{
		title: "Users",
		path: "/admin/dashboard/users",
		icon: <FaUsers size={20} />,
	},
	{
		title: "Events",
		path: "/admin/dashboard/events",
		icon: <MdEvent size={20} />,
		submenu: true,
		subMenuItems: [
			{ title: "Upcoming Events", path: "/admin/dashboard/events/upcoming" },
			{ title: "Ongoing Events", path: "/admin/dashboard/events/ongoing" },
		],
	},
];

export const eventDefaultValues = {
	title: "",
	description: "",
	location: "",
	imageUrl: "",
	startDateTime: new Date(),
	endDateTime: new Date(),
	categoryId: "",
	price: "",
	isFree: false,
	url: "",
};
