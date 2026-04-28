const Record = require("../models/Record");

// SAVE RECORD (max 5 per user)
exports.saveRecord = async (req, res) => {
  try {
    const { userId, name, symptomText, disease } = req.body;

    if (!userId || !disease) {
      return res.status(400).json({ message: "Missing data" });
    }

    // count existing records
    const count = await Record.countDocuments({ userId });

    // if already 5 → delete oldest
    if (count >= 5) {
      const oldest = await Record.findOne({ userId }).sort({ createdAt: 1 });
      if (oldest) await Record.findByIdAndDelete(oldest._id);
    }

    const record = await Record.create({
      userId,
      name,
      symptomText,
      disease
    });

    res.json({ success: true, record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Record save failed" });
  }
};

// GET USER RECORDS
exports.getUserRecords = async (req, res) => {
  try {
    const { userId } = req.params;

    const records = await Record.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed" });
  }
};
