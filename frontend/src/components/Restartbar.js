import React from "react";
import classNames from "classnames";
import "./Restartbar.css";
import toaster from "./toaster.png";

export default class Restartbar extends React.Component {
    onClick = () => window.location.reload();

    render() {
        const {visible, warning} = this.props;

        return (
            <div
                className={classNames(
                    "restartbar",
                    {"restartbar-visible": visible},
                    {"restartbar-warning": warning}
                )}
                onClick={this.onClick}
            >
                {!warning && <img src={toaster} height={25} width={25} alt="Toaster" />}

                {
                    warning ? (
                        <div className="restartbar-text">
                            <h3 className="restartbar-title">CHEATER!</h3>

                            <h3 className="restartbar-description">
                                How about you actually pay attention? <span role="img" aria-label="angry">😠</span>
                            </h3>
                        </div>
                    ) : (
                        <div className="restartbar-text">
                            <h3 className="restartbar-title">BINGO!</h3>

                            <h3 className="restartbar-description">
                                Refresh the page for another bingo card :)
                            </h3>
                        </div>
                    )
                }
            </div>
        );
    }
}
