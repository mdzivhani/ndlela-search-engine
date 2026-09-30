const assert = require("node:assert/strict");
const { spawn } = require("node:child_process");
const { once } = require("node:events");
const path = require("node:path");
const { Pool } = require("pg");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const database = `ndlela_test_${Date.now()}`;
const config = {
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT || 5433),
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: "postgres",
};
const admin = new Pool(config),
  secret = "integration-only-secret-not-for-production",
  port = 3307,
  base = `http://127.0.0.1:${port}`;
let server, testDb, browser;
async function api(url, { token, method = "GET", body, status = 200 } = {}) {
  const r = await fetch(base + "/api" + url, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.text();
  assert.equal(r.status, status, `${method} ${url}: ${data}`);
  return data ? JSON.parse(data) : null;
}
async function main() {
  await admin.query(`CREATE DATABASE "${database}"`);
  testDb = new Pool({ ...config, database });
  server = spawn(process.execPath, ["index.js"], {
    cwd: path.resolve(__dirname, "../.."),
    env: {
      ...process.env,
      POSTGRES_DB: database,
      PORT: String(port),
      JWT_SECRET: secret,
      LOG_DIR: path.resolve(__dirname, "../../logs/integration"),
      ADMIN_EMAILS: "admin@example.test",
      SMTP_HOST: "",
      PAYFAST_MERCHANT_ID: "",
      PAYFAST_MERCHANT_KEY: "",
      PAYFAST_PASSPHRASE: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });
  let output = "";
  server.stderr.on("data", (chunk) => {
    output += chunk;
  });
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try {
      if ((await fetch(base + "/health")).ok) {
        ready = true;
        break;
      }
    } catch {}
    await new Promise((r) => setTimeout(r, 100));
  }
  assert.ok(ready, "Server did not start: " + output);
  const register = async (name, email) =>
    api("/auth/register", {
      method: "POST",
      status: 201,
      body: { name, email, password: "Integration!123" },
    });
  const traveller = await register("Traveller", "traveller@example.test"),
    operator = await register("Operator", "operator@example.test"),
    moderator = await register("Moderator", "admin@example.test");
  await api("/operator", { status: 401 });
  await api("/admin", { token: operator.token, status: 403 });
  const resetToken = jwt.sign(
    { id: traveller.user.id, email: traveller.user.email, type: "reset" },
    secret,
    { expiresIn: "1h" },
  );
  await api("/auth/me", { token: resetToken, status: 401 });
  await api("/trips", { token: resetToken, status: 401 });
  const reset = await api("/auth/forgot-password", {
    method: "POST",
    body: { email: traveller.user.email },
    status: 503,
  });
  assert.equal(reset.token, undefined);
  const login = await api("/auth/login", {
    method: "POST",
    body: { email: "TRAVELLER@example.test", password: "Integration!123" },
  });
  assert.ok(login.token);
  const avatarForm = new FormData();
  avatarForm.append("avatar", new Blob(["<html>not an image</html>"], { type: "image/png" }), "invalid.png");
  const invalidAvatar = await fetch(base + "/api/auth/avatar", {
    method: "POST", headers: { Authorization: `Bearer ${traveller.token}` }, body: avatarForm,
  });
  assert.equal(invalidAvatar.status, 400);
  const validAvatarForm = new FormData();
  validAvatarForm.append("avatar", new Blob([Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+aWQAAAABJRU5ErkJggg==", "base64")], { type: "image/png" }), "avatar.png");
  const avatarResponse = await fetch(base + "/api/auth/avatar", {
    method: "POST", headers: { Authorization: `Bearer ${traveller.token}` }, body: validAvatarForm,
  });
  assert.equal(avatarResponse.status, 200);
  const avatar = await avatarResponse.json();
  assert.equal((await fetch(base + avatar.url)).status, 200);
  await api("/auth/avatar", { token: traveller.token, method: "DELETE" });
  assert.equal((await fetch(base + avatar.url)).status, 404);
  await require("node:fs/promises").rmdir(path.resolve(__dirname, "../../uploads/avatars", traveller.user.id));
  const recovery = await register("Recovery test", "recovery@example.test");
  await api("/auth/change-password", {
    token: recovery.token,
    method: "PUT",
    body: {
      currentPassword: "Integration!123",
      newPassword: "Changed!456",
      confirmPassword: "Changed!456",
    },
  });
  await api("/auth/me", { token: recovery.token, status: 401 });
  assert.ok(
    (
      await api("/auth/login", {
        method: "POST",
        body: { email: "recovery@example.test", password: "Changed!456" },
      })
    ).token,
  );
  const listing = {
    name: "Integration forest walk",
    description: "A real test listing managed by its owner",
    city: "Cape Town",
    province: "Western Cape",
    category: "Activities",
    latitude: -33.92,
    longitude: 18.42,
    priceFrom: 125,
    priceBasis: "per person",
    gallery: [],
    facilities: ["Parking"],
    hours: "09:00–17:00",
    accessibility: "Step-free entrance",
    transport: "Parking on site",
    languages: "English",
    cancellationPolicy: "Cancel before the visit for review",
    services: [{ name: "Guided walk", price: 125, duration: "2 hours" }],
  };
  const created = await api("/operator/listings", {
    token: operator.token,
    method: "POST",
    body: listing,
    status: 201,
  });
  await api("/operator/listings/" + created.id, {
    token: traveller.token,
    method: "PUT",
    body: listing,
    status: 404,
  });
  const search = await api(
    "/listings?q=Integration&maxPrice=200&facility=Parking",
  );
  assert.equal(search.results[0].id, created.id);
  assert.equal(search.results[0].verified, false);
  assert.equal(search.results[0].sample, false);
  await api("/favourites/" + created.id, {
    token: traveller.token,
    method: "PUT",
    body: {},
  });
  assert.deepEqual(await api("/favourites", { token: traveller.token }), [
    created.id,
  ]);
  assert.deepEqual(await api("/favourites", { token: operator.token }), []);
  const plan = await api("/planner", {
    method: "POST",
    body: { destination: "Cape Town", budget: 1000, adults: 2, days: 2 },
  });
  assert.ok(plan.stops.length);
  assert.ok(plan.estimatedTotal <= 1000);
  const trip = await api("/trips", {
    token: traveller.token,
    method: "POST",
    body: plan,
    status: 201,
  });
  await api("/trips/" + trip.id, {
    token: operator.token,
    method: "PUT",
    body: plan,
    status: 404,
  });
  const shared = await api("/trips/" + trip.id + "/share", {
    token: traveller.token,
    method: "POST",
    body: {},
  });
  await api("/shared/" + shared.share_token + "/vote", {
    token: operator.token,
    method: "POST",
    body: { listingId: plan.stops[0].listingId },
  });
  await api("/shared/" + shared.share_token + "/vote", {
    token: operator.token,
    method: "POST",
    body: { listingId: plan.stops[0].listingId },
  });
  assert.equal((await api("/shared/" + shared.share_token)).votes[0].count, 1);
  await api("/trips/" + trip.id + "/share", {
    token: traveller.token,
    method: "DELETE",
    status: 204,
  });
  await api("/shared/" + shared.share_token, { status: 404 });
  await api("/enquiries", {
    token: traveller.token,
    method: "POST",
    body: { listingId: "1", date: "2099-12-01", guests: 2 },
    status: 400,
  });
  const enquiry = await api("/enquiries", {
    token: traveller.token,
    method: "POST",
    body: {
      listingId: created.id,
      date: new Date().toISOString().slice(0, 10),
      guests: 2,
      message: "A morning walk",
    },
    status: 201,
  });
  await api("/operator/enquiries/" + enquiry.id, {
    token: traveller.token,
    method: "PATCH",
    body: { status: "available", quote: 250, response: "Come along" },
    status: 404,
  });
  await api("/operator/enquiries/" + enquiry.id, {
    token: operator.token,
    method: "PATCH",
    body: { status: "available", quote: 250, response: "Two places available" },
  });
  assert.equal(
    (await api("/enquiries", { token: traveller.token }))[0].quoted_amount,
    "250.00",
  );
  await api("/payments/checkout", {
    token: traveller.token,
    method: "POST",
    body: { enquiryId: enquiry.id },
    status: 503,
  });
  await api("/operator/enquiries/" + enquiry.id, {
    token: operator.token,
    method: "PATCH",
    body: { status: "completed", response: "Thanks for visiting" },
  });
  await api("/listings/" + created.id + "/reviews", {
    token: traveller.token,
    method: "POST",
    body: { rating: 5, text: "A wonderful guided forest experience." },
    status: 201,
  });
  assert.equal((await api("/listings/" + created.id)).reviewCount, 0);
  const pending = (await api("/admin", { token: moderator.token })).reviews[0];
  await api("/admin/reviews/" + pending.id, {
    token: moderator.token,
    method: "PATCH",
    body: { status: "approved" },
  });
  assert.equal((await api("/listings/" + created.id)).rating, 5);
  await api("/operator/claims", {
    token: operator.token,
    method: "POST",
    body: {
      listingId: "2",
      evidence: "Independent business registration proof supplied for review",
    },
    status: 201,
  });
  const claim = (await api("/admin", { token: moderator.token })).claims[0];
  await api("/admin/claims/" + claim.id, {
    token: moderator.token,
    method: "PATCH",
    body: { status: "approved" },
  });
  assert.equal((await api("/listings/2")).verified, true);
  const { recordPayment } = require("../../services/bookings");
  const paymentId = "integration-payment";
  await testDb.query(
    "INSERT INTO payments(id,enquiry_id,user_id,amount,status) VALUES($1,$2,$3,250,'pending')",
    [paymentId, enquiry.id, traveller.user.id],
  );
  await recordPayment(testDb, paymentId, "provider-first");
  await recordPayment(testDb, paymentId, "provider-first");
  assert.equal(
    (await testDb.query("SELECT COUNT(*)::int n FROM payment_receipts")).rows[0]
      .n,
    1,
  );
  assert.equal(
    (await api("/enquiries", { token: traveller.token })).find(
      (e) => e.id === enquiry.id,
    ).status,
    "completed",
  );
  await recordPayment(testDb, paymentId, "provider-duplicate");
  assert.match(
    (
      await testDb.query(
        "SELECT reason FROM refund_requests WHERE payment_id=$1",
        [paymentId],
      )
    ).rows[0].reason,
    /Additional payment/,
  );
  const cancelled = await api("/enquiries", {
    token: traveller.token,
    method: "POST",
    body: { listingId: created.id, date: "2099-12-01", guests: 2 },
    status: 201,
  });
  await api("/operator/enquiries/" + cancelled.id, {
    token: operator.token,
    method: "PATCH",
    body: { status: "available", quote: 250, response: "Available" },
  });
  await testDb.query(
    "INSERT INTO payments(id,enquiry_id,user_id,amount,status) VALUES('late-payment',$1,$2,250,'pending')",
    [cancelled.id, traveller.user.id],
  );
  await api("/enquiries/" + cancelled.id + "/cancel", {
    token: traveller.token,
    method: "POST",
    body: {},
  });
  await recordPayment(testDb, "late-payment", "provider-late");
  assert.equal(
    (await api("/enquiries", { token: traveller.token })).find(
      (e) => e.id === cancelled.id,
    ).status,
    "refund_requested",
  );
  console.log(
    "PASS: payment confirmation idempotency, duplicate-charge review and payment-after-cancellation handling",
  );
  console.log(
    "PASS: authentication, access control, catalogue, favourites, planner, trips, sharing, votes, enquiries, quote, review moderation, business claims, payment configuration guard",
  );
  if (process.env.BROWSER_TESTS === "true") {
    const {
      chromium,
    } = require("../../../client/node_modules/@playwright/test");
    browser = await chromium.launch({ channel: "msedge", headless: true });
    const context = await browser.newContext();
    await context.route("**/api/**", async (route) => {
      const url = new URL(route.request().url());
      const response = await route.fetch({
        url: base + url.pathname + url.search,
      });
      await route.fulfill({ response });
    });
    await context.addInitScript(
      (token) => localStorage.setItem("auth_token", token),
      traveller.token,
    );
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("http://127.0.0.1:5173/trips");
    await page.getByLabel("New collection name").fill("Browser weekend");
    await page
      .getByRole("button", { name: "Create collection", exact: true })
      .click();
    await page.getByDisplayValue?.("Browser weekend");
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("input")).some(
        (i) => i.value === "Browser weekend",
      ),
    );
    await page.goto("http://127.0.0.1:5173/planner");
    await page.getByLabel("Destination", { exact: true }).fill("Cape Town");
    await page.getByRole("button", { name: "Build my itinerary" }).click();
    await page.getByRole("button", { name: "Save this itinerary" }).waitFor();
    await page.getByRole("button", { name: "Save this itinerary" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Your itinerary is saved" })
      .waitFor();
    await page.goto("http://127.0.0.1:5173/business/" + created.id);
    await page
      .getByRole("heading", { name: listing.name, exact: true })
      .waitFor();
    await page.getByLabel("Preferred date").fill("2099-12-01");
    await page.getByRole("button", { name: "Request availability" }).click();
    await page
      .getByRole("status")
      .filter({ hasText: "Your request has been sent" })
      .waitFor();
    await page.goto("http://127.0.0.1:5173/favourites");
    await page
      .getByRole("heading", { name: listing.name, exact: true })
      .waitFor();
    await page.getByRole("button", { name: "Sign out", exact: true }).click();
    await page.getByText("Make room for your next adventure.").waitFor();
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto("http://127.0.0.1:5173/");
    await page.getByRole("heading", { name: /Find your own/ }).waitFor();
    assert.equal(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
      false,
    );
    assert.deepEqual(errors, []);
    const operatorContext = await browser.newContext();
    await operatorContext.route("**/api/**", async (route) => {
      const url = new URL(route.request().url());
      const response = await route.fetch({ url: base + url.pathname + url.search });
      await route.fulfill({ response });
    });
    await operatorContext.addInitScript((token) => localStorage.setItem("auth_token", token), operator.token);
    const operatorPage = await operatorContext.newPage();
    operatorPage.on("pageerror", (e) => errors.push(e.message));
    await operatorPage.goto("http://127.0.0.1:5173/operator");
    await operatorPage.getByRole("article").filter({ has: operatorPage.getByRole("heading", { name: listing.name, exact: true }) }).getByRole("button", { name: "Edit listing" }).click();
    await operatorPage.getByLabel("Business name", { exact: true }).fill("Browser-tested forest walk");
    await operatorPage.getByRole("button", { name: "Add an experience" }).click();
    const experience = operatorPage.getByRole("group", { name: "Experience 2" });
    await experience.getByLabel("Name", { exact: true }).fill("Sunset walk");
    await experience.getByLabel("Price per person (R)").fill("150");
    await operatorPage.getByRole("button", { name: "Publish listing" }).click();
    await operatorPage.getByRole("status").filter({ hasText: "Your listing is published" }).waitFor();
    const updatedListing = await api("/listings/" + created.id);
    assert.equal(updatedListing.name, "Browser-tested forest walk");
    assert.ok(updatedListing.services.some((s) => s.name === "Sunset walk" && s.price === 150));
    assert.deepEqual(errors, []);
    await browser.close();
    browser = null;
    console.log(
      "PASS: browser trip creation, planner saving, enquiry submission, favourites isolation, mobile layout, operator editing and service publishing",
    );
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) {
      server.kill();
      await Promise.race([
        once(server, "exit"),
        new Promise((r) => setTimeout(r, 3000)),
      ]);
    }
    if (testDb) await testDb.end();
    // The only database removed is the uniquely named database created by this run.
    if (/^ndlela_test_\d+$/.test(database))
      await admin.query(`DROP DATABASE IF EXISTS "${database}" WITH (FORCE)`);
    await admin.end();
  });
