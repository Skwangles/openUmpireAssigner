function Umpire(props) {
    
  // Highlighting
  let handleClickToFocus = (event) => {
    props.setSelectedUmpire(props.info)
  }
  
  // Drag and drop handling
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData('umpire', JSON.stringify(umpire));
    props.setSelectedUmpire(umpire)
  };

  let {name, isDisabled, levels, club, notes, teams} = props.info

  return (
    <tr
    onClick={handleClickToFocus} 
    draggable onDragStart={(event) => handleDragStart(event, props.info)} className={isDisabled === true ? "disabled" : "" } >

    {/* Umpire info */}
       <td>{name}</td>
        <td>{levels || "-"}</td>
        <td>{teams.length > 0 ? teams.join(', ') : "None"}</td>
        <td>{club || "-"}</td>
        <td>{notes || "-"}</td>
        
        {isDisabled ? (props.info.reason ? <td>Disabled: {props.info.reason}</td> : "") : ""}

    </tr>
  );
}

export default Umpire;