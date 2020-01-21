import React from "react";
import classNames from "classnames";
import CardHeader from "./CardHeader";
import "./BingoGrid.css";

import {getWinningBoardState, shuffleWords} from "../utils/BingoUtils";

// The static set of buzzwords that are used to generate the bingo card.
// Yes, there is only exactly enough buzzword to fill a 5x5 grid.
const BUZZWORDS = [
	"Alignment", "Convergence", "DevOps", "Paradigm", "Leverage", "Synergy",
	"Bitcoin", "Serverless", "Next Generation", "Bandwidth", "Machine Learning",
	"Innovation", "Disruption", "Cloud", "Containerization", "Offshoring",
	"Enterprise", "Lambda", "Holistic", "Scalability", "Internet of Things",
	"Data Science", "Blockchain", "Best Practices", "SaaS"
];

export default class BingoGrid extends React.Component {
    // The start time is used for cheat prevention (checking how long the user
    // has been on the page so that they don't try and 'cheat' and win too fast).
    startTime = new Date();

    // Cheat prevention is disabled for demo purposes.
    cheatPreventionEnabled = false;

    state = {
        // The 2D array of buzzwords that represents the grid.
        //
        // Note: A single buzzword object looks like the following:
        // {text: str, selected: bool, win: bool}
        buzzwords: shuffleWords(BUZZWORDS)
    };

    onCellClick = (row, col) => () => {
        // Disable clicking on the center (free) square
        if ((row === 2 && col === 2) || this.props.alreadyWon) return;

        const updatedBuzzwords = [...this.state.buzzwords];
        updatedBuzzwords[row][col].selected = !updatedBuzzwords[row][col].selected;

        // Make sure the winning check process is run after the state update,
        // since the process depends on the selected buzzwords being up-to-date.
        this.setState({buzzwords: updatedBuzzwords}, () => {
            this.checkWinner();
        });
    }

    checkWinner = () => {
        // The winning state is a list of coordinates for all of the cells that form a line.
        // If the return value here is empty, that means there is no winning state.
        const winningState = getWinningBoardState(this.state.buzzwords);

        if (winningState.length > 0) {
            if (this.cheatPreventionEnabled && (new Date() - this.startTime) / 1000 <= 15) {
                this.props.handleCheater();
            } else {
                this.props.handleWinner(this.getWinningWords(winningState));

                // Mark the winning buzzwords differently from other cells.
                const winningBuzzwords = [...this.state.buzzwords];
                winningState.forEach((state) => {
                    winningBuzzwords[state[0]][state[1]].win = true;
                });

                this.setState({buzzwords: winningBuzzwords});
            }
        }
    }

    getWinningWords = (winningState) => winningState.map(([x, y]) => this.state.buzzwords[x][y].text);

    render() {
        const {alreadyWon, username} = this.props;
        const {buzzwords} = this.state;

        return (
            <BingoGridLayout
                username={username}
                buzzwords={buzzwords}
                alreadyWon={alreadyWon}
                onCellClick={this.onCellClick}
            />
        );
    }
}

const BingoGridLayout = ({username, buzzwords, alreadyWon, onCellClick}) => (
    <div className="buzzwords-container">
        <CardHeader text={username} />

        <div className="buzzwords-grid">
            {buzzwords.map((row, rowIndex) => (
                <div className="buzzword-row" key={rowIndex}>
                    {row.map((buzzword, cellIndex) => (
                        <div
                            className={classNames(
                                "buzzword-cell",
                                {"buzzword-cell--selected": buzzword.selected},
                                {"buzzword-cell--selected--won": buzzword.win},
                                {"buzzword-cell--disabled": alreadyWon}
                            )}
                            onClick={onCellClick(rowIndex, cellIndex)}
                            key={cellIndex}
                        >
                            {buzzword.text}
                        </div>
                    ))}
                </div>
            ))}
        </div>
    </div>
);
