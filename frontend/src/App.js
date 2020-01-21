import React from "react";
import randomUsernameGenerator from "random-username-generator";
import api from "./api";
import {BingoGrid, ConnectedUsers, Restartbar, Titlebar, Winners} from "./components";
import "./App.css";

const POLL_PERIOD = 5000;  // 5 seconds

const username = randomUsernameGenerator.generate();

/* Root component for the application. Handles all top-level state and passes it down as necessary.
 * Since this app is pretty small, there was no need for Redux et al.
 */
class App extends React.Component {
    state = {
        // The randomly generated username for the current user.
        username,
        // The current list of connected users.
        users: [username],
        // The current list of winners across all people who have used the app.
        winners: [],
        // Flag indicating that the user already won and that the page should be refreshed to get a new bingo card.
        alreadyWon: false,
        // Cheat prevention just makes sure a user doesn't try to win too fast by just immediately getting a bingo;
        // it was meant to force people to actually pay attention to the original one-off presentation.
        //
        // NOTE: Cheat prevention is enabled/disabled by a class property of the BingoGrid component.
        // For demo purposes beyond the original one-off presentation, cheat prevention is disabled.
        cheater: false
    };

    async componentDidMount() {
        // Mark the current user as a connected user on the backend
        const serverState = await api.users.connect(this.state.username);
        this.setState(serverState);

        // Need a forceful re-render when resizing to get all of the components
        // to reflow their layout based on screen width (since raw CSS media queries aren't enough by themselves).
        // Yes, this is a hack.
        window.addEventListener("resize", this.rerender);

        // Need to the 'disconnect' the user from the backend when the user tries to leave.
        window.addEventListener("beforeunload", this.disconnect)

        // Since web sockets were removed, we now have to poll for changes to the currently connected users/winners.
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

    disconnect = async (e) => {
        e.preventDefault();
        e.returnValue = "Are you sure you want to disconnect?";

        await api.users.disconnect(this.state.username);
    }

    // Again, this is indeed a hack to force the `isLaptop` check to re-fire on window resizing.
    // But hey, at least it's debounced!
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

// Just a debounce function stolen from https://davidwalsh.name/javascript-debounce-function.
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
