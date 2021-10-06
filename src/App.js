import "./App.css";
import axios from "axios";
import { useState } from "react";
import { BasicTable } from "./table";
import HashMap from "hashmap";

const getPlayerStats =
  "https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=statsSingleSeason&season=20202021";

const getTeamsAndRosters =
  "https://statsapi.web.nhl.com/api/v1/teams?expand=team.roster";

function App() {
  const [data, setData] = useState([]);
  const [cachedData, cacheData] = useState([]);

  let apiCall = async () => {
    try {
      let data = await axios.get(getPlayerStats);
      setData(data.data.stats[0].splits[0]);
    } catch (err) {
      console.log(err);
    }
  };

  let init = async () => {
    try {
      let cachedData = await axios.get(getTeamsAndRosters);
      let teams = cachedData.data.teams;
      let initMap = new HashMap();
      //teams is an array, loop through this and to teams.roster.roster
      //roster is also an array, loop through this array and access the .person element in each element and see if the .fullName matches the one we are looking for
      //cache the roster[i].person.fullName as the key, and the roster[i].person as the value
      for (let i = 0; i < teams.length; i++) {
        let roster = teams[i].roster.roster;
        for (let j = 0; j < roster.length; j++) {
          initMap.set(roster[j].person.fullName, roster[j].person);
        }
      }

      console.log(initMap);
      console.log(initMap.get("Aaron Dell"));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="App">
      {/* <BasicTable /> */}
      <button onClick={init}>Initialize</button>
      <button onClick={apiCall}>Get Player</button>
      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
