    const express = require("express");
    const app = express();
    const dbConnect = require("./config/database");
    //expiring token and cookie in 7 day is geeral.
    // example - u visit cafe and login but forgot logout and token has no expiry.
    const cookieParser = require("cookie-parser");

    app.use(express.json());
    app.use(cookieParser());

    const authRouter = require("./routes/auth");
    const profileRouter = require("./routes/profile");
    const requestsRouter = require("./routes/requests");

    // Health check route
    app.get("/health", (req, res) => {
        res.send({ status: "OK", message: "Server is running" });
    });

    app.use("/", authRouter);
    app.use("/", profileRouter);
    app.use("/", requestsRouter);

    // Catch-all route for undefined endpoints
    app.use((req, res) => {
        res.status(404).send("Route not found");
    });

    // Global error handler
    app.use((err, req, res, next) => {
        console.error("Error:", err);
        res.status(500).send({ error: err.message || "Internal server error" });
    });

    dbConnect().then(()=>{
        console.log("Database connected");
        app.listen(3000,()=>{console.log("Application is listening on port no 3000")});
    }).catch((err)=>{
        console.log(err);
    });
    