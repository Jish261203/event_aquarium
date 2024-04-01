import { SideNavItems } from "@/types";
import { BsHouseDoor } from "react-icons/bs";
import { MdEvent } from "react-icons/md";
import { FaUsers } from "react-icons/fa";
import { MdOutlineUpcoming } from "react-icons/md";
import { SiEventstore } from "react-icons/si";

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
		path: "/admin/users",
		icon: <FaUsers size={20} />,
	},
	{
		title: "Events",
		path: "/admin/events",
		icon: <MdEvent size={20} />,
		submenu: true,
		subMenuItems: [
			{ title: "Upcoming Events", path: "/admin/events/upcoming" ,icon:<MdOutlineUpcoming size={20}/>},
			{ title: "Completed Events", path: "/admin/events/completed", icon:<SiEventstore size={20}/> },
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
