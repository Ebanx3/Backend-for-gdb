import { verify } from "jsonwebtoken";
import ConnectDB from "../services/db";
import { Request, Response, } from "express";
import { userConnection } from "./users";

const addDB = async (req: Request, res: Response) => {
    const tokenAuth = req.get("token-auth")
    const tokenData: any = verify(tokenAuth!, process.env.TOKEN_SECRET_KEY!)
    const email: string = tokenData.email
    const { url_db } = req.body;
    const dbName = email.split("@")[0]
    if (!url_db || !dbName) return res.status(400).json({ success: false, message: "body must have url_db string" })

    try {
        await userConnection.updateElement("users", { email }, { url_db, dbName })
        return res.status(200).json({ success: true, message: "connected to db" })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "invalid string url database" })
    }
}

const addElement = async (req: Request, res: Response) => {
    const tokenAuth = req.get("token-auth")
    const tokenData: any = verify(tokenAuth!, process.env.TOKEN_SECRET_KEY!)
    const email: string = tokenData.email
    const { element, collectionName } = req.body;
    if (!element || !collectionName) return res.status(400).json({ success: false, message: "body must have collectionName and element to add" })

    try {
        const user: any = await userConnection.getElement("users", { email })

        const newConnection = new ConnectDB(user.url_db, user.dbName);

        await newConnection.addELement(collectionName, element)

        res.status(200).json({
            success: true
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "can´t add element" })
    }
}

const getAll = async (req: Request, res: Response) => {
    const tokenAuth = req.get("token-auth")
    const tokenData: any = verify(tokenAuth!, process.env.TOKEN_SECRET_KEY!)
    const email: string = tokenData.email
    const { collectionName } = req.body;
    if (!collectionName) return res.status(400).json({ success: false, message: "body must have collectionName to get" })


    try {
        const user: any = await userConnection.getElement("users", { email })

        const newConnection = new ConnectDB(user.url_db, user.dbName);
        const elements = await newConnection.getElements(collectionName);
        res.status(200).json({
            success: true,
            elements
        })
    }
    catch (err) {
        console.log(err)
        return res.status(400).json({ success: false, message: "can´t get all elements" })
    }
}
export { addDB, addElement, getAll }