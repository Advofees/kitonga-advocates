import { Routes, Route } from "react-router-dom";
import { NavBar } from "./Navbar";
import { LandingPage } from "./LandingPage";
import { images } from "../../assets/images/images";
import { Footer } from "./Footer";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

export function Home() {
  const [showNav, setShowNav] = useState(false);

  const tabs = [
    { name: "Home", path: "/" },
    { name: "Cases", path: "/cases" },
    { name: "Pages", path: "/pages" },
    { name: "About", path: "/about" },
    { name: "Contact", path: "/contact" },
    { name: "Blog", path: "/blog" },
  ];

  return (
    <div
      style={{
        background: `url(${images.justice}) center no-repeat`,
        backgroundSize: "cover",
      }}
      className="fixed flex flex-col inset-0 overflow-y-scroll"
    >
      {showNav && (
        <div onClick={() => setShowNav(false)} className="fixed flex flex-col md:hidden z-50 left-0 right-[50%] bottom-0 top-0 bg-black border-r border-lime-600/50">
          <div className="flex justify-end">
            <button className="h-10 w-10 shadow-md hover:shadow-lg hover:shadow-lime-500 hover:bg-lime-600 hover:text-black shadow-lime-500 rounded-full text-lime-600 m-4 hover:scale-110 duration-300">
              <FontAwesomeIcon icon={faClose} />
            </button>
          </div>
          <div className="relative grid gap-1 text-gray-500">
            {tabs.map((tab, index) => (
              <div
                className="block w-full text-start py-2 px-4 hover:text-lime-600 border-b border-lime-600/50"
                key={index}
              >
                {tab.name}
              </div>
            ))}
          </div>
          <div className="flex-grow"></div>
          <button className="text-start px-12 m-2 hover:-translate-y-2 py-2 text-lime-600 rounded shadow-md shadow-lime-600 hover:shadow-lg hover:shadow-lime-500 hover:bg-lime-600 hover:text-black duration-300">Logout</button>
        </div>
      )}
      <div className="flex-grow bg-black/90 font-serif">
        <div className="">
          <NavBar tabs={tabs} setShowNav={setShowNav} showNav={showNav} />
        </div>

        <Routes>
          <Route path="" element={<LandingPage />} />
        </Routes>
        <div>
          <Footer />
        </div>
      </div>
    </div>
  );
}
