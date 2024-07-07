import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "../api/AuthAPI";

export const userAuth = () => {
  const {
    data: user,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["user"],
    queryFn: getCurrentUser,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return { user, isError, isLoading };
};
