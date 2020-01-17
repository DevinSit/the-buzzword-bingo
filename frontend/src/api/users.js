import axios from "axios";
import {BACKEND_URL} from "../config";

const BASE_API = `${BACKEND_URL}/api/v1`;

const USERS_ROUTE = `${BASE_API}/users`;
const WINNERS_ROUTE = `${USERS_ROUTE}/winners`;

export const getState = async () => {
    const response = await axios.get(USERS_ROUTE);
    return response.data;
};

export const connect = async (username) => {
    const response = await axios.post(USERS_ROUTE, {username});
    return response.data;
};

export const disconnect = async (username) => {
    const response = await axios.delete(USERS_ROUTE, {data: {username}});
    return response.data.users;
};

export const saveWinner = async (username) => {
    const response = await axios.post(WINNERS_ROUTE, {username});
    return response.data.winners;
};
