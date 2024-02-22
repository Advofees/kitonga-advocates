import {
  faBars,
  faEnvelope,
  faGavel,
  faPhone,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from "react-router-dom";
import { Background } from "../common/DottedBackground";
import { Glass } from "../common/Glass";

export function NavBar({ tabs = [], showNav, setShowNav }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <div>
      {/* Larg Screen [md+] */}
      <div className="hidden md:flex gap-4 items-center border-b border-amber-600/25 py-8">
        <div className="flex items-center justify-center">
          <div className="p-2 text-3xl flex items-center justify-center text-amber-700 h-16 w-16">
            <FontAwesomeIcon icon={faGavel} />
          </div>
          <div className="font-thin">
            <h3 className="text-white text-2xl font-serif">Kitonga</h3>
            <h4 className="font-bold text-amber-600 text-sm">LAW FIRM</h4>
          </div>
        </div>
        <div className="text-white flex flex-grow justify-center font-bold relative">
          {tabs.map((tab, index) => (
            <Glass
              onClick={() => navigate(tab.path)}
              className={`p-2 px-4 cursor-pointer duration-300 ${
                pathname === tab.path
                  ? "text-amber-500 bg-amber-600/10 backdrop-blur hover:text-white"
                  : "hover:text-amber-500"
              }`}
              key={index}
            >
              {tab.name}
            </Glass>
          ))}
        </div>
        <div className="hidden lg:flex items-center gap-6 flex-grow">
          <div className="flex items-center ">
            <div className="h-12 text-amber-600 w-12 flex items-center justify-center text-3xl">
              <span>
                <FontAwesomeIcon icon={faPhone} />
              </span>
            </div>
            <div className="font-thin">
              <h4 className="text-amber-500 px-4">Call us</h4>
              <h4 className="font-bold text-gray-500">+87-877-673</h4>
            </div>
          </div>
          <div className="flex items-center ">
            <div className="h-12 text-amber-600 w-12 flex items-center justify-center text-3xl">
              <span>
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
            </div>
            <div className="font-thin">
              <h4 className="text-amber-500 px-4">Email us</h4>
              <h4 className="font-bold text-gray-500">
                <a href="mailto:info@gmail.com" title="Send mail">
                  info@gmail.com
                </a>
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Small Screen [-md] */}
      <div className="md:hidden flex items-center">
        <div className="flex items-center">
          <div className="p-2 text-3xl flex items-center justify-center text-amber-700 h-16 w-16">
            <FontAwesomeIcon icon={faGavel} />
          </div>
          <div className="font-thin">
            <h3 className="text-white text-2xl font-serif">Kitonga</h3>
            <h4 className="font-bold text-amber-600 text-sm">LAW FIRM</h4>
          </div>
        </div>
        {!showNav && (
          <div className="flex flex-grow justify-end">
            <button
              onClick={() => setShowNav(true)}
              className="text-amber-500 group font-bold duration-300 text-center text-2xl flex relative h-12 w-12 m-2 border-1 border-amber-700/50"
            >
              <div className="relative z-10 w-full h-full">
                <Background />
              </div>
              <span className="absolute inset-0 z-20 flex items-center justify-center group-hover:text-white">
                <FontAwesomeIcon icon={faBars} />
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
