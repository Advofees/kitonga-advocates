import { useContext, useEffect, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSession } from "../hooks/useSession";
import { AuthContext } from "../context/AuthContext";
import { Login } from "../account/Login";
import { Expired } from "../common/Expired";
import { DashNavBar } from "./DashNavBar";
import Cases from "./Cases";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons/faBars";
import {
  faClose,
  faFolder,
  faGear,
  faHome,
  faRightFromBracket,
  faUserAlt,
} from "@fortawesome/free-solid-svg-icons";
import Clients from "./Clients";
import { Loader } from "../common/Loader";
import { Dash } from "./Dash";
import { CaseDetailsWrapper } from "./CaseDetailsWrapper";
import { ClientDetailsWrapper } from "./ClientDetailsWrapper";

export function Dashboard() {
  const { pathname } = useLocation();
  const [showNavBar, setShowNavBar] = useState(false);
  const navigate = useNavigate();
  const [handleSession] = useSession();
  const [loading, setLoading] = useState(false);
  const { userInfo, setUserInfo, expiredLogin, logout } =
    useContext(AuthContext);

  const tabs = [
    {
      label: "",
      icon: faHome,
      link: "/dashboard",
      description: "Home",
    },
    {
      label: "Cases",
      icon: faFolder,
      link: "/dashboard/cases",
      description: "Cases",
    },
    {
      label: "Clients",
      icon: faUserAlt,
      link: "/dashboard/clients",
      description: "Clients",
    },
    // {
    //   label: "Settings",
    //   icon: faGear,
    //   link: "/dashboard/iam",
    //   description: "Settings",
    // },
  ];

  useEffect(() => {
    setUserInfo(handleSession());
  }, [pathname]);

  return (
    <div className="fixed inset-0 flex">
      {userInfo && expiredLogin && (
        <Expired
          onCancel={() => {
            navigate("/");
            logout();
          }}
          onLogin={logout}
        />
      )}
      {loading && <Loader className="bg-white/75 z-50 fixed" />}
      {userInfo ? (
        <div className="flex-grow flex flex-col">
          <div>
            <DashNavBar
              currentPage={tabs.find((tab) => tab.link === pathname)?.label}
            />
          </div>
          <div className="flex-grow flex">
            <div className="flex flex-col shadow">
              <div className="flex justify-end">
                {!showNavBar ? (
                  <button
                    onClick={() => setShowNavBar(true)}
                    className="bg-gray-100 h-10 w-10 shadow shadow-dark duration-300 hover:bg-amber-800 hover:text-white"
                  >
                    <FontAwesomeIcon icon={faBars} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowNavBar(false)}
                    className="m-3 duration-300 hover:scale-125 hover:text-amber-800"
                  >
                    <FontAwesomeIcon icon={faClose} />
                  </button>
                )}
              </div>

              {/* <button
                onClick={() => navigate("/")}
                className="h-10 border-b border-amber-800/50 hover:text-amber-800"
              >
                <FontAwesomeIcon icon={faHome} />
              </button> */}

              <div className="flex flex-col">
                {tabs.map((tab, index) => (
                  <NavLink
                    className={`h-10 hover:text-amber-600 duration-300 flex items-center gap-2 justify-center ${
                      tab.link === pathname ? "text-amber-800" : ""
                    }`}
                    key={index}
                    to={tab.link}
                    title={tab.description}
                  >
                    <FontAwesomeIcon icon={tab.icon} />
                    {showNavBar && <div>{tab.description}</div>}
                  </NavLink>
                ))}
              </div>
              <div className="flex-grow"></div>
              {!showNavBar ? (
                <button
                  onClick={logout}
                  className="text-amber-800 h-10 duration-300 hover:bg-amber-800 hover:text-white"
                >
                  <FontAwesomeIcon icon={faRightFromBracket} />
                </button>
              ) : (
                <div
                  onClick={logout}
                  className="text-start px-4 py-2 text-amber-800 cursor-pointer rounded-sm hover:bg-amber-800 hover:text-white duration-300"
                >
                  Logout
                </div>
              )}
            </div>
            <div className="text-sm flex-grow relative">
              <div className="absolute inset-0 overflow-y-scroll">
                <Routes>
                  <Route path="" element={<Dash />} />
                  <Route path="cases" element={<Cases {...{ setLoading }} />} />
                  <Route
                    path="cases/:caseId"
                    element={<CaseDetailsWrapper {...{ setLoading }} />}
                  />
                  <Route
                    path="clients/:clientId"
                    element={<ClientDetailsWrapper {...{ setLoading }} />}
                  />
                  <Route
                    path="clients"
                    element={<Clients {...{ setLoading }} />}
                  />
                </Routes>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </div>
  );
}
