const express = require("express");
const routes = express.Router();
const nodeMailer = require("nodemailer");

routes.post("/", async (req, res) => {
  const output = `
   <p> Nwe contact request</p>
   <h3>Contact Details</h3>
   <ul>
     <li>fullname:${req.body.fullname}</li>
     <li> email:${req.body.email}</li>
     <li>Telephone:${req.body.telephone}</li>
     <li>message:${req.body.message}</li>
   </ul>
   `;

  let mailTransporter = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: " iken6970@gmail.com",
      pass: "cisoiclhegsygqnz",
    },
  });

  let mailOptions = {
    from: "iken6970@gmail.com",
    to: "kingchiji89@gmail.com",
    subject: "texting",
    text: "IT",
    html: output,
  };

  mailTransporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log("error in sending mail", err);
      return res.status(400).json({ data: "error in sending mail" });
    } else {
      res.send("mail send!");
      return res.json({ send: mailOptions });
    }
  });
});
module.exports = routes;
