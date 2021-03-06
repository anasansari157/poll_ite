import React from "react";
import PropTypes, { element } from "prop-types";

class Poll extends React.Component {
	state = {
		showVotes: false,
		voteCount: null,
		errorMsg: "",
		ballot: null,
	};

	componentDidMount() {
		this.fetchVoteCountAndUserBallot(this.props.poll.id);
	}

	vote = async (i) => {
		let vote = { option: i, poll_id: this.props.poll.id };
		let api = "/vote";

		fetch(api, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": document.querySelector('[name="csrf-token"]').content,
			},
			body: JSON.stringify({ vote }),
		})
			.then((response) => response.json())
			.then((data) => {
				this.setState({ voteCount: data.voteCount, errorMsg: data.message });
			});

			await this.fetchVoteCountAndUserBallot(vote.poll_id)
		this.setState({ showVotes: "show" });
	};

	fetchVoteCountAndUserBallot = (id) => {
		console.log("FETCHING");
		// show only those polls votes, that have been voted by User
		let api = `/vote/${id}`;

		fetch(api, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				"X-CSRF-TOKEN": document.querySelector('[name="csrf-token"]').content,
			},
		})
			.then((response) => response.json())
			.then((ballotAndCount) => {
				console.log(ballotAndCount, "fetchVotesCountAndUserBallot");
				this.setState({
					voteCount: ballotAndCount[1],
					ballot: ballotAndCount[0],
				});
			});
	};

	showTotalCount = (AllOptionsIndividualCount) => {
		let totalVotesincludingAllOptions =
			AllOptionsIndividualCount.option_1 +
			AllOptionsIndividualCount.option_2 +
			AllOptionsIndividualCount.option_3 +
			AllOptionsIndividualCount.option_4;

		return (
			<h3
				className="text-center"
				key={this.state.poll && this.state.poll.poll_id}
			>
				<span className="badge badge-secondary">
					Total Votes: {totalVotesincludingAllOptions}
				</span>
			</h3>
		);
	};

	showButton = (i, option) => {
		return (
			<button
				type="button"
				className="btn btn-primary ml-3"
				key={i}
				onClick={() => this.vote(i)}
			>
				{option}
			</button>
		);
	};

	showDisabledButtonWithCount = (i, option) => {
		let voted_option = this.state.ballot && this.state.ballot.voted_option;
		let isThisVotedOption = voted_option == i + 1;
		let noOfPeopleWhoVotedOnThisOption = this.state.voteCount[
			`option_${i + 1}`
		];

		// let totalVotesincludingAllOptions = (voteCount) => {
		// 	return Object.values(voteCount).reduce((a, b) => a + b, 0);
		// };

		return (
			<div className="disabled-buttons-container">
				<div key={i} className="m-3">
					<button
						className={`btn btn-${isThisVotedOption ? "success" : "primary"}`}
						disabled
					>
						{option}
					</button>
					{noOfPeopleWhoVotedOnThisOption ? (
						<span className="badge badge-pill badge-dark ml-2">
							{noOfPeopleWhoVotedOnThisOption}
						</span>
					) : null}
				</div>
			</div>
		);
	};

	render() {
		let poll = this.props.poll;
		let voteCount = this.state.voteCount;

		return (
			<div>
				<div style={{ border: "1px solid red" }} className="card m-4">
					<div class="card-header">Poll #{poll.id}</div>
					<div class="card-body">
						<h5 class="card-title">{poll.question}</h5>
						<div className="options">
							{poll.options.map((option, i) =>
								this.state.voteCount
									? this.showDisabledButtonWithCount(i, option)
									: this.showButton(i, option)
							)}
						</div>
					</div>
					<div>
						{this.state.errorMsg ? <p>{this.state.errorMsg}</p> : null}

						{/* <h1>{poll.question}</h1>

						<div className="options">
							{poll.options.map((option, i) =>
								this.state.voteCount
									? this.showDisabledButtonWithCount(i, option)
									: this.showButton(i, option)
							)}
						</div> */}
					</div>
					{voteCount ? this.showTotalCount(voteCount) : null}
				</div>
			</div>
		);
	}
}

export default Poll;
