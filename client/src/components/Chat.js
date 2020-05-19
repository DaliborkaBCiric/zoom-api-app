import React, { Component } from 'react'

import socketIOClient from "socket.io-client";

let socket;

class Chat extends Component {
	constructor() {
		super();
		this.state = {
			endpoint: 'http://localhost:80/',
			name: '',
			response: false,
			messages: [],
			users: []
		};
		socket = socketIOClient(this.state.endpoint);
	}

	componentDidMount() {
		socket.on('send private message', message => {
			this.setState({ messages: [...this.state.messages, message] });
		})
		socket.on('connect', function () {
			console.log("client connection done.....");
		});
		socket.on('update', usersInfo => {
			this.setState({ users: usersInfo })
		})
	}

	addUser = (name) => {
		socket.emit("join", name);
	}

	callUser = (name) => {
		socket.emit('initiate private message', name, 'Please Join');
		socket.emit("send private message", "Cao")
	}

	render() {
		return (
			<div>
				{this.state.users.length === 0 &&
					<>
						<input
							type="text"
							id={'name'}
							placeholder={'Enter your name...'}
							value={this.state.name}
							onChange={e => this.setState({ name: e.target.value })}
						/>
						<button onClick={() => this.addUser(this.state.name)}>Done</button>
					</>
				}
				<div>
					{this.state.users.length > 0 && this.state.users.filter(user => user.socketId === socket.io.engine.id).map(user =>
						<>
							<p key={user.socketId}>Wellcome {user.userName}</p>
							<label>There is a list of available users</label>
						</>
					)}
					{this.state.users && this.state.users.filter(user => user.socketId !== socket.io.engine.id).map(user =>
						<p key={user.socketId}>{user.userName}
							<button onClick={() => this.callUser(user.userName)}>Invite</button>
						</p>)}
				</div>
			</div>
		)
	}
}

export { Chat, socket }