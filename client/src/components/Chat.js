import React, { Component } from 'react'
import UserMeeting from './UserMeeting';
import socketIOClient from "socket.io-client";
import InviteModal from './InviteModal';

let socket;

class Chat extends Component {
	constructor() {
		super();
		this.state = {
			endpoint: 'http://localhost:80/',
			name: '',
			response: false,
			users: [],
			roomMembers: null,
			modal: false
		};
		this.toggle = this.toggle.bind(this);
		socket = socketIOClient(this.state.endpoint);
	}

	toggle() {
		this.setState({ modal: !this.state.modal });
	}

	componentDidMount() {
		socket.on('connect', function () {
			console.log("client connection done.....");
		});
		socket.on('update', usersInfo => {
			this.setState({ users: usersInfo })
		})
		socket.on('updateRoom', roomMembers => {
			this.setState({ roomMembers: roomMembers });
			this.state.roomMembers &&
				this.state.roomMembers.filter(rm => rm.receiverID != socket.io.engine.id).length != 1 &&
				this.setState({ modal: true })
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
		let {
			users,
			roomMembers,
			name
		} = this.state;
		return (
			<div className="content">
				{roomMembers &&
					roomMembers.filter(rm => rm.receiverID == socket.io.engine.id).map((rm, index) =>
						<InviteModal
							key={index}
							receiverName={rm.receiver.name}
							senderName={rm.sender.name}
							toggle={this.toggle}
							modalState={this.state.modal}
						/>
					)}

				{users && users.filter(user => user.socketId === socket.io.engine.id).length != 1 &&
					<div key={socket.io.engine.id} >
						<div className="form-group">
							<label for="formGroupExampleInput">Email full name</label>
							<input type="text" className="form-control" value={name} id="formGroupExampleInput" placeholder="John Smit" onChange={e => this.setState({ name: e.target.value })} />
						</div>
						<div className="form-group">
							<label for="exampleFormControlInput2">Email your address</label>
							<input type="email" className="form-control" id="exampleFormControlInput2" placeholder="name@example.com" />
						</div>
						<button className="btn btn-info container-fluid" onClick={() => this.addUser(name)}>Confirm</button>
					</div>
				}
				<div>
					{users.length > 0 && users.filter(user => user.socketId === socket.io.engine.id).map(user =>
						<div key={user.socketId}>
							<p>Wellcome {user.userName}</p>
						</div>
					)}
					{users && users.filter(user => user.socketId !== socket.io.engine.id).map(user =>
						<>
							<label>There is a list of available users</label>
							<p key={user.socketId}>{user.userName}
								<UserMeeting userEmail="daliborka.b.ciric@gmail.com">
									<button onClick={() => this.callUser(user.userName)}>Invite</button>
								</UserMeeting>
							</p>
						</>)}
				</div>
			</div>
		)
	}
}

export { Chat, socket }