import express from "express";
import http from "http";
import router from "./router";
import dotenv from 'dotenv';
import cors from "cors";
import * as deepl from 'deepl-node';
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();

const server = http.createServer(app);

const port = process.env.PORT;

app.use(cors({
  origin: `http://localhost:${port}`,
  credentials: true,
}));


const deeplApiKey = process.env.DEEPL_API_KEY || ""; 

export const translator = new deepl.Translator(deeplApiKey);

server.listen(port, () => {
  console.log("Server is running on port " + port);
});

export const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY || "" 
});

app.use('/', router());
