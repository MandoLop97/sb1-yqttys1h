import { Link, useLocation } from "react-router-dom";
import { HomeIcon, LayoutDashboard, Settings, MenuIcon, Share2, BookOpen, ChevronLeft, ChevronRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme/ThemeSwitcher";
const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  const getItemClass = (path: string) => {
    return cn("flex items-center w-full rounded-md px-3 py-2 transition-colors", isActive(path) ? "bg-orange-500/10 text-orange-600 dark:bg-orange-500/20 dark:text-orange-400" : "hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300 hover:text-navy-800 dark:hover:text-white");
  };
  return <aside className={cn("admin-sidebar transition-all duration-300 flex flex-col h-screen", collapsed ? "w-[70px]" : "w-64")}>
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <Link to="/admin/dashboard" className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className="bg-gradient-to-br from-orange-500 to-red-500 w-9 h-9 rounded-md flex items-center justify-center text-white shadow-sm">
            <span className="font-bold text-sm">MP</span>
          </div>
          {!collapsed && <span className="font-semibold text-navy-800 dark:text-white">MasPedidos</span>}
        </Link>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-500 dark:text-gray-400" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </Button>
      </div>

      <div className="flex flex-col p-2 space-y-1 flex-grow">
        <Link to="/admin/dashboard">
          <div className={getItemClass("/admin/dashboard")}>
            <HomeIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Inicio</span>}
          </div>
        </Link>
        <Link to="/admin/panel">
          <div className={getItemClass("/admin/panel")}>
            <LayoutDashboard className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Panel</span>}
          </div>
        </Link>
        <Link to="/admin/menu">
          <div className={getItemClass("/admin/menu")}>
            <MenuIcon className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Menú</span>}
          </div>
        </Link>
        <Link to="/admin/share">
          <div className={getItemClass("/admin/share")}>
            <Share2 className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Compartir</span>}
          </div>
        </Link>
        <Link to="/admin/settings">
          <div className={getItemClass("/admin/settings")}>
            <Settings className={cn("h-5 w-5", collapsed ? "mx-auto" : "mr-3")} />
            {!collapsed && <span>Ajustes</span>}
          </div>
        </Link>
      </div>

      <div className={cn("border-t border-gray-200 dark:border-gray-700 flex flex-col gap-2", collapsed ? "p-2" : "p-3")}>
        {!collapsed ? <>
            <Link to="/admin/tutorials">
              <div className={cn("flex items-center rounded-md px-3 py-2 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300", isActive("/admin/tutorials") && "bg-gray-100 dark:bg-navy-700 text-navy-800 dark:text-white")}>
                <BookOpen className="h-5 w-5 mr-3" />
                <span>Tutoriales</span>
              </div>
            </Link>
            <div className="flex items-center justify-between mt-2">
              <ThemeSwitcher />
              <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
                <span className="bg-green-500 rounded-full h-2 w-2"></span>
                <span>Soporte activo</span>
              </div>
            </div>
            <div className="text-xs text-gray-600 dark:text-gray-300 flex items-center gap-2 mt-1 px-3">
              <PhoneCall className="h-3 w-3" />
              <span>+1 (462) 207-0235</span>
            </div>
          </> : <div className="flex flex-col gap-3 items-center">
            <Link to="/admin/tutorials">
              <div className={cn("flex items-center justify-center rounded-md p-2 hover:bg-gray-100 dark:hover:bg-navy-700 text-gray-700 dark:text-gray-300", isActive("/admin/tutorials") && "bg-gray-100 dark:bg-navy-700 text-navy-800 dark:text-white")}>
                <BookOpen className="h-5 w-5" />
              </div>
            </Link>
            <ThemeSwitcher />
            <div className="bg-green-500 rounded-full h-2 w-2 mb-1" title="Soporte activo"></div>
          </div>}
      </div>
    </aside>;
};
export default Sidebar;