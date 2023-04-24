import './App.css';
import { Draggable, Droppable } from 'react-drag-and-drop';
import {Stack} from "react-bootstrap"
import Umpires from './Umpires';
import Games from './Games';

function App() {
  return (
    <div className="App">
      <Stack direction="horizontal" gap={2} className="col-5 mx-auto container border">
      <Games className="col-7 mx-auto">
      </Games>
      <Umpires className="col-5 mx-auto">
      </Umpires>
      </Stack>
    </div>
  );
}

export default App;
