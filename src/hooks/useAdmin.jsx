import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";


const useAdmin = () => {
    const { user, loading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { data: isAdmin, isPending: isAdminLoading } = useQuery({
        queryKey: [user?.email, 'isAdmin'],
        enabled: !loading,
        queryFn: async () => {
            console.log('asking or checking is admin', user)
            const res = await axiosSecure.get(`/users/admin/${user.email}`);
            // console.log(res.data);
            return res.data?.admin;
        }
    })
    return [isAdmin, isAdminLoading]
};

export default useAdmin;

// import { useContext, useEffect, useState } from 'react';
// import { AuthContext } from '../providers/AuthProvider';

// const useAdmin = () => {
//   const { user } = useContext(AuthContext);
//   const [isAdmin, setIsAdmin] = useState(false);
//   const [isAdminLoading, setIsAdminLoading] = useState(true);

//   useEffect(() => {
//     if (user?.email) {
//       fetch(`https://your-backend.com/users/admin/${user.email}`, {
//         headers: {
//           authorization: `bearer ${localStorage.getItem('access-token')}`,
//         },
//       })
//         .then(res => res.json())
//         .then(data => {
//           setIsAdmin(data.isAdmin);
//           setIsAdminLoading(false);
//         });
//     }
//   }, [user]);

//   return [isAdmin, isAdminLoading];
// };

// export default useAdmin;
