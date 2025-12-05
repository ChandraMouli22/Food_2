const fs = require("fs");
const path = require("path");
const ejs = require("ejs");

const viewsDir = path.join(__dirname, "views");
const previewsDir = path.join(__dirname, "previews");
const publicCss = path.join(__dirname, "public", "css", "common.css");
const previewCssDir = path.join(previewsDir, "css");

if (!fs.existsSync(previewsDir)) fs.mkdirSync(previewsDir);
if (!fs.existsSync(previewCssDir))
  fs.mkdirSync(previewCssDir, { recursive: true });

// copy CSS
try {
  if (fs.existsSync(publicCss)) {
    fs.copyFileSync(publicCss, path.join(previewCssDir, "styles.css"));
    console.log("Copied CSS to previews/css/styles.css");
  } else {
    console.log(
      "Warning: public/css/common.css not found, previews may lack styling."
    );
  }
} catch (err) {
  console.error("Error copying CSS:", err);
}

// sample data used to render templates
const sampleData = {
  name: "Sample Org",
  donorEmail: "donor@example.com",
  no_donations: 3,
  don_data: {
    Donor_name: "Jane Doe",
    ph_no: "9876543210",
    street: "12 Baker St",
    city: "Sample City",
    dist: "Sample District",
    state: "Sample State",
    pincode: "123456",
  },
  org_data: {
    organization_name: "Helping Hands",
    organization_id: "HH-001",
    street: "100 Main Ave",
    city: "Metroville",
    state: "Stateland",
  },
  dataArr: {
    org_his_data: [
      {
        OrderId: "ORD123",
        Status: "Pending",
        Date: "12/05/2025",
        Donor_name: "Jane Doe",
        Donor_ph_no: "9876543210",
        Donor_email: "donor@example.com",
        Donation: "Food",
        Donor_address:
          "12 Baker St/Sample City/Sample District/Sample State/123456",
        Items: ["Bread", "Rice"],
        EachItem_Qty: [2, 1],
      },
    ],
    org_data: [
      { organization_name: "Helping Hands", city: "Metroville" },
      { organization_name: "Food For All", city: "Greenville" },
    ],
    don_his_data: [
      {
        OrderId: "ORD999",
        Date: "12/04/2025",
        Donate_to: "Helping Hands",
        Donation: "Groceries",
        Organization_ph: "0123456789",
        address: "12 Baker St/Sample City",
        Items: "Canned Beans",
        EachItem_Qty: "5",
        Status: "Collected",
      },
    ],
  },
  notifications: [
    {
      id: "n1",
      message: "Sample notification 1",
      read: false,
      createdAt: {
        _seconds: Math.floor(Date.now() / 1000),
        toDate: () => new Date(),
      },
    },
    {
      id: "n2",
      message: "Sample notification 2",
      read: true,
      createdAt: {
        _seconds: Math.floor(Date.now() / 1000) - 86400,
        toDate: () => new Date(Date.now() - 86400 * 1000),
      },
    },
  ],
  // flags and small objects used by some templates
  errState: false,
  errMsg: "",
  sucState: false,
  don_details: {
    Donor_name: "Jane Doe",
    ph_no: "9876543210",
    street: "12 Baker St",
    city: "Sample City",
    dist: "Sample District",
    state: "Sample State",
    pincode: "123456",
  },
};

// Read all ejs files in views
const viewFiles = fs.readdirSync(viewsDir).filter((f) => f.endsWith(".ejs"));

(async () => {
  for (const file of viewFiles) {
    const fullPath = path.join(viewsDir, file);
    try {
      const rendered = await ejs.renderFile(fullPath, sampleData, {
        async: true,
      });
      // replace absolute css links to local preview css
      const fixed = rendered.replace(
        /href=\"\/css\/[^"]*\"/g,
        'href="css/styles.css"'
      );
      const outName = file.replace(".ejs", ".html");
      fs.writeFileSync(path.join(previewsDir, outName), fixed, "utf8");
      console.log("Rendered", outName);
    } catch (err) {
      console.error("Error rendering", file, err.message);
    }
  }
  console.log("All previews generated in /previews");
})();
