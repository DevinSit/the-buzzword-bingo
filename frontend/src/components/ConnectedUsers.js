import React from "react";
import CardHeader from "./CardHeader";
import "./ConnectedUsers.css";

const ConnectedUsers = ({users}) => (
    <div className="connected-users-container">
        <CardHeader text="Connected Users" color="#e22866" />

        <div className="connected-users">
            {users.map((user) => <div key={user}>{user}</div>)}
        </div>
    </div>
);

export default ConnectedUsers;
