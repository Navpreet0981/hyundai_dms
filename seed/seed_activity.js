/**
 * seed_activity.js
 * Adds test drives and bookings for existing customers.
 *
 * Flow:
 * 1. Admin login → fetch all dealers
 * 2. For each dealer → login as dealer → fetch their employees + customers
 * 3. For each customer:
 *    - 60% chance → create a test drive (COMPLETED)
 *    - 30% of those → also create a booking (CONFIRMED)
 *    - Inventory must exist (set to 50 per variant to be safe)
 */

const http = require("http");

const ADMIN_EMAIL    = "super@hyundai.com";
const ADMIN_PASSWORD = "admin@123";

// Your exact variant IDs from DB
const VARIANT_IDS = [1, 3, 4, 2, 5, 6, 7, 8, 9, 10, 11];

// Dates spread over last 12 months
function randomPastDate() {
  const d = new Date();
  d.setDate(d.getDate() - Math.floor(Math.random() * 365));
  return d.toISOString().split("T")[0]; // YYYY-MM-DD
}

function rand(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

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

async function main() {
  // ── 1. Admin login ──────────────────────────────────────────────────────────
  console.log("\n[1] Admin login...");
  const lr = await request("POST", "/auth/login", { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
  if (!lr.data.token) { console.error("Login failed:", lr.data); process.exit(1); }
  const adminToken = lr.data.token;
  console.log("    ✓ Logged in as admin");

  // ── 2. Fetch all customers (paged, collect all) ─────────────────────────────
  console.log("\n[2] Fetching all customers...");
  let allCustomers = [];
  let pg = 0;
  while (true) {
    const res = await request("GET", `/customers/paged?page=${pg}&size=100`, {}, adminToken);
    if (!res.data.content || res.data.content.length === 0) break;
    allCustomers = allCustomers.concat(res.data.content);
    if (res.data.last) break;
    pg++;
  }
  console.log(`    ✓ Total customers fetched: ${allCustomers.length}`);

  // ── 3. Fetch all employees to map customerId → employeeId + dealerId ─────────
  console.log("\n[3] Fetching all employees...");
  let allEmployees = [];
  pg = 0;
  while (true) {
    const res = await request("GET", `/employees/paged?page=${pg}&size=100`, {}, adminToken);
    if (!res.data.content || res.data.content.length === 0) break;
    allEmployees = allEmployees.concat(res.data.content);
    if (res.data.last) break;
    pg++;
  }
  console.log(`    ✓ Total employees fetched: ${allEmployees.length}`);

  // Build a map: employeeId → { dealerId }
  const empMap = {};
  for (const e of allEmployees) {
    empMap[e.employeeId] = { dealerId: e.dealerId };
  }

  // ── 4. Set inventory to 50 for all dealers × all variants ───────────────────
  console.log("\n[4] Refreshing inventory (50 units per variant per dealer)...");
  const dealerEmails = [...new Set(allEmployees.map(e => e.dealerId).filter(Boolean))];

  // We need dealer tokens — login as each dealer
  // Collect unique dealer IDs from employees
  const dealerIds = [...new Set(allEmployees.map(e => e.dealerId).filter(Boolean))];
  console.log(`    Dealers to update: ${dealerIds.length}`);

  // We'll set inventory via admin token using a workaround — 
  // actually inventory endpoint requires dealer token, so we skip and rely on existing stock
  // If you want to reset inventory, login as each dealer manually
  console.log("    Skipping inventory reset — using existing stock");

  // ── 5. Create test drives + bookings ────────────────────────────────────────
  console.log("\n[5] Creating test drives and bookings...");

  let tdCreated = 0;
  let bkCreated = 0;
  let skipped   = 0;
  const total   = allCustomers.length;

  for (let i = 0; i < total; i++) {
    const customer = allCustomers[i];
    const empId    = customer.employeeId;
    const custId   = customer.customerId;

    if (!empId || !empMap[empId]) { skipped++; continue; }

    const dealerId  = empMap[empId].dealerId;
    const variantId = rand(VARIANT_IDS);

    // 60% chance of test drive
    if (Math.random() < 0.6) {
      const tdRes = await request("POST", "/testdrives", {
        customerId:    custId,
        dealerId:      dealerId,
        employeeId:    empId,
        variantId:     variantId,
        testDriveDate: randomPastDate(),
        status:        "COMPLETED",
      }, adminToken);

      if (tdRes.status === 200 || tdRes.status === 201) {
        tdCreated++;
      }

      // 30% of test drives → also create a booking
      if (Math.random() < 0.3) {
        const bkRes = await request("POST", "/bookings", {
          customerId:  custId,
          dealerId:    dealerId,
          employeeId:  empId,
          variantId:   variantId,
          bookingDate: randomPastDate(),
          status:      "CONFIRMED",
        }, adminToken);

        if (bkRes.status === 200 || bkRes.status === 201) {
          bkCreated++;
        }
      }
    }

    process.stdout.write(`\r    Progress: ${i + 1}/${total} | Test Drives: ${tdCreated} | Bookings: ${bkCreated} | Skipped: ${skipped}`);
  }

  console.log("\n\n═══════════════════════════════════════════════════════════════");
  console.log("  Activity seed complete.");
  console.log(`  Customers processed : ${total}`);
  console.log(`  Test drives created : ${tdCreated}`);
  console.log(`  Bookings created    : ${bkCreated}`);
  console.log(`  Skipped (no emp)    : ${skipped}`);
  console.log("═══════════════════════════════════════════════════════════════\n");
}

main().catch(console.error);
