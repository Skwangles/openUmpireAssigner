import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import {
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Box,
  Table,
  TableBody,
  TableHead,
} from "@mui/material";
import React from "react";
import { unavailableRowColour } from "../constants";

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
    <>
      <TableRow
        onClick={handleClickToFocus}
        draggable
        onDragStart={(event) => handleDragStart(event, props.info)}
        sx={{ backgroundColor: isUnavailable ? unavailableRowColour : "" }}
      >
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell>{Name}</TableCell>
        <TableCell>{Levels.length > 0 ? Levels.join(", ") : "None"}</TableCell>
        <TableCell>{Teams.length > 0 ? Teams.join(", ") : "None"}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={4}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Club</TableCell>
                    <TableCell>Restricted Turf</TableCell>
                    <TableCell>Blockout Dates</TableCell>
                    <TableCell>Limited Times</TableCell>
                    <TableCell>TBAO</TableCell>
                    <TableCell>Notes</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
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
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default Umpire;