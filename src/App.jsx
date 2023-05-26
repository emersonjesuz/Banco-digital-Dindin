import "./App.css";
import Home from "./components/Home";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import { getItem } from "./utils";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import RouterError from "./components/routerError";

function ProtectLogin({ redirect }) {
  const token = getItem("token");
  return token ? <Outlet /> : <Navigate to={redirect} />;
}

function ProtectHome({ redirect }) {
  const token = getItem("token");
  return !token ? <Outlet /> : <Navigate to={redirect} />;
}

function App() {
  return (
    <div className="conteiner">
      <Routes>
        <Route element={<ProtectHome redirect={"/home"} />}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />

          <Route path="/signup" element={<SignUp />} />
        </Route>

        <Route element={<ProtectLogin redirect={"/login"} />}>
          <Route path="/home" element={<Home />} />
        </Route>
        <Route path="*" element={<RouterError />} />
      </Routes>
    </div>
  );
}

export default App;
