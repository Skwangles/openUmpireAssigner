import { Button } from "@mui/material";

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
    <div
      className="sticky-bottom py-3 container-sm d-flex justify-content-center"
      style={{ width: "auto", pointerEvents: "none" }}
    >
      <div
        className=" control-panel p-3 border border-dark rounded"
        style={{ pointerEvents: "auto" }}
      >
        <div className="pb-2">
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
            <span
              className="border border-1 border-dark rounded p-1"
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
            </span>
          ) : (
            "None"
          )}
        </div>
        <div draggable onDragStart={handleDragStartOfEmpty} className="mt-2">
          <i className="border border-dark rounded p-1">
            Drag/Drop me to clear an allocation
          </i>
        </div>

        <div className="py-2">
          <div className="py-1">
            <div className="pb-2">
              <b>Filtering by: </b>
              {highlightType === "game"
                ? "Game"
                : highlightType === "umpire"
                ? "Umpire"
                : "-"}
            </div>
            <Button
              className="btn-sm mx-2"
              onClick={() => {
                setHighlightType("umpire");
                setSelectedGame({});
              }}
            >
              Filter by Umpire
            </Button>
            <Button
              className="btn-sm mx-2"
              onClick={() => {
                setHighlightType("game");
                setSelectedUmpire({});
              }}
            >
              Filter by Game
            </Button>
          </div>
          <Button
            className="btn-sm mx-2"
            onClick={() => {
              setSelectedUmpire({});
              setSelectedGame({});
            }}
          >
            Clear Unavailabilities
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FloatingBox;
