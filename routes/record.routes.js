
// const express = require("express");
// const router = express.Router();
// const {
//   saveRecord,
//   getRecords
// } = require("../controllers/record.controller");

// router.post("/save", saveRecord);
// router.get("/:userId", getRecords);

// module.exports = router;

// const express = require("express");
// const router = express.Router();
// const {
//   saveRecord,
//   getUserRecords
// } = require("../controllers/record.controller");

// router.post("/save", saveRecord);
// router.get("/:userId", getUserRecords);

// module.exports = router;


const express = require("express");
const router = express.Router();
const { saveRecord, getUserRecords } = require("../controllers/record.controller");

router.post("/save", saveRecord);
router.get("/:userId", getUserRecords);

module.exports = router;
