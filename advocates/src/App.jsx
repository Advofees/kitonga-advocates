import "./App.css";
import { Navigate, Route, Routes } from "react-router-dom";
import { Dashboard } from "./components/dashboard/Dashboard";

function App() {
  
  return (
    <div className="">
      <div>
        <Routes>
          <Route path="/*" element={<Navigate to="dashboard" />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
