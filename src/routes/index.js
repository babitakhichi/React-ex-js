import { useTranslation } from "react-i18next";
import { AdminLayout, UserLayout } from "../layouts/index";
import { NotFound } from "../pages";
import { adminRoutes } from "./Admin/index";
import { userRoutes } from "./User/index";

export const routes = () => {
  const { t } = useTranslation();
  return [
    {
      element: <AdminLayout />,
      children: [...adminRoutes(t)],
    },
    {
      element: <UserLayout />,
      children: [...userRoutes(t)],
    },
    {
      path: "*",
      element: <NotFound />,
    },
  ];
};

export const routesList = () => {
  const { t } = useTranslation();
  let routeArr = [
    ...adminRoutes(t)[0].children,
    ...adminRoutes(t)[1].children,
    ...userRoutes(t)[0].children,
    ...userRoutes(t)[1].children,
  ];
  return [...routeArr];
};

export const moduleRoutesList = () => {
  const { t } = useTranslation();
  let routeArr = {
    admin: [...adminRoutes(t)[0].children, ...adminRoutes(t)[1].children],
    user: [...userRoutes(t)[0].children, ...userRoutes(t)[1].children],
  };
  return routeArr;
};

export const getCompletePathList = () => {
  return routesList().reduce((prev, curr) => {
    prev.push(curr);
    if (curr.children) {
      prev.push(...curr.children);
    }
    return prev;
  }, []);
};
