import React, { Component } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import UserMeeting from './UserMeeting';

class InviteModal extends Component {
	constructor() {
		super();
		this.state = {
			modal: false
		};
		this.toggle = this.toggle.bind(this);
	}
	toggle() {
		this.setState({ modal: !this.state.modal });
	}
	componentDidMount() {
		const {
			senderName,
			receiverName,
			roomMembers
		} = this.props;
		if (roomMembers) {
			roomMembers.find(rm => rm.room === `privateRoom${senderName}And${receiverName}`) &&
				this.setState({ modal: true })
		}
	}
	render() {
		const {
			senderName,
			receiverName
		} = this.props;
		let roomName = this.props.roomMembers.find(room => room.room === `privateRoom${senderName}And${receiverName}`)
		console.log(senderName, 'sender profile')
		console.log(receiverName, 'sender profile')
		console.log(roomName, 'roomName')
		return (
			<Modal isOpen={this.state.modal}>
				<ModalHeader>
					<h3>Hello, {this.props.receiverName}</h3>
					<button
						type="button"
						className="close"
						aria-label="Close"
						onClick={this.toggle}
					>
						<span aria-hidden="true">&times;</span>
					</button>
				</ModalHeader>
				<ModalBody>
					<p>User {this.props.senderName} invite you to join the conference call</p>
				</ModalBody>
				<ModalFooter>
					<button
						type="button"
						className="btn btn-secondary"
						onClick={this.toggle}
					>
						Close
            </button>
					<UserMeeting userEmail={this.props.email} joinURL={roomName.inviteURL}>
						<button
							type="button"
							className="btn btn-primary"
							onClick={this.toggle}
						>Accept</button>
					</UserMeeting>
				</ModalFooter>
			</Modal>
		)
	}
}

export default InviteModal;