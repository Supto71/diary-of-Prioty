// ============================================
// Prioty's Money Diary — Tracker Logic
// Stores data in Supabase with localStorage fallback
// ============================================

(function () {
  'use strict';

  // ---- Supabase Config ----
  // These will be set from environment / config
  let SUPABASE_URL = '';
  let SUPABASE_ANON_KEY = '';
  let supabaseClient = null;
  let useSupabase = false;

  // Try to load config
  async function initSupabase() {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const config = await res.json();
        SUPABASE_URL = config.supabaseUrl;
        SUPABASE_ANON_KEY = config.supabaseAnonKey;

        if (SUPABASE_URL && SUPABASE_ANON_KEY) {
          const { createClient } = window.supabase;
          supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
          useSupabase = true;
          console.log('✅ Connected to Supabase');
        }
      }
    } catch (e) {
      console.log('ℹ️ Using localStorage (Supabase not configured)');
    }
    // Load and render after init
    await loadEntries();
    render();
  }

  // ---- State ----
  const STORAGE_KEY = 'prioty_money_diary';
  let entries = [];
  let currentType = 'income';
  let viewDate = new Date();

  // ---- DOM Elements ----
  const form = document.getElementById('entryForm');
  const descInput = document.getElementById('entryDescription');
  const amountInput = document.getElementById('entryAmount');
  const dateInput = document.getElementById('entryDate');
  const categorySelect = document.getElementById('entryCategory');
  const incomeToggle = document.getElementById('incomeToggle');
  const expenseToggle = document.getElementById('expenseToggle');
  const entriesList = document.getElementById('entriesList');
  const totalIncomeEl = document.getElementById('totalIncome');
  const totalExpenseEl = document.getElementById('totalExpense');
  const totalBalanceEl = document.getElementById('totalBalance');
  const currentMonthEl = document.getElementById('currentMonth');
  const prevMonthBtn = document.getElementById('prevMonth');
  const nextMonthBtn = document.getElementById('nextMonth');

  // ---- Helpers ----
  const MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const CATEGORY_EMOJIS = {
    general: '📝',
    salary: '💰',
    freelance: '💻',
    food: '🍽️',
    transport: '🚗',
    shopping: '🛍️',
    bills: '📄',
    education: '📚',
    health: '💊',
    gift: '🎁',
    other: '📌'
  };

  function formatAmount(amount) {
    return '৳' + Number(amount).toLocaleString('en-BD', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  function formatDate(dateStr) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
  }

  // ---- Data Layer ----
  async function loadEntries() {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseClient
          .from('entries')
          .select('*')
          .order('date', { ascending: false });

        if (error) throw error;
        entries = data || [];
        // Sync to localStorage as backup
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (e) {
        console.error('Supabase load failed, using localStorage:', e);
        entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      }
    } else {
      entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    }
  }

  async function saveEntry(entry) {
    if (useSupabase) {
      try {
        const { data, error } = await supabaseClient
          .from('entries')
          .insert([{
            type: entry.type,
            description: entry.description,
            amount: entry.amount,
            date: entry.date,
            category: entry.category
          }])
          .select();

        if (error) throw error;
        if (data && data[0]) {
          entry.id = data[0].id;
        }
      } catch (e) {
        console.error('Supabase save failed:', e);
      }
    }
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  async function removeEntry(id) {
    if (useSupabase) {
      try {
        const { error } = await supabaseClient
          .from('entries')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (e) {
        console.error('Supabase delete failed:', e);
      }
    }
    entries = entries.filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }

  // ---- Type Toggle ----
  incomeToggle.addEventListener('click', () => {
    currentType = 'income';
    incomeToggle.classList.add('active');
    expenseToggle.classList.remove('active');
  });

  expenseToggle.addEventListener('click', () => {
    currentType = 'expense';
    expenseToggle.classList.add('active');
    incomeToggle.classList.remove('active');
  });

  // ---- Set Default Date ----
  const today = new Date();
  dateInput.value = today.toISOString().split('T')[0];

  // ---- Form Submission ----
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const description = descInput.value.trim();
    const amount = parseFloat(amountInput.value);
    const date = dateInput.value;
    const category = categorySelect.value;

    if (!description || !amount || !date) return;

    const entry = {
      id: generateId(),
      type: currentType,
      description,
      amount,
      date,
      category,
      created_at: new Date().toISOString()
    };

    await saveEntry(entry);

    // Reset form
    descInput.value = '';
    amountInput.value = '';
    dateInput.value = today.toISOString().split('T')[0];

    // Update view to the month of the new entry
    const entryDate = new Date(date + 'T00:00:00');
    viewDate = new Date(entryDate.getFullYear(), entryDate.getMonth(), 1);

    render();

    // Small success animation
    const btn = document.getElementById('addEntryBtn');
    btn.textContent = '✅ Added!';
    btn.style.background = 'linear-gradient(135deg, #86efac, #4ade80)';
    setTimeout(() => {
      btn.textContent = 'Add Entry 💕';
      btn.style.background = '';
    }, 1200);
  });

  // ---- Month Navigation ----
  prevMonthBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() - 1);
    render();
  });

  nextMonthBtn.addEventListener('click', () => {
    viewDate.setMonth(viewDate.getMonth() + 1);
    render();
  });

  // ---- Delete Entry ----
  async function deleteEntry(id) {
    await removeEntry(id);
    render();
  }

  // ---- Render ----
  function render() {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    // Update month label
    currentMonthEl.textContent = `${MONTHS[month]} ${year}`;

    // Filter entries for current month
    const monthEntries = entries.filter(e => {
      const d = new Date(e.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    });

    // Sort by date descending
    monthEntries.sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;

    monthEntries.forEach(e => {
      if (e.type === 'income') totalIncome += e.amount;
      else totalExpense += e.amount;
    });

    totalIncomeEl.textContent = formatAmount(totalIncome);
    totalExpenseEl.textContent = formatAmount(totalExpense);
    totalBalanceEl.textContent = formatAmount(totalIncome - totalExpense);

    // Render entries
    if (monthEntries.length === 0) {
      entriesList.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🌷</div>
          <p>No entries yet for ${MONTHS[month]} ${year}.<br>Add your first one above.</p>
        </div>
      `;
      return;
    }

    entriesList.innerHTML = monthEntries.map((entry, i) => `
      <div class="entry-item" style="animation-delay: ${i * 0.05}s">
        <div class="entry-left">
          <div class="entry-type-dot ${entry.type}"></div>
          <div class="entry-info">
            <h4>${CATEGORY_EMOJIS[entry.category] || '📝'} ${escapeHtml(entry.description)}</h4>
            <span class="entry-date">${formatDate(entry.date)}</span>
          </div>
        </div>
        <div class="entry-right">
          <span class="entry-amount ${entry.type}">
            ${entry.type === 'income' ? '+' : '−'}${formatAmount(entry.amount)}
          </span>
          <button class="delete-btn" onclick="window.__deleteEntry('${entry.id}')" title="Delete">
            ×
          </button>
        </div>
      </div>
    `).join('');
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Expose delete function globally
  window.__deleteEntry = deleteEntry;

  // ---- Initialize ----
  initSupabase();
})();
