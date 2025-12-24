"use client";
import React, { useState, useEffect } from "react";
import { getAllAdminUser, deleteAdminUser } from "@/lib/actions/user.action"; // Import deleteUser function
import { Trash, Edit } from "lucide-react";
import { useUser } from "@clerk/nextjs";

interface IUser {
  _id: string;
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
}

const AdminUser = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const { user: clerkUser } = useUser();

  useEffect(() => {
    // Fetch users data when component mounts
    const fetchUsers = async () => {
      try {
        const fetchedUsers = await getAllAdminUser();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId: string) => {
    try {
      const result = await deleteAdminUser(userId);
      if (result) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user.clerkId !== userId)
        );
        alert("User deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      alert(
        `Error deleting user: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  };

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
                      style={{ boxSizing: "border-box" }}
                    >
                      <td className="min-w-[250px] py-4 text-primary-500">
                        {row.clerkId}
                      </td>
                      <td className="min-w-[200px] flex-1 py-4 pr-4">
                        {row.email}
                      </td>
                      <td className="min-w-[150px] py-4">{row.username}</td>
                      <td className="min-w-[150px] py-4">{row.firstName}</td>
                      <td className="min-w-[150px] py-4">{row.lastName}</td>
                      <td className="min-w-[100px] py-4 text-right">
                        <div style={{ display: "flex" }}>
                          {clerkUser?.id !== row.clerkId ? (
                            <button
                              onClick={() => handleDeleteUser(row.clerkId)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash size={24} />
                            </button>
                          ) : (
                            <span
                              className="text-gray-400 cursor-not-allowed"
                              title="Cannot delete own account"
                            >
                              <Trash size={24} />
                            </span>
                          )}
                        </div>
                      </td>
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

export default AdminUser;
