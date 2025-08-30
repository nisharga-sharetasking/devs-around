export const getRegisterPayload = () => {
  if (
    typeof window !== "undefined" &&
    localStorage.getItem("registerPayload")
  ) {
    return JSON.parse(localStorage.getItem("registerPayload")!);
  }
  return null;
};
