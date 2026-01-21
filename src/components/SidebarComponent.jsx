import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../components/ui/Sidebar";
import {
  IconArrowLeft,
  IconAsset,
  IconBrandTabler,
  IconFileAnalytics,
  IconLayoutDashboard,
  IconUserBolt,
  IconUserCircle,
} from "@tabler/icons-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../lib/utils";
import { useDispatch, useSelector } from "react-redux";
import Header from "./Header";
import { logout } from "@/features/auth/authSlice";
import Modal from "./Modal";
import { AlertCircle, BarChart3, Wrench } from "lucide-react";

export function SidebarDemo({ outlet }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [modalOpen, setModalOpen] = useState(false);

  const user = useSelector((state) => state.auth.user);
  console.log("User Role:", user?.role);
  const handleLogout = () => {
    dispatch(logout());
    navigate("/auth/login");
  };
  const location = useLocation();
  const getHeaderTitle = () => {
    switch (location.pathname) {
      case "/app/dashboard":
        return "Dashboard";
      case "/app/alerts":
        return "Alerts";
      case "/app/kpi":
        return "KPI";
      case "/app/tools":
        return "Tools";
      case "/app/profile":
        return "Profile";
      default:
        return "Dashboard";
    }
  };

  const links = [
    {
      label: "Dashboard",
      href: "dashboard",
      icon: (
        <IconBrandTabler className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Alerts",
      href: "alerts",
      icon: (
        <AlertCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Kpi",
      href: "kpi",
      icon: (
        <BarChart3 className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Assets",
      href: "assets",
      icon: (
        <IconAsset className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
   {
      label: "Analytics",
      href: "analytics",
      icon: (
        <IconFileAnalytics className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    //    {
    //   label: "Power Bi",
    //   href: "powerbi",
    //   icon: (
    //     <IconLayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // 🔒 ADMIN ONLY
    ...(user?.role === "admin"
      ? [
          {
            label: "Tools",
            href: "tools",
            icon: (
              <Wrench className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
            ),
          },
        ]
      : []),

    //     {
    //   label: "Fanclub",
    //   href: "fanclub",
    //   icon: (
    //     <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Profile",
    //   href: "profile",
    //   icon: (
    //     <IconUserCircle className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
      label: "Logout",
      icon: (
        <IconArrowLeft className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
      action: () => setModalOpen(true),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className={cn(
          "flex flex-col md:flex-row bg-white dark:bg-neutral-900 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-500 overflow-hidden h-full"
        )}
      >
        <Sidebar open={open} setOpen={setOpen} animate={false}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
              <>
                <Logo />
              </>
              <div className="mt-8 flex flex-col gap-2">
                {links.map((link, idx) => (
                  <SidebarLink
                    key={idx}
                    link={{
                      label: link.label,
                      href: link.href,
                      icon: link.icon,
                    }}
                    action={link.action}
                  />
                ))}
              </div>
            </div>
            <div>
              {/* <SidebarLink
                link={{
                  label: user?.role === "admin" ? "Admin" : "User",
                  href: "/app/profile",
                  icon: (
                    <img
                      src="/images.png"
                      className="h-7 w-7 flex-shrink-0 object-cover rounded-full"
                      alt="Avatar"
                      // onError={(e) => {
                      //   e.target.src = "https://via.placeholder.com/28x28/cccccc/666666?text=U";
                      // }}
                    />
                  ),
                }}
              /> */}
            </div>
          </SidebarBody>
        </Sidebar>

        <div className="flex no-scrollbar border flex-col flex-1 overflow-hidden">
          <Header header={getHeaderTitle()} />
          <div className="flex-1 no-scrollbar overflow-y-auto">{outlet}</div>
        </div>
      </div>
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Confirm Logout"
        size="sm"
        showCloseButton={true}
        closeOnBackdrop={true}
        closeOnEscape={true}
      >
        <div className="p-4">
          <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
            Are you sure you want to log out?
          </p>
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setModalOpen(false)}
              className="px-4 py-2 text-sm rounded bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

export const Logo = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      {/* <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" /> */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className=" text-blue-600 text-2xl font-bold dark:text-white whitespace-pre"
      >Digital Twin</motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="/"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
