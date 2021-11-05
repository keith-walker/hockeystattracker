import "./App.css";
import axios from "axios";
import { useState, useEffect } from "react";
import HashMap from "hashmap";
import {
  Button,
  Toolbar,
  AppBar,
  Typography,
  TextField,
  Box,
} from "@material-ui/core";
import MaUTable from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";

const API_URL = "https://statsapi.web.nhl.com";

const getTeamsAndRosters = API_URL + "/api/v1/teams?expand=team.roster";

let initMap = new HashMap();

let season = "20212022";

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
      console.log("1 call = " + (Date.now() - start) + "ms");
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
      let innerloop = 0;
      let outerloop = 0;
      let playerLink = "";
      for (let i = 0; i < teams.length; i++) {
        outerloop++;
        let roster = teams[i].roster.roster;
        for (let j = 0; j < roster.length; j++) {
          innerloop++;
          if (roster[j].person.fullName === playerName) {
            playerLink = roster[j].person.link;
            break;
          }
        }
        if (playerLink !== "") {
          break;
        }
      }
      console.log("innerloop= " + innerloop);
      console.log("outerloop= " + outerloop);
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let getPlayerStats = API_URL + playerLink + queryParams + season;
      let data = await axios.get(getPlayerStats);
      setData(data.data.stats[0].splits[0]);
      console.log(data.data.stats[0].splits[0]);
      console.log("2 calls = " + (Date.now() - start) + "ms");
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
        let outerloop = 0;
        let innerloop = 0;
        for (let i = 0; i < teams.length; i++) {
          outerloop++;
          let roster = teams[i].roster.roster;
          for (let j = 0; j < roster.length; j++) {
            innerloop++;
            initMap.set(roster[j].person.fullName, roster[j].person);
          }
        }
        console.log("innerloop= " + innerloop);
        console.log("outerloop= " + outerloop);
      } catch (err) {
        console.log(err);
      }
    })();
  }, []);

  return (
    <div className="App">
      <AppBar position="static" color="default">
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography component={"span"} variant={"body2"}>
            <Box>
              <TextField
                label="Player Name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              ></TextField>
              <Button color="primary" variant="contained" onClick={apiCall}>
                1 API Call
              </Button>
              <Button
                color="primary"
                variant="contained"
                onClick={extraApiCall}
              >
                2 API Calls
              </Button>
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>

      <pre> {JSON.stringify(data, null, 2)} </pre>
    </div>
  );
}

export default App;
