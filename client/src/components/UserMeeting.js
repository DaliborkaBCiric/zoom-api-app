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
				href={this.props.userMeeting && this.props.userMeeting.join_url}>
				{this.props.children}
			</a>
		)
	}
}

export default UserMeeting;