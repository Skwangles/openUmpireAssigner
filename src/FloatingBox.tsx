import { Button, Box, Stack, Typography, Switch } from "@mui/material";
import { useState } from "react";

let FloatingBox = (props) => {
  let {
    highlightType,
    selectedUmpire,
    selectedGame,
    setSelectedGame,
    setSelectedUmpire,
    setHighlightType,
  } = props;

  const [checked, setChecked] = useState(highlightType === "game");

  const handleFilterByChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked === true) {
      setHighlightType("game");
      setSelectedUmpire({});
    } else {
      setHighlightType("umpire");
      setSelectedGame({});
    }

    setChecked(event.target.checked);
  };

  /**
   * Drag and drop handling
   * @param {*} event - Drag start event object, this is given to the Drop event
   */
  const handleDragStartOfEmpty = (event) => {
    event.dataTransfer.setData("umpire", JSON.stringify({}));
  };

  // Drag and drop handling
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData("umpire", JSON.stringify(umpire));
  };

  return (
    <Box
      sx={{
        position: "sticky",
        bottom: 0,
        display: "flex",
        justifyContent: "center",
        width: "auto",
        pointerEvents: "none",
      }}
    >
      <Box
        sx={{
          pointerEvents: "auto",
          p: 3,
          border: 1,
          borderColor: "black",
          borderRadius: 1,
        }}
        className="control-panel"
        style={{ pointerEvents: "auto" }}
      >
        <Box sx={{ pb: 2 }}>
          <b>Checking availability for: </b>
          {highlightType === "game" ? (
            selectedGame["A"] ? (
              selectedGame.Date +
              "@" +
              selectedGame.Time +
              " - " +
              selectedGame.A +
              " vs " +
              selectedGame.B
            ) : (
              "None"
            )
          ) : selectedUmpire["Name"] ? (
            <Box
              component={"span"}
              sx={{ border: 1, borderColor: "black", borderRadius: 1, p: 1 }}
              draggable
              onDragStart={(event) => {
                handleDragStart(event, selectedUmpire);
              }}
            >
              {selectedUmpire.Name +
                " - Levels: " +
                selectedUmpire.Levels +
                " - Teams: " +
                selectedUmpire.Teams}
            </Box>
          ) : (
            "None"
          )}
        </Box>
        <Box sx={{ mt: 2 }} draggable onDragStart={handleDragStartOfEmpty}>
          <Box
            component={"i"}
            sx={{ border: 1, borderColor: "black", borderRadius: 16, p: 1 }}
          >
            Drag/Drop me to clear an allocation
          </Box>
        </Box>

        <Box sx={{ py: 2 }}>
          <Box sx={{ py: 1 }}>
            <Box sx={{ pb: 2 }}>
              <b>Filtering by: </b>
            </Box>
            <Box
              display={"flex"}
              alignItems={"center"}
              justifyContent={"center"}
              flexDirection={"row"}
            >
              <Typography>Umpire</Typography>
              <Switch
                checked={checked}
                onChange={handleFilterByChange}
                inputProps={{ "aria-label": "controlled" }}
              />
              <Typography>Game</Typography>
            </Box>
          </Box>
          <Button
            sx={{ mx: 2 }}
            onClick={() => {
              setSelectedUmpire({});
              setSelectedGame({});
            }}
          >
            Clear Unavailabilities
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FloatingBox;
