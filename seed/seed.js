const http = require("http");

const ADMIN_EMAIL    = "super@hyundai.com";
const ADMIN_PASSWORD = "admin@123";

const CAR_NAMES   = ["Creta", "Venue", "Alcazar", "i20", "Ioniq 5"];
const leadSources = ["WEBSITE", "WALKIN", "REFERRAL"];
const empRoles    = ["SALES_EXECUTIVE", "SALES_MANAGER", "SERVICE_MANAGER", "TECHNICIAN"];
const cities      = ["Mumbai","Delhi","Bangalore","Chennai","Hyderabad","Pune","Kolkata","Jaipur","Surat","Nagpur","Indore","Bhopal","Lucknow","Patna","Kochi"];

// ── 50 NEW dealers (emails are new, won't conflict with existing 20) ──────────
const newDealers = [
  { dealerName:"Hyundai Noida Sector18",    email:"dealer.noida@hyundai.com",       phone:"9811101001", city:"Noida",          state:"Uttar Pradesh",  address:"18 Sector 18",        password:"Dealer@123" },
  { dealerName:"Hyundai Gurgaon Cyber",     email:"dealer.gurgaon@hyundai.com",     phone:"9811101002", city:"Gurgaon",        state:"Haryana",         address:"Cyber City Hub",      password:"Dealer@123" },
  { dealerName:"Hyundai Faridabad Central", email:"dealer.faridabad@hyundai.com",   phone:"9811101003", city:"Faridabad",      state:"Haryana",         address:"NIT Faridabad",       password:"Dealer@123" },
  { dealerName:"Hyundai Agra Taj",          email:"dealer.agra@hyundai.com",        phone:"9811101004", city:"Agra",           state:"Uttar Pradesh",  address:"Taj Road Agra",       password:"Dealer@123" },
  { dealerName:"Hyundai Varanasi Ghat",     email:"dealer.varanasi@hyundai.com",    phone:"9811101005", city:"Varanasi",       state:"Uttar Pradesh",  address:"Lanka Varanasi",      password:"Dealer@123" },
  { dealerName:"Hyundai Kanpur Metro",      email:"dealer.kanpur@hyundai.com",      phone:"9811101006", city:"Kanpur",         state:"Uttar Pradesh",  address:"Mall Road Kanpur",    password:"Dealer@123" },
  { dealerName:"Hyundai Meerut City",       email:"dealer.meerut@hyundai.com",      phone:"9811101007", city:"Meerut",         state:"Uttar Pradesh",  address:"Hapur Road Meerut",   password:"Dealer@123" },
  { dealerName:"Hyundai Amritsar Golden",   email:"dealer.amritsar@hyundai.com",    phone:"9811101008", city:"Amritsar",       state:"Punjab",          address:"GT Road Amritsar",    password:"Dealer@123" },
  { dealerName:"Hyundai Ludhiana Hub",      email:"dealer.ludhiana@hyundai.com",    phone:"9811101009", city:"Ludhiana",       state:"Punjab",          address:"Ferozepur Road",      password:"Dealer@123" },
  { dealerName:"Hyundai Jalandhar City",    email:"dealer.jalandhar@hyundai.com",   phone:"9811101010", city:"Jalandhar",      state:"Punjab",          address:"GT Road Jalandhar",   password:"Dealer@123" },
  { dealerName:"Hyundai Dehradun Hills",    email:"dealer.dehradun@hyundai.com",    phone:"9811101011", city:"Dehradun",       state:"Uttarakhand",     address:"Rajpur Road",         password:"Dealer@123" },
  { dealerName:"Hyundai Haridwar Holy",     email:"dealer.haridwar@hyundai.com",    phone:"9811101012", city:"Haridwar",       state:"Uttarakhand",     address:"Jwalapur Road",       password:"Dealer@123" },
  { dealerName:"Hyundai Jodhpur Blue",      email:"dealer.jodhpur@hyundai.com",     phone:"9811101013", city:"Jodhpur",        state:"Rajasthan",       address:"Residency Road",      password:"Dealer@123" },
  { dealerName:"Hyundai Udaipur Lake",      email:"dealer.udaipur@hyundai.com",     phone:"9811101014", city:"Udaipur",        state:"Rajasthan",       address:"Hiran Magri",         password:"Dealer@123" },
  { dealerName:"Hyundai Kota Study",        email:"dealer.kota@hyundai.com",        phone:"9811101015", city:"Kota",           state:"Rajasthan",       address:"Aerodrome Circle",    password:"Dealer@123" },
  { dealerName:"Hyundai Ajmer Dargah",      email:"dealer.ajmer@hyundai.com",       phone:"9811101016", city:"Ajmer",          state:"Rajasthan",       address:"Station Road Ajmer",  password:"Dealer@123" },
  { dealerName:"Hyundai Raipur Capital",    email:"dealer.raipur@hyundai.com",      phone:"9811101017", city:"Raipur",         state:"Chhattisgarh",    address:"Pandri Raipur",       password:"Dealer@123" },
  { dealerName:"Hyundai Bilaspur Steel",    email:"dealer.bilaspur@hyundai.com",    phone:"9811101018", city:"Bilaspur",       state:"Chhattisgarh",    address:"Vyapar Vihar",        password:"Dealer@123" },
  { dealerName:"Hyundai Ranchi Jharkhand",  email:"dealer.ranchi@hyundai.com",      phone:"9811101019", city:"Ranchi",         state:"Jharkhand",       address:"Main Road Ranchi",    password:"Dealer@123" },
  { dealerName:"Hyundai Jamshedpur Steel",  email:"dealer.jamshedpur@hyundai.com",  phone:"9811101020", city:"Jamshedpur",     state:"Jharkhand",       address:"Bistupur Jamshedpur", password:"Dealer@123" },
  { dealerName:"Hyundai Bhubaneswar East",  email:"dealer.bhubaneswar@hyundai.com", phone:"9811101021", city:"Bhubaneswar",    state:"Odisha",          address:"Janpath Bhubaneswar", password:"Dealer@123" },
  { dealerName:"Hyundai Cuttack Silver",    email:"dealer.cuttack@hyundai.com",     phone:"9811101022", city:"Cuttack",        state:"Odisha",          address:"Badambadi Cuttack",   password:"Dealer@123" },
  { dealerName:"Hyundai Thiruvananthapuram",email:"dealer.trivandrum@hyundai.com",  phone:"9811101023", city:"Thiruvananthapuram",state:"Kerala",        address:"MG Road TVM",         password:"Dealer@123" },
  { dealerName:"Hyundai Kozhikode North",   email:"dealer.kozhikode@hyundai.com",   phone:"9811101024", city:"Kozhikode",      state:"Kerala",          address:"SM Street Kozhikode", password:"Dealer@123" },
  { dealerName:"Hyundai Thrissur Cultural", email:"dealer.thrissur@hyundai.com",    phone:"9811101025", city:"Thrissur",       state:"Kerala",          address:"Round North Thrissur",password:"Dealer@123" },
  { dealerName:"Hyundai Madurai Temple",    email:"dealer.madurai@hyundai.com",     phone:"9811101026", city:"Madurai",        state:"Tamil Nadu",      address:"Anna Nagar Madurai",  password:"Dealer@123" },
  { dealerName:"Hyundai Tiruchirappalli",   email:"dealer.trichy@hyundai.com",      phone:"9811101027", city:"Tiruchirappalli",state:"Tamil Nadu",      address:"Thillai Nagar Trichy",password:"Dealer@123" },
  { dealerName:"Hyundai Salem Steel",       email:"dealer.salem@hyundai.com",       phone:"9811101028", city:"Salem",          state:"Tamil Nadu",      address:"Omalur Road Salem",   password:"Dealer@123" },
  { dealerName:"Hyundai Tirunelveli South", email:"dealer.tirunelveli@hyundai.com", phone:"9811101029", city:"Tirunelveli",    state:"Tamil Nadu",      address:"Palayamkottai Road",  password:"Dealer@123" },
  { dealerName:"Hyundai Vijayawada Krishna",email:"dealer.vijayawada@hyundai.com",  phone:"9811101030", city:"Vijayawada",     state:"Andhra Pradesh",  address:"MG Road Vijayawada",  password:"Dealer@123" },
  { dealerName:"Hyundai Guntur Andhra",     email:"dealer.guntur@hyundai.com",      phone:"9811101031", city:"Guntur",         state:"Andhra Pradesh",  address:"Brodipet Guntur",     password:"Dealer@123" },
  { dealerName:"Hyundai Nellore Coastal",   email:"dealer.nellore@hyundai.com",     phone:"9811101032", city:"Nellore",        state:"Andhra Pradesh",  address:"Trunk Road Nellore",  password:"Dealer@123" },
  { dealerName:"Hyundai Warangal Fort",     email:"dealer.warangal@hyundai.com",    phone:"9811101033", city:"Warangal",       state:"Telangana",       address:"Hanamkonda Warangal", password:"Dealer@123" },
  { dealerName:"Hyundai Nizamabad North",   email:"dealer.nizamabad@hyundai.com",   phone:"9811101034", city:"Nizamabad",      state:"Telangana",       address:"Dichpally Road",      password:"Dealer@123" },
  { dealerName:"Hyundai Mysuru Palace",     email:"dealer.mysuru@hyundai.com",      phone:"9811101035", city:"Mysuru",         state:"Karnataka",       address:"Sayyaji Rao Road",    password:"Dealer@123" },
  { dealerName:"Hyundai Hubli Dharwad",     email:"dealer.hubli@hyundai.com",       phone:"9811101036", city:"Hubli",          state:"Karnataka",       address:"Lamington Road Hubli",password:"Dealer@123" },
  { dealerName:"Hyundai Mangaluru Port",    email:"dealer.mangaluru@hyundai.com",   phone:"9811101037", city:"Mangaluru",      state:"Karnataka",       address:"Hampankatta",         password:"Dealer@123" },
  { dealerName:"Hyundai Belgaum Border",    email:"dealer.belgaum@hyundai.com",     phone:"9811101038", city:"Belgaum",        state:"Karnataka",       address:"Khanapur Road",       password:"Dealer@123" },
  { dealerName:"Hyundai Nashik Wine",       email:"dealer.nashik@hyundai.com",      phone:"9811101039", city:"Nashik",         state:"Maharashtra",     address:"College Road Nashik", password:"Dealer@123" },
  { dealerName:"Hyundai Aurangabad Cave",   email:"dealer.aurangabad@hyundai.com",  phone:"9811101040", city:"Aurangabad",     state:"Maharashtra",     address:"Jalna Road",          password:"Dealer@123" },
  { dealerName:"Hyundai Solapur South",     email:"dealer.solapur@hyundai.com",     phone:"9811101041", city:"Solapur",        state:"Maharashtra",     address:"Vijapur Road",        password:"Dealer@123" },
  { dealerName:"Hyundai Kolhapur Sugar",    email:"dealer.kolhapur@hyundai.com",    phone:"9811101042", city:"Kolhapur",       state:"Maharashtra",     address:"Tarabai Park",        password:"Dealer@123" },
  { dealerName:"Hyundai Vadodara Baroda",   email:"dealer.vadodara@hyundai.com",    phone:"9811101043", city:"Vadodara",       state:"Gujarat",         address:"Alkapuri Vadodara",   password:"Dealer@123" },
  { dealerName:"Hyundai Rajkot Saurashtra", email:"dealer.rajkot@hyundai.com",      phone:"9811101044", city:"Rajkot",         state:"Gujarat",         address:"Kalawad Road Rajkot", password:"Dealer@123" },
  { dealerName:"Hyundai Bhavnagar Gulf",    email:"dealer.bhavnagar@hyundai.com",   phone:"9811101045", city:"Bhavnagar",      state:"Gujarat",         address:"Waghawadi Road",      password:"Dealer@123" },
  { dealerName:"Hyundai Jammu North",       email:"dealer.jammu@hyundai.com",       phone:"9811101046", city:"Jammu",          state:"J&K",             address:"Residency Road Jammu",password:"Dealer@123" },
  { dealerName:"Hyundai Shimla Hills",      email:"dealer.shimla@hyundai.com",      phone:"9811101047", city:"Shimla",         state:"Himachal Pradesh",address:"The Mall Shimla",     password:"Dealer@123" },
  { dealerName:"Hyundai Imphal Northeast",  email:"dealer.imphal@hyundai.com",      phone:"9811101048", city:"Imphal",         state:"Manipur",         address:"Paona Bazar Imphal",  password:"Dealer@123" },
  { dealerName:"Hyundai Shillong Meghalaya",email:"dealer.shillong@hyundai.com",    phone:"9811101049", city:"Shillong",       state:"Meghalaya",       address:"Police Bazar",        password:"Dealer@123" },
  { dealerName:"Hyundai Agartala Tripura",  email:"dealer.agartala@hyundai.com",    phone:"9811101050", city:"Agartala",       state:"Tripura",         address:"HGB Road Agartala",   password:"Dealer@123" },
];

function request(method, path, body, token) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const opts = {
      hostname: "localhost", port: 8080, path, method,
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    };
    const req = http.request(opts, (res) => {
      let raw = "";
      res.on("data", (c) => (raw += c));
      res.on("end", () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(raw) }); }
        catch { resolve({ status: res.statusCode, data: raw }); }
      });
    });
    req.on("error", reject);
    req.write(data);
    req.end();
  });
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function pad(n, l = 3) { return String(n).padStart(l, "0"); }

const CAR_VARIANTS = [
  { variantId: 1 }, { variantId: 3 }, { variantId: 4 },
  { variantId: 2 }, { variantId: 5 }, { variantId: 6 },
  { variantId: 7 }, { variantId: 8 }, { variantId: 9 },
  { variantId: 10 }, { variantId: 11 },
];

async function main() {
  // ── Admin login ─────────────────────────────────────────────────────────────
  console.log("\n[1] Admin login...");
  const lr = await request("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (!lr.data.token) { console.error("Login failed:", lr.data); process.exit(1); }
  const adminToken = lr.data.token;
  console.log("    ✓ Logged in");

  // ── Add 50 new dealers ──────────────────────────────────────────────────────
  console.log("\n[2] Creating 50 new dealers...");
  const dealerTokens = [];

  for (const d of newDealers) {
    // Fix duplicate phone field in Vadodara entry
    const payload = { dealerName: d.dealerName, email: d.email, phone: d.phone, city: d.city, state: d.state, address: d.address, password: d.password, active: true };
    const res = await request("POST", "/dealers", payload, adminToken);
    const ok = res.status === 200 || res.status === 201;
    console.log(`    ${ok ? "✓" : "~"} ${d.dealerName}`);

    // Set inventory for this dealer
    const dl = await request("POST", "/auth/login", { email: d.email, password: d.password });
    if (dl.data.token) {
      for (const v of CAR_VARIANTS) {
        await request("PUT", `/dealer/inventory/${v.variantId}`, { quantity: 15 }, dl.data.token);
      }
      dealerTokens.push({ token: dl.data.token, email: d.email, city: d.city });
    }
  }
  console.log(`    Total dealer tokens: ${dealerTokens.length}`);

  // ── Add 500 new employees (emp204 onwards) under new dealers ────────────────
  console.log("\n[3] Creating 500 new employees (emp204–emp703)...");
  const allEmpTokens = [];
  let empIndex = 204; // continue from where last seed left off (203 was last)

  for (const dt of dealerTokens) {
    for (let i = 1; i <= 10; i++) { // 10 employees per new dealer = 500 total
      const emp = {
        name:     `Emp ${dt.city} ${i}`,
        email:    `emp${pad(empIndex)}@hyundai.com`,
        phone:    `81${String(empIndex).padStart(8, "0")}`,
        role:     empRoles[(empIndex - 1) % empRoles.length],
        password: "Emp@123",
      };
      const res = await request("POST", "/employees", emp, dt.token);
      if (res.status === 200 || res.status === 201) {
        const el = await request("POST", "/auth/login", { email: emp.email, password: emp.password });
        if (el.data.token) allEmpTokens.push(el.data.token);
        process.stdout.write(`\r    ✓ emp${pad(empIndex)} created`);
      } else {
        process.stdout.write(`\r    ✗ emp${pad(empIndex)} failed`);
      }
      empIndex++;
    }
  }
  console.log(`\n    Total new employee tokens: ${allEmpTokens.length}`);

  // ── Also collect tokens for existing employees (emp001–emp100) ──────────────
  console.log("\n[4] Logging into existing employees for customer creation...");
  const existingEmpTokens = [];
  for (let i = 1; i <= 100; i++) {
    const el = await request("POST", "/auth/login", { email: `emp${pad(i)}@hyundai.com`, password: "Emp@123" });
    if (el.data.token) existingEmpTokens.push(el.data.token);
    process.stdout.write(`\r    ✓ ${i}/100`);
  }
  console.log();

  const combinedTokens = [...existingEmpTokens, ...allEmpTokens];
  console.log(`    Total employee tokens available: ${combinedTokens.length}`);

  // ── Add 1000 new customers ──────────────────────────────────────────────────
  console.log("\n[5] Creating 1000 new customers...");
  const ts = Date.now();
  let created = 0;

  for (let i = 1; i <= 1000; i++) {
    const token = combinedTokens[(i - 1) % combinedTokens.length];
    const res = await request("POST", "/customers", {
      name:            `Customer ${pad(i, 4)}`,
      email:           `c${pad(i, 4)}.${ts}@gmail.com`,
      phone:           `72${String(ts).slice(-4)}${String(i).padStart(4, "0")}`,
      city:            rand(cities),
      leadSource:      rand(leadSources),
      interestedModel: rand(CAR_NAMES),
    }, token);
    if (res.status === 200 || res.status === 201) {
      created++;
      process.stdout.write(`\r    ✓ ${created}/1000 customers`);
    } else {
      process.stdout.write(`\r    ✗ ${i} failed`);
    }
  }

  console.log("\n\n═══════════════════════════════════════════════════════════════");
  console.log("  Done.");
  console.log(`  New dealers:   ${dealerTokens.length}`);
  console.log(`  New employees: emp204 – emp${pad(empIndex - 1)} (password: Emp@123)`);
  console.log(`  New customers: ${created}`);
  console.log("\n  New dealer password: Dealer@123");
  console.log("═══════════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
