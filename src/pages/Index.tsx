import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { GoalsView } from "@/components/goals/GoalsView";
import { RoutinesView } from "@/components/routines/RoutinesView";
import { FinanceView } from "@/components/finance/FinanceView";
import { SettingsView } from "@/components/settings/SettingsView";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/useNotifications";

const tabTitles: Record<string, string> = {
  dashboard: "ORBIT",
  goals: "Goals",
  routines: "Routines",
  finance: "Finance",
  settings: "Settings",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  // Initialize native notifications for alarm sync
  useNotifications();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;
      case "goals":
        return <GoalsView />;
      case "routines":
        return <RoutinesView />;
      case "finance":
        return <FinanceView />;
      case "settings":
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {isMobile ? (
        <>
          <MobileHeader title={tabTitles[activeTab]} setActiveTab={setActiveTab} />
          <main className="pt-14 pb-20 px-4">
            <div className="py-4">
              {renderContent()}
            </div>
          </main>
          <MobileNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      ) : (
        <>
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            isCollapsed={isCollapsed}
            setIsCollapsed={setIsCollapsed}
          />
          <main
            className={cn(
              "min-h-screen transition-all duration-300",
              isCollapsed ? "ml-20" : "ml-64"
            )}
          >
            <div className="p-8 max-w-7xl mx-auto">
              {renderContent()}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
