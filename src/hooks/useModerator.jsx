import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import useAxiosSecure from "./useAxiosSecure";

const useModerator = () => {
  const { user, loading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: isModerator, isPending: isModeratorLoading } = useQuery({
    queryKey: [user?.email, 'isModerator'],
    enabled: !loading,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data?.moderator;
    }
  });

  return [isModerator, isModeratorLoading];
};

export default useModerator;
