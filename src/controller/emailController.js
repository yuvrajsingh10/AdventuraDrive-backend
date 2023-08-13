/**
 *
 * This call sends a message to the given recipient with vars and custom vars.
 *
 */
const mailjet = require ('node-mailjet')
	.connect({"BASE_URL":"https://app.mailjet.com","NODE_ENV":"production","PREPROD":false}.MJ_APIKEY_PUBLIC, {"BASE_URL":"https://app.mailjet.com","NODE_ENV":"production","PREPROD":false}.MJ_APIKEY_PRIVATE)
const request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
			{
				"From": {
					"Email": "yuvrajsinghchouhan668@gmail.com",
					"Name": "AdventuraDrive"
				},
				"To": [
					{
						"Email": "passenger1@example.com",
						"Name": "passenger 1"
					}
				],
				"TemplateID": 5018144,
				"TemplateLanguage": true,
				"Subject": "Reset Password",
				"Variables": {}
			}
		]
	})
request
	.then((result) => {
		console.log(result.body)
	})
	.catch((err) => {
		console.log(err.statusCode)
	})