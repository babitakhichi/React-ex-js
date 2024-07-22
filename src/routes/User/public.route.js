import { Login, Signup } from "../../pages";
import userRoutesMap from "../../routeControl/userRoutes";

export default function route() {
  return [
    {
      path: userRoutesMap.LOGIN.path,
      name: "Login",
      key: userRoutesMap.LOGIN.path,
      private: false,
      common: false,
      belongsToHeader: false,
      belongsToFooter: false,
      element: <Login />,
    },
    {
      path: userRoutesMap.SIGNUP.path,
      name: "Signup",
      key: userRoutesMap.SIGNUP.path,
      private: false,
      common: false,
      belongsToHeader: false,
      belongsToFooter: false,
      element: <Signup />,
    },
  ];
}
