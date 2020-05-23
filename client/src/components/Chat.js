import React, { Component } from 'react'
import config from '../config';
import UserMeeting from './UserMeeting';
import socketIOClient from "socket.io-client";
import InviteModal from './InviteModal';
import avatar from '../media/avatar.jpg';

let socket;
console.log(config.main_path, 'config.main_path')
class Chat extends Component {
	constructor() {
		super();
		this.state = {
			endpoint: `${config.main_path}:8080`,
			name: '',
			email: '',
			response: false,
			users: [],
			roomMembers: null,
			modal: false,
			nameErrorMessage: false,
			emailErrorMessage: false,
			userMeeting: []
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

	addUser = (username) => {
		const {
			name,
			email
		} = this.state
		if (name !== "") {
			this.setState({ nameErrorMessage: false })
		}
		if (email !== "") {
			this.setState({ emailErrorMessage: false })
		}
		if (name !== '' && email !== '') {
			socket.emit("join", username, email);
		} else {
			if (name === '') {
				this.setState({ nameErrorMessage: true })
			}
			if (this.state.email === '') {
				this.setState({ emailErrorMessage: true })
			}
		}

		this.getMeeting()
	}

	async getData() {
		const res = await fetch(`/create-meeting/${this.state.email}`);
		return await res.json();
	}

	getMeeting() {
		this.getData().then(userMeeting => this.setState({ userMeeting }))
			.catch(err => { console.log('There is now meetings') })
	}

	callUser = (name, email) => {
		socket.emit('initiate private message', name, email, 'Please Join');
		socket.emit("send private message", "Cao")
	}

	render() {
		let {
			users,
			roomMembers,
			name,
			email,
			modal,
			nameErrorMessage,
			emailErrorMessage,
			userMeeting
		} = this.state;
		let sender = roomMembers && roomMembers[0].sender.email;
		return (
			<div className="content">
				{roomMembers &&
					roomMembers.filter(rm => rm.receiverID == socket.io.engine.id).map((rm, index) =>
						<InviteModal
							key={index}
							receiverName={rm.receiver.name}
							senderName={rm.sender.name}
							toggle={this.toggle}
							modalState={modal}
							email={sender}
							userMeeting={userMeeting}
						/>
					)}

				{users && users.filter(user => user.socketId === socket.io.engine.id).length != 1 &&
					<div key={socket.io.engine.id} >
						<div className="form-group">
							<label htmlFor="formGroupExampleInput">Email full name</label>
							<input type="text" className="form-control" value={name} id="formGroupExampleInput" required="required"
								placeholder="John Smit" onChange={e => this.setState({ name: e.target.value })} />
							<span style={{ color: 'red', display: nameErrorMessage ? 'block' : 'none' }}>This field is required</span>
						</div>
						<div className="form-group">
							<label htmlFor="exampleFormControlInput2">Email your address</label>
							<input type="email" className="form-control" id="exampleFormControlInput2" required="required"
								placeholder="name@example.com" onChange={e => this.setState({ email: e.target.value })} />
							<span style={{ color: 'red', display: emailErrorMessage ? 'block' : 'none' }}>This field is required</span>
						</div>
						<button className="btn btn-info container-fluid" onClick={() => this.addUser(name)}>Confirm</button>
					</div>
				}
				<div>
					{users.length > 0 && users.filter(user => user.socketId === socket.io.engine.id).map(user =>
						<div key={user.socketId}>
							<h3>Wellcome {user.userName}</h3>
						</div>
					)}
					<div>
						{name !== '' && email !== "" &&
							users && users.filter(user => user.socketId !== socket.io.engine.id).map((user, index) =>
								<div key={index}>
									<div className="d-flex justify-content-between align-items-center py-2" key={user.socketId}>
										<div>
											<img src={avatar} alt="Avatar" className="avatar" />
											<span>{user.userName}</span>
										</div>
										<UserMeeting userEmail={sender} userMeeting={userMeeting}>
											<button className="btn btn-info" onClick={() => this.callUser(user.userName, user.email)}>Invite</button>
										</UserMeeting>
									</div>
								</div>)}
					</div>
				</div>
			</div>
		)
	}
}

export { Chat, socket }