import React from "react";
import io from "socket.io-client";
import rug from "random-username-generator";

import {BingoGrid, ConnectedUsers, Restartbar, Titlebar, Winners} from "./components";
import "./App.css";

const SERVER_URL = "http://localhost:8080";

class App extends React.Component {
    socket = null;

    state = {
        username: rug.generate(),
        connectedUsernames: [],
        winners: [],
        alreadyWon: false,
        cheater: false
    };

    componentDidMount() {
        this.socket = io(SERVER_URL, {query: `name=${this.state.username}`});

        this.socket.on("connected_users_changed", (users) => {
            this.setState({connectedUsernames: [...users]});
        });

        this.socket.on("bingo", (winners) => {
            this.setState({winners});
        });

        window.addEventListener("resize", this.rerender);
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.rerender);
    }

	rerender = debounce(() => {
        this.setState(this.state)
    }, 100)

    handleWinner = (words) => {
        this.setState({alreadyWon: true})
        this.socket.emit("bingo", {
            username: this.state.username,
            words
        });
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

const AppDesktopLayout = ({username, connectedUsernames, winners, alreadyWon, handleWinner, handleCheater}) => (
    <div id="app-content">
        <ConnectedUsers users={connectedUsernames} />

        <BingoGrid
            username={username}
            alreadyWon={alreadyWon}
            handleWinner={handleWinner}
            handleCheater={handleCheater}
        />

        <Winners winners={winners} />
    </div>
);

const AppLaptopLayout = ({username, connectedUsernames, winners, alreadyWon, handleWinner, handleCheater}) => (
    <div id="app-content">
        <BingoGrid
            username={username}
            alreadyWon={alreadyWon}
            handleWinner={handleWinner}
            handleCheater={handleCheater}
        />

        <div id="app-users">
            <ConnectedUsers users={connectedUsernames} />
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
