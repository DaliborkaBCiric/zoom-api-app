import React, { Component } from 'react';

class ListOfMeetings extends Component {
  constructor() {
    super();
    this.state = { data1: null, allMeetings: null };
  }

  componentDidMount() {
    if (!this.state.allMeetings) {
      this.getAllMeetings().then(allMeetings => this.setState({ allMeetings }))
        .catch(err => { console.log('There is now meetings') })
    }

    if (!this.state.data1) {
      this.getData().then(data1 => this.setState({ data1 }))
        .catch(err => { console.log('SOMETHING WENT WRONG') });
    }
  }

  async getAllMeetings() {
    const res = await fetch('/meetings');
    return await res.json();
  }

  async getData() {
    const res = await fetch('/userinfo');
    return await res.json(); // (Or whatever)
  }

  render() {
    return (
      <div className="App">
        User email {
          this.state.data1 && this.state.data1.email
        }
        <div>
          Meeting url: {
            this.state.allMeetings && this.state.allMeetings.personal_meeting_url
          }
        </div>
        {/* <div className="iframe-container" style={{ overflow: 'hidden', paddingTop: '56.25%', position: 'relative' }}>
          <iframe allow="microphone; camera" style={{ border: 0, height: '100%', left: 0, position: 'absolute', top: 0, width: '100%' }}
            src="https://success.zoom.us/wc/join/72354196399" frameborder="0"></iframe>
        </div> */}
      </div>
    );
  }
}

export default ListOfMeetings;