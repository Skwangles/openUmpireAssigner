import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();
  return (
    <nav style={{ position: "sticky", top: 0, zIndex: 100000 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          navigate("/");
        }}
      >
        Appointments
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={(e) => {
          e.preventDefault();
          navigate("/dashboard");
        }}
      >
        Dashboard
      </Button>
    </nav>
  );
};

export default Navigation;
