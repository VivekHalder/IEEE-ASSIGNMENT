import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { SignUp, Login } from "./components";

const router = createBrowserRouter([
  {
    path: "/",
    element: <SignUp />,
  },
  {
    path: "/login",
    element: <Login />,
  },
]);

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}
