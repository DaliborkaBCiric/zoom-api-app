// import React, { Component } from 'react'
// import config from '../config';
// import UserMeeting from './UserMeeting';
// import socketIOClient from "socket.io-client";
// import InviteModal from './InviteModal';
// import avatar from '../media/avatar.jpg';

// let socket;

// class Chat extends Component {
// 	constructor() {
// 		super();
// 		this.state = {
// 			endpoint: `http://meetings.diplomacy.edu:8080`,
// 			name: '',
// 			email: '',
// 			users: [],
// 			roomMembers: null,
// 			modal: false,
// 			nameErrorMessage: false,
// 			emailErrorMessage: false,
// 			userMeeting: [],
// 			loading: false
// 		};
// 		this.toggle = this.toggle.bind(this);
// 		socket = socketIOClient(this.state.endpoint);
// 	}

// 	toggle() {
// 		this.setState({ modal: !this.state.modal });
// 	}

// 	componentDidMount() {
// 		socket.on('update', usersInfo => {
// 			this.setState({ users: usersInfo })
// 		})
// 		socket.on('connect', function () {
// 			console.log("client connection done.....");
// 		});
// 		socket.on('updateRoom', roomMembers => {
// 			this.setState({ roomMembers: roomMembers });
// 		})
// 	}

// 	async getData() {
// 		const res = await fetch(`/create-meeting/${sessionStorage.getItem('userEmail')}`);
// 		return await res.json();
// 	}

// 	getMeeting() {
// 		this.getData().then(userMeeting => this.setState({ userMeeting }))
// 			.catch(err => { console.log('There is now meetings') })
// 	}

// 	async createUser(userName, userEmail) {
// 		const res = await fetch(`/create-user/${userName}/${userEmail}`);
// 		return await res.json();
// 	}

// 	addUser = (username) => {
// 		const {
// 			name,
// 			email
// 		} = this.state
// 		this.createUser(name, email)
// 		this.getMeeting()
// 		sessionStorage.setItem('userEmail', email);
// 		sessionStorage.setItem('userName', name);
// 		let storageEmail = sessionStorage.getItem('userEmail')
// 		let storageUserName = sessionStorage.getItem('userName')
// 		if (storageUserName !== "") {
// 			this.setState({ nameErrorMessage: false })
// 		}
// 		if (storageEmail !== "") {
// 			this.setState({ emailErrorMessage: false })
// 		}
// 		if (storageUserName !== '' && storageEmail !== '') {
// 			this.setState({ loading: true })
// 			setTimeout(() => {
// 				socket.emit("join", storageUserName, storageEmail, this.state.userMeeting.join_url);
// 			}, 2000);
// 		} else {
// 			if (storageUserName === '') {
// 				this.setState({ nameErrorMessage: true })
// 			}
// 			if (storageEmail === '') {
// 				this.setState({ emailErrorMessage: true })
// 			}
// 		}
// 	}

// 	callUser = (name, email) => {
// 		socket.emit('initiate private message', name, email, this.state.userMeeting, 'Please Join');
// 		socket.emit("send private message", "Cao")
// 	}

// 	render() {
// 		let {
// 			users,
// 			roomMembers,
// 			name,
// 			modal,
// 			nameErrorMessage,
// 			emailErrorMessage,
// 			loading
// 		} = this.state;

// 		let sender = roomMembers && roomMembers.find(room => room.sender.email !== sessionStorage.getItem('userEmail'))
// 		let is_logged_in = users && users.find(user => user.email === sessionStorage.getItem('userEmail'))
// 		return (
// 			<div className="content">
// 				{roomMembers &&
// 					roomMembers.filter(rm => rm.receiverEmail === sessionStorage.getItem('userEmail')).map((rm, index) =>
// 						<InviteModal
// 							key={index}
// 							users={users}
// 							receiverName={rm.receiver.name}
// 							senderName={rm.sender.name}
// 							toggle={this.toggle}
// 							modalState={modal}
// 							email={sender}
// 							roomMembers={roomMembers}
// 						/>
// 					)}

// 				{!is_logged_in &&
// 					<div key={socket.io.engine.id} >
// 						<div className="form-group">
// 							<label htmlFor="formGroupExampleInput">Email full name</label>
// 							<input type="text" className="form-control" value={name} id="formGroupExampleInput" required="required"
// 								placeholder="John Smit" onChange={e => this.setState({ name: e.target.value })} />
// 							<span style={{ color: 'red', display: nameErrorMessage ? 'block' : 'none' }}>This field is required</span>
// 						</div>
// 						<div className="form-group">
// 							<label htmlFor="exampleFormControlInput2">Email your address</label>
// 							<input type="email" className="form-control" id="exampleFormControlInput2" required="required"
// 								placeholder="name@example.com" onChange={e => this.setState({ email: e.target.value })} />
// 							<span style={{ color: 'red', display: emailErrorMessage ? 'block' : 'none' }}>This field is required</span>
// 						</div>
// 						<button className="btn btn-info container-fluid" onClick={() => this.addUser(name)}>
// 							{loading ? 'Processing...' : 'Confirm'}
// 						</button>
// 					</div>
// 				}
// 				<div>
// 					{users.length > 0 && is_logged_in && users.filter(user => user.email === sessionStorage.getItem('userEmail')).map(user =>
// 						<div key={user.socketId}>
// 							<h3>Welcome {user.userName}</h3>
// 						</div>
// 					)}
// 					<div>
// 						{is_logged_in && users.filter(user => user.email !== sessionStorage.getItem('userEmail')).map((user, index) =>
// 							<div key={index}>
// 								<div className="d-flex justify-content-between align-items-center py-2" key={user.socketId}>
// 									<div>
// 										<img src={avatar} alt="Avatar" className="avatar" />
// 										<span>{user.userName}</span>
// 									</div>
// 									<UserMeeting userEmail={sender} joinURL={is_logged_in.join_url}>
// 										<button className="btn btn-info" onClick={() => this.callUser(user.userName, user.email)}>Invite</button>
// 									</UserMeeting>
// 								</div>
// 							</div>)}
// 					</div>
// 				</div>
// 			</div>
// 		)
// 	}
// }

// export { Chat, socket }