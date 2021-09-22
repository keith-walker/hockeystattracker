import React, { Component, useState } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

const api=axios.create({
  baseURL: 'https://statsapi.web.nhl.com/api/v1/people/8474141/stats?stats=statsSingleSeason&season=20202021'
})

let stats1;
let test;

class App extends Component {
    state = {
      stats:[]
    }
    constructor(){
      super();
      api.get('').then(res=>{
        //console.log(res.data)
        test=res.data.stats[0].splits[0].season;
        console.log(test);
        let stats=JSON.stringify(res.data.stats[0].splits[0], null, 2);
        console.log(stats);
        this.state=({stats1: res.data.stats[0].splits[0]});
        //console.log(this.state);
      })
    }

  render() {
    return (
      <div className="App">
        <pre> {JSON.stringify(stats1, null, 2)} </pre>
        <b> {test} </b>
      </div>
    );
  }

}
export default App;