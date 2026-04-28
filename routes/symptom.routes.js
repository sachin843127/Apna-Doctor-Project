// const express = require("express");
// const router = express.Router();

// router.post("/analyze", (req, res) => {
//   const text = (req.body.text || "").toLowerCase();

//   // 🚨 Emergency
//   if (text.includes("chest pain") || text.includes("breath")) {
//     return res.json({
//       disease: "🚨 Emergency Condition",
//       do: ["Call ambulance immediately"],
//       dont: ["Do not ignore symptoms"],
//       diet: [],
//       remedy: [],
//       emergency: true
//     });
//   }

//   let response = {
//     disease: "General Health Issue",
//     do: ["Take rest", "Drink water"],
//     dont: ["Avoid stress"],
//     diet: ["Fruits", "Light food"],
//     remedy: ["Warm water"],
//     emergency: false
//   };

//   if (text.includes("bukhar") || text.includes("fever")) {
//     response = {
//       disease: "Viral Fever",
//       do: ["Take rest", "Drink fluids"],
//       dont: ["Cold drinks"],
//       diet: ["Khichdi", "Soup"],
//       remedy: ["Tulsi + ginger tea"],
//       emergency: false
//     };
//   }

//   res.json(response);
// });

// module.exports = router;



const express = require("express");
const router = express.Router();
const { analyzeSymptom } = require("../controllers/symptom.controller");

router.post("/analyze", analyzeSymptom);

module.exports = router;

