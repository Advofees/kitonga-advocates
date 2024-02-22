import { useContext } from "react";
import { endpoints } from "../../assets/apis";
import { apiCalls } from "../../assets/apiCalls";
import { useToken } from "./useToken";
import { AuthContext } from "../context/AuthContext";
import { useSession } from "./useSession";
import { notifiers } from "../../assets/notifiers";

export function useLogin() {
  const [handleToken] = useToken();
  const [handleSession] = useSession();
  const { setExpiredLogin, setUserInfo } = useContext(AuthContext);

  function updateUserInformation(tokenObject, setLoading) {
    handleToken(tokenObject.access_token);
    setExpiredLogin(false);
    setUserInfo(handleSession());
    setLoading(false);
  }

  const handleLogin = ({
    payload = {},
    setLoading = () => {},
    errorCallback = () => {},
  }) => {
    apiCalls.postRequest({
      endpoint: endpoints.getAccessToken,
      httpMethod: "POST",
      httpHeaders: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      httpBody: payload,
      successCallback: (res) => {
        updateUserInformation(res, setLoading);
      },
      errorCallback: (err) => {
        notifiers.httpError(err);
        errorCallback(err);
        setLoading(false);
      },
    });
  };

  return [handleLogin];
}
