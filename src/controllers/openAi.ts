import express, { response } from 'express';
import { openai, anthropic } from '../app';

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

    // Make the API request here...
    try {
        // const response = await openai.chat.completions.create({
        //     model: 'gpt-3.5-turbo-16k',
        //     messages: [{ role: 'system', content: prompt }],
        //     temperature: 0.5
        // });

        res.type('application/json');
        return res.send({ message: /*response.choices[0].message.content*/ msg.content[0].text });
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

    // Make the API request here...
    try {
        // const response = await openai.chat.completions.create({
        //     model: 'gpt-3.5-turbo-16k',
        //     messages: [{ role: 'system', content: prompt }],
        //     temperature: 0.5
        // });

        // if (!response.choices[0].message.content) {
        //     throw new Error('No response from the API');
        // }

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
    const { text } = req.body;
    
    const prompt = `Provide more information abou the topic ${text}`;

    // Make the API request here...
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo-16k',
            messages: [{ role: 'system', content: prompt }],
            temperature: 0.7
        });
        return response.choices[0].message.content;
    } catch (error) {
        throw new Error(error as string);
    }
};
