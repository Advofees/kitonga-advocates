import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { utilityFunctions } from "../../assets/functions";

export function useToken() {
  const { setUserInfo } = useContext(AuthContext);

  const handleToken = (token) => {
    setUserInfo(utilityFunctions.decodeToken(token));
    sessionStorage.setItem("token", token);
  };

  return [handleToken];
}
