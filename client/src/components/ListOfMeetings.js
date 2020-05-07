import React, { Component } from 'react';
import axios from 'axios';
import CountDown from './CountDown';
import behaviour from '../media/behaviour.png';
import diplomacy from '../media/diplomacy.png';
import moderation from '../media/moderation.png';
import security from '../media/security.png';
import technology from '../media/technology.png';


let userData = [
  { id: 1, email: 'djordjej@diplomacy.edu', meetingId: 96078707611, icon: behaviour, color: 'rgb(240, 141, 0)' },
  { id: 2, email: 'arvink@diplomacy.edu', meetingId: 97321314807, icon: diplomacy, color: 'rgb(0, 120, 175)' },
  { id: 3, email: 'aleksandarf@diplomacy.edu', meetingId: 93042015216, icon: moderation, color: 'rgb(229, 0, 4)' },
  { id: 4, email: 'natasap@diplomacy.edu', meetingId: 93990238126, icon: security, color: 'rgb(69, 173, 99)' },
  { id: 5, email: 'milicak@diplomacy.edu', meetingId: 96518366804, icon: technology, color: 'rgb(0, 126, 136)' },
  { id: 6, email: 'katarinaa@diplomacy.edu', meetingId: 96989625816, color: 'rgb(204, 204, 204)' },
  { id: 7, email: 'daliborka.b.ciric@gmail.com', meetingId: 72354196399, color: 'rgb(204, 204, 204)' }
]

class ListOfMeetings extends Component {
  constructor() {
    super();

    this.state = {
      data1: null,
      allMeetings: null,
      timeLeftForMeeting: null
    };
  }

  componentDidMount() {
    if (!this.state.allMeetings) {
      this.getData().then(data1 => this.setState({ data1 }))
        .catch(err => { console.log('There is now meetings') })
    }

    if (!this.state.data1) {
      this.getAllMeetings().then(allMeetings => this.setState({ allMeetings }))
        .catch(err => { console.log('SOMETHING WENT WRONG') });
    }
  }

  async getData() {
    const res = await fetch('/userinfo');
    return await res.json();
  }

  async getAllMeetings() {
    const users = userData.map(user => {
      return axios
        .get(`/meetings/${user.email}`)
        .then(res => res.data)
        .catch(e => console.error(e));
    })

    return Promise.all(users).then(res => res);
  }

  render() {
    var meetingIds = userData.map(meeting => meeting.meetingId);
    return (
      <div className="container App">
        <div className="row col-12">
          {this.state.allMeetings && this.state.allMeetings.map(data =>
            data.meetings.sort((a, b) => b.start_time - a.start_time)
              .filter(meeting => meetingIds.indexOf(meeting.id) > -1)
              .map(meeting =>
                <div key={meeting.id} className="col-4 py-2">
                  {userData.filter(d => d.meetingId === meeting.id).map(d =>
                    <div key={d.meetingId} style={{ backgroundColor: d.color }} className="py-4">
                      <img src={d.icon} alt={d.id}/>
                      <h6 className="title">{meeting.topic}</h6>
                      <p className="lead">Meeting duration: {meeting.duration}min</p>
                      <hr className="my-4" />
                      <CountDown date={meeting.start_time} />
                      {meeting.agenda && <p>{meeting.agenda}</p>}
                      {new Date(meeting.start_time) > new Date() ?
                        <a className="btn btn-light main-button" target="blank" href={meeting.join_url} role="button">Join meeting</a>
                        : null}
                    </div>
                  )}
                </div>
              )
          )}
        </div>
      </div>
    );
  }
}

export default ListOfMeetings;