import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: 'gemini-2.5-flash',
});

export async function generateAIResponse(prompt, history = []) {
  // Convert our message history format to Gemini's format if needed
  // For simplicity, we can just pass the new prompt and let it be stateless,
  // or we can build a proper chat session.
  // The PRD mentions `model.generateContent(prompt)` as an example.
  // We'll use startChat for conversational history.
  
  const formattedHistory = history.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
  });

  const result = await chat.sendMessage(prompt);
  return result.response.text();
}
