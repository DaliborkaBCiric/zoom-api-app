import React, { Component } from 'react';
import logo from '../media/diplo-logo-30.png';

class Home extends Component {
    render() {
        return (
            <div className="container welcomeSection">
                <img src={logo} />
                <h1 className="py-3">The Future of Meetings</h1>
                <div className="input-group input-group-lg auto-width">
                    <input type="text" className="form-control" placeholder="Enter your email" aria-label="Enter your email" aria-describedby="inputGroup-sizing-lg" />

                    <button type="button" class="btn btn-primary btn-lg diplo-button">Submit</button>
                </div>
            </div>
        )
    }
}

export default Home;