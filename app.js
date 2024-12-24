const express = require("express");
const bodyParser = require("body-parser");
const mailchimp = require("@mailchimp/mailchimp_marketing");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Mailchimp Configuration
mailchimp.setConfig({
	apiKey: process.env.MAILCHIMP_API_KEY,
	server: process.env.MAILCHIMP_SERVER,
});

// Route for displaying the signup page
app.get("/", function (req, res) {
	res.sendFile(__dirname + "/signin.html");
});

// Route for handling form submissions
app.post("/", async function (req, res) {
	const { fName, lName, email } = req.body;

	const listId = process.env.LIST_ID;
	const subscribingUser = {
		firstName: fName,
		lastName: lName,
		email: email,
	};

	try {
		const response = await mailchimp.lists.addListMember(listId, {
			email_address: subscribingUser.email,
			status: "subscribed",
			merge_fields: {
				FNAME: subscribingUser.firstName,
				LNAME: subscribingUser.lastName,
			},
		});
		console.log(`Successfully added contact: ${response.id}`);
		res.sendFile(__dirname + "/success.html"); // Show success page
	} catch (error) {
		console.error(`Error subscribing user: ${error}`);
		res.sendFile(__dirname + "/failure.html"); // Show failure page
	}
});

// Start the server
app.listen(PORT, function () {
	console.log(`Server is running on port ${PORT}!`);
});
