import { IChildRoute, IRoute, guestRoutes, userRoutes } from "./index.data";

const routes = { userRoutes, guestRoutes };

export const getRoutes = (
  routeListType: keyof typeof routes,
  type: IRoute["type"] | "rendered",
  role?: IChildRoute["role"],
  rootOnly = false,
  routeList: typeof routes = routes
) => {
  const selectedRouteList = routeList[routeListType];
  if (type == null) return selectedRouteList;

  return selectedRouteList.reduce((acc: IRoute[], val: IRoute) => {
    if (role != null && val.role != null && role !== val.role) return acc;

    if (rootOnly && val.children != null) {
      val.children.map((item) => {
        if (
          (role == null || val.role == null || role === val.role) &&
          (type == null || type === "rendered" || type === item.type)
        )
          acc.push(item);
      });
    } else {
      const childRoutes = val.children?.filter(
        (item) =>
          (role == null || item.role == null || role === item.role) &&
          (type == null || type === "rendered" || type === item.type)
      );
      const route = { ...val, children: childRoutes };

      if (
        (role == null || val.role == null || role === val.role) &&
        (type == null || type === "rendered" || type === val.type)
      )
        acc.push(route);
    }

    return acc;
  }, []);
};
