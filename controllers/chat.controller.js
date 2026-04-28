const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const SYSTEM_PROMPT =
  "You are a compassionate, doctor-like assistant. Use Hinglish (Hindi + English) by default. " +
  "Answer the user's question first, clearly and directly. " +
  "Ask follow-up questions only when they are necessary to give safe or accurate guidance (max 1–2). " +
  "If the user asks a general question, answer it without extra questions. " +
  "Give general health information and self-care guidance, but do NOT provide a definitive diagnosis. " +
  "If symptoms seem severe or emergency-related, advise to seek urgent medical care. " +
  "Keep replies very short, friendly, and helpful. " +
  "Limit to 1–3 short lines (max ~60 words). " +
  "Do not add extra details unless the user asks. " +
  "If a follow-up is needed, ask only one short question.";

exports.doctorChat = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({ message: "Messages array is required" });
    }

    const cleaned = messages
      .filter(m => m && typeof m.content === "string")
      .map(m => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content.trim()
      }))
      .filter(m => m.content.length > 0)
      .slice(-12);

    const completion = await groq.chat.completions.create({
      model: process.env.GROQ_MODEL || "llama-3.1-8b-instant",
      temperature: 0.4,
      max_tokens: 120,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...cleaned
      ]
    });

    const reply = completion?.choices?.[0]?.message?.content || "";
    res.json({ reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Chat failed" });
  }
};
