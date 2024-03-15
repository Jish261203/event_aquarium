import { redirect } from "next/navigation";
import { checkRole } from "@/utils/roles";


export default function AdminDashboard() {
	// If the user does not have the admin role, redirect them to the home page
	if (!checkRole("admin")) {
		redirect("/");
	}

	return (
		<>
			<div>Dashoboard</div>
			
		</>
	);
}
