import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import SignUp from "../pages/SignUp/index.tsx";
import Main from "../pages/main/index.tsx";
import SignIn from "../pages/signIn/index.tsx";
import { getItemLocalStore } from "../helpers/index.ts";
import NotFoundPage from "./NotFoundPage/index.tsx";
type Props = {
  redirect: string;
  ticket: boolean;
};

function ProtectRouter({ redirect, ticket }: Props) {
  const token = getItemLocalStore("token");
  const isToken = !token;
  return isToken === ticket ? <Outlet /> : <Navigate to={redirect} />;
}

export default function Router() {
  return (
    <>
      <Routes>
        <Route element={<ProtectRouter ticket={true} redirect={"/main"} />}>
          <Route path="/">
            <Route path="/signIn" element={<SignIn />} />
          </Route>
          <Route path="/signUp" element={<SignUp />} />
        </Route>

        <Route element={<ProtectRouter ticket={false} redirect={"/signIn"} />}>
          <Route path="/main" element={<Main />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}
