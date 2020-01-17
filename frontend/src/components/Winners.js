import React from "react";
import CardHeader from "./CardHeader";
import "./Winners.css";

const Winners = ({winners}) => (
    <div className="winners-container">
        <CardHeader text="Winners" color="#e22866" />

        <div className="winners">
            {
                winners.length === 0 ? (
                    <div>No one yet</div>
                ) : (
                    winners.map((user) => <div key={user}>{user}</div>)
                )
            }
        </div>
    </div>
);

export default Winners;
