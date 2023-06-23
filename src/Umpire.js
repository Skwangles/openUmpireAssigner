function Umpire(props) {
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
    TBAO,
  } = props.info;

  return (
    <tr
      onClick={handleClickToFocus}
      draggable
      onDragStart={(event) => handleDragStart(event, props.info)}
      className={isUnavailable === true ? "table-danger" : ""}
    >
      {/* Umpire info */}
      <td>{Name}</td>
      <td>{Levels.length > 0 ? Levels.join(", ") : "None"}</td>
      <td>{Teams.length > 0 ? Teams.join(", ") : "None"}</td>
      <td>{Club || "-"}</td>
      <td>
        {RestrictedTurf && RestrictedTurf.length > 0
          ? RestrictedTurf?.join(", ")
          : "-" || "-"}
      </td>
      <td>
        {BlockoutDates && BlockoutDates.length > 0
          ? BlockoutDates?.join(", ")
          : "-" || "-"}
      </td>
      <td>{TBAO || "-"}</td>
      <td>
        {Notes +
          (isUnavailable
            ? props.info.reason
              ? " Unavailable: " + props.info.reason
              : ""
            : "") || "-"}
      </td>
    </tr>
  );
}

export default Umpire;
