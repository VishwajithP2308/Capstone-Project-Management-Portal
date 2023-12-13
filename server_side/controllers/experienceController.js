const Experience = require("../models/experience");
const mailService = require("../services/sendMail");

exports.addExperience = async (req, res) => {
  try {
    // Create a new experience with the request body data
    const newExperience = new Experience({
      experienceText: req.body.experienceText,
      skillsText: req.body.skillsText,
    });

    // Save the new experience to the database
    const experience = await newExperience.save();
    console.log(JSON.stringify(experience));
    // Send a success response
    res.status(201).json(experience);
  } catch (error) {
    // If there's an error, send an error response
    console.log("Error in API controller");
    res.status(400).json({ error: error.message });
  }
};

exports.inviteStudents = async (req, res) => {
  try {
    const mail = req.body.mail;
    const subject = "INVITATION TO JOIN UMASS";
    const name = "Student";

    await mailService.sendEmail(mail, subject, name);
    console.log("Successfully sent mail to invite student ");
    res.status(201);
  } catch (error) {
    console.log("Error sending an email");
    res.status(400).json({ error: error.message });
  }
};