import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import HashMap from "hashmap";

const API_URL = "https://statsapi.web.nhl.com";

const getTeamsAndRosters = API_URL + "/api/v1/teams?expand=team.roster";

let initMap = new HashMap();

let season = "20202021";

function App() {
  const [data, setData] = useState([]);
  const [playerName, setPlayerName] = useState("");

  let apiCall = async () => {
    try {
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let player = initMap.get(playerName);
      let getPlayerStats = API_URL + player.link + queryParams + season;
      let data = await axios.get(getPlayerStats);
      setData(data.data.stats[0].splits[0]);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let cachedData = await axios.get(getTeamsAndRosters);
        let teams = cachedData.data.teams;
        initMap = new HashMap();
        //teams is an array, loop through this and to teams[i].roster.roster
        //roster is also an array, loop through this array and access the .person element in each element
        //cache the roster[i].person.fullName as the key, and the roster[i].person as the value
        for (let i = 0; i < teams.length; i++) {
          let roster = teams[i].roster.roster;
          for (let j = 0; j < roster.length; j++) {
            initMap.set(roster[j].person.fullName, roster[j].person);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="App">
      <form>
        <label>
          Player Name
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
          ></input>
        </label>
      </form>

      <button onClick={apiCall}>Get Player</button>
      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
