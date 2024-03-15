import express from 'express';
import { translator, anthropic } from '../app';
import * as deepl from 'deepl-node';

export const summarize = async (req: express.Request, res: express.Response) => {
  const { text } = req.body;
  const prompt = `Summarize the following text in your own words, aiming to make it easier and faster for students to learn. Remember to maintain a casual tone and focus on clarity and brevity in your summary.`;

  const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0,
      system: prompt,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": text
            }
          ]
        }
      ]
    });

  try {
      res.type('application/json');
      return res.send({ message: msg.content[0].text });
  } catch (error) {
      throw new Error(error as string);
  }
};

export const plan = async (req: express.Request, res: express.Response) => {
  const { text } = req.body;
  
  const prompt = `Imagine you're tasked with restructuring a comprehensive set of educational materials into a concise and organized plan for students that they can use during studying certain topic and format it as markdown. Add tags as the last line, as a JSON string array, that represent the content of the topic.\n \n topic: \n\n ${text}`;

  const msg = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 4000,
      temperature: 0,
      system: prompt,
      messages: [
        {
          "role": "user",
          "content": [
            {
              "type": "text",
              "text": text
            }
          ]
        }
      ]
    });

  try {
      let message = msg.content[0].text;
      const tags = JSON.parse(message.split('\n').pop() || '[]');

      //remove the last line of the message    
      message = message.split('\n').slice(0, -1).join('\n');

      return res.send({
          message: message,
          tags: tags
      });
  } catch (error) {
      throw new Error(error as string);
  }
};

export const extend = async (req: express.Request, res: express.Response) => {
    const topic = req.body.topic;
    const text = req.body.text;
    
    const prompt = `Explore the topic in details, providing comprehensive insights to aid students and scholars in their learning journey. Keep in mind the token count while delivering casual and accessible explanations, aiming to facilitate easier and faster learning. The topic is: \n\n ${topic}`;

    const msg = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 4000,
        temperature: 0,
        system: prompt,
        messages: [
          {
            "role": "user",
            "content": [
              {
                "type": "text",
                "text": text
              }
            ]
          }
        ]
      });

    try {
        let message = msg.content[0].text;
       
        return res.send({ message: message });
    } catch (error) {
        throw new Error(error as string);
    }
};

export const translate = async (req: express.Request, res: express.Response) => {
  const { text, target } = req.body;

  const results = await translator.translateText(
      text,
      null,
      target,
  ) as deepl.TextResult;
  
  try {
      return res.send({ message: results.text });
  } catch (error) {
      throw new Error(error as string);
  }
}
