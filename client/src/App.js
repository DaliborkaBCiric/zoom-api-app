/* Import statements */
import React from "react";
import { Route } from "react-router-dom";
import Home from './components/Home'
import ListOfMeetings from './components/ListOfMeetings'

export default function App() {
  return (
    <div>
      <Route path="/" exact={true} component={Home} />
      <Route path="/meetings" component={ListOfMeetings} />
    </div>
  );
}