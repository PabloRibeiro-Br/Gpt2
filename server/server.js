import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration, OpenAIApi } from 'openai'
dotenv.config()

const configuration = new Configuration({
 apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);
const app = express()

app.use(cors())
app.use(express.json())

// Lista de palavras-chave relacionadas a transmissão automática
const transmissionKeywords = ['transmissão automática', 
'câmbio automático', 'reparação', 'manutenção', 'problemas de transmissão', 'fluidos', 'diagnóstico', 'torque converter', 'Qual lubrificante', 'Qual o óleo', 
'qual quantidade de óleo', 'todas as transmissões automáticas', 'reaparação de câmbios de automóveis'];

function isAboutTransmission(prompt) {
 const lowerPrompt = prompt.toLowerCase();
 return transmissionKeywords.some(keyword => lowerPrompt.includes(keyword));
}

app.get('/', async (req, res) => {
 res.status(200).send({
   message: 'Olá, bem-vindo! Este é um assistente sobre transmissões automáticas de automóveis.'
 })
})

app.post('/', async (req, res) => {
 try {
   const prompt = req.body.prompt;

   // Verifique se o prompt está relacionado a transmissões automáticas
   if (isAboutTransmission(prompt)) {
     const response = await openai.createCompletion({
       model: "text-davinci-003",
       prompt: `${prompt}`,
       temperature: 0.5,
       max_tokens: 200, 
       top_p: 0.4, 
       frequency_penalty: 0.5, 
       presence_penalty: 0, 
     });

     res.status(200).send({
       bot: response.data.choices[0].text
     });
   } else {
     res.status(200).send({
       bot: 'Desculpe, este assistente responde apenas sobre transmissões automáticas de automóveis.'
     });
   }

 } catch (error) {
   console.error(error)
   res.status(500).send(error || 'Algo deu errado');
 }
})

app.listen(5000, () => console.log('Servidor AI iniciado em http://localhost:5000'))
