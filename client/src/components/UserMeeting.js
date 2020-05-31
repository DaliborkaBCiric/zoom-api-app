import React, { Component } from 'react'
import config from '../config';

class UserMeeting extends Component {
	
	render() {
		return (
			<a
				rel="noopener noreferrer"
				target="_blank"
				href={this.props.joinURL}>
				{this.props.children}
			</a>
		)
	}
}

export default UserMeeting;