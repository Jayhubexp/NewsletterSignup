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
		// Redirect to the success route
		res.redirect("/success");
	} catch (error) {
		const errorText = error.response?.text || "Unknown error";
		console.error(`Error subscribing user: ${errorText}`);
		res.redirect("/failure"); // Redirect to the failure route
	}
});

// Route for success page
app.get("/success", function (req, res) {
	res.sendFile(__dirname + "/success.html");
});

// Route for failure page
app.get("/failure", function (req, res) {
	res.sendFile(__dirname + "/failure.html");
});

// Start the server
app.listen(PORT, function () {
	console.log(`Server is running on port ${PORT}!`);
});

// const express = require('express');
// const request = require('request');
// const BodyParser = require('body-parser');
// const app = express();
// const https = require('https');
// const mailchimp = require("@mailchimp/mailchimp_marketing");

// app.use(express.static('public'));
// app.use(BodyParser.urlencoded({ extended: true }));

// app.get('/', function (req, res) {
//     res.sendFile(__dirname + '/signin.html');
// });

// app.post('/', function (req, res) {

//     mailchimp.setConfig({
//         apiKey: "a9dc29bb5359b72ba979ebcdd33b0d63-us21",
//         server: "app",
//       });

//       async function run() {
//         const response = await mailchimp.ping.get();
//         console.log(response);
//       }

//       run();

//     var firstName = req.body.fName;
//     var lastName = req.body.lName;
//     var email = req.body.email;

//     const listId = "efea33be87";
// const subscribingUser = {
//   firstName:req.body.fName ,
//   lastName: req.body.lName,
//   email: req.body.email
// };

// async function run() {
//   const response = await mailchimp.lists.addListMember(listId, {
//     email_address: subscribingUser.email,
//     status: "subscribed",
//     merge_fields: {
//       FNAME: subscribingUser.firstName,
//       LNAME: subscribingUser.lastName
//     }
//   });

//   console.log(
//     `Successfully added contact as an audience member. The contact's id is ${
//       response.id
//     }.`
//   );
// }

// run();

//     }
//     )

// app.listen(5000, function () {
//     console.log('Server is running on port 5000!');
// });

// // API Key
// // a9dc29bb5359b72ba979ebcdd33b0d63-us21
