function Umpire(props) {
    
  let handleClickToFocus = (data, event) => {
    props.setSelectedUmpire(props.info)
  }
  
  const handleDragStart = (event, umpire) => {
    event.dataTransfer.setData('umpire', JSON.stringify(umpire));
  };

  let {name, canMens, canWomens} = props.info

  return (
    <tr>
      <td type="umpire" data={JSON.stringify(props.info)} onClick={handleClickToFocus} draggable onDragStart={(event) => handleDragStart(event, props.info)}>
        {name}:{canMens ? "M" : "-"}/{canWomens ? "W" : "-"}/{"Teams:" + props.info.teams.join(', ')}
    </td>
    </tr>
  );
}

export default Umpire;