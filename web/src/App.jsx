import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Home } from "./components/home/Home";

function FrancieCard() {
  return (
    <div className="container mx-auto border-1 p-8 border-black">
      <div className="after:inset-0 after:absolute after:z-[-2] after:bg-gray-200 rounded-xl overflow-hidden relative text-justify p-4 before:absolute before:z-[-1] before:right-0 before:top-0 before:w-16 before:h-16 before:rounded-bl-full before:hover:rounded-bl-[0px] before:hover:w-full before:hover:h-full before:duration-500 before:bg-gradient-to-bl before:from-orange-900  before:to-orange-600 hover:text-white duration-500">
        In Ruby, converting a string to lowercase is straightforward using the
        built-in downcase method. This method returns a new string with all
        uppercase letters converted to their lowercase equivalents. It does not
        modify the original string. In Ruby, converting a string to lowercase is
        straightforward using the built-in downcase method. This method returns
        a new string with all uppercase letters converted to their lowercase
        equivalents. It does not modify the original string. In Ruby, converting
        a string to lowercase is straightforward using the built-in downcase
        method. This method returns a new string with all uppercase letters
        converted to their lowercase equivalents. It does not modify the
        original string. In Ruby, converting a string to lowercase is
        straightforward using the built-in downcase method. This method returns
        a new string with all uppercase letters converted to their lowercase
        equivalents. It does not modify the original string.
      </div>

      <div className="mt-4 h-[30vh] w-[15vh] border-1 border-green-700 rounded-l-full"></div>
    </div>
  );
}

function App() {
  return (
    <div className="">
      <div>
        <Routes>
          <Route path="/*" element={<Navigate to="dashboard" />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
          <Route path="/home/*" element={<FrancieCard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
