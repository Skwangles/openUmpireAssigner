import { Check } from "@mui/icons-material";
import { Box, ToggleButton } from "@mui/material";

export default function UseSql({ useSql, setUseSql, isAuthenticated }) {
  if (isAuthenticated !== true) {
    setUseSql(false);
    return;
  }

  return (
    <Box
      sx={{ width: "100%", py: 2 }}
      display={"flex"}
      flexDirection={"row"}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <h3>Use Database Stored Values:</h3>

      <ToggleButton
        value="check"
        selected={useSql}
        onChange={() => {
          if (!isAuthenticated) {
            localStorage.setItem("useSql", JSON.stringify(false));
            setUseSql(false);
            alert("You must be logged in to use this feature");
            return;
          }
          localStorage.setItem("useSql", JSON.stringify(!useSql));
          setUseSql(!useSql);
        }}
      >
        <Check />
      </ToggleButton>
    </Box>
  );
}
