import { createBrowserRouter } from "react-router";

import { StudyWorkspacePage } from "../pages/StudyWorkspacePage/StudyWorkspacePage";
import { NotFoundPage } from "../pages/NotFoundPage/NotFoundPage";
export const appRoutes = {
  home: "/",
  study: "/study",
} as const;

export const router = createBrowserRouter([
  {
    path: appRoutes.home,
    Component: StudyWorkspacePage,
  },
  {
    path: appRoutes.study,
    Component: StudyWorkspacePage,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);