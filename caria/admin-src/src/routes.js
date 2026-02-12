import React from "react";

import MainDashboard from "views/admin/default";
import Properties from "views/admin/properties";
import Inquiries from "views/admin/inquiries";
import Settings from "views/admin/settings";
import Pages from "views/admin/pages";
import CMSPages from "views/admin/cms-pages";
import Menus from "views/admin/menus";
import Advisors from "views/admin/advisors";
import Features from "views/admin/features";
import SignIn from "views/auth/SignIn";

import {
  MdHome,
  MdOutlineStore,
  MdPeople,
  MdSettings,
  MdLock,
  MdDescription,
  MdMenu,
  MdList,
  MdViewModule,
} from "react-icons/md";

const routes = [
  {
    name: "Dashboard",
    layout: "/admin",
    path: "default",
    icon: <MdHome className="h-6 w-6" />,
    component: <MainDashboard />,
  },
  {
    name: "Gayrimenkul İlanları",
    layout: "/admin",
    path: "properties",
    icon: <MdOutlineStore className="h-6 w-6" />,
    component: <Properties />,
  },
  {
    name: "Özellik Yönetimi",
    layout: "/admin",
    path: "features",
    icon: <MdList className="h-6 w-6" />,
    component: <Features />,
  },
  {
    name: "İlan Talepleri",
    layout: "/admin",
    path: "inquiries",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Inquiries />,
  },
  {
    name: "CMS Sayfaları",
    layout: "/admin",
    path: "cms-pages",
    icon: <MdViewModule className="h-6 w-6" />,
    component: <CMSPages />,
  },
  {
    name: "Sayfa Yönetimi",
    layout: "/admin",
    path: "pages",
    icon: <MdDescription className="h-6 w-6" />,
    component: <Pages />,
  },
  {
    name: "Menü Yönetimi",
    layout: "/admin",
    path: "menus",
    icon: <MdMenu className="h-6 w-6" />,
    component: <Menus />,
  },
  {
    name: "Danışman Yönetimi",
    layout: "/admin",
    path: "advisors",
    icon: <MdPeople className="h-6 w-6" />,
    component: <Advisors />,
  },
  {
    name: "Site Ayarları",
    layout: "/admin",
    path: "settings",
    icon: <MdSettings className="h-6 w-6" />,
    component: <Settings />,
  },
  {
    name: "Çıkış Yap",
    layout: "/auth",
    path: "sign-in",
    icon: <MdLock className="h-6 w-6" />,
    component: <SignIn />,
  },
];
export default routes;
