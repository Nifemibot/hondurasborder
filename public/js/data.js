/**
 * HondurasBorder — Data Store (localStorage)
 * Switch to backend API later by replacing _get/_set with fetch() calls
 */
const DB = {

  // ── DEFAULTS ──
  defaultCategories: [
    { id:'cat-1', name:'Vehicles',     icon:'🚗', color:'#3b82f6' },
    { id:'cat-2', name:'Electronics',  icon:'💻', color:'#8b5cf6' },
    { id:'cat-3', name:'Jewelry',      icon:'💎', color:'#f59e0b' },
    { id:'cat-4', name:'Vessels',      icon:'⛵', color:'#06b6d4' },
    { id:'cat-5', name:'Luxury Goods', icon:'👜', color:'#ec4899' },
    { id:'cat-6', name:'Real Estate',  icon:'🏠', color:'#10b981' },
  ],

  defaultItems: [
    { id:'SGT-2026-001', title:'2024 Mercedes-Benz E-Class Sedan', category:'Vehicles', status:'Seized', location:'Federal Impound Lot, Washington D.C.', value:58000, featured:true, description:'Seized during a federal investigation. Vehicle is in excellent condition with verified VIN and all original documentation. Low mileage, full service history available upon request.', image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80', date:'2026-01-15' },
    { id:'SGT-2026-002', title:'Electronic Equipment Collection', category:'Electronics', status:'Under Review', location:'Evidence Warehouse, New York', value:34500, featured:true, description:'Collection of 12 laptops, 8 tablets, and 20 smartphones seized at the border. All devices are catalogued, encrypted, and stored securely pending investigation outcome.', image:'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80', date:'2026-01-22' },
    { id:'SGT-2026-003', title:'Luxury Watch & Jewelry Collection', category:'Jewelry', status:'Available', location:'Secure Vault, Miami', value:142000, featured:true, description:'High-end timepieces and jewelry including Rolex Submariner, Patek Philippe Calatrava, and a diamond bracelet set. All items appraised by certified independent experts.', image:'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=800&q=80', date:'2026-02-03' },
    { id:'SGT-2026-004', title:'42ft Motor Yacht', category:'Vessels', status:'Seized', location:'Marina Bay, San Diego', value:385000, featured:false, description:'Fully equipped 42-foot motor yacht with twin 300HP engines, full cabin, navigation system, and all safety equipment. Seized at port of entry during routine inspection.', image:'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?w=800&q=80', date:'2026-02-10' },
    { id:'SGT-2026-005', title:'Designer Handbag Collection', category:'Luxury Goods', status:'Under Review', location:'Evidence Room, Chicago', value:67000, featured:false, description:'Collection of 47 designer handbags including Louis Vuitton, Chanel, and Hermès pieces. Authenticity verification currently in progress by certified luxury goods appraisers.', image:'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&q=80', date:'2026-02-18' },
    { id:'SGT-2026-006', title:'Residential Property - 4BR Colonial', category:'Real Estate', status:'Available', location:'Springfield, Virginia', value:520000, featured:false, description:'4-bedroom, 3-bathroom colonial home seized under asset forfeiture proceedings. Property is well-maintained, currently unoccupied, and available for court-ordered sale.', image:'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80', date:'2026-03-01' },
  ],

  // ── SAFE STORAGE ──
  _get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch(e) { return fallback; }
  },

  _set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
      return true;
    } catch(e) {
      console.error('Storage error:', e);
      return false;
    }
  },

  // ── INIT ──
  init() {
    try {
      if (!localStorage.getItem('hb_items'))      this._set('hb_items',      this.defaultItems);
      if (!localStorage.getItem('hb_messages'))   this._set('hb_messages',   []);
      if (!localStorage.getItem('hb_categories')) this._set('hb_categories', this.defaultCategories);
      if (!localStorage.getItem('hb_admin'))      this._set('hb_admin',      { email:'admin@hondurasborder.gov', password:'Admin@123' });
    } catch(e) { console.warn('DB init error:', e); }
  },

  // ── CATEGORIES ──
  getCategories()    { return this._get('hb_categories', this.defaultCategories); },

  getCategoryMeta(name) {
    return this.getCategories().find(c => c.name === name) || { icon:'📦', color:'#888', name: name||'Unknown' };
  },

  saveCategory(data) {
    const cats = this.getCategories();
    if (data.id && cats.find(c => c.id === data.id)) {
      const idx = cats.findIndex(c => c.id === data.id);
      cats[idx] = { ...cats[idx], ...data };
    } else {
      data.id = 'cat-' + Date.now();
      cats.push(data);
    }
    this._set('hb_categories', cats);
    return data;
  },

  deleteCategory(id) {
    this._set('hb_categories', this.getCategories().filter(c => c.id !== id));
  },

  // ── ITEMS ──
  getItems(filters = {}) {
    let items = this._get('hb_items', []);
    try {
      if (filters.search) {
        const q = filters.search.toLowerCase();
        items = items.filter(i =>
          (i.title       || '').toLowerCase().includes(q) ||
          (i.description || '').toLowerCase().includes(q) ||
          (i.location    || '').toLowerCase().includes(q) ||
          (i.id          || '').toLowerCase().includes(q)
        );
      }
      if (filters.category && filters.category !== 'All') items = items.filter(i => i.category === filters.category);
      if (filters.status   && filters.status   !== 'All') items = items.filter(i => i.status   === filters.status);
      if (filters.featured) items = items.filter(i => i.featured);
    } catch(e) { console.warn('Filter error:', e); }
    return items;
  },

  getItem(id) {
    return this._get('hb_items', []).find(i => i.id === id) || null;
  },

  saveItem(data) {
    const items = this._get('hb_items', []);
    if (data.id && items.find(i => i.id === data.id)) {
      const idx = items.findIndex(i => i.id === data.id);
      items[idx] = { ...items[idx], ...data };
    } else {
      const num  = String(items.length + 1).padStart(3, '0');
      data.id    = `SGT-${new Date().getFullYear()}-${num}`;
      data.date  = new Date().toISOString().split('T')[0];
      items.unshift(data);
    }
    this._set('hb_items', items);
    return data;
  },

  deleteItem(id) {
    this._set('hb_items', this._get('hb_items', []).filter(i => i.id !== id));
  },

  // ── MESSAGES ──
  // Message shape: { id, itemId, itemTitle, name, phone, email, message, date, read }
  getMessages(itemId = null) {
    let msgs = this._get('hb_messages', []);
    if (itemId) msgs = msgs.filter(m => m.itemId === itemId);
    return msgs.sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  saveMessage(data) {
    const msgs  = this._get('hb_messages', []);
    data.id     = 'msg-' + Date.now();
    data.date   = new Date().toISOString();
    data.read   = false;
    msgs.unshift(data);
    this._set('hb_messages', msgs);
    return data;
  },

  markMessageRead(id) {
    const msgs = this._get('hb_messages', []);
    const msg  = msgs.find(m => m.id === id);
    if (msg) { msg.read = true; this._set('hb_messages', msgs); }
  },

  deleteMessage(id) {
    this._set('hb_messages', this._get('hb_messages', []).filter(m => m.id !== id));
  },

  getUnreadCount() {
    return this._get('hb_messages', []).filter(m => !m.read).length;
  },

  // ── AUTH ──
  login(email, password) {
    try {
      this.init();
      const admin = this._get('hb_admin', null);
      const normalizedEmail = String(email || '').trim().toLowerCase();
      const normalizedPassword = String(password || '').trim();
      if (admin && String(admin.email || '').trim().toLowerCase() === normalizedEmail && admin.password === normalizedPassword) {
        this._set('hb_session', 'true');
        return true;
      }
      return false;
    } catch(e) { return false; }
  },

  logout()     { try { localStorage.removeItem('hb_session'); } catch(e){} },
  isLoggedIn() { return localStorage.getItem('hb_session') === 'true'; },

  // ── HELPERS ──
  formatCurrency(val) {
    const n = Number(val) || 0;
    if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000)    return '$' + n.toLocaleString('en-US');
    return '$' + n;
  },

  formatDate(str) {
    try {
      return new Date(str).toLocaleDateString('en-US', { year:'numeric', month:'short', day:'numeric' });
    } catch(e) { return str || '—'; }
  },

  badgeClass(status) {
    if (status === 'Seized')       return 'badge-seized';
    if (status === 'Under Review') return 'badge-review';
    return 'badge-available';
  },

  getStats() {
    const items = this._get('hb_items', []);
    const msgs  = this._get('hb_messages', []);
    return {
      total:      items.length,
      seized:     items.filter(i => i.status === 'Seized').length,
      review:     items.filter(i => i.status === 'Under Review').length,
      available:  items.filter(i => i.status === 'Available').length,
      totalValue: items.reduce((s, i) => s + (Number(i.value) || 0), 0),
      messages:   msgs.length,
      unread:     msgs.filter(m => !m.read).length,
      categories: this.getCategories().length,
    };
  },
};

DB.init();