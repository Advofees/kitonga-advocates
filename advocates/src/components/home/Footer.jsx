import { faGavel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BsFacebook, BsGoogle, BsTwitter } from "react-icons/bs";
import { NavLink } from "react-router-dom";
import { ScaleButton } from "../common/ScaleButton";

export function Footer() {
  return (
    <div className="text-white py-8 bg-black px-4">
      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4 pb-6">
        <div>
          <div className="flex items-center justify-center">
            <div className="p-2 text-3xl flex items-center justify-center text-amber-700 h-16 w-16">
              <FontAwesomeIcon icon={faGavel} />
            </div>
            <div className="font-thin">
              <h3 className="text-white text-2xl font-serif">Kitonga</h3>
              <h4 className="font-bold text-amber-600 text-sm">LAW FIRM</h4>
            </div>
          </div>
          <div className="flex gap-4 p-2 justify-center">
            <ScaleButton
              className="h-8 w-8 flex items-center justify-center rounded-full hover:text-amber-600 shadow shadow-amber-600 hover:shadow-lg hover:shadow-amber-600"
              text={<BsFacebook />}
            />
            <ScaleButton
              className="h-8 w-8 flex items-center justify-center rounded-full hover:text-amber-600 shadow shadow-amber-600 hover:shadow-lg hover:shadow-amber-600"
              text={<BsTwitter />}
            />
            <ScaleButton
              className="h-8 w-8 flex items-center justify-center rounded-full hover:text-amber-600 shadow shadow-amber-600 hover:shadow-lg hover:shadow-amber-600"
              text={<BsGoogle />}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 text-gray-400 mx-auto gap-4">
          <div className="grid">
            <NavLink className="text-gray-400 no-underline" to="/about">About Our Firm</NavLink>
            <NavLink className="text-gray-400 no-underline" to="/cases">Case Results</NavLink>
            <NavLink className="text-gray-400 no-underline" to="/testimonials">Testimonials</NavLink>
          </div>
          <div className="grid">
            <NavLink className="text-gray-400 no-underline" to="/law">Employment Law</NavLink>
            <NavLink className="text-gray-400 no-underline" to="/law">Personal Injury</NavLink>
            <NavLink className="text-gray-400 no-underline" to="/law">Corporate Law</NavLink>
          </div>
        </div>
        <div className="grid px-4 text-gray-400 mx-auto">
          <NavLink className="text-gray-400 no-underline" to="/terms">Terms of service</NavLink>
          <NavLink className="text-gray-400 no-underline" to="/terms">Privacy Policy</NavLink>
          <NavLink className="text-gray-400 no-underline" to="/terms">Disclosures</NavLink>
        </div>
        <div className="grid gap-4 py-4 mx-auto">
          <h5>Subscribe to Our Newsletter</h5>
          <div className="">
            <input className="flex-grow outline-none py-2 px-4 text-black font-bold" />
            <button className="px-4 py-2 bg-amber-600 duration-300 hover:bg-amber-700">SEND</button>
          </div>
        </div>
      </div>
      <div className="px-4 pt-16 border-t border-amber-600/25 items-center justify-center gap-4 text-gray-400 font-bold flex">
        <span>Copyright &copy; {new Date().getFullYear()}</span>{" "}
        <span className="text-amber-600">Kitonga</span>
        <span>All rights reserved</span>
      </div>
    </div>
  );
}
