let ElasticEmail = require("@elasticemail/elasticemail-client");
// elastic mail api key ==  9439329EC5E91402819D40EC14A95BB6E38F5E770B33D0DB1EA4DE0E228D62EC74F164D0C4E995FB9B29EB919F8EA483

let defaultClient = ElasticEmail.ApiClient.instance;

let apikey = defaultClient.authentications["apikey"];
apikey.apiKey =process.env.MAIL_API_KEY;
const sendMail = (data) => {
  let api = new ElasticEmail.EmailsApi();

  const emailData = {
    Recipients: {
      To: [data.email],
    },
    Content: {
      Body: [
        {
          ContentType: "HTML",
          Charset: "utf-8",
          Content: `${data.resetUrl}`,
        },
      ],
      From: "yuvrajsinghchouhan668@gmail.com",
      Subject: `${data.subject}`,
    },
  };

  api.emailsTransactionalPost(emailData, (error, data, response) => {
    if (error) {
      console.log(error);
    } else {
      // console.log(response);
      console.log(data);
    }
  });
};

module.exports = { sendMail };
