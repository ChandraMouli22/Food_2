// server.js
require("dotenv").config();
const { initializeApp, cert } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

// Handle Firebase credentials from environment variables or key.json
let serviceAccount;

if (process.env.FIREBASE_CREDENTIALS) {
  // For Vercel: Use single environment variable with entire JSON
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_CREDENTIALS);
  } catch (err) {
    console.error("Error parsing FIREBASE_CREDENTIALS:", err.message);
    process.exit(1);
  }
} else if (process.env.FIREBASE_PROJECT_ID) {
  // For local development: Use individual env variables
  serviceAccount = {
    type: "service_account",
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY
      ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
      : undefined,
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
    client_id: process.env.FIREBASE_CLIENT_ID,
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url: process.env.FIREBASE_CERT_URL,
  };
} else {
  // Fallback for local development with key.json file
  try {
    serviceAccount = require("./key.json");
  } catch (err) {
    console.error(
      "Firebase credentials not found! Please set FIREBASE_CREDENTIALS env variable or ensure key.json exists."
    );
    process.exit(1);
  }
}

initializeApp({
  credential: cert(serviceAccount),
});

const db = getFirestore();

const bp = require("body-parser");
const ph = require("password-hash");
const uniqId = require("uniqid");
const session = require("express-session");
const express = require("express");

const app = express();

// --- Email setup (SendGrid) ---
const sgMail = require("@sendgrid/mail");

// Get and sanitize SendGrid key
function getSendGridKey() {
  const key = (process.env.SENDGRID_KEY || "").trim();
  // Remove any quotes if they exist
  return key.replace(/^["']|["']$/g, "").trim();
}

async function sendEmail(to, subject, text) {
  try {
    const sendgridKey = getSendGridKey();

    // Check if key exists
    if (!sendgridKey) {
      console.warn("⚠️  SendGrid key not found. Email not sent to:", to);
      return;
    }

    // Validate key format
    if (!sendgridKey.startsWith("SG.")) {
      console.warn(
        "⚠️  SendGrid key invalid format. Must start with 'SG.'. Email not sent to:",
        to
      );
      return;
    }

    // Check for invalid characters in the key
    if (/[\n\r\t]/.test(sendgridKey)) {
      console.warn(
        "⚠️  SendGrid key contains invalid characters (newlines/tabs). Email not sent to:",
        to
      );
      return;
    }

    // Set the API key each time (fresh)
    sgMail.setApiKey(sendgridKey);

    // Send email
    const msg = { to, from: "mouli4115@gmail.com", subject, text };
    await sgMail.send(msg);
    console.log("✅ Email sent successfully to:", to);
  } catch (error) {
    console.warn(
      "⚠️  Email sending failed (non-critical):",
      error.message || error
    );
    // Don't throw - let the donation proceed without email
    return;
  }
}

// serve static files (if you want to add client JS/css under /public)
app.use(express.static("public"));

app.set("view engine", "ejs");
app.use(bp.urlencoded({ extended: true }));
app.use(bp.json());
app.use(
  session({
    secret: "food donation app",
    resave: true,
    saveUninitialized: true,
  })
);

app.get("/", function (req, res) {
  res.render("intro");
});

app.get("/signup", function (req, res) {
  res.render("reg_home");
});

app.get("/orgRegister", function (req, res) {
  res.render("org_register", { sucState: false, errState: false });
});

app.get("/donRegister", function (req, res) {
  res.render("don_register", { sucState: false, errState: false });
});

app.get("/orglogin", function (req, res) {
  res.render("org_login", { errState: false });
});

app.get("/donlogin", function (req, res) {
  res.render("don_login", { errState: false });
});

// app.post("/org_register_submit", function (req, res) {
//   const email = req.body.email;
//   const psw = req.body.psw;
//   const c_psw = req.body.c_psw;
//   db.collection("Organizations")
//     .where("email", "==", email)
//     .get()
//     .then((docs) => {
//       if (docs.size > 0) {
//         res.render("org_register", {
//           sucState: false,
//           errState: true,
//           errMsg: "Organization Already Exists.!",
//         });
//       } else {
//         if (psw == c_psw) {
//           db.collection("Organizations")
//             .add({
//               organization_name: req.body.organization_name,
//               organization_id: req.body.org_id,
//               owner_name: req.body.owner_name,
//               email: email,
//               password: ph.generate(psw),
//               ph_no: req.body.phone_no,
//               state: req.body.state,
//               dist: req.body.district,
//               city: req.body.city,
//               street: req.body.street,
//               pincode: req.body.pincode,
//             })
//             .then(() => {
//               res.render("org_register", { sucState: true, errState: false });
//             });
//         } else {
//           res.render("org_register", {
//             sucState: false,
//             errState: true,
//             errMsg: "Pasword Doesn't Match.!",
//           });
//         }
//       }
//     });
//   // console.log(req.body);
// });
app.post("/org_register_submit", function (req, res) {
  const email = req.body.email;
  const psw = req.body.psw;
  const c_psw = req.body.c_psw;

  // ✅ Step 1: Password validation regex
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  db.collection("Organizations")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("org_register", {
          sucState: false,
          errState: true,
          errMsg: "Organization Already Exists.!",
        });
      } else {
        // ✅ Step 2: Check password format first
        if (!passwordRegex.test(psw)) {
          return res.render("org_register", {
            sucState: false,
            errState: true,
            errMsg:
              "Password must have at least 8 chars, one letter, one number, and one special character.",
          });
        }

        // ✅ Step 3: Then check if passwords match
        if (psw == c_psw) {
          db.collection("Organizations")
            .add({
              organization_name: req.body.organization_name,
              organization_id: req.body.org_id,
              owner_name: req.body.owner_name,
              email: email,
              password: ph.generate(psw),
              ph_no: req.body.phone_no,
              state: req.body.state,
              dist: req.body.district,
              city: req.body.city,
              street: req.body.street,
              pincode: req.body.pincode,
            })
            .then(() => {
              res.render("org_register", { sucState: true, errState: false });
            });
        } else {
          res.render("org_register", {
            sucState: false,
            errState: true,
            errMsg: "Password Doesn't Match.!",
          });
        }
      }
    });
});

// app.post("/don_register_submit", function (req, res) {
//   const email = req.body.email;
//   const psw = req.body.psw;
//   const c_psw = req.body.c_psw;
//   db.collection("Donors")
//     .where("email", "==", email)
//     .get()
//     .then((docs) => {
//       if (docs.size > 0) {
//         res.render("don_register", {
//           sucState: false,
//           errState: true,
//           errMsg: "Donor Already Exists.!",
//         });
//       } else {
//         if (psw == c_psw) {
//           db.collection("Donors")
//             .add({
//               Donor_name: req.body.user_name,
//               email: email,
//               password: ph.generate(psw),
//               ph_no: req.body.phone_no,
//               state: req.body.state,
//               dist: req.body.district,
//               city: req.body.city,
//               street: req.body.street,
//               pincode: req.body.pincode,
//             })
//             .then(() => {
//               res.render("don_register", { sucState: true, errState: false });
//             });
//         } else {
//           res.render("don_register", {
//             sucState: false,
//             errState: true,
//             errMsg: "Pasword Doesn't Match.!",
//           });
//         }
//       }
//     });
// });

app.post("/don_register_submit", function (req, res) {
  const email = req.body.email;
  const psw = req.body.psw;
  const c_psw = req.body.c_psw;

  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

  db.collection("Donors")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      if (docs.size > 0) {
        res.render("don_register", {
          sucState: false,
          errState: true,
          errMsg: "Donor Already Exists.!",
        });
      } else {
        if (!passwordRegex.test(psw)) {
          return res.render("don_register", {
            sucState: false,
            errState: true,
            errMsg:
              "Password must have at least 8 chars, one letter, one number, and one special character.",
          });
        }

        if (psw == c_psw) {
          db.collection("Donors")
            .add({
              Donor_name: req.body.user_name,
              email: email,
              password: ph.generate(psw),
              ph_no: req.body.phone_no,
              state: req.body.state,
              dist: req.body.district,
              city: req.body.city,
              street: req.body.street,
              pincode: req.body.pincode,
            })
            .then(() => {
              res.render("don_register", { sucState: true, errState: false });
            });
        } else {
          res.render("don_register", {
            sucState: false,
            errState: true,
            errMsg: "Password Doesn't Match.!",
          });
        }
      }
    });
});

app.post("/org_login_submit", async function (req, res) {
  const org_id = req.body.org_id;
  const email = req.body.email;
  const psw = req.body.psw;
  const orgdb = await db
    .collection("Organizations")
    .where("email", "==", email)
    .get();

  if (orgdb.size == 0) {
    res.render("org_login", {
      errState: true,
      errMsg: "Organization email not Found or Incorrect!",
    });
  } else {
    const userData = orgdb.docs[0].data();
    if (!ph.verify(psw, userData.password)) {
      // Incorrect password
      res.render("org_login", {
        errState: true,
        errMsg: "Incorrect password.!",
      });
    } else {
      if (org_id == userData.organization_id) {
        // Successful login
        req.session.orgEmail = email;
        const orgHisRef = orgdb.docs[0].ref
          .collection("Donation_History")
          .where("Status", "==", "Pending");
        const orgHis = await orgHisRef.get();
        const org_his_data = orgHis.docs.map((doc) => doc.data());
        res.render("org_home", {
          name: userData.organization_name,
          dataArr: { org_his_data },
        });
      } else {
        //incorrect org id
        res.render("org_login", {
          errState: true,
          errMsg: "Organization ID not Found or Incorrect!",
        });
      }
    }
  }
});

app.post("/don_login_submit", function (req, res) {
  const email = req.body.email;
  const psw = req.body.psw;
  db.collection("Donors")
    .where("email", "==", email)
    .get()
    .then((docs) => {
      if (docs.size == 0) {
        res.render("don_login", {
          errState: true,
          errMsg: "Donor not Found or Incorrect Email!",
        });
      } else {
        const userData = docs.docs[0].data();
        if (!ph.verify(psw, userData.password)) {
          // Incorrect password
          res.render("don_login", {
            errState: true,
            errMsg: "Incorrect password.!",
          });
        } else {
          // Successful login
          // store email in session (used across your app)
          req.session.userEmail = email;
          // render don_home and pass donor email so client can register socket
          res.render("don_home", {
            name: userData.Donor_name,
            donorEmail: email,
          });
        }
      }
    });
});

app.get("/donat_food", async function (req, res) {
  const organizationsSnapshot = await db.collection("Organizations").get();
  const org_data = organizationsSnapshot.docs.map((doc) => doc.data());

  const user_email = req.session.userEmail;
  // console.log(user_email);
  const don_data = await db
    .collection("Donors")
    .where("email", "==", user_email)
    .get();
  // console.log(don_data.docs[0].data());
  res.render("food_donate_form", {
    dataArr: { org_data },
    don_details: don_data.docs[0].data(),
  });
});

app.post("/donat_food_submit", async function (req, res) {
  try {
    const user_email = req.session.userEmail;
    if (!user_email) {
      return res.status(401).send("User not logged in.");
    }

    const orgName = req.body.orgname;
    if (!orgName) {
      return res.status(400).send("Organization name is required.");
    }

    const Donation = req.body.Donation;
    if (!Donation) {
      return res.status(400).send("Donation type is required.");
    }

    const item = req.body.item;
    const qty = req.body.qty;

    // Get donor data
    const donSnapshot = await db
      .collection("Donors")
      .where("email", "==", user_email)
      .get();

    if (donSnapshot.empty) {
      return res.status(404).send("Donor not found.");
    }
    const donorData = donSnapshot.docs[0].data();
    const donDoc = donSnapshot.docs[0];

    // Get organization data
    const orgSnapshot = await db
      .collection("Organizations")
      .where("organization_name", "==", orgName)
      .get();

    if (orgSnapshot.empty) {
      return res.status(404).send("Organization not found.");
    }
    const orgDoc = orgSnapshot.docs[0];

    const orderID = uniqId();
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    // Add to Organization's Donation_History
    await orgDoc.ref.collection("Donation_History").add({
      OrderId: orderID,
      Status: "Pending",
      Date: formattedDate,
      Donor_name: donorData.Donor_name,
      Donor_ph_no: donorData.ph_no,
      Donor_email: donorData.email,
      Donation: Donation,
      Donor_address: `${donorData.street}/${donorData.city}/${donorData.dist}/${donorData.state}/${donorData.pincode}`,
      Items: item,
      EachItem_Qty: qty,
    });

    // Add to Donor's Donation_History
    await donDoc.ref.collection("Donation_History").add({
      OrderId: orderID,
      Date: formattedDate,
      Donate_to: orgName,
      Donation: Donation,
      Organization_ph: orgDoc.data().ph_no,
      address: `${donorData.street}/${donorData.city}/${donorData.dist}/${donorData.state}/${donorData.pincode}`,
      Items: item,
      EachItem_Qty: qty,
      Status: "Pending",
    });

    // Add notification to Organization
    await orgDoc.ref.collection("Notifications").add({
      message: `New donation received from ${donorData.Donor_name} (Order ID: ${orderID})`,
      createdAt: new Date(),
      read: false,
      orderId: orderID,
      status: "Pending",
    });

    // Send email notification to organization
    await sendEmail(
      orgDoc.data().email,
      "New Donation Received",
      `You have a new donation from ${donorData.Donor_name}.
Order ID: ${orderID}
Donation Type: ${Donation}
Items: ${item}
Quantity: ${qty}`
    );

    //res.send("Donation submitted successfully.");
    res.redirect("/don_home");
  } catch (err) {
    console.error("Error in /donat_food_submit:", err);
    res.status(500).send("Internal server error.");
  }
});

app.get("/donat_grocy", async function (req, res) {
  const organizationsSnapshot = await db.collection("Organizations").get();
  const org_data = organizationsSnapshot.docs.map((doc) => doc.data());

  const user_email = req.session.userEmail;
  const don_data = await db
    .collection("Donors")
    .where("email", "==", user_email)
    .get();
  res.render("grocery_donate_form", {
    dataArr: { org_data },
    don_details: don_data.docs[0].data(),
  });
});

app.post("/donat_grocery_submit", async function (req, res) {
  try {
    const user_email = req.session.userEmail;
    if (!user_email) {
      return res.status(401).send("User not logged in.");
    }

    const orgName = req.body.orgname;
    if (!orgName) {
      return res.status(400).send("Organization name is required.");
    }

    const Donation = req.body.Donation;
    if (!Donation) {
      return res.status(400).send("Donation type is required.");
    }

    const item = req.body.item;
    const qty = req.body.qty;

    const donSnapshot = await db
      .collection("Donors")
      .where("email", "==", user_email)
      .get();

    if (donSnapshot.empty) {
      return res.status(404).send("Donor not found.");
    }
    const donorData = donSnapshot.docs[0].data();
    const donDoc = donSnapshot.docs[0];

    const orgSnapshot = await db
      .collection("Organizations")
      .where("organization_name", "==", orgName)
      .get();

    if (orgSnapshot.empty) {
      return res.status(404).send("Organization not found.");
    }
    const orgDoc = orgSnapshot.docs[0];

    const orderID = uniqId();
    const date = new Date();
    const formattedDate = `${
      date.getMonth() + 1
    }/${date.getDate()}/${date.getFullYear()}`;

    await orgDoc.ref.collection("Donation_History").add({
      OrderId: orderID,
      Status: "Pending",
      Date: formattedDate,
      Donor_name: donorData.Donor_name,
      Donor_ph_no: donorData.ph_no,
      Donor_email: donorData.email,
      Donation: Donation,
      Donor_address: `${donorData.street}/${donorData.city}/${donorData.dist}/${donorData.state}/${donorData.pincode}`,
      Items: item,
      EachItem_Qty: qty,
    });

    await donDoc.ref.collection("Donation_History").add({
      OrderId: orderID,
      Date: formattedDate,
      Donate_to: orgName,
      Donation: Donation,
      Organization_ph: orgDoc.data().ph_no,
      address: `${donorData.street}/${donorData.city}/${donorData.dist}/${donorData.state}/${donorData.pincode}`,
      Items: item,
      EachItem_Qty: qty,
      Status: "Pending",
    });

    await orgDoc.ref.collection("Notifications").add({
      message: `New donation received from ${donorData.Donor_name} (Order ID: ${orderID})`,
      createdAt: new Date(),
      read: false,
      orderId: orderID,
      status: "Pending",
    });

    // Send email notification to organization
    await sendEmail(
      orgDoc.data().email,
      "New Donation Received",
      `You have a new donation from ${donorData.Donor_name}.
Order ID: ${orderID}
Donation Type: ${Donation}
Items: ${item}
Quantity: ${qty}`
    );

    //res.send("Grocery donation submitted successfully.");
    res.redirect("/don_home");
  } catch (err) {
    console.error("Error in /donat_grocery_submit:", err);
    res.status(500).send("Internal server error.");
  }
});

app.get("/don_history", async (req, res) => {
  const donor_email = req.session.userEmail;

  const donQuery = db.collection("Donors").where("email", "==", donor_email);
  const donSnapshot = await donQuery.get();
  const don_name = donSnapshot.docs[0].data().Donor_name;

  //"Donation_History" subcollection
  const donHistoryRef = donSnapshot.docs[0].ref.collection("Donation_History");
  const donData = await donHistoryRef.get();
  const don_his_data = donData.docs.map((doc) => doc.data());

  res.render("don_history", {
    name: don_name,
    dataArr: { don_his_data },
  });
});

app.get("/don_profile", async (req, res) => {
  const don_email = req.session.userEmail;

  // "Donors" collection to get donor data
  const donorQuery = db.collection("Donors").where("email", "==", don_email);
  const donorSnapshot = await donorQuery.get();
  const don_data = donorSnapshot.docs[0].data();

  //"Donation_History" subcollection
  const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
  const donHis = await donHisRef.get();
  const no_donations = donHis.size;
  res.render("don_profile", {
    don_data,
    no_donations,
    name: don_data.Donor_name,
  });
});

// app.get("/org_profile", async (req, res) => {
//   const org_email = req.session.orgEmail;

//   // "Organization" collection to get donor data
//   const donorQuery = db
//     .collection("Organizations")
//     .where("email", "==", org_email);
//   const donorSnapshot = await donorQuery.get();
//   const org_data = donorSnapshot.docs[0].data();

//   //"Donation_History" subcollection
//   const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
//   const donHis = await donHisRef.get();
//   const no_donations = donHis.size;
//   res.render("org_profile", { org_data, no_donations });
// });
app.get("/org_profile", async (req, res) => {
  const org_email = req.session.orgEmail;

  const donorQuery = db
    .collection("Organizations")
    .where("email", "==", org_email);
  const donorSnapshot = await donorQuery.get();
  const org_data = donorSnapshot.docs[0].data();

  const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
  const donHis = await donHisRef.get();
  const no_donations = donHis.size;

  // ✅ collect donor addresses for map
  const donor_locations = donHis.docs.map((doc) => {
    const data = doc.data();
    return {
      donor_name: data.Donor_name,
      donor_address: data.Donor_address,
      status: data.Status,
    };
  });

  res.render("org_profile", { org_data, no_donations, donor_locations });
});

app.get("/don_home", (req, res) => {
  const don_email = req.session.userEmail;
  db.collection("Donors")
    .where("email", "==", don_email)
    .get()
    .then((docs) => {
      const name = docs.docs[0].data().Donor_name;
      // pass donorEmail so client can register socket
      res.render("don_home", { name, donorEmail: don_email });
    });
});

app.get("/org_home", async (req, res) => {
  const org_email = req.session.orgEmail;
  const orgdb = await db
    .collection("Organizations")
    .where("email", "==", org_email)
    .get();

  const orgData = orgdb.docs[0].data();
  const orgHisRef = orgdb.docs[0].ref
    .collection("Donation_History")
    .where("Status", "==", "Pending");
  const orgHis = await orgHisRef.get();
  const org_his_data = orgHis.docs.map((doc) => doc.data());
  res.render("org_home", {
    name: orgData.organization_name,
    dataArr: { org_his_data },
  });
});

// app.post("/donation_accept", async (req, res) => {
//   const org_email = req.session.orgEmail;
//   const donor_email = req.body.orderemail;
//   const orderid = req.body.orderid;
//   const time = req.body.time;

//   const donorQuery = db
//     .collection("Organizations")
//     .where("email", "==", org_email);
//   const donorSnapshot = await donorQuery.get();

//   const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
//   const donHis = await donHisRef.where("OrderId", "==", orderid).get();

//   const donationDoc = donHis.docs[0];
//   await donationDoc.ref.update({
//     Status: "Accepted",
//     time: time,
//   });

//   const donQuery = db.collection("Donors").where("email", "==", donor_email);
//   const donSnapshot = await donQuery.get();

//   //"Donation_History" subcollection
//   const donHistoryRef = donSnapshot.docs[0].ref.collection("Donation_History");
//   const donData = await donHistoryRef.where("OrderId", "==", orderid).get();

//   const donDoc = donData.docs[0];
//   await donDoc.ref.update({
//     Status: "Accepted",
//     time: time,
//   });

//   // --- NEW: add notification to donor and emit via socket.io if connected ---
//   try {
//     const donorRootDoc = donSnapshot.docs[0]; // donor document reference
//     const notifRef = donorRootDoc.ref.collection("Notifications");
//     const notifDocRef = await notifRef.add({
//       message: `Your donation (Order ID: ${orderid}) has been accepted by ${
//         donorSnapshot.docs[0].data().organization_name || ""
//       }`,
//       createdAt: new Date(),
//       read: false,
//       orderId: orderid,
//       status: "Accepted",
//     });

//     // emit to donor if online
//     const socketId = donorSockets[donor_email];
//     if (socketId) {
//       io.to(socketId).emit("donationStatusUpdate", {
//         id: notifDocRef.id,
//         message: `Your donation (Order ID: ${orderid}) has been accepted by ${
//           donorSnapshot.docs[0].data().organization_name || ""
//         }`,
//         createdAt: new Date(),
//         orderId: orderid,
//         status: "Accepted",
//       });
//     }
//   } catch (err) {
//     console.error("Error creating/emitting notification:", err);
//   }
//   // --- end new code ---

//   const orgdb = await db
//     .collection("Organizations")
//     .where("email", "==", org_email)
//     .get();

//   const orgHisRef = orgdb.docs[0].ref
//     .collection("Donation_History")
//     .where("Status", "==", "Pending");
//   const orgHis = await orgHisRef.get();
//   const org_his_data = orgHis.docs.map((doc) => doc.data());
//   res.render("org_home", {
//     name: orgdb.docs[0].data().organization_name,
//     dataArr: { org_his_data },
//   });
// });
app.post("/donation_accept", async (req, res) => {
  const org_email = req.session.orgEmail;
  const donor_email = req.body.orderemail;
  const orderid = req.body.orderid;
  const time = req.body.time;

  // Update organization donation status
  const orgQuery = db
    .collection("Organizations")
    .where("email", "==", org_email);
  const orgSnapshot = await orgQuery.get();
  const orgHisRef = orgSnapshot.docs[0].ref.collection("Donation_History");
  const orgHis = await orgHisRef.where("OrderId", "==", orderid).get();
  await orgHis.docs[0].ref.update({
    Status: "Accepted",
    time: time,
  });

  // Update donor donation status
  const donorQuery = db.collection("Donors").where("email", "==", donor_email);
  const donorSnapshot = await donorQuery.get();
  const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
  const donHis = await donHisRef.where("OrderId", "==", orderid).get();
  await donHis.docs[0].ref.update({
    Status: "Accepted",
    time: time,
  });

  // Add notification to donor (Firestore only)
  const notifRef = donorSnapshot.docs[0].ref.collection("Notifications");
  await notifRef.add({
    message: `Your donation (Order ID: ${orderid}) has been accepted by ${
      orgSnapshot.docs[0].data().organization_name
    }`,
    createdAt: new Date(),
    read: false,
    orderId: orderid,
    status: "Accepted",
  });

  // Reload organization home page
  const pendingRef = orgSnapshot.docs[0].ref
    .collection("Donation_History")
    .where("Status", "==", "Pending");
  const pendingDocs = await pendingRef.get();
  const org_his_data = pendingDocs.docs.map((doc) => doc.data());

  // Send email to donor
  await sendEmail(
    donor_email,
    "Donation Accepted",
    `Your donation (Order ID: ${orderid}) has been accepted by ${
      orgSnapshot.docs[0].data().organization_name
    }.\nPlease be ready for pickup at the scheduled time: ${time}.`
  );

  res.render("org_home", {
    name: orgSnapshot.docs[0].data().organization_name,
    dataArr: { org_his_data },
  });
});

// app.get("/org_history", async (req, res) => {
//   const email = req.session.orgEmail;
//   const orgdb = await db
//     .collection("Organizations")
//     .where("email", "==", email)
//     .get();
//   const userData = orgdb.docs[0].data();

//   const orgHisRef = orgdb.docs[0].ref
//     .collection("Donation_History")
//     .where("Status", "!=", "Pending");
//   const orgHis = await orgHisRef.get();
//   const org_his_data = orgHis.docs.map((doc) => doc.data());
//   res.render("org_history", {
//     name: userData.organization_name,
//     dataArr: { org_his_data },
//   });
// });
app.get("/org_history", async (req, res) => {
  const email = req.session.orgEmail;
  const orgdb = await db
    .collection("Organizations")
    .where("email", "==", email)
    .get();
  const userData = orgdb.docs[0].data();

  const orgHisRef = orgdb.docs[0].ref
    .collection("Donation_History")
    .where("Status", "!=", "Pending");
  const orgHis = await orgHisRef.get();
  const org_his_data = orgHis.docs.map((doc) => doc.data());

  // Pass org_data to template
  const org_data = {
    street: userData.street,
    city: userData.city,
    state: userData.state,
  };

  res.render("org_history", {
    name: userData.organization_name,
    dataArr: { org_his_data },
    org_data, // <--- add this
  });
});

app.post("/donation_collect", async (req, res) => {
  const org_email = req.session.orgEmail;
  const donor_email = req.body.orderemail;
  const orderid = req.body.orderid;

  // Update organization donation status
  const orgQuery = db
    .collection("Organizations")
    .where("email", "==", org_email);
  const orgSnapshot = await orgQuery.get();
  const orgHisRef = orgSnapshot.docs[0].ref.collection("Donation_History");
  const orgHis = await orgHisRef.where("OrderId", "==", orderid).get();
  await orgHis.docs[0].ref.update({ Status: "Collected" });

  // Update donor donation status
  const donorQuery = db.collection("Donors").where("email", "==", donor_email);
  const donorSnapshot = await donorQuery.get();
  const donHisRef = donorSnapshot.docs[0].ref.collection("Donation_History");
  const donHis = await donHisRef.where("OrderId", "==", orderid).get();
  await donHis.docs[0].ref.update({ Status: "Collected" });

  // ✅ Add notification to donor
  const notifRef = donorSnapshot.docs[0].ref.collection("Notifications");
  await notifRef.add({
    message: `Your donation (Order ID: ${orderid}) has been collected by ${
      orgSnapshot.docs[0].data().organization_name
    }`,
    createdAt: new Date(),
    read: false,
    orderId: orderid,
    status: "Collected",
  });

  // Reload organization history page
  const orgHisPendingRef = orgSnapshot.docs[0].ref
    .collection("Donation_History")
    .where("Status", "!=", "Pending");
  const orgHisPendingDocs = await orgHisPendingRef.get();
  const org_his_data = orgHisPendingDocs.docs.map((doc) => doc.data());

  // Send email to donor
  await sendEmail(
    donor_email,
    "Donation Collected",
    `Your donation (Order ID: ${orderid}) has been successfully collected by ${
      orgSnapshot.docs[0].data().organization_name
    }.\nThank you for your generous contribution!`
  );

  // Get organization data for template
  const org_data = {
    street: orgSnapshot.docs[0].data().street,
    city: orgSnapshot.docs[0].data().city,
    state: orgSnapshot.docs[0].data().state,
  };

  res.render("org_history", {
    name: orgSnapshot.docs[0].data().organization_name,
    dataArr: { org_his_data },
    org_data,
  });
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.render("intro");
});

// ---------- DONOR NOTIFICATIONS PAGE ----------
// ---------- DONOR NOTIFICATIONS PAGE ----------
app.get("/notifications", async (req, res) => {
  try {
    const donor_email = req.session.userEmail;
    if (!donor_email) {
      return res.redirect("/donlogin");
    }

    // Get donor document
    const donorQuery = db
      .collection("Donors")
      .where("email", "==", donor_email);
    const donorSnapshot = await donorQuery.get();
    if (donorSnapshot.empty) return res.send("Donor not found");

    const donorDoc = donorSnapshot.docs[0];

    // Fetch Notifications subcollection
    const notifSnapshot = await donorDoc.ref
      .collection("Notifications")
      .orderBy("createdAt", "desc")
      .get();

    const notifications = notifSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.render("notifications", {
      name: donorDoc.data().Donor_name,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).send("Error loading notifications");
  }
});

app.post("/notifications/read/:id", async (req, res) => {
  try {
    const donor_email = req.session.userEmail;
    if (!donor_email) return res.redirect("/donlogin");

    const notifId = req.params.id;

    const donorQuery = db
      .collection("Donors")
      .where("email", "==", donor_email);
    const donorSnapshot = await donorQuery.get();
    if (donorSnapshot.empty) return res.send("Donor not found");

    const donorDoc = donorSnapshot.docs[0];
    const notifRef = donorDoc.ref.collection("Notifications").doc(notifId);

    await notifRef.update({ read: true });

    res.redirect("/notifications");
  } catch (err) {
    console.error("Error marking notification as read:", err);
    res.status(500).send("Error updating notification");
  }
});
app.get("/org_notifications", async (req, res) => {
  try {
    const org_email = req.session.orgEmail;
    if (!org_email) return res.redirect("/orglogin");

    const orgQuery = db
      .collection("Organizations")
      .where("email", "==", org_email);
    const orgSnapshot = await orgQuery.get();
    if (orgSnapshot.empty) return res.send("Organization not found");

    const orgDoc = orgSnapshot.docs[0];
    const notifSnapshot = await orgDoc.ref
      .collection("Notifications")
      .orderBy("createdAt", "desc")
      .get();

    const notifications = notifSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    res.render("org_notifications", {
      name: orgDoc.data().organization_name,
      notifications,
    });
  } catch (err) {
    console.error("Error fetching org notifications:", err);
    res.status(500).send("Error loading notifications");
  }
});
// Mark organization notification as read
app.post("/org_notifications/read/:id", async (req, res) => {
  try {
    const org_email = req.session.orgEmail;
    if (!org_email) return res.redirect("/orglogin");

    const notifId = req.params.id;

    const orgQuery = db
      .collection("Organizations")
      .where("email", "==", org_email);
    const orgSnapshot = await orgQuery.get();
    if (orgSnapshot.empty) return res.send("Organization not found");

    const orgDoc = orgSnapshot.docs[0];
    const notifRef = orgDoc.ref.collection("Notifications").doc(notifId);

    await notifRef.update({ read: true });

    res.redirect("/org_notifications");
  } catch (err) {
    console.error("Error marking org notification as read:", err);
    res.status(500).send("Error updating notification");
  }
});

app.listen(3000, () => {
  console.log("Server runs on port 3000");
});
