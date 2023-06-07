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

  let {Name, isDisabled, Levels, Club, Notes, Teams, TBAO} = props.info

  return (
    <tr
    onClick={handleClickToFocus} 
    draggable onDragStart={(event) => handleDragStart(event, props.info)} className={isDisabled === true ? "disabled" : "" } >

    {/* Umpire info */}
       <td>{Name}</td>
        <td>{Levels.length > 0 ? Levels.join(', ') : "None"}</td>
        <td>{Teams.length > 0 ? Teams.join(', ') : "None"}</td>
        <td>{Club || "-"}</td>
        <td>{TBAO || "-" }</td>
        <td>{Notes || "-"}</td>
        
        {isDisabled ? (props.info.reason ? <td>Disabled: {props.info.reason}</td> : <td></td>) : <td></td>}

    </tr>
  );
}

export default Umpire;