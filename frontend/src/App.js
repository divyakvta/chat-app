import { Button } from "@chakra-ui/react";
import "./App.css";
import { Route } from "react-router-dom/cjs/react-router-dom.min";
import Homepage from "./Pages/Homepage";
import Chatpage from "./Pages/Chatpage";

function App() {
  return <div className="App">
<Route path="/" component={Homepage} exact/>
<Route path="/chat" component={Chatpage}/>

  </div>;
}

export default App;
