import { MongoClient, ObjectId } from "mongodb";

class ConnectDB {
    url: string = "";
    client: MongoClient;
    db;

    constructor(url: string, dbName: string) {
        this.url = url;
        this.client = new MongoClient(this.url);
        this.db = this.client.db(dbName);
    }

    private async connectDoDisconnect(method: Function) {
        try {
            await this.client.connect();
            await method();
            await this.client.close();
        }
        catch (err) {
            console.log(err)
        }
    }

    async addELement(collectionName: string, object: object) {
        this.connectDoDisconnect(async () => {
            try { await this.db.collection(collectionName).insertOne(object); }
            catch (err) {
                console.log(err)
            }
        })
    }

    async getElements(collectionName: string) {
        let res;
        await this.connectDoDisconnect(async () => {
            res = await this.db.collection(collectionName).find({}).toArray();
        })
        return res;
    }

    async getElement(collectionName: string, query: any) {
        let res;
        await this.connectDoDisconnect(async () => {
            res = await this.db.collection(collectionName).findOne(query)
        })
        return res;
    }

    async updateElement(collectionName: string, queryFind: any, query: any) {
        await this.connectDoDisconnect(async () => {
            const element = await this.db.collection(collectionName).findOneAndUpdate(queryFind, { $set: query });
        })
    }
}

export default ConnectDB;