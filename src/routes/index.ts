import { Router } from "express";
import { addDB, addElement, getAll } from "../controllers/database";
import { login, signup } from "../controllers/users";
import authenticate from "../middlewares/authenticate";

const router = Router();


router.post("/auth/login", login);
router.post("/auth/signup", signup);

router.use(authenticate);
router.post("/setdburlandname", addDB);
router.post("/addElement", addElement);
router.get("/", getAll);
export default router;