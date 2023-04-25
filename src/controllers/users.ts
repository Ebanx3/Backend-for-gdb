import { Request, Response, } from "express";
import ConnectDB from "../services/db";
import { hash, compare } from "bcrypt"
import config from "../config";
import { generateAuthToken } from "../services/auth";
import { verify } from "jsonwebtoken";

export const userConnection = new ConnectDB(config.URL_DB || "", "gdbUsers");

const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) return res.status(400).json({ success: false, message: 'Must have email and password fields' })

        const response: any = await userConnection.getElement("users", { email: email.toLowerCase() });
        if (!response) return res.status(400).json({ success: false, message: "invalid email or password" });

        const samePass = await compare(password, response.password);
        if (!samePass) return res.status(400).json({ success: false, message: "invalid email or password" });

        const token = generateAuthToken(response);

        res.status(200).setHeader('token-auth', token).json({ success: "true" })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false })
    }
}

const signup = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!password || !email) return res.status(400).json({ success: false, message: 'Must have password and email fields' })


        const response = await userConnection.getElement("users", { email: email.toLowerCase() });
        if (response) return res.status(400).json({ success: false, message: "email already used" });

        const hashedPassword = await hash(password, 10);

        userConnection.addELement("users", { email: email.toLowerCase(), password: hashedPassword });

        res.status(200).json({ success: true })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false })
    }
}

const isValidToken = async (req: Request, res: Response) => {
    try {
        const tokenAuth = req.get("token-auth")
        if (!tokenAuth) return res.status(400).json({ success: false, message: "Headers must have a token" })
        const tokenData: any = verify(tokenAuth!, process.env.TOKEN_SECRET_KEY!)
        const email: string = tokenData.email
        res.status(200).json({ success: true, data: email })
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ success: false })
    }
}

export { login, signup, isValidToken }