import "./App.css";
import axios from "axios";
import { useState } from "react";
import { BasicTable } from "./table";

const API_URL =
  "https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=statsSingleSeason&season=20202021";

function App() {
  const [data, setData] = useState([]);

  let apiCall = async () => {
    try {
      let data = await axios.get(API_URL);
      setData(data.data.stats[0].splits[0]);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      <BasicTable />
      <button onClick={apiCall}>Click me</button>
      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
