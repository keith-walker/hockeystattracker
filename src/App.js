import "./App.css";
import React from "react";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import HashMap from "hashmap";
import {
  Button,
  Toolbar,
  AppBar,
  Typography,
  TextField,
  Box,
  NativeSelect,
  InputLabel,
  FormControl,
} from "@material-ui/core";
import MaterialTable from "material-table";

const API_URL = "https://statsapi.web.nhl.com";

const getTeamsAndRostersWithoutYear =
  API_URL + "/api/v1/teams?expand=team.roster&season=";

let initMap = new HashMap();

const columns = [
  { title: "Category", field: "Category" },
  { title: "Values", field: "Values" },
];

function App() {
  const [data, setData] = useState([]);
  const [playerName, setPlayerName] = useState("");
  const [season, setSeason] = useState("20212022");
  const [tableHeader, setTableHeader] = useState("");
  const [getTeamsAndRosters, setTeamsAndRosters] = useState(
    getTeamsAndRostersWithoutYear + "20212022"
  );

  let apiCall = async () => {
    try {
      var start = Date.now();
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let player = initMap.get(playerName);
      let getPlayerStats = API_URL + player.link + queryParams + season;
      let data = await axios.get(getPlayerStats);
      let formattedData = data.data.stats[0].splits[0];
      createTable(
        formattedData,
        player.team,
        player.position,
        player.jerseyNumber
      );
    } catch (err) {
      console.log(err);
    }
  };

  let changeSeason = (value) => {
    setSeason(value);
    //need to reinitialize it everytime the year changes
    setTeamsAndRosters(getTeamsAndRostersWithoutYear + value);
    //when we change the value of getTeamsAndRosters, the code below wrapped in the "useCallback" runs automatically since
    //the hook is a depedency of the usecallback method... SO COOL, NO NEED TO EXPLICITLY CALL THE FUNCTION
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
      let queryParams = "/stats?stats=statsSingleSeason&season=";
      let getPlayerStats = API_URL + playerLink + queryParams + season;
      let data = await axios.get(getPlayerStats);
      let formattedData = data.data.stats[0].splits[0];
      //pass the data to the create table functions to make the table objects
      createTable(formattedData);
    } catch (err) {
      console.log(err);
    }
  };

  let createTable = (
    formattedData,
    playerTeam,
    playerPosition,
    jerseyNumber
  ) => {
    let formattedSeason =
      formattedData.season.substring(0, 4) +
      "-" +
      formattedData.season.substring(4, 9);
    let tableFormat = [
      { Category: "Current Team", Values: playerTeam },
      { Category: "Position", Values: playerPosition },
      { Category: "Jersey Number", Values: jerseyNumber },
      { Category: "Season", Values: formattedSeason },
      { Category: "Games Played", Values: formattedData.stat.games },
      { Category: "Goals", Values: formattedData.stat.goals },
      { Category: "Assists", Values: formattedData.stat.assists },
      { Category: "Points", Values: formattedData.stat.points },
      { Category: "Plus/Minus", Values: formattedData.stat.plusMinus },
      {
        Category: "Penalty Minutes",
        Values: formattedData.stat.penaltyMinutes,
      },
      { Category: "Shots", Values: formattedData.stat.shots },
      { Category: "Time On Ice", Values: formattedData.stat.timeOnIce },
      {
        Category: "Time On Ice Per Game",
        Values: formattedData.stat.timeOnIcePerGame,
      },
      { Category: "Shifts", Values: formattedData.stat.shifts },
    ];
    setTableHeader(playerName + "'s Stats");
    setData(tableFormat);
  };

  let createPlayer = (person, team) => {
    const playerValue = {
      name: person.person.fullName,
      jerseyNumber: person.jerseyNumber,
      team: team.name,
      position: person.position.name,
      id: person.person.id,
      link: person.person.link,
    };
    return playerValue;
  };

  //when we change the value of getTeamsAndRosters, the code below wrapped in the "useCallback" runs automatically since
  //the hook is a depedency of the usecallback method... SO COOL, NO NEED TO EXPLICITLY CALL THE FUNCTION anywhere
  let initializePlayerData = useCallback(() => {
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
            const playerValue = createPlayer(roster[j], teams[i]);
            initMap.set(roster[j].person.fullName, playerValue);
          }
        }
      } catch (err) {
        console.log(err);
      }
    })();
  }, [getTeamsAndRosters]);

  useEffect(() => {
    initializePlayerData();
  }, [initializePlayerData]);

  return (
    <div className="App">
      <AppBar position="static" color="default">
        <Toolbar style={{ justifyContent: "center" }}>
          <Typography component={"span"} variant={"body2"}>
            <Box>
              <FormControl>
                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                  Season
                </InputLabel>
                <NativeSelect
                  defaultValue={season}
                  inputProps={{
                    name: "Season",
                    id: "uncontrolled-native",
                  }}
                  onChange={(e) => changeSeason(e.target.value)}
                >
                  {/* <option value={career}>Career</option> */}
                  <option value={20192020}>2019-2020</option>
                  <option value={20202021}>2020-2021</option>
                  <option value={20212022}>2021-2022</option>
                </NativeSelect>
              </FormControl>
              &nbsp;
              <TextField
                label="Player Name"
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
              ></TextField>
              &nbsp;
              <Button color="primary" variant="contained" onClick={apiCall}>
                Get Stats
              </Button>
              &nbsp;
              {/* <Button
                color="primary"
                variant="contained"
                onClick={extraApiCall}
              >
                2 API Calls
              </Button> */}
            </Box>
          </Typography>
        </Toolbar>
      </AppBar>

      <MaterialTable
        title={tableHeader}
        data={data}
        columns={columns}
        options={{ search: false, paging: false }}
      />
    </div>
  );
}

export default App;
