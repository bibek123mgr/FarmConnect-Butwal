const baseUrl =
    window.location.hostname === "localhost"
        ? "http://localhost:3000/api"
        : "http://192.168.1.46:3000/api";

export { baseUrl };