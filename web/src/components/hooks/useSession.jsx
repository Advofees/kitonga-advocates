import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { utilityFunctions } from "../../assets/functions";

export function useSession() {
  const { setExpiredLogin } = useContext(AuthContext);

  const handleSession = () => {
    const accessToken = sessionStorage.getItem("token");
    if (accessToken) {
      // Decode token and set user
      const decodedToken = utilityFunctions.decodeToken(accessToken);
      if (decodedToken?.header) {
        if (new Date().getTime() - decodedToken?.header?.exp * 1000 > 0) {
          setExpiredLogin(true);
        }
      }
      return decodedToken?.payload;
    }
    return null;
  };

  return [handleSession];
}
