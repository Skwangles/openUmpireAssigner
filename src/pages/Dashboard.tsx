import { Navigate } from "react-router-dom";

const DashboardPage = ({isAuthenticated}) => {
    if (isAuthenticated !== true){
        return <Navigate to="/login"/>
    }

    return (
      <div>
        <h1>Dashboard</h1>
        {/* Your dashboard components */}
      </div>
    );
  };

  export default DashboardPage