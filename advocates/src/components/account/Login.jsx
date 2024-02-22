import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { useSession } from "../hooks/useSession";
import { InputField } from "../common/InputField";
import { ScaleButton } from "../common/ScaleButton";
import { images } from "../../assets/images/images";
import { Loader } from "../common/Loader";
import { faHomeLgAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Login() {
  const [loginErrors, setLoginErrors] = useState();
  const [handleLogin] = useLogin();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    identity: "admin",
    password: "password",
  });
  const navigate = useNavigate();

  const [handleSession] = useSession();

  useEffect(() => {
    handleSession();
  }, []);

  function handleChange(k, v) {
    setFormData({
      ...formData,
      [k]: v,
    });
  }

  function handleSubmit(e) {
    setLoading(true);
    e.preventDefault();
    handleLogin({
      payload: {
        ...formData,
        grant_type: "user",
      },
      setLoading,
      errorCallback: setLoginErrors,
    });
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <div
        className="absolute inset-0 -z-10 opacity-25 backdrop-blur"
        style={{
          background: `url(${images.gavel}) center no-repeat`,
          backgroundSize: "cover",
        }}
      ></div>
      <div className="rounded-lg relative bg-white/25 backdrop-blur shadow px-4 py-12">
        {loading && <Loader className="bg-white/50 z-50 rounded" />}
        <div className="py-2 px-4 sm:rounded-lg sm:px-10">
          <h2
            onClick={() => navigate("/")}
            className="cursor-pointer flex items-center gap-2 text-left text-2xl font-bold"
          >
            <FontAwesomeIcon icon={faHomeLgAlt} />
            <span className="relative">Login</span>
          </h2>

          <form className="grid p-2 gap-4 mt-4" onSubmit={handleSubmit}>
            <div>
              <InputField
                className="px-4"
                type="text"
                id="identity"
                placeholder="Username or Email"
                value={formData.identity}
                onChange={handleChange}
                required
                name="identity"
                colors={{
                  success: "border-dark text-dark font-bold",
                  initial: "border-secondary text-secondary font-bold",
                  error: "border-danger text-danger font-bold",
                }}
              />
              {loginErrors && loginErrors.status === 404 && (
                <div className="text-red-700 bg-black rounded text-sm my-1 text-center">
                  {loginErrors.error}
                </div>
              )}
            </div>
            <div>
              <InputField
                className="px-4"
                type="password"
                id="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                name="password"
                colors={{
                  success: "border-dark text-dark font-bold",
                  initial: "border-secondary text-secondary font-bold",
                  error: "border-danger text-danger font-bold",
                }}
              />
              {loginErrors && loginErrors.status === 401 && (
                <div className="text-red-700 bg-black rounded text-sm my-1 text-center">
                  {loginErrors.error}
                </div>
              )}
            </div>
            <div className="mt-4 grid font-bold rounded-md">
              <button
                className={`duration-300 bg-amber-600 hover:shadow-2xl hover:shadow-black  text-white rounded-lg px-8 py-2`}
                type="submit"
              >
                Sign In
              </button>
            </div>
          </form>
          {/* <div className="text-center flex mx-auto w-max mt-6 items-center gap-4">
            <span>Not registered..?</span>
            <NavLink to="/signup" className="text-lg underline text-blue-600">
              Sign Up
            </NavLink>
          </div>
          <div className="my-4 grid gap-4">
            <div className="text-lines">Login with</div>
            <div className="grid gap-4">
              <ScaleButton
                text="Google"
                className="w-full duration-300 hover:bg-amber-600 hover:text-white shadow-gray-800/50"
              />
              <ScaleButton
                text="Facebook"
                className="w-full duration-300 hover:bg-amber-600 hover:text-white shadow-gray-800/50"
              />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
