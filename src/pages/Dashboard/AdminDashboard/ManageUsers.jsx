import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { FaTrash, FaUserShield, FaUserCog } from "react-icons/fa";

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();

    const { data: users = [], refetch } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await axiosSecure.get("/users");
            return res.data;
        },
    });

    const handleRoleUpdate = async (id, role) => {
        try {
            await axiosSecure.patch(`/users/${id}`, { role });
            refetch();
        } catch (error) {
            console.error("Failed to update role:", error);
        }
    };

    const handleDeleteUser = user => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/users/${user._id}`)
                    .then(res => {
                        if (res.data.deletedCount > 0) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "User has been removed.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-pink-500 text-transparent bg-clip-text mb-2">
                Manage Users
            </h3>
            <p className="mb-4 text-gray-600">Total Users: <span className="font-semibold">{users.length}</span></p>

            <div className="overflow-x-auto rounded-lg">
                <table className="w-full border border-gray-200 text-sm text-left">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800">
                        <tr>
                            <th className="p-3 font-semibold">#</th>
                            <th className="p-3 font-semibold">Name</th>
                            <th className="p-3 font-semibold">Email</th>
                            <th className="p-3 font-semibold">Moderator</th>
                            <th className="p-3 font-semibold">Admin</th>
                            <th className="p-3 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={user._id} className="border-t hover:bg-gray-50">
                                <td className="p-3">{index + 1}</td>
                                <td className="p-3">{user.name}</td>
                                <td className="p-3">{user.email}</td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleRoleUpdate(user._id, "moderator")}
                                        className={`px-3 py-1 rounded flex items-center gap-1 justify-center transition ${
                                            user.role === "moderator"
                                                ? "bg-blue-200 text-blue-700 cursor-not-allowed"
                                                : "bg-blue-500 hover:bg-blue-600 text-white"
                                        }`}
                                        disabled={user.role === "moderator"}
                                    >
                                        <FaUserCog />
                                        {user.role === "moderator" ? "Moderator" : "Make"}
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleRoleUpdate(user._id, "admin")}
                                        className={`px-3 py-1 rounded flex items-center gap-1 justify-center transition ${
                                            user.role === "admin"
                                                ? "bg-green-200 text-green-700 cursor-not-allowed"
                                                : "bg-green-500 hover:bg-green-600 text-white"
                                        }`}
                                        disabled={user.role === "admin"}
                                    >
                                        <FaUserShield />
                                        {user.role === "admin" ? "Admin" : "Make"}
                                    </button>
                                </td>
                                <td className="p-3">
                                    <button
                                        onClick={() => handleDeleteUser(user)}
                                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded flex items-center gap-1 justify-center transition"
                                    >
                                        <FaTrash />
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageUsers;
