import { Request, Response, NextFunction } from "express";
import { checkAuth } from "../services/auth";

const authenticate = (req: Request, res: Response, next: NextFunction) => {
    try {
        const tokenAuth = req.get("token-auth")

        if (!tokenAuth || !checkAuth(tokenAuth)) return res.status(401).json({ success: false, message: "Unauthorized" })

        next();
    } catch (err) {
        console.log(err)
        return res.status(401).json({ success: false, message: "Unauthorized" })
    }
}

export default authenticate;