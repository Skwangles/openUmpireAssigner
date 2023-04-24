import { Draggable } from "react-drag-and-drop";

function Umpire(props) {
    let {name, canMens, canWomens} = props.info
  return (
    <Draggable type="umpire" data={JSON.stringify(props.info)}>
        <p>{name}: {canMens ? "M" : "-"}/{canWomens ? "W" : "-"}</p>
    </Draggable>
  );
}

export default Umpire;