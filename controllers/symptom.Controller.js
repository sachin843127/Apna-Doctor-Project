// const groq = require("../utils/groqClient");

// exports.analyzeSymptom = async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ message: "Symptom text required" });
//     }

//     const lower = text.toLowerCase();

//     // 🚨 STEP 1: Emergency local check (AI se pehle)
//     if (
//       lower.includes("chest pain") ||
//       lower.includes("breath") ||
//       lower.includes("saans") ||
//       lower.includes("heart")
//     ) {
//       return res.json({
//         source: "local",
//         disease: "🚨 Emergency Condition",
//         do: ["Turant ambulance call karein", "Patient ko shant rakhein"],
//         dont: ["Symptoms ignore na karein"],
//         diet: [],
//         remedy: [],
//         emergency: true
//       });
//     }

//     // 🧠 STEP 2: Groq AI call
//     const completion = await groq.chat.completions.create({
//       model: "llama-3.1-8b-instant", // free + fast
//       messages: [
//         {
//           role: "system",
//           content: `
// You are a medical symptom checker.
// Respond ONLY in valid JSON format like:
// {
//   "disease": "",
//   "do": [],
//   "dont": [],
//   "diet": [],
//   "remedy": [],
//   "emergency": false
// }
// Use simple Hinglish.
// No markdown, no extra text.
// `
//         },
//         {
//           role: "user",
//           content: text
//         }
//       ],
//       temperature: 0.3
//     });

//     const aiText = completion.choices[0].message.content;

//     // ⚠️ safe parse
//     let parsed;
//     try {
//       parsed = JSON.parse(aiText);
//     } catch (e) {
//       return res.status(500).json({
//         error: "AI response parsing failed",
//         raw: aiText
//       });
//     }

//     res.json({
//       source: "ai",
//       ...parsed
//     });

//   } catch (error) {
//     console.error("Groq Error:", error);
//     res.status(500).json({ error: "Groq AI failed" });
//   }
// };

const groq = require("../utils/groqClient");

exports.analyzeSymptom = async (req, res) => {
  try {
    const text = (req.body.text || "").toLowerCase();

    // 🚨 Emergency (local, instant)
    if (text.includes("chest pain") || text.includes("breath")) {
      return res.json({
        source: "local-engine",
        disease: "🚨 Emergency Condition",
        do: ["Call ambulance immediately"],
        dont: ["Do not ignore symptoms"],
        diet: [],
        remedy: [],
        emergency: true
      });
    }

    // 🧠 GROQ AI CALL (for everything else)
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `
You are a medical symptom checker.
Reply ONLY in valid JSON like:
{
  "disease": "",
  "do": [],
  "dont": [],
  "diet": [],
  "remedy": [],
  "emergency": false,
  "followUpQuestion": ""
}
Use simple Hindi-English (Hinglish).
You MUST always include a followUpQuestion.
If not needed, ask about duration or severity.
No markdown.`
        },
        {
          role: "user",
          content: text
        }
      ],
      temperature: 0.3
    });

    const aiText = completion.choices[0].message.content;
    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch (parseErr) {
      return res.status(500).json({
        error: "AI response parsing failed",
        raw: aiText
      });
    }

    return res.json({
      source: "groq-ai",
      disease: parsed.disease,
      do: parsed.do,
      dont: parsed.dont,
      diet: parsed.diet,
      remedy: parsed.remedy,
      emergency: parsed.emergency,
      followUpQuestion: parsed.followUpQuestion
    });
  } catch (err) {
    console.error("Groq Error:", err);
    return res.status(500).json({ error: "AI analysis failed" });
  }
};
