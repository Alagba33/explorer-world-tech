import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ------------------------------------------------------------
// EXPLORER WORLD TECH – Single-File React App
// Features:
// - Clean, modern UI with Tailwind
// - Navigation: Home, Services, Shop, Book, Support, Orientation, Reviews, FAQ
// - E-commerce accessories with prices & cart
// - Appointment booking with issue description & optional image
// - Live issue comments (support)
// - Orientation blog (care tips)
// - Testimonials & ratings
// - FAQs
// - User Accounts: name, phone, email + activity history
// - Referral program: refer 2 customers => 5% discount on next service
// - Notifications (updates & discounts)
// - Warranty/Guarantee info
// - Lightweight Admin Dashboard (manage users, products, bookings, comments)
// - LocalStorage persistence (no backend required for demo)
// ------------------------------------------------------------

// ---- Utilities: localStorage wrapper ----
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  },
};

// ---- Demo Data ----
const CATEGORIES = [
  { id: "chargers", name: "Chargers" },
  { id: "cables", name: "Cables & Cords" },
  { id: "audio", name: "Earbuds & Headsets" },
  { id: "power", name: "Power & Storage" },
  { id: "protection", name: "Protection" },
  { id: "laptop", name: "Laptop Accessories" },
  { id: "smart", name: "Smart Gadgets" },
];

const PRODUCTS = [
  // Chargers
  { id: "p1", name: "20W Fast Charger (Original)", price: 9500, category: "chargers" },
  { id: "p2", name: "Oraimo 33W SuperCharge", price: 14500, category: "chargers" },
  { id: "p3", name: "Anker Nano Charger", price: 18900, category: "chargers" },
  // Cables
  { id: "p4", name: "Oraimo Type‑C Cable (1m)", price: 4500, category: "cables" },
  { id: "p5", name: "iPhone Lightning Cable (MFi)", price: 9900, category: "cables" },
  { id: "p6", name: "3‑in‑1 Multi Cable", price: 6500, category: "cables" },
  // Audio
  { id: "p7", name: "EarPods (Wired)", price: 5500, category: "audio" },
  { id: "p8", name: "Wireless Earbuds", price: 18500, category: "audio" },
  { id: "p9", name: "Bluetooth Headset", price: 12500, category: "audio" },
  // Power & Storage
  { id: "p10", name: "10000mAh Power Bank", price: 14500, category: "power" },
  { id: "p11", name: "20000mAh Power Bank", price: 24500, category: "power" },
  { id: "p12", name: "64GB Memory Card", price: 9500, category: "power" },
  { id: "p13", name: "128GB Flash Drive", price: 11500, category: "power" },
  // Protection
  { id: "p14", name: "Tempered Glass (Universal)", price: 3500, category: "protection" },
  { id: "p15", name: "Phone Pouch / Case", price: 5500, category: "protection" },
  { id: "p16", name: "Laptop Sleeve 13-15\"", price: 14500, category: "protection" },
  // Laptop
  { id: "p17", name: "Universal Laptop Charger", price: 18500, category: "laptop" },
  { id: "p18", name: "Wireless Mouse", price: 6500, category: "laptop" },
  { id: "p19", name: "USB Keyboard", price: 6500, category: "laptop" },
  { id: "p20", name: "External HDD 1TB", price: 45500, category: "laptop" },
  // Smart
  { id: "p21", name: "Smartwatch (Fitness)", price: 29500, category: "smart" },
  { id: "p22", name: "BT Speaker Mini", price: 12500, category: "smart" },
];

const SERVICES = [
  { id: "s1", name: "Phone Screen Replacement", price: 35000 },
  { id: "s2", name: "Battery Replacement", price: 18000 },
  { id: "s3", name: "Charging Port Repair", price: 15000 },
  { id: "s4", name: "Water Damage Treatment", price: 30000 },
  { id: "s5", name: "Software/OS Update", price: 8000 },
  { id: "s6", name: "Laptop Keyboard Replacement", price: 25000 },
  { id: "s7", name: "Laptop Screen Repair", price: 60000 },
];

const FAQS = [
  { q: "Do you give warranty after repair?", a: "Yes. We provide a 30–90 day limited warranty depending on the repair type and parts used." },
  { q: "Can I book an appointment online?", a: "Absolutely. Pick a service, describe the issue, choose a date/time, and we'll confirm instantly." },
  { q: "Do you use original parts?", a: "We use original or premium-grade parts with tested quality and performance." },
  { q: "Do you offer home/office pickup?", a: "Yes, in select areas for an extra logistics fee. Ask support for availability." },
];

const TIPS = [
  { title: "Avoid Overheating", body: "Keep devices out of direct sunlight and remove thick cases while fast charging." },
  { title: "Water Safety", body: "Use waterproof pouches near water. If wet, turn off immediately and don't charge." },
  { title: "Battery Care", body: "Avoid 0% and 100% extremes daily. Aim for 20–80% to prolong battery health." },
  { title: "Storage & Ventilation", body: "Store laptops on flat ventilated surfaces. Avoid blocking air vents." },
];

// ---- Helpers ----
const formatNaira = (n) => `₦${n.toLocaleString()}`;
const uid = () => Math.random().toString(36).slice(2, 10);

// ---- Core App ----
export default function ExplorerWorldTechApp() {
  const [section, setSection] = useState("home");
  const [cart, setCart] = useState(() => store.get("cart", []));
  const [user, setUser] = useState(() => store.get("user", null));
  const [users, setUsers] = useState(() => store.get("users", []));
  const [bookings, setBookings] = useState(() => store.get("bookings", []));
  const [orders, setOrders] = useState(() => store.get("orders", []));
  const [comments, setComments] = useState(() => store.get("comments", []));
  const [notifs, setNotifs] = useState(() => store.get("notifs", []));
  const [showAccount, setShowAccount] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [search, setSearch] = useState("");
  const [activeCat, setActiveCat] = useState("all");
  const [banner, setBanner] = useState("Welcome to EXPLORER WORLD TECH — Repairs • Accessories • Guaranteed Support");

  // Persist
  useEffect(() => store.set("cart", cart), [cart]);
  useEffect(() => store.set("user", user), [user]);
  useEffect(() => store.set("users", users), [users]);
  useEffect(() => store.set("bookings", bookings), [bookings]);
  useEffect(() => store.set("orders", orders), [orders]);
  useEffect(() => store.set("comments", comments), [comments]);
  useEffect(() => store.set("notifs", notifs), [notifs]);

  // Derived
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + i.price * i.qty, 0), [cart]);
  const discountEligible = useMemo(() => {
    if (!user) return false;
    return (user.referralsUsed ?? 0) < Math.floor((user.referrals ?? 0) / 2);
  }, [user]);

  const discountedTotal = discountEligible ? Math.round(cartTotal * 0.95) : cartTotal;

  // Notifications helper
  const pushNotif = (title, body) => {
    const n = { id: uid(), title, body, time: new Date().toISOString(), read: false };
    setNotifs((x) => [n, ...x]);
  };

  // Cart actions
  const addToCart = (p) => {
    setCart((c) => {
      const i = c.find((x) => x.id === p.id);
      if (i) return c.map((x) => (x.id === p.id ? { ...x, qty: x.qty + 1 } : x));
      return [...c, { ...p, qty: 1 }];
    });
    pushNotif("Added to cart", p.name);
  };
  const updateQty = (id, q) => setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, q) } : x)));
  const removeFromCart = (id) => setCart((c) => c.filter((x) => x.id !== id));
  const checkout = () => {
    if (!cart.length) return;
    if (!user) {
      alert("Please create an account or sign in first.");
      setShowAccount(true);
      return;
    }
    const order = {
      id: uid(),
      userId: user.id,
      items: cart,
      total: discountedTotal,
      date: new Date().toISOString(),
      discountApplied: discountEligible,
    };
    setOrders((o) => [order, ...o]);
    setCart([]);
    pushNotif("Order placed", `Order ${order.id} placed successfully!`);
  };

  // Booking actions
  const [bookingForm, setBookingForm] = useState({ serviceId: "s1", date: "", time: "", note: "", photo: "", referee: "" });
  const submitBooking = () => {
    if (!user) {
      alert("Please create an account or sign in first.");
      setShowAccount(true);
      return;
    }
    if (!bookingForm.date || !bookingForm.time) {
      alert("Please choose a date and time.");
      return;
    }
    const service = SERVICES.find((s) => s.id === bookingForm.serviceId);
    const discount = discountEligible ? 0.05 : 0;
    const amount = Math.round(service.price * (1 - discount));
    const b = {
      id: uid(),
      userId: user.id,
      serviceId: bookingForm.serviceId,
      serviceName: service.name,
      basePrice: service.price,
      amount,
      date: bookingForm.date,
      time: bookingForm.time,
      note: bookingForm.note,
      photo: bookingForm.photo,
      status: "Booked",
    };
    setBookings((x) => [b, ...x]);

    // Handle referral code
    if (bookingForm.referee) {
      setUsers((us) => us.map((u) => (u.refCode === bookingForm.referee ? { ...u, referrals: (u.referrals || 0) + 1 } : u)));
      pushNotif("Referral recorded", `Referee code ${bookingForm.referee} acknowledged.`);
    }

    pushNotif("Appointment booked", `${service.name} on ${bookingForm.date} @ ${bookingForm.time}`);
    setSection("home");
    setBookingForm({ serviceId: "s1", date: "", time: "", note: "", photo: "", referee: "" });
  };

  // Comments (Support)
  const [issueText, setIssueText] = useState("");
  const postIssue = () => {
    if (!issueText.trim()) return;
    const c = { id: uid(), userName: user?.name || "Guest", text: issueText.trim(), time: new Date().toISOString(), reply: null };
    setComments((cs) => [c, ...cs]);
    setIssueText("");
    pushNotif("Support message sent", "We'll respond shortly.");
  };

  // Account
  const [auth, setAuth] = useState({ name: "", phone: "", email: "" });
  const signInOrUp = () => {
    if (!auth.name || !auth.phone || !auth.email) {
      alert("Please fill in name, phone and email");
      return;
    }
    // find or create
    const existing = users.find((u) => u.email === auth.email);
    if (existing) {
      setUser(existing);
      setShowAccount(false);
      pushNotif("Welcome back", existing.name);
      return;
    }
    const newUser = { id: uid(), ...auth, referrals: 0, referralsUsed: 0, refCode: auth.name.slice(0, 3).toUpperCase() + uid().slice(0, 3) };
    setUsers((us) => [newUser, ...us]);
    setUser(newUser);
    setShowAccount(false);
    pushNotif("Account created", `Hello ${newUser.name}!`);
  };
  const useReferralDiscount = () => {
    if (!user) return;
    if (!discountEligible) return alert("No available referral discount yet.");
    const updated = { ...user, referralsUsed: (user.referralsUsed || 0) + 1 };
    setUser(updated);
    setUsers((us) => us.map((u) => (u.id === user.id ? updated : u)));
    pushNotif("Discount applied", "5% referral discount applied.");
  };

  // Admin quick reply for support messages
  const adminReply = (id, reply) => setComments((cs) => cs.map((c) => (c.id === id ? { ...c, reply } : c)));

  // Filters
  const filteredProducts = PRODUCTS.filter((p) =>
    (activeCat === "all" || p.category === activeCat) && p.name.toLowerCase().includes((search || "").toLowerCase())
  );

  // UI Building Blocks
  const Section = ({ id, children }) => (
    <section id={id} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">{children}</section>
  );

  const Pill = ({ children }) => (
    <span className="px-3 py-1 rounded-full text-xs sm:text-sm bg-emerald-50 text-emerald-700 border border-emerald-200">{children}</span>
  );

  const Button = ({ children, onClick, variant = "primary", className = "", ...rest }) => {
    const base = "px-4 py-2 rounded-2xl font-medium shadow-sm transition-transform active:scale-95";
    const styles =
      variant === "primary"
        ? "bg-emerald-600 text-white hover:bg-emerald-700"
        : variant === "outline"
        ? "border border-emerald-600 text-emerald-700 hover:bg-emerald-50"
        : variant === "ghost"
        ? "text-emerald-700 hover:bg-emerald-50"
        : "bg-gray-800 text-white";
    return (
      <button onClick={onClick} className={`${base} ${styles} ${className}`} {...rest}>
        {children}
      </button>
    );
  };

  const Card = ({ children, className = "" }) => (
    <div className={`rounded-3xl border bg-white/90 backdrop-blur p-5 shadow-sm ${className}`}>{children}</div>
  );

  const Stat = ({ label, value }) => (
    <div className="text-center">
      <div className="text-2xl font-bold text-emerald-700">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white text-gray-900">
      {/* Top Banner */}
      <div className="bg-emerald-700 text-white text-center text-sm py-2">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <span>{banner}</span>
          <div className="hidden sm:flex gap-3">
            <Pill>☎ 08067058513</Pill>
            <Pill>✉ sundayolaniyan65@gmail.com</Pill>
            <Pill>Warranty Guaranteed</Pill>
          </div>
        </div>
      </div>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-orange-400 grid place-items-center text-white font-extrabold">EX</div>
            <div>
              <div className="font-bold leading-tight">EXPLORER WORLD TECH</div>
              <div className="text-xs text-gray-500 -mt-0.5">Repairs • Accessories • Support</div>
            </div>
          </div>
          <nav className="hidden md:flex gap-4 text-sm">
            {[
              ["home", "Home"],
              ["services", "Services"],
              ["shop", "Shop"],
              ["book", "Book"],
              ["support", "Support"],
              ["orientation", "Orientation"],
              ["reviews", "Reviews"],
              ["faq", "FAQs"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setSection(id)} className={`px-3 py-2 rounded-xl hover:bg-emerald-50 ${section === id ? "text-emerald-700 font-semibold" : "text-gray-600"}`}>
                {label}
              </button>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setShowAccount(true)}>Account</Button>
            <Button variant="primary" onClick={() => setSection("cart")}>
              Cart ({cart.reduce((s, i) => s + i.qty, 0)})
            </Button>
            <button className="ml-2 px-3 py-2 text-sm rounded-xl border hover:bg-emerald-50" onClick={() => setShowAdmin(true)}>Admin</button>
          </div>
        </div>
      </header>

      {/* Hero */}
      {section === "home" && (
        <Section id="home">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight">
                Trusted <span className="text-emerald-700">Phone & Laptop Repairs</span> + Quality Accessories
              </h1>
              <p className="mt-4 text-gray-600">
                Fast, reliable service with warranty. Shop original accessories, book repairs online, and get expert support.
              </p>
              <div className="mt-6 flex gap-3 flex-wrap">
                <Button onClick={() => setSection("book")}>Book Appointment</Button>
                <Button variant="outline" onClick={() => setSection("shop")}>Shop Accessories</Button>
              </div>
              <div className="mt-8 grid grid-cols-3 gap-4">
                <Card><Stat label="Repairs Completed" value="10k+" /></Card>
                <Card><Stat label="Accessories in Stock" value={`${PRODUCTS.length}+`} /></Card>
                <Card><Stat label="Avg. Rating" value="4.9/5" /></Card>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="aspect-[4/3] rounded-3xl bg-gradient-to-br from-emerald-100 via-white to-orange-100 border grid place-items-center p-6">
                <div className="text-center">
                  <div className="text-7xl">🔧</div>
                  <div className="mt-3 font-semibold">Certified Technicians • Genuine Parts • Fast Turnaround</div>
                </div>
              </div>
            </motion.div>
          </div>
        </Section>
      )}

      {/* Services */}
      {section === "services" && (
        <Section id="services">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Our Services</h2>
            <Button variant="outline" onClick={() => setSection("book")}>Book a Service</Button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s) => (
              <Card key={s.id}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-sm text-gray-500 mt-1">Warranty Included • Expert Handling</div>
                  </div>
                  <div className="text-emerald-700 font-bold">{formatNaira(s.price)}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => { setSection("book"); setBookingForm((f) => ({ ...f, serviceId: s.id })); }}>Book</Button>
                  <Button variant="outline" onClick={() => { setBanner(`${s.name} now available — Book online!`); }}>Learn More</Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Shop */}
      {section === "shop" && (
        <Section id="shop">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <h2 className="text-2xl font-bold">Accessories Shop</h2>
            <div className="flex gap-2">
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products..." className="px-3 py-2 rounded-xl border w-56" />
              <select className="px-3 py-2 rounded-xl border" value={activeCat} onChange={(e) => setActiveCat(e.target.value)}>
                <option value="all">All Categories</option>
                {CATEGORIES.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredProducts.map((p) => (
              <Card key={p.id}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-gray-500 mt-1">In stock • Genuine</div>
                  </div>
                  <div className="text-emerald-700 font-bold">{formatNaira(p.price)}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <Button onClick={() => addToCart(p)}>Add to Cart</Button>
                  <Button variant="outline" onClick={() => { setBanner(`${p.name} — limited discount today!`); }}>Details</Button>
                </div>
              </Card>
            ))}
          </div>
        </Section>
      )}

      {/* Cart */}
      {section === "cart" && (
        <Section id="cart">
          <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
          {!cart.length ? (
            <Card>
              <div className="flex items-center justify-between">
                <div>No items yet. Start shopping!</div>
                <Button onClick={() => setSection("shop")}>Go to Shop</Button>
              </div>
            </Card>
          ) : (
            <div className="grid lg:grid-cols-3 gap-5">
              <div className="lg:col-span-2 space-y-3">
                {cart.map((it) => (
                  <Card key={it.id}>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-semibold">{it.name}</div>
                        <div className="text-sm text-gray-500">{formatNaira(it.price)} × {it.qty} = {formatNaira(it.price * it.qty)}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <input type="number" min={1} value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value))} className="w-20 px-3 py-2 rounded-xl border" />
                        <Button variant="outline" onClick={() => removeFromCart(it.id)}>Remove</Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              <div>
                <Card>
                  <div className="font-semibold mb-3">Summary</div>
                  <div className="flex items-center justify-between text-sm mb-1"><span>Subtotal</span><span>{formatNaira(cartTotal)}</span></div>
                  {discountEligible && (
                    <div className="flex items-center justify-between text-sm mb-1 text-emerald-700 font-semibold"><span>Referral Discount (5%)</span><span>-{formatNaira(Math.round(cartTotal * 0.05))}</span></div>
                  )}
                  <div className="flex items-center justify-between font-bold text-lg mt-2"><span>Total</span><span>{formatNaira(discountedTotal)}</span></div>
                  <div className="mt-4 flex gap-2">
                    {discountEligible && <Button variant="outline" onClick={useReferralDiscount}>Use Discount</Button>}
                    <Button onClick={checkout}>Checkout</Button>
                  </div>
                </Card>
                <Card className="mt-3">
                  <div className="text-sm text-gray-600">Pay securely on delivery or at our store. Need help? <button className="underline" onClick={() => setSection("support")}>Contact support</button>.</div>
                </Card>
              </div>
            </div>
          )}
        </Section>
      )}

      {/* Booking */}
      {section === "book" && (
        <Section id="book">
          <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <Card>
              <div className="grid gap-3">
                <label className="text-sm">Select Service</label>
                <select className="px-3 py-2 rounded-xl border" value={bookingForm.serviceId} onChange={(e) => setBookingForm({ ...bookingForm, serviceId: e.target.value })}>
                  {SERVICES.map((s) => (
                    <option key={s.id} value={s.id}>{s.name} — {formatNaira(s.price)}</option>
                  ))}
                </select>
                <div className="grid sm:grid-cols-2 gap-3 mt-2">
                  <div>
                    <label className="text-sm">Date</label>
                    <input type="date" className="px-3 py-2 rounded-xl border w-full" value={bookingForm.date} onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })} />
                  </div>
                  <div>
                    <label className="text-sm">Time</label>
                    <input type="time" className="px-3 py-2 rounded-xl border w-full" value={bookingForm.time} onChange={(e) => setBookingForm({ ...bookingForm, time: e.target.value })} />
                  </div>
                </div>
                <div className="mt-2">
                  <label className="text-sm">Describe the issue</label>
                  <textarea rows={4} className="px-3 py-2 rounded-xl border w-full" placeholder="e.g., iPhone 12, screen cracked, touch not responding..." value={bookingForm.note} onChange={(e) => setBookingForm({ ...bookingForm, note: e.target.value })} />
                </div>
                <div className="mt-2">
                  <label className="text-sm">Referral Code (optional)</label>
                  <input className="px-3 py-2 rounded-xl border w-full" placeholder="Enter code from a friend" value={bookingForm.referee} onChange={(e) => setBookingForm({ ...bookingForm, referee: e.target.value.trim() })} />
                </div>
                <div className="mt-2">
                  <label className="text-sm">Attach photo (optional)</label>
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = () => setBookingForm({ ...bookingForm, photo: String(reader.result) });
                    reader.readAsDataURL(file);
                  }} />
                  {bookingForm.photo && (
                    <img src={bookingForm.photo} alt="issue" className="mt-2 w-full max-h-48 object-cover rounded-xl border" />
                  )}
                </div>
                <div className="mt-3 flex gap-2">
                  {discountEligible && <Pill>Referral Discount Available: 5%</Pill>}
                  <Button onClick={submitBooking}>Submit Booking</Button>
                </div>
              </div>
            </Card>
            <Card>
              <div className="font-semibold mb-2">What you get</div>
              <ul className="list-disc pl-5 text-sm text-gray-600 space-y-1">
                <li>Expert diagnostics and transparent pricing</li>
                <li>Genuine parts and careful handling</li>
                <li>30–90 day warranty depending on repair</li>
                <li>SMS/Email updates and reminders</li>
              </ul>
              <div className="mt-4">
                <div className="font-semibold">Recent Bookings</div>
                <div className="mt-2 space-y-2 max-h-64 overflow-auto">
                  {bookings.slice(0, 6).map((b) => (
                    <div key={b.id} className="text-sm p-3 rounded-xl border">
                      <div className="font-medium">{b.serviceName} • {formatNaira(b.amount)}</div>
                      <div className="text-gray-500">{b.date} @ {b.time}</div>
                    </div>
                  ))}
                  {!bookings.length && <div className="text-sm text-gray-500">No bookings yet.</div>}
                </div>
              </div>
            </Card>
          </div>
        </Section>
      )}

      {/* Support */}
      {section === "support" && (
        <Section id="support">
          <div className="grid md:grid-cols-3 gap-5">
            <div className="md:col-span-2">
              <h2 className="text-2xl font-bold mb-3">Customer Support</h2>
              <Card>
                <div className="text-sm text-gray-600 mb-2">Describe what is happening to your phone or laptop and our team will respond.</div>
                <textarea rows={4} className="w-full border rounded-xl px-3 py-2" placeholder="Type your issue here..." value={issueText} onChange={(e) => setIssueText(e.target.value)} />
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-sm text-gray-500">Average reply time: under 10 minutes during business hours</div>
                  <Button onClick={postIssue}>Send</Button>
                </div>
              </Card>
              <div className="mt-4 space-y-3">
                {comments.map((c) => (
                  <Card key={c.id}>
                    <div className="text-sm">
                      <div className="font-semibold">{c.userName}</div>
                      <div className="text-gray-700 mt-1">{c.text}</div>
                      {c.reply ? (
                        <div className="mt-2 p-3 rounded-xl bg-emerald-50 text-emerald-900"><span className="font-semibold">EX Support:</span> {c.reply}</div>
                      ) : (
                        <div className="mt-2 text-gray-500">Awaiting reply…</div>
                      )}
                    </div>
                  </Card>
                ))}
                {!comments.length && <Card>No messages yet. Ask us anything!</Card>}
              </div>
            </div>
            <div>
              <Card>
                <div className="font-semibold mb-2">Contact</div>
                <div className="text-sm">Phone: 08067058513</div>
                <div className="text-sm">Email: sundayolaniyan65@gmail.com</div>
                <div className="text-sm mt-2">Hours: Mon–Sat 9:00–18:00</div>
                <div className="mt-3">
                  <div className="font-semibold">Warranty & Guarantee</div>
                  <div className="text-sm text-gray-600">We offer a limited warranty covering part defects and workmanship. Physical or water damage after pickup is excluded.</div>
                </div>
                <div className="mt-3">
                  <Button variant="outline" onClick={() => pushNotif("Promo", "This week: 5% off screen replacements!")}>Push Promo</Button>
                </div>
              </Card>
              <Card className="mt-4">
                <div className="font-semibold mb-2">Notifications</div>
                <div className="space-y-2 max-h-64 overflow-auto">
                  {notifs.map((n) => (
                    <div key={n.id} className={`p-3 rounded-xl border ${n.read ? "opacity-70" : "bg-white"}`}>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-sm text-gray-600">{n.body}</div>
                      <div className="text-xs text-gray-400 mt-1">{new Date(n.time).toLocaleString()}</div>
                    </div>
                  ))}
                  {!notifs.length && <div className="text-sm text-gray-500">No notifications yet.</div>}
                </div>
              </Card>
            </div>
          </div>
        </Section>
      )}

      {/* Orientation */}
      {section === "orientation" && (
        <Section id="orientation">
          <h2 className="text-2xl font-bold mb-4">Customer Orientation: Care Tips</h2>
          <div className="grid md:grid-cols-2 gap-5">
            {TIPS.map((t, i) => (
              <Card key={i}>
                <div className="font-semibold">{t.title}</div>
                <div className="text-sm text-gray-600 mt-1">{t.body}</div>
              </Card>
            ))}
            <Card>
              <div className="font-semibold">Storage & Safety</div>
              <div className="text-sm text-gray-600 mt-1">Keep devices away from liquids, heat sources, and sharp objects. Use pouches/cases and sleeves during travel.</div>
            </Card>
          </div>
        </Section>
      )}

      {/* Reviews */}
      {section === "reviews" && (
        <Section id="reviews">
          <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
          <Card>
            <div className="text-sm text-gray-600">Share your experience with EXPLORER WORLD TECH.</div>
            <Reviews orders={orders} onSubmit={(r) => pushNotif("Thanks for your review!", r.comment.slice(0, 40) + "...")} />
          </Card>
        </Section>
      )}

      {/* FAQs */}
      {section === "faq" && (
        <Section id="faq">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQS.map((f, i) => (
              <Accordion key={i} q={f.q} a={f.a} />
            ))}
          </div>
        </Section>
      )}

      {/* Footer */}
      <footer className="mt-10 border-t">
        <Section id="footer">
          <div className="grid md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="font-bold">EXPLORER WORLD TECH</div>
              <div className="text-gray-600 mt-1">Repairing phones & laptops, selling quality accessories, and providing guaranteed support.</div>
            </div>
            <div>
              <div className="font-semibold">Quick Links</div>
              <ul className="mt-2 space-y-1">
                <li><button className="hover:underline" onClick={() => setSection("shop")}>Shop</button></li>
                <li><button className="hover:underline" onClick={() => setSection("book")}>Book Repair</button></li>
                <li><button className="hover:underline" onClick={() => setSection("support")}>Support</button></li>
              </ul>
            </div>
            <div>
              <div className="font-semibold">Support</div>
              <div className="mt-2">Phone: 08067058513</div>
              <div>Email: sundayolaniyan65@gmail.com</div>
              <div className="mt-2">Mon–Sat 9:00–18:00</div>
            </div>
            <div>
              <div className="font-semibold">Newsletter</div>
              <div className="text-gray-600 text-xs mt-1">Get updates on discounts and new arrivals.</div>
              <div className="mt-2 flex gap-2">
                <input placeholder="Your email" className="px-3 py-2 rounded-xl border w-full" />
                <Button onClick={() => pushNotif("Subscribed", "You're now subscribed to updates!")}>Subscribe</Button>
              </div>
            </div>
          </div>
          <div className="text-xs text-gray-500 mt-6">© {new Date().getFullYear()} EXPLORER WORLD TECH. All rights reserved.</div>
        </Section>
      </footer>

      {/* Account Modal */}
      <AnimatePresence>
        {showAccount && (
          <Modal onClose={() => setShowAccount(false)} title="Your Account">
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <div className="font-semibold mb-2">Sign in / Create Account</div>
                <div className="grid gap-2">
                  <input className="px-3 py-2 rounded-xl border" placeholder="Full name" value={auth.name} onChange={(e) => setAuth({ ...auth, name: e.target.value })} />
                  <input className="px-3 py-2 rounded-xl border" placeholder="Phone number" value={auth.phone} onChange={(e) => setAuth({ ...auth, phone: e.target.value })} />
                  <input className="px-3 py-2 rounded-xl border" placeholder="Email address" value={auth.email} onChange={(e) => setAuth({ ...auth, email: e.target.value })} />
                  <Button onClick={signInOrUp}>Continue</Button>
                </div>
                {user && (
                  <div className="mt-4 p-3 rounded-xl border text-sm">
                    <div className="font-semibold">Signed in as {user.name}</div>
                    <div className="text-gray-600">Referrals: {user.referrals || 0} • Used: {user.referralsUsed || 0}</div>
                    <div className="mt-1">Your referral code: <span className="font-mono bg-emerald-50 px-2 py-1 rounded">{user.refCode}</span></div>
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold mb-2">Activity</div>
                <div className="text-sm">Orders</div>
                <div className="max-h-32 overflow-auto mb-3 border rounded-xl p-2 text-sm">
                  {orders.filter((o) => (user ? o.userId === user.id : false)).map((o) => (
                    <div key={o.id} className="py-1 border-b last:border-none">Order {o.id} • {formatNaira(o.total)} • {new Date(o.date).toLocaleDateString()}</div>
                  ))}
                  {user && !orders.some((o) => o.userId === user.id) && <div className="text-gray-500">No orders yet.</div>}
                </div>
                <div className="text-sm">Bookings</div>
                <div className="max-h-32 overflow-auto border rounded-xl p-2 text-sm">
                  {bookings.filter((b) => (user ? b.userId === user.id : false)).map((b) => (
                    <div key={b.id} className="py-1 border-b last:border-none">{b.serviceName} • {b.date} {b.time} • {formatNaira(b.amount)}</div>
                  ))}
                  {user && !bookings.some((b) => b.userId === user.id) && <div className="text-gray-500">No bookings yet.</div>}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Admin Dashboard Modal */}
      <AnimatePresence>
        {showAdmin && (
          <Modal onClose={() => setShowAdmin(false)} title="Admin Dashboard">
            <div className="grid lg:grid-cols-3 gap-4">
              <Card>
                <div className="font-semibold mb-2">Users ({users.length})</div>
                <div className="max-h-64 overflow-auto text-sm">
                  {users.map((u) => (
                    <div key={u.id} className="p-2 border-b last:border-none">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-gray-600">{u.email} • {u.phone}</div>
                      <div className="text-xs">Referrals: {u.referrals || 0} • Used: {u.referralsUsed || 0} • Code: {u.refCode}</div>
                    </div>
                  ))}
                  {!users.length && <div className="text-gray-500">No users yet.</div>}
                </div>
              </Card>
              <Card>
                <div className="font-semibold mb-2">Orders ({orders.length})</div>
                <div className="max-h-64 overflow-auto text-sm">
                  {orders.map((o) => (
                    <div key={o.id} className="p-2 border-b last:border-none">
                      <div className="font-medium">{formatNaira(o.total)} • {new Date(o.date).toLocaleString()}</div>
                      <div className="text-xs text-gray-600">Items: {o.items.map((i) => i.name).join(", ")}</div>
                    </div>
                  ))}
                  {!orders.length && <div className="text-gray-500">No orders yet.</div>}
                </div>
              </Card>
              <Card>
                <div className="font-semibold mb-2">Bookings ({bookings.length})</div>
                <div className="max-h-64 overflow-auto text-sm">
                  {bookings.map((b) => (
                    <div key={b.id} className="p-2 border-b last:border-none">
                      <div className="font-medium">{b.serviceName} • {b.date} {b.time} • {formatNaira(b.amount)}</div>
                      <div className="text-xs text-gray-600">User: {users.find((u) => u.id === b.userId)?.name || "Unknown"}</div>
                    </div>
                  ))}
                  {!bookings.length && <div className="text-gray-500">No bookings yet.</div>}
                </div>
              </Card>
              <Card className="lg:col-span-3">
                <div className="font-semibold mb-2">Support Messages ({comments.length})</div>
                <div className="max-h-64 overflow-auto text-sm">
                  {comments.map((c) => (
                    <div key={c.id} className="p-2 border-b last:border-none">
                      <div className="font-medium">{c.userName}</div>
                      <div className="text-gray-700">{c.text}</div>
                      <div className="mt-2 flex gap-2">
                        <input className="px-2 py-1 border rounded w-full" placeholder="Admin reply..." onKeyDown={(e) => {
                          if (e.key === "Enter") adminReply(c.id, e.currentTarget.value);
                        }} />
                        <Button onClick={(e) => {
                          const input = e.currentTarget.previousSibling;
                          if (input && input.value) adminReply(c.id, input.value);
                        }}>Reply</Button>
                      </div>
                      {c.reply && <div className="text-emerald-700 text-xs mt-1">Replied</div>}
                    </div>
                  ))}
                  {!comments.length && <div className="text-gray-500">No messages yet.</div>}
                </div>
              </Card>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Toasts (simple) */}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        <AnimatePresence>
          {notifs.filter((n) => !n.read).slice(0, 3).map((n) => (
            <motion.div key={n.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="bg-gray-900 text-white px-4 py-3 rounded-2xl shadow-lg max-w-xs">
              <div className="font-semibold">{n.title}</div>
              <div className="text-sm text-gray-200">{n.body}</div>
              <div className="text-xs text-gray-400 mt-1">{new Date(n.time).toLocaleTimeString()}</div>
              <div className="text-right mt-2"><button className="text-xs underline" onClick={() => setNotifs((ns) => ns.map((x) => (x.id === n.id ? { ...x, read: true } : x)))}>Dismiss</button></div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- Reusable Components ----
function Modal({ title, children, onClose }) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 grid place-items-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 20, opacity: 0 }} className="relative bg-white rounded-3xl w-[95vw] max-w-4xl max-h-[85vh] overflow-auto p-5 border shadow-xl">
        <div className="flex items-center justify-between mb-3">
          <div className="text-lg font-bold">{title}</div>
          <button onClick={onClose} className="px-3 py-1 rounded-xl border">Close</button>
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

function Accordion({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border bg-white">
      <button className="w-full text-left px-4 py-3 font-medium flex items-center justify-between" onClick={() => setOpen(!open)}>
        <span>{q}</span>
        <span>{open ? "–" : "+"}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="px-4 pb-4 text-sm text-gray-600">
            {a}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Reviews({ orders, onSubmit }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const submit = () => {
    if (!comment.trim()) return;
    onSubmit({ rating, comment: comment.trim() });
    setComment("");
  };
  return (
    <div className="mt-3">
      <div className="flex items-center gap-2">
        <span className="text-sm">Your rating:</span>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((i) => (
            <button key={i} onClick={() => setRating(i)} className={`text-2xl ${i <= rating ? "text-emerald-600" : "text-gray-300"}`}>★</button>
          ))}
        </div>
      </div>
      <textarea rows={3} className="w-full border rounded-xl px-3 py-2 mt-2" placeholder="Tell us about your experience..." value={comment} onChange={(e) => setComment(e.target.value)} />
      <div className="mt-2 flex items-center justify-between">
        <div className="text-xs text-gray-500">We value honest feedback to keep improving.</div>
        <button onClick={submit} className="px-4 py-2 rounded-2xl bg-emerald-600 text-white">Submit Review</button>
      </div>
    </div>
  );
}
