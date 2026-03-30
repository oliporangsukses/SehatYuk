import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ActivityList from "../components/ActivityList";
import ChartCard from "../components/ChartCard";

export default function Dashboard() {
  return (

    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar />

      <div className="flex-1 p-8">

        <Topbar />

        {/* STAT CARD */}

        <div className="grid grid-cols-3 gap-6 mb-8">

          <StatCard
            title="Calories Burned"
            value="520 kcal"
          />

          <StatCard
            title="Steps Today"
            value="8,432"
          />

          <StatCard
            title="Water Intake"
            value="1.8 L"
          />

        </div>

        {/* CHART + ACTIVITY */}

        <div className="grid grid-cols-2 gap-6">

          <ChartCard />

          <ActivityList />

        </div>

      </div>

    </div>

  );
}
