import React from "react";
import randomUsernameGenerator from "random-username-generator";
import api from "./api";
import {BingoGrid, ConnectedUsers, Restartbar, Titlebar, Winners} from "./components";
import "./App.css";

const POLL_PERIOD = 5000;  // 5 seconds

const username = randomUsernameGenerator.generate();

class App extends React.Component {
    state = {
        username,
        users: [username],
        winners: [],
        alreadyWon: false,
        cheater: false
    };

    async componentDidMount() {
        const serverState = await api.users.connect(this.state.username);
        this.setState(serverState);

        window.addEventListener("resize", this.rerender);
        window.addEventListener("beforeunload", this.disconnect)

        this.pollForUsersTimer = this.pollForUsers();
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
        window.removeEventListener("beforeunload", this.disconnect);

        this.pollForUsersTimer = null;
    }

    pollForUsers = () => {
        return setInterval(async () => {
            const serverState = await api.users.getState();
            this.setState(serverState);
        }, POLL_PERIOD);
    }

    disconnect = async () => {
        await api.users.disconnect(this.state.username);
    }

	rerender = debounce(() => {
        this.setState(this.state)
    }, 100)

    handleWinner = async (words) => {
        this.setState({alreadyWon: true})

        const winners = await api.users.saveWinner(this.state.username);
        this.setState({winners});
    }

    handleCheater = () => {
        this.setState({alreadyWon: true, cheater: true});
    }

    isLaptop = () => window.matchMedia("(max-width: 1350px)").matches;

    render() {
        const {alreadyWon, cheater} = this.state;

        return (
            <div id="app">
                <Titlebar />

                {!cheater && <Restartbar visible={alreadyWon} />}
                {cheater && <Restartbar visible={alreadyWon} warning={true} />}

                {
                    this.isLaptop() ? (
                        <AppLaptopLayout
                            {...this.state}
                            handleWinner={this.handleWinner}
                            handleCheater={this.handleCheater}
                        />
                    ) : (
                        <AppDesktopLayout
                            {...this.state}
                            handleWinner={this.handleWinner}
                            handleCheater={this.handleCheater}
                        />
                    )
                }
            </div>
        );
    }
}

const AppDesktopLayout = ({username, users, winners, alreadyWon, handleWinner, handleCheater}) => (
    <div id="app-content">
        <ConnectedUsers users={users} />

        <BingoGrid
            username={username}
            alreadyWon={alreadyWon}
            handleWinner={handleWinner}
            handleCheater={handleCheater}
        />

        <Winners winners={winners} />
    </div>
);

const AppLaptopLayout = ({username, users, winners, alreadyWon, handleWinner, handleCheater}) => (
    <div id="app-content">
        <BingoGrid
            username={username}
            alreadyWon={alreadyWon}
            handleWinner={handleWinner}
            handleCheater={handleCheater}
        />

        <div id="app-users">
            <ConnectedUsers users={users} />
            <Winners winners={winners} />
        </div>
    </div>
);

export default App;

function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
