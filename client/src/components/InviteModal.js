import React, { Component } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import UserMeeting from './UserMeeting';

class InviteModal extends Component {

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
			<Modal isOpen={this.props.modalState}>
				<ModalHeader>
					<h3>Hello, {this.props.receiverName}</h3>
					<button
						type="button"
						className="close"
						aria-label="Close"
						onClick={this.props.toggle}
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
						onClick={this.props.toggle}
					>
						Close
            </button>
					<UserMeeting userEmail={this.props.email} joinURL={roomName.inviteURL}>
						<button
							type="button"
							className="btn btn-primary"
							onClick={this.props.toggle}
						>Accept</button>
					</UserMeeting>
				</ModalFooter>
			</Modal>
		)
	}
}

export default InviteModal;