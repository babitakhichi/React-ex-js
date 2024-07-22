import { AdminPublicLayout, AdminPrivateLayout } from "../../layouts/index";
import publicRoutes from "./public.route";
import privateRoutes from "./private.route";

export const adminRoutes = (t) => {
  return [
    {
      element: <AdminPublicLayout />,
      children: [...publicRoutes(t)],
    },
    {
      element: <AdminPrivateLayout />,
      children: [...privateRoutes(t)],
    },
  ];
};
