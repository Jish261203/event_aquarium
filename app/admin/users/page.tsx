import { getAllUser } from "@/lib/actions/user.action";
import { IUser } from "@/lib/database/models/user.model";
import React from "react";

const UserView = async () => {

  const users = await getAllUser();

  return (
		<>
			<section className=" bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
				<h3 className="wrapper h3-bold text-center sm:text-left ">Users</h3>
			</section>
			<section className="wrapper overflow-x-auto">
				<table className="w-full border-collapse border-t">
					<thead>
						<tr className="p-medium-14 border-b text-grey-500">
							<th className="min-w-[250px] py-3 text-left">User ID</th>
							<th className="min-w-[200px] flex-1 py-3 pr-4 text-left">
								Email
							</th>
							<th className="min-w-[150px] py-3 text-left">Username</th>
							<th className="min-w-[100px] py-3 text-left">First Name</th>
							<th className="min-w-[150px] py-3 text-left">Last Name</th>
							<th className="min-w-[150px] py-3 text-left">action</th>
						</tr>
					</thead>
					<tbody>
						{users && users.length === 0 ? (
							<tr className="border-b">
								<td colSpan={5} className="py-4 text-center text-gray-500">
									No users found.
								</td>
							</tr>
						) : (
							<>
								{users &&
									users.map((row: IUser) => (
										<tr
											key={row._id}
											className="p-regular-14 lg:p-regular-16 border-b "
											style={{ boxSizing: "border-box" }}>
											<td className="min-w-[250px] py-4 text-primary-500">
												{row._id}
											</td>
											<td className="min-w-[200px] flex-1 py-4 pr-4">
												{row.email}
											</td>
											<td className="min-w-[150px] py-4">{row.username}</td>
											<td className="min-w-[150px] py-4">{row.firstName}</td>
											<td className="min-w-[150px] py-4">{row.lastName}</td>
										</tr>
									))}
							</>
						)}
					</tbody>
				</table>
			</section>
		</>
	);
};

export default UserView;
