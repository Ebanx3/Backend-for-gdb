import express from "express";
import mainRouter from "../routes";

class Server {
    public static instance: Server;
    app = express();

    private constructor(port: number) {
        this.app.use(express.json());
        this.app.use("/api", mainRouter);

        this.app.listen(port, () => console.log("Server ready, lintening at port", port))
    }

    public static getInstance(): Server {
        if (this.instance == null) {
            return new Server(parseInt(process.env.PORT || "8080"))
        }
        return this.instance
    }
}

export default Server;