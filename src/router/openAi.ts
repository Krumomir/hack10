import express from "express";
import bodyParser from "body-parser";

import { summarize, plan, extend, translate } from "../controllers/openAi";

export default (router: express.Router) => {
    router.use(bodyParser.json());
    router.post("/summarize", summarize);
    router.post("/plan", plan);
    router.post("/extend", extend);
    router.post("/translate", translate);
};