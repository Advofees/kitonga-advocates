import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/dashboard/Dashboard";
import { Home } from "./components/home/Home";

function App() {
  
  return (
    <div className="">
      <div>
        <Routes>
          <Route path="/*" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
