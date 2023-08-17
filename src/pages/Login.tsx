import { TextField, Button } from "@mui/material";
import { useState } from "react";
import axios from "axios";

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
  
    const handleLogin = async () => {
      try {
        const response = await axios.post("/api/login", { username, password });
        if (response.data.ok) {
          onLogin();
        } else {
          setError("Invalid username or password");
        }
      } catch (error) {
        setError("An error occurred");
      }
    };
  
    return (
      <div>
        <h1>Login</h1>
        <TextField
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button variant="contained" onClick={handleLogin}>
          Login
        </Button>
        {error && <p>{error}</p>}
      </div>
    );
  };

  export default LoginPage