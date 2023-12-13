const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  // Define the schema fields here
  experienceText: {
    type: String,
    required: true,
  },
  skillsText: {
    type: String,
    required: true,
  },
  // Add any other fields you need
});

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;