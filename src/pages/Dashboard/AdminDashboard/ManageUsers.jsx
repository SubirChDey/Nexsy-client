import { useQuery } from "@tanstack/react-query"
import useAxiosSecure from "../../../hooks/useAxiosSecure"

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const {data: users = []} = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
const res = await axiosSecure.get('/users');
return res.data;
        }
    })

  return (
    <div>
        <h3>Manage Users</h3>
        <p>{users.length}</p>
    </div>
  )
}

export default ManageUsers