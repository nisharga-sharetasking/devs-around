import { useGetCurrentProfileQuery } from "@/redux/api-queries/auth-api";

export const useGetLoggedInProfile = () => {
  // === get client profile ===
  const { data, isLoading } = useGetCurrentProfileQuery({});

  return {
    profile: data?.data,
    isLoading,
  };
};
