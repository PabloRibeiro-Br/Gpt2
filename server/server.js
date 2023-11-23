import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';
import { generateResponse } from './openaiService'; // Import the openaiService module
dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express();

app.use(cors());
app.use(express.json());

// Lista de palavras-chave relacionadas a transmissão automática
const transmissionKeywords = ['transmissão automática', 'câmbio automático', 'reparação', 'manutenção', 'problemas de transmissão', 'fluidos', 'diagnóstico', 'torque converter'];

function isAboutTransmission(prompt) {
  const lowerPrompt = prompt.toLowerCase();
  return transmissionKeywords.some(keyword => lowerPrompt.includes(keyword));
}

app.get('/', async (req, res) => {
  res.status(200).send({
    message: 'Olá, bem-vindo! Este é um assistente sobre transmissões automáticas de automóveis.'
  });
});

app.post('/', async (req, res) => {
  try {
    const prompt = req.body.prompt;

    // Verifique se o prompt está relacionado a transmissões automáticas
    if (isAboutTransmission(prompt)) {
      // Use the generateResponse function from the openaiService module
      const response = await generateResponse(prompt, conversationArray);

      res.status(200).send({
        bot: response,
      });
    } else {
      res.status(200).send({
        bot: 'Desculpe, este assistente responde apenas sobre transmissões automáticas de automóveis.'
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).send(error || 'Algo deu errado');
  }
});

app.listen(5000, () => console.log('Servidor AI iniciado em http://localhost:5000'));