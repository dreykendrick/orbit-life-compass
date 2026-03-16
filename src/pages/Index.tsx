import { useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileNav } from "@/components/layout/MobileNav";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { GoalsView } from "@/components/goals/GoalsView";
import { RoutinesView } from "@/components/routines/RoutinesView";
import { FinanceView } from "@/components/finance/FinanceView";
import { SettingsView } from "@/components/settings/SettingsView";
import { TasksView } from "@/components/tasks/TasksView";
import { FocusSessionsView } from "@/components/focus/FocusSessionsView";
import { RemindersView } from "@/components/reminders/RemindersView";
import { ReflectionsView } from "@/components/reflections/ReflectionsView";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { NotificationBell } from "@/components/notifications/NotificationCenter";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNotifications } from "@/hooks/useNotifications";
import { useNotificationEngine } from "@/hooks/useNotificationEngine";

const tabTitles: Record<string, string> = {
  dashboard: "ORBIT",
  goals: "Goals",
  tasks: "Tasks",
  routines: "Routines",
  focus: "Focus",
  reminders: "Reminders",
  reflections: "Reflect",
  finance: "Finance",
  settings: "Settings",
};

const Index = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const isMobile = useIsMobile();
  
  // Initialize native notifications for alarm sync
  useNotifications();
  // Initialize desktop notification engine
  useNotificationEngine();

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "goals": return <GoalsView />;
      case "tasks": return <TasksView />;
      case "routines": return <RoutinesView />;
      case "focus": return <FocusSessionsView />;
      case "reminders": return <RemindersView />;
      case "reflections": return <ReflectionsView />;
      case "finance": return <FinanceView />;
      case "settings": return <SettingsView />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Notification Center */}
      <NotificationCenter open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {isMobile ? (
        <>
          <MobileHeader title={tabTitles[activeTab]} setActiveTab={setActiveTab} onNotificationClick={() => setNotificationsOpen(!notificationsOpen)} />
          <main className="pt-14 pb-20 px-4">
            <div className="py-4">{renderContent()}</div>
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
          <main className={cn("min-h-screen transition-all duration-300", isCollapsed ? "ml-20" : "ml-64")}>
            <div className="p-8 max-w-7xl mx-auto">
              {/* Top bar with notification bell */}
              <div className="flex justify-end mb-4">
                <NotificationBell onClick={() => setNotificationsOpen(!notificationsOpen)} />
              </div>
              {renderContent()}
            </div>
          </main>
        </>
      )}
    </div>
  );
};

export default Index;
