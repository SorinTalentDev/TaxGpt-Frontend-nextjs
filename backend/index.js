const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

// app.use(cors(corsOptions));
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: "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",
  dangerouslyAllowBrowser: true,
});

const assistantId = 'asst_ItNNqhVEJOXkiODy0PlNGG6J';

async function sendMessageToAssistant(userInput){
  try{
    //Create a new thread for conversation
    const thread = await openai.beta.threads.create();

    //Send user's input the assistant
    await openai.beta.threads.messages.create(thread.id, {
      role: 'user',
      content: userInput,
    });

    //Run the assistanton the thread
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });

    //Poll for assistant response
    let response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    while(response.status === 'in_progress' || response.status === 'queued') {
      await new Promise(resolve => setTimeout(resolve, 5000));
      response = await openai.beta.threads.runs.retrieve(thread.id, run.id);
    }

    //Get the assistant's reply message
    const messages = await openai.beta.threads.messages.list(thread.id);
    const lastMessage = messages.data
      .filter((message) => message.role === 'assistant')
      .pop();

      return lastMessage ? lastMessage.content[0].text.value : 'No response received';
  } catch (error) {
    console.error('Error', error);
    return `Error occurred while contacting assistant: ${error.message || error}`;
  }
}

app.post('/send-message', async (req, res) => {
  const userInput = req.body.messages;
  const assistantResponse  = await sendMessageToAssistant(userInput);
  res.json(assistantResponse);
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});