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
      var start = Date.now();
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let player = initMap.get(playerName);
      let getPlayerStats = API_URL + player.link + queryParams + season;
      let data = await axios.get(getPlayerStats);
      setData(data.data.stats[0].splits[0]);
      console.log(Date.now() - start);
    } catch (err) {
      console.log(err);
    }
  };

  let extraApiCall = async () => {
    try {
      var start = Date.now();
      //make initial call to get team roster data
      let teamRosterData = await axios.get(getTeamsAndRosters);
      let teams = teamRosterData.data.teams;
      //teams is an array, loop through this and to teams[i].roster.roster
      //roster is also an array, loop through this array and access the .person element in each element
      //if roster[i].person.fullName is the name we want, break out and use the roster[i].person.
      let playerLink = "";
      for (let i = 0; i < teams.length; i++) {
        let roster = teams[i].roster.roster;
        for (let j = 0; j < roster.length; j++) {
          if (roster[j].person.fullName === playerName) {
            playerLink = roster[j].person.link;
          }
        }
      }
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let getPlayerStats = API_URL + playerLink + queryParams + season;
      let data = await axios.get(getPlayerStats);
      setData(data.data.stats[0].splits[0]);
      console.log(Date.now() - start);
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

      <button onClick={apiCall}>1 API Call</button>
      <button onClick={extraApiCall}>2 API Calls</button>
      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
