import express from "express";
import openAi from "./openAi";

const router = express.Router();

export default (): express.Router => {
    openAi(router);
    
    return router;
};