import React, { Component } from 'react'
import socketIOClient from "socket.io-client";
import InviteModal from './InviteModal';
import UserMeeting from './UserMeeting';
import avatar from '../media/avatar.jpg';
import Jitsi from 'react-jitsi'

let socket;

class Chat extends Component {
	constructor() {
		super();
		this.state = {
			endpoint: `http://meetings.diplomacy.edu:8080`,
			name: '',
			email: '',
			users: [],
			roomMembers: null,
			nameErrorMessage: false,
			emailErrorMessage: false,
			userMeeting: [],
			loading: false,
			setOnCall: false,
			roomName: ''
		};
		socket = socketIOClient(this.state.endpoint);
	}

	componentDidMount() {
		socket.on('connect', () => {   //  'connect' event is received on client on every connection start.
			if (sessionStorage.getItem('userName')) {
				socket.emit('join', { name: sessionStorage.getItem('userName'), email: sessionStorage.getItem('userEmail') });  //  where 'user' is your object containing email.
			}
		})
		socket.on('update', usersInfo => {
			this.setState({ users: usersInfo })
		})
		socket.on('updateRoom', roomMembers => {
			this.setState({ roomMembers: roomMembers });
		});
		this.setState({ name: sessionStorage.getItem('userName'), email: sessionStorage.getItem('userEmail') })
	}

	addUser = (username) => {
		const {
			name,
			email
		} = this.state
		sessionStorage.setItem('userEmail', email);
		sessionStorage.setItem('userName', name);
		let storageEmail = sessionStorage.getItem('userEmail')
		let storageUserName = sessionStorage.getItem('userName')
		if (storageUserName !== "") {
			this.setState({ nameErrorMessage: false })
		}
		if (storageEmail !== "") {
			this.setState({ emailErrorMessage: false })
		}
		if (storageUserName !== '' && storageEmail !== '') {
			this.setState({ loading: true })
			socket.emit("join", { name: sessionStorage.getItem('userName'), email: sessionStorage.getItem('userEmail') });
		} else {
			if (storageUserName === '') {
				this.setState({ nameErrorMessage: true })
			}
			if (storageEmail === '') {
				this.setState({ emailErrorMessage: true })
			}
		}
	}

	deleteRoom = () => {
		socket.emit("remove room", sessionStorage.getItem('userEmail'));
	}

	setOnCall = (userName, email) => {
		socket.emit('initiate private message', userName, email, sessionStorage.getItem('userEmail'), 'Please Join');
		socket.on('updateRoom', roomMembers => {
			this.setState({ roomMembers });
		});
		let room = `privateRoom${sessionStorage.getItem('userName')}And${userName}`;
		this.setState({ roomName: room, setOnCall: true })
	}

	render() {
		let {
			users,
			roomMembers,
			name,
			nameErrorMessage,
			emailErrorMessage,
			loading,
			roomName
		} = this.state;
		
		let sender = roomMembers && roomMembers.find(room => room.sender.email !== sessionStorage.getItem('userEmail'))

		let is_logged_in = users && users.find(user => user.email === sessionStorage.getItem('userEmail'))
		return (
			<div className="content">
				{roomMembers &&
					roomMembers.filter(rm => rm.receiverEmail === sessionStorage.getItem('userEmail')).map((rm, index) =>
						<InviteModal
							key={index}
							users={users}
							receiverName={rm.receiver.userName}
							senderName={rm.sender.userName}
							email={sender}
							roomMembers={roomMembers}
							roomName={roomName}
							deleteRoom={() => this.deleteRoom}
						/>
					)}
				{/* {this.state.setOnCall &&
					<Jitsi roomName={this.state.roomName} displayName={sessionStorage.getItem('userName')} onAPILoad={JitsiMeetAPI => console.log('Good Morning everyone!')} />} */}
				{!is_logged_in &&
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
						<button className="btn btn-info container-fluid" onClick={() => this.addUser(name)}>
							{loading ? 'Processing...' : 'Confirm'}
						</button>
					</div>
				}
				<div>
					{users.length > 0 && is_logged_in && users.filter(user => user.email === sessionStorage.getItem('userEmail')).map(user =>
						<div key={user.email}>
							<h3>Welcome {user.userName}</h3>
						</div>
					)}
					<div>
						{is_logged_in && users.filter(user => user.email !== sessionStorage.getItem('userEmail')).map((user, index) =>
							<div key={index}>
								<div className="d-flex justify-content-between align-items-center py-2" key={user.e}>
									<div>
										<img src={avatar} alt="Avatar" className="avatar" />
										<span>{user.userName}</span>
									</div>
									<UserMeeting userEmail={sender} joinURL={`https://meet.jit.si/${roomName}#userInfo.displayName="${sessionStorage.getItem('userName')}"`}>
										<button className="btn btn-info" onClick={() => this.setOnCall(user.userName, user.email)}> Invite</button>
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