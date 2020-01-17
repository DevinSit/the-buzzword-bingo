import React from "react";
import classNames from "classnames";
import CardHeader from "./CardHeader";
import "./BingoGrid.css";

import {getWinningBoardState, shuffleWords} from "../utils/BingoUtils";

const BUZZWORDS = [
	"Alignment", "Convergence", "DevOps", "Paradigm", "Leverage", "Synergy",
	"Bitcoin", "Serverless", "Next Generation", "Bandwidth", "Machine Learning",
	"Innovation", "Disruption", "Cloud", "Containerization", "Offshoring",
	"Enterprise", "Lambda", "Holistic", "Scalability", "Internet of Things",
	"Data Science", "Blockchain", "Best Practices", "SaaS"
];

export default class BingoGrid extends React.Component {
    startTime = new Date();
    cheatPreventionEnabled = false;

    state = {
        buzzwords: shuffleWords(BUZZWORDS)
    };

    onCellClick = (row, col) => () => {
        // Disable clicking on center (free) square
        if ((row === 2 && col === 2) || this.props.alreadyWon) return;

        const updatedBuzzwords = [...this.state.buzzwords];
        updatedBuzzwords[row][col].selected = !updatedBuzzwords[row][col].selected;

        this.setState({buzzwords: updatedBuzzwords});
        this.checkWinner();
    }

    checkWinner = () => {

        setTimeout(() => {
            const winningState = getWinningBoardState(this.state.buzzwords);
            console.log(winningState);

            if (winningState.length > 0) {
                if (this.cheatPreventionEnabled && (new Date() - this.startTime) / 1000 <= 15) {
                    this.props.handleCheater();
                } else {
                    this.props.handleWinner(this.getWinningWords(winningState));

                    const winningBuzzwords = [...this.state.buzzwords];
                    winningState.forEach((state) => {
                        winningBuzzwords[state[0]][state[1]].win = true;
                    });

                    this.setState({buzzwords: winningBuzzwords});
                }
            }
        }, 100)
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
