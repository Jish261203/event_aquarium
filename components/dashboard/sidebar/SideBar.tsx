import React from "react";
import styles from './sidebar.module.css'
import {
	MdDashboard,
	MdSupervisedUserCircle,
	MdShoppingBag,
	MdAttachMoney,
	MdWork,
	MdAnalytics,
	MdPeople,
	MdOutlineSettings,
	MdHelpCenter,
	MdLogout,
} from "react-icons/md";
import MenuLink from "./menuLink/MenuLink";

const SideBar = () => {
const menuItems = [
	{
		title: "Pages",
		list: [
			{
				title: "Dashboard",
				path: "/admin/dashboard",
				icon: <MdDashboard />,
			},
			{
				title: "Users",
				path: "/admin/dashboard/users",
				icon: <MdSupervisedUserCircle />,
			},
			{
				title: "Products",
				path: "/dashboard/products",
				icon: <MdShoppingBag />,
			},
			{
				title: "Transactions",
				path: "/dashboard/transactions",
				icon: <MdAttachMoney />,
			},
		],
	},
	// {
	// 	title: "Analytics",
	// 	list: [
	// 		{
	// 			title: "Revenue",
	// 			path: "/dashboard/revenue",
	// 			icon: <MdWork />,
	// 		},
	// 		{
	// 			title: "Reports",
	// 			path: "/dashboard/reports",
	// 			icon: <MdAnalytics />,
	// 		},
	// 		{
	// 			title: "Teams",
	// 			path: "/dashboard/teams",
	// 			icon: <MdPeople />,
	// 		},
	// 	],
	// },
	// {
	// 	title: "User",
	// 	list: [
	// 		{
	// 			title: "Settings",
	// 			path: "/dashboard/settings",
	// 			icon: <MdOutlineSettings />,
	// 		},
	// 		{
	// 			title: "Help",
	// 			path: "/dashboard/help",
	// 			icon: <MdHelpCenter />,
	// 		},
	// 	],
	// },
];
  return (<div className={styles.container}>
    <ul>
      {menuItems.map((cat) => (
        <li key={cat.title}>
          <span className={styles.cat}>{cat.title}</span>
          {cat.list.map(item => (
            <MenuLink item={item} key={item.title } />
          ))}
          
          </li>
      ))}
    </ul>
  </div>);
};

export default SideBar;
