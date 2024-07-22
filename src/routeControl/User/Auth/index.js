import { baseRoutes } from "../../../helpers/baseRoutes";

const accessRoute = {
  LOGIN: {
    path: `${baseRoutes.userBaseRoutes}login`,
  },
  SIGNUP: {
    path: `${baseRoutes.userBaseRoutes}signup`,
  },
  HOME: {
    path: `${baseRoutes.userBaseRoutes}`,
  },
};

export default accessRoute;
