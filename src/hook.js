import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";

const API_URL =
  "https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=statsSingleSeason&season=20202021";

function App() {
  const [data, setData] = useState([]);

  let apiCall = async () => {
    try {
      let data = await axios.get(API_URL);
      setData(data);
    } catch (err) {
      console.log("fuck u");
    }
  };

  return (
    <div className="App">
      <button onClick={apiCall}>Click me Daddy</button>
      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
