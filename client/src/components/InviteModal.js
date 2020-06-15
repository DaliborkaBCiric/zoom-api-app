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

	render() {
		setTimeout(() => {
			this.props.roomMembers.find(room => room.receiverEmail === sessionStorage.getItem('userEmail')) &&
				this.setState({ modal: true });
		}, 3000);
		const {
			senderName,
			receiverName,
			deleteRoom
		} = this.props;
		let roomName = this.props.roomMembers.find(room => room.room === `privateRoom${senderName}And${receiverName}`)
		return (
			<Modal isOpen={this.state.modal}>
				<ModalHeader>
					<h3>Hello, {this.props.receiverName}</h3>
					<button
						type="button"
						className="close"
						aria-label="Close"
						onClick={this.toggle && deleteRoom()}
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
						onClick={this.toggle && deleteRoom()}
					>
						Close
            </button>
					<UserMeeting userEmail={this.props.email} joinURL={`https://meet.jit.si/${roomName.room}#userInfo.displayName="${receiverName}"`}>
						<button
							type="button"
							className="btn btn-primary"
							onClick={this.toggle && deleteRoom()}
						>Accept</button>
					</UserMeeting>
				</ModalFooter>
			</Modal>
		)
	}
}

export default InviteModal;