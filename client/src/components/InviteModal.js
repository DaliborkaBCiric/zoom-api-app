import React, { Component } from 'react';
import Modal, { ModalHeader, ModalBody, ModalFooter } from './Modal';
import UserMeeting from './UserMeeting';

class InviteModal extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userMeeting: [],
			allMeetings: []
		}
	}

	componentDidMount() {
		this.getMeetings().then(allMeetings => this.setState({ allMeetings }))
			.catch(err => { console.log('There is now meetings') })
	}

	async getMeetings() {
		const res = await fetch(`/meetings/${this.props.email}`);
		return await res.json();
	}

	render() {
		const {allMeetings} = this.state;
		let currentMeeting = allMeetings.meetings && allMeetings.meetings[allMeetings.meetings.length - 1]
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
					<UserMeeting userEmail={this.props.email} userMeeting={currentMeeting}>
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