// If the BACKEND values aren't set, this means we are running in development mode locally.
// Otherwise, they are substituded by the production Node server into the root index.html.
if (window.BACKEND_HOST === "__BACKEND_HOST__") {
    // Use window.location.hostname instead of just 'localhost' so that it still works
    // when running the server locally, but connecting to it from another device (e.g. for mobile testing).
    window.BACKEND_HOST = window.location.hostname;
}

if (window.BACKEND_PORT === "__BACKEND_PORT__") {
    window.BACKEND_PORT = "8080";
}

if (window.BACKEND_PROTOCOL === "__BACKEND_PROTOCOL__") {
    window.BACKEND_PROTOCOL = "http";
}

let BACKEND_URL = `${window.BACKEND_PROTOCOL}://${window.BACKEND_HOST}`;

if (window.BACKEND_PORT !== "80" && window.BACKEND_PORT !== "443") {
    BACKEND_URL = `${BACKEND_URL}:${window.BACKEND_PORT}`;
}

export {
    BACKEND_URL
};
