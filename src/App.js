import React, { Component } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const api=axios.create({
  baseURL: 'https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=statsSingleSeason&season=20202021'
})

let stats;

class App extends Component {
    state = {
      stats:[]
    }
    constructor(){
      super();
      api.get('').then(res=>{
        console.log(res.data)
        stats=res.data.stats[0].splits[0];
        console.log(stats);
        this.state=({stats: res.data.stats[0].splits[0]});
        console.log(this.state);
      })
    }

  render() {
    return (
      <div className="App">
        {stats}
      </div>
    );
  }
}
export default App;