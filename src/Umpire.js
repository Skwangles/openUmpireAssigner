function Umpire(props) {
    
  // Highlighting
  let handleClickToFocus = (data, event) => {
    props.setSelectedUmpire(props.info)
  }
  
  // Drag and drop handling
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData('umpire', JSON.stringify(umpire));
  };

  let {name, canMens, canWomens, isDisabled, skillLevel} = props.info
  
  return (
    <tr
    onClick={handleClickToFocus} 
    draggable onDragStart={(event) => handleDragStart(event, props.info)} className={isDisabled === true ? "disabled" : "" } >

    {/* Umpire info */}
       <td>{name}</td>
        <td>{canMens ? "M" : "-"}/{canWomens ? "W" : "-"}</td>
        <td>{skillLevel}</td>
        <td>{props.info.teams.length > 0 ? props.info.teams.join(', ') : "None"}</td>
        <td>{props.info.club || "-"}</td>
        <td>{props.info.notes || "-"}</td>
        {isDisabled ? (props.info.reason ? <td>Disabled: {props.info.reason}</td> : "") : ""}
    </tr>
  );
}

export default Umpire;