import { Collapse, IconButton, TableCell, TableRow } from "@mui/material";

function Umpire(props) {
  const [open, setOpen] = React.useState(false);
  // Highlighting
  let handleClickToFocus = () => {
    props.setSelectedUmpire(props.info);
  };

  // Drag and drop handling
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData("umpire", JSON.stringify(umpire));
    props.setSelectedUmpire(umpire);
  };

  let {
    Name,
    isUnavailable,
    Levels,
    Club,
    Notes,
    Teams,
    RestrictedTurf,
    BlockoutDates,
    LimitedTimes,
    TBAO,
  } = props.info;

  return (
    <TableRow
      onClick={handleClickToFocus}
      draggable
      onDragStart={(event) => handleDragStart(event, props.info)}
      className={isUnavailable === true ? "table-danger" : ""}
    >
      <TableCell>
        <IconButton
          aria-label="expand row"
          size="small"
          onClick={() => setOpen(!open)}
        >
          {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        </IconButton>
      </TableCell>
      <TableCell>{Name}</TableCell>
      <TableCell>{Levels.length > 0 ? Levels.join(", ") : "None"}</TableCell>
      <TableCell>{Teams.length > 0 ? Teams.join(", ") : "None"}</TableCell>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <Box>
          <Table>
            <TableCell>{Club || "-"}</TableCell>
            <TableCell>
              {RestrictedTurf && RestrictedTurf.length > 0
                ? RestrictedTurf?.join(", ")
                : "-" || "-"}
            </TableCell>
            <TableCell>
              {BlockoutDates && BlockoutDates.length > 0
                ? BlockoutDates?.join(", ")
                : "-" || "-"}
            </TableCell>
            <TableCell>
              {LimitedTimes && LimitedTimes.length > 0
                ? LimitedTimes?.join(", ")
                : "-" || "-"}
            </TableCell>
            <TableCell>{TBAO || "-"}</TableCell>
            <TableCell>
              {Notes +
                (isUnavailable
                  ? props.info.reason
                    ? " Unavailable: " + props.info.reason
                    : ""
                  : "") || "-"}
            </TableCell>
          </Table>
        </Box>
      </Collapse>
    </TableRow>
  );
}

export default Umpire;
