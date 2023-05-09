import { Draggable } from "react-drag-and-drop";

function Umpire(props) {
    
  let handleClickToFocus = (data, event) => {
    props.setSelectedUmpire(props.info)
  }
  
  let {name, canMens, canWomens} = props.info

  return (
    <tr>
      <td>
    <Draggable type="umpire" data={JSON.stringify(props.info)} onClick={handleClickToFocus}>
        {name}:{canMens ? "M" : "-"}/{canWomens ? "W" : "-"}/{"Teams:" + props.info.teams.join(', ')}
    </Draggable>
    </td>
    </tr>
  );
}

export default Umpire;