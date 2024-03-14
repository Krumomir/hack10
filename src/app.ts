import express from "express";
import http from "http";
import router from "./router";
import dotenv from 'dotenv';
import cors from "cors";
import { OpenAI } from 'openai';
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();

const server = http.createServer(app);

const port = process.env.PORT;

app.use(cors({
  origin: 'http://localhost:8080',
  credentials: true,
}));


server.listen(port, () => {
  console.log("Server is running on port " + port);
});

export const openai = new OpenAI(
{
    apiKey: process.env.OPENAI_API_KEY,
});

export const anthropic = new Anthropic({
    apiKey: process.env.CLAUDE_API_KEY
});

app.use('/', router());
