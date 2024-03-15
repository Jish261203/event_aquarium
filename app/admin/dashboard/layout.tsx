import NavBar from "@/components/dashboard/navbar/NavBar";
import SideBar from "@/components/dashboard/sidebar/SideBar";
import styles from '@/components/dashboard/dashboard.module.css'

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className={styles.rootLayout}>
			<div className={styles.menu}>
				<SideBar />
			</div>
			<div className={styles.content}>
				<NavBar />
				<main className={styles.mainContent}>{children}</main>
			</div>
		</div>
	);
}
