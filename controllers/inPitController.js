const asyncHandler = require("express-async-handler");
const inPit = require("../models/inPitModel.js");

const getAllProfiles = asyncHandler(async (req, res) => {
	const profiles = await inPit.find();
    res.status(200).json(profiles);
});

const getProfile = asyncHandler(async (req, res) => {
	const profile = await inPit.find({teamNumber: req.query.teamNumber});
	// If the profile doesn't exist return a 404 error
	(!profile.length) ? res.status(404).end() : res.status(200).json(profile);
	
});

const editProfile = asyncHandler(async (req, res) => {
	// Check if the team has a profile
	const exists = await inPit.exists({teamNumber:req.body.teamNumber})
	if (!exists){
		// Create a profile for the team if it doesn't exist
		const profile = await inPit.create({
			teamNumber: req.body.teamNumber,
			working: req.body.working,
			numOfChargers: req.body.numOfChargers,
			numOfBatteries: req.body.numOfBatteries,
			drivetrain: req.body.drivetrain,
			preferredScoringType: req.body.preferredScoringType,
			preferredScoringMethod: req.body.preferredScoringMethod,
			comments: req.body.comments,
		});
		// Return that new profile with the appropriate status code (201 Created)
		res.status(201).json(profile);
	}else{
		// If the profile for the team already exists check for any differences between the body and the database

		const all = [];

		// Get current profile from database
		const modifiedDB = await inPit.findOne({teamNumber:req.body.teamNumber});
		// Create an array of the keys and values from the body and the database
		const entrifiedBody = Object.entries(req.body);
		// Database returns a document with a _doc property that contains the actual data
		const entrifiedDB = Object.entries(modifiedDB._doc);
		// Loop through the body and database arrays
		
		for ([key, value] of entrifiedBody){
			for ([dbKey, dbValue] of entrifiedDB){
				if (key === dbKey && dbValue instanceof Array){
					for ([index, obj] of dbValue.entries()){
						all.push(obj.content)
					}
					if (!(all.includes(value.content))){
						const updated = await inPit.findOneAndUpdate({teamNumber:req.body.teamNumber}, {$push: {[key]: value}}, {new: true});
						const copy = updated[key];
						copy.sort(function(a, b) {
							return new Date(a.timestamp) - new Date(b.timestamp);
						}).reverse();
						await inPit.update({teamNumber:req.body.teamNumber}, {[key]: copy})
					}
					
				}
			}
		  }
		// Return the profile regardless of whether it was updated or not
		const profile = await inPit.findOne({teamNumber: req.body.teamNumber})
		res.status(200).json(profile)
	}	
});

const deleteProfile = asyncHandler(async (req, res) => {
	const profile = await inPit.findOne({teamNumber: req.query.team});
	// If the profile doesn't exist return a 404 error otherwise delete the profile and return a 200 status code
	(!profile) ? res.status(404).end(): await profile.remove(); res.status(200).end();
});


module.exports = {
	getAllProfiles,
    getProfile,
    editProfile,
	deleteProfile
};
