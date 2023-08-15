import { Button, Box } from "@mui/material";

let FloatingBox = (props) => {
  let {
    highlightType,
    selectedUmpire,
    selectedGame,
    setSelectedGame,
    setSelectedUmpire,
    setHighlightType,
  } = props;

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
        sticky: "bottom",
        py: 3,
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
              {highlightType === "game"
                ? "Game"
                : highlightType === "umpire"
                ? "Umpire"
                : "-"}
            </Box>
            <Button
              sx={{ mx: 2 }}
              onClick={() => {
                setHighlightType("umpire");
                setSelectedGame({});
              }}
            >
              Filter by Umpire
            </Button>
            <Button
              sx={{ mx: 2 }}
              onClick={() => {
                setHighlightType("game");
                setSelectedUmpire({});
              }}
            >
              Filter by Game
            </Button>
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
