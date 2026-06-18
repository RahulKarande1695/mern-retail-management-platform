import sgMail from "@sendgrid/mail";
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendOtp = async (email, code) => {
  try {
    const response = await sgMail.send({
      to: email,
      from: process.env.FROM_EMAIL,
      subject: "Your DGFlake OTP",
      text: `Your OTP is: ${code}`,
    });

    console.log("SENDGRID SUCCESS", response, response[0].statusCode);
  } catch (err) {
    console.log("SENDGRID ERROR");

    console.log(err.response?.body || err);

    throw err;
  }
};

export default sendOtp;