import React, { Component } from 'react'

class UserMeeting extends Component {
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

		this.getData().then(userMeeting => this.setState({ userMeeting }))
			.catch(err => { console.log('There is now meetings') })
	}

	async getData() {
		const res = await fetch(`/create-meeting/${this.props.userEmail}`);
		return await res.json();
	}

	async getMeetings() {
		const res = await fetch(`/meetings/${this.props.userEmail}`);
		return await res.json();
	}


	render() {
		return (
			<a
				rel="noopener noreferrer"
				target="_blank"
				href={this.state.userMeeting && this.state.userMeeting.join_url}>
				{this.props.children}
			</a>
		)
	}
}

export default UserMeeting;