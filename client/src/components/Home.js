import React, { Component } from 'react';
import { Chat } from './Chat';

class Home extends Component {

	render() {
		return (
			<div className="App">
				<Chat />
			</div>
			// <div className="container welcomeSection">
			// 	<img src={logo} alt="Diplo logo" />
			// 	<h1 className="py-3">The Future of Meetings</h1>
			// 	<div className="input-group input-group-lg auto-width">
			// 		<input type="text" className="form-control" placeholder="Enter your email" aria-label="Enter your email" aria-describedby="inputGroup-sizing-lg" />

			// 		<button type="button" className="btn btn-primary btn-lg diplo-button">Submit</button>
			// 	</div>
			// </div>
		)
	}
}

export default Home;