const express = require("express");
const routes = express.Router();
const nodeMailer = require("nodemailer");

routes.post("/", async (req, res) => {
  const output = `
 <p> Nwe contact request</p>
 <h3>Contact Details</h3>
 <ul>
   <li>Name:${req.body.name}</li>
   <li>Company:${req.body.company}</li> 
   <li>Telephone:${req.body.telephone}</li> 
   <li>Email:${req.body.email}</li>
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
