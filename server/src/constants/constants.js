export const SERVER_TIME = () =>
    new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" })
    );
