const express = require("express");
const router = express.Router();
const experienceController = require("../controllers/experienceController");

router.post("/experience", experienceController.addExperience);
router.post("/inviteStudents", experienceController.inviteStudents);

module.exports = router;