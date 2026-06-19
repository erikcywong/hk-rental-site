// ===== PAYMENT MODAL =====
const paymentPlans = {
  free: { name_zh: '免費體驗', name_en: 'Free Trial', price: 'HK$0', period: '/月' },
  basic: { name_zh: '基礎版', name_en: 'Basic Plan', price: 'HK$48', period: '/月' },
  pro: { name_zh: '高級版', name_en: 'Pro Plan', price: 'HK$128', period: '/月' },
  enterprise: { name_zh: '企業版', name_en: 'Enterprise Plan', price: 'HK$388', period: '/月' }
};

const paymentMethods = [
  { id: 'alipay', icon: '💰', name_zh: 'Alipay HK', name_en: 'Alipay HK', desc_zh: '香港支付寶，即時到賬', desc_en: 'Alipay Hong Kong, instant payment' },
  { id: 'fps', icon: '⚡', name_zh: '轉數快 FPS', name_en: 'FPS', desc_zh: '香港快速支付系統', desc_en: 'Faster Payment System' },
  { id: 'card', icon: '💳', name_zh: '信用卡 / 借記卡', name_en: 'Credit / Debit Card', desc_zh: 'Visa、Mastercard、銀聯', desc_en: 'Visa, Mastercard, UnionPay' },
  { id: 'wechat', icon: '💬', name_zh: '微信支付', name_en: 'WeChat Pay', desc_zh: '微信掃碼支付', desc_en: 'WeChat QR code payment' },
  { id: 'payme', icon: '📱', name_zh: 'PayMe', name_en: 'PayMe', desc_zh: '滙豐銀行 PayMe', desc_en: 'HSBC PayMe' }
];

let selectedPaymentMethod = null;

function showPaymentModal(planType) {
  const L = i18n[currentLang];
  const plan = paymentPlans[planType];
  if (!plan) return;

  selectedPaymentMethod = null;
  const planName = currentLang === 'zh' ? plan.name_zh : plan.name_en;

  const modalHTML = `
    <div class="payment-modal" id="payment-modal">
      <div class="payment-box">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:24px;">
          <div>
            <h2>${L.pay_title || '確認支付'}</h2>
            <p style="color:var(--x-gray);font-size:14px;">${L.pay_subtitle || '選擇支付方式完成購買'}</p>
          </div>
          <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentModal()">×</span>
        </div>

        <div class="plan-summary">
          <h3>${planName}</h3>
          <div class="price">${plan.price}<small style="font-size:16px;font-weight:400;color:var(--x-gray);">${plan.period}</small></div>
        </div>

        <h4 style="font-size:16px;font-weight:700;margin-bottom:16px;">${L.pay_select_method || '選擇支付方式'}</h4>
        <div class="payment-options" id="payment-options">
          ${paymentMethods.map(m => `
            <div class="payment-option" onclick="selectPaymentMethod('${m.id}')" id="payment-option-${m.id}">
              <div class="icon">${m.icon}</div>
              <div class="info">
                <h4>${currentLang === 'zh' ? m.name_zh : m.name_en}</h4>
                <p>${currentLang === 'zh' ? m.desc_zh : m.desc_en}</p>
              </div>
              <div class="check">✓</div>
            </div>
          `).join('')}
        </div>

        <button class="btn btn-lg payment-confirm" onclick="confirmPayment()" id="payment-confirm-btn" disabled style="opacity:0.5;cursor:not-allowed;">${L.pay_confirm || '確認支付'}</button>
        <div class="payment-secure"><span class="lock">🔒</span> ${L.pay_secure || '安全加密支付，支持退款保證'}</div>
      </div>
    </div>
  `;

  // Remove existing modal if any
  const existingModal = document.getElementById('payment-modal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.getElementById('payment-modal').classList.add('show');
  }, 10);
}

function closePaymentModal() {
  const modal = document.getElementById('payment-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

function selectPaymentMethod(methodId) {
  selectedPaymentMethod = methodId;
  // Update UI
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  const selectedEl = document.getElementById('payment-option-' + methodId);
  if (selectedEl) selectedEl.classList.add('selected');

  // Enable confirm button
  const confirmBtn = document.getElementById('payment-confirm-btn');
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
  }
}

function confirmPayment() {
  if (!selectedPaymentMethod) return;
  const L = i18n[currentLang];
  
  // Close payment selection modal
  closePaymentModal();
  
  // Show payment processing interface based on selected method
  showPaymentProcessing(selectedPaymentMethod);
}

// ===== PAYMENT PROCESSING INTERFACE =====
function showPaymentProcessing(methodId) {
  const L = i18n[currentLang];
  const method = paymentMethods.find(m => m.id === methodId);
  if (!method) return;

  let processingHTML = '';
  const methodName = currentLang === 'zh' ? method.name_zh : method.name_en;

  // Different payment interfaces based on payment method
  switch(methodId) {
    case 'alipay':
      // Alipay HK - Show QR code
      processingHTML = `
        <div class="payment-modal show" id="payment-processing-modal">
          <div class="payment-box" style="max-width:420px;text-align:center;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
              <h2>💰 Alipay HK 支付</h2>
              <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentProcessing()">×</span>
            </div>
            
            <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;">
              <div style="width:200px;height:200px;margin:0 auto 16px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#999;">
                📱 Alipay HK 二維碼<br>（實際接入時顯示真實QR Code）
              </div>
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:8px;">請使用 Alipay HK App 掃描二維碼</p>
              <div style="background:#e8f5e9;color:#2e7d32;padding:12px;border-radius:8px;font-size:14px;">
                ✅ 支付金額：HK$48.00
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:12px;">或</p>
              <a href="#" onclick="showToast('正在跳轉到 Alipay HK...'); return false;" 
                 style="display:block;background:#1677FF;color:#fff;padding:14px;border-radius:9999px;text-decoration:none;font-weight:700;">
                🔗 直接跳轉到 Alipay HK 支付
              </a>
            </div>

            <button class="btn btn-outline" onclick="closePaymentProcessing()" style="width:100%;">
              ${L.btn_cancel || '取消'}
            </button>
          </div>
        </div>`;
      break;

    case 'fps':
      // FPS - Show FPS QR code and FPS ID
      processingHTML = `
        <div class="payment-modal show" id="payment-processing-modal">
          <div class="payment-box" style="max-width:420px;text-align:center;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
              <h2>⚡ 轉數快 FPS 支付</h2>
              <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentProcessing()">×</span>
            </div>
            
            <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;">
              <div style="width:200px;height:200px;margin:0 auto 16px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#999;">
                ⚡ FPS 二維碼<br>（實際接入時顯示真實QR Code）
              </div>
              
              <div style="background:#fff3e0;color:#e65100;padding:16px;border-radius:8px;font-size:14px;margin-bottom:12px;text-align:left;">
                <p style="font-weight:700;margin-bottom:8px;">📋 轉數快支付指引：</p>
                <ol style="margin:0;padding-left:20px;line-height:1.8;">
                  <li>打開您的銀行 App</li>
                  <li>選擇「轉數快」或掃描二維碼</li>
                  <li>輸入金額：<strong>HK$48.00</strong></li>
                  <li>完成支付後點擊「我已完成支付」</li>
                </ol>
              </div>

              <div style="background:#f5f5f5;padding:12px;border-radius:8px;font-size:14px;">
                <p style="margin:0 0 4px;color:var(--x-gray);">轉數快識別碼（FPS ID）</p>
                <p style="margin:0;font-weight:700;font-size:18px;color:var(--x-text);">16001234567</p>
                <button onclick="copyFPSID()" style="margin-top:8px;padding:6px 16px;border-radius:9999px;border:1px solid var(--x-border);background:#fff;cursor:pointer;font-size:12px;">
                  📋 複製 FPS ID
                </button>
              </div>
            </div>

            <button class="btn" onclick="verifyFPSPayment()" style="width:100%;margin-bottom:12px;">
              ✅ 我已完成支付
            </button>
            <button class="btn btn-outline" onclick="closePaymentProcessing()" style="width:100%;">
              ${L.btn_cancel || '取消'}
            </button>
          </div>
        </div>`;
      break;

    case 'card':
      // Credit Card - Show card form
      processingHTML = `
        <div class="payment-modal show" id="payment-processing-modal">
          <div class="payment-box" style="max-width:480px;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
              <h2>💳 信用卡 / 借記卡支付</h2>
              <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentProcessing()">×</span>
            </div>
            
            <div style="margin-bottom:20px;">
              <div style="display:flex;gap:12px;justify-content:center;margin-bottom:20px;">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='32'%3E%3Crect fill='%231A1F71' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='55%25' font-size='10' fill='white' text-anchor='middle' dy='.3em' font-weight='bold'%3EVISA%3C/text%3E%3C/svg%3E" alt="Visa" style="height:32px;">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='32'%3E%3Crect fill='%23EB001B' width='48' height='32' rx='4'/%3E%3Ccircle cx='18' cy='16' r='10' fill='%23FF5F00' opacity='0.8'/%3E%3Ccircle cx='30' cy='16' r='10' fill='%23EB001B' opacity='0.8'/%3E%3C/svg%3E" alt="Mastercard" style="height:32px;">
                <img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='48' height='32'%3E%3Crect fill='%23E21836' width='48' height='32' rx='4'/%3E%3Ctext x='50%25' y='55%25' font-size='7' fill='white' text-anchor='middle' dy='.3em' font-weight='bold'%3EUnionPay%3C/text%3E%3C/svg%3E" alt="UnionPay" style="height:32px;">
              </div>

              <div style="margin-bottom:16px;">
                <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;">信用卡號碼</label>
                <input type="text" placeholder="1234 5678 9012 3456" style="width:100%;padding:12px;border:1px solid var(--x-border);border-radius:8px;font-size:16px;box-sizing:border-box;">
              </div>

              <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;margin-bottom:16px;">
                <div>
                  <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;">有效期</label>
                  <input type="text" placeholder="MM/YY" style="width:100%;padding:12px;border:1px solid var(--x-border);border-radius:8px;font-size:16px;box-sizing:border-box;">
                </div>
                <div>
                  <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;">安全碼 (CVV)</label>
                  <input type="text" placeholder="123" style="width:100%;padding:12px;border:1px solid var(--x-border);border-radius:8px;font-size:16px;box-sizing:border-box;">
                </div>
              </div>

              <div style="margin-bottom:16px;">
                <label style="display:block;font-size:14px;font-weight:600;margin-bottom:8px;">持卡人姓名</label>
                <input type="text" placeholder="姓名（與卡片一致）" style="width:100%;padding:12px;border:1px solid var(--x-border);border-radius:8px;font-size:16px;box-sizing:border-box;">
              </div>

              <div style="background:#e3f2fd;padding:12px;border-radius:8px;font-size:13px;color:#1565c0;margin-bottom:20px;">
                🔒 您的支付信息已通过 SSL 加密保护
              </div>
            </div>

            <button class="btn btn-lg" onclick="processCardPayment()" style="width:100%;margin-bottom:12px;">
              💳 支付 HK$48.00
            </button>
            <button class="btn btn-outline" onclick="closePaymentProcessing()" style="width:100%;">
              ${L.btn_cancel || '取消'}
            </button>
          </div>
        </div>`;
      break;

    case 'wechat':
      // WeChat Pay - Show QR code
      processingHTML = `
        <div class="payment-modal show" id="payment-processing-modal">
          <div class="payment-box" style="max-width:420px;text-align:center;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
              <h2>💬 微信支付</h2>
              <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentProcessing()">×</span>
            </div>
            
            <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;">
              <div style="width:200px;height:200px;margin:0 auto 16px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#999;">
                💬 微信支付二維碼<br>（實際接入時顯示真實QR Code）
              </div>
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:8px;">請使用微信掃描二維碼</p>
              <div style="background:#e8f5e9;color:#2e7d32;padding:12px;border-radius:8px;font-size:14px;">
                ✅ 支付金額：HK$48.00
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:12px;">或</p>
              <a href="#" onclick="showToast('正在跳轉到微信支付...'); return false;" 
                 style="display:block;background:#07c160;color:#fff;padding:14px;border-radius:9999px;text-decoration:none;font-weight:700;">
                🔗 打開微信支付
              </a>
            </div>

            <button class="btn btn-outline" onclick="closePaymentProcessing()" style="width:100%;">
              ${L.btn_cancel || '取消'}
            </button>
          </div>
        </div>`;
      break;

    case 'payme':
      // PayMe - Show QR code
      processingHTML = `
        <div class="payment-modal show" id="payment-processing-modal">
          <div class="payment-box" style="max-width:420px;text-align:center;">
            <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
              <h2>📱 PayMe 支付</h2>
              <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePaymentProcessing()">×</span>
            </div>
            
            <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;">
              <div style="width:200px;height:200px;margin:0 auto 16px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#999;">
                📱 PayMe 二維碼<br>（實際接入時顯示真實QR Code）
              </div>
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:8px;">請使用 PayMe App 掃描二維碼</p>
              <div style="background:#e8f5e9;color:#2e7d32;padding:12px;border-radius:8px;font-size:14px;">
                ✅ 支付金額：HK$48.00
              </div>
            </div>

            <div style="margin-bottom:20px;">
              <p style="font-size:14px;color:var(--x-gray);margin-bottom:12px;">或</p>
              <a href="#" onclick="showToast('正在跳轉到 PayMe...'); return false;" 
                 style="display:block;background:#ff6f00;color:#fff;padding:14px;border-radius:9999px;text-decoration:none;font-weight:700;">
                🔗 打開 PayMe App
              </a>
            </div>

            <button class="btn btn-outline" onclick="closePaymentProcessing()" style="width:100%;">
              ${L.btn_cancel || '取消'}
            </button>
          </div>
        </div>`;
      break;

    default:
      processingHTML = `<div class="payment-modal show" id="payment-processing-modal">
        <div class="payment-box" style="max-width:420px;text-align:center;">
          <h2>支付方式未支持</h2>
          <button class="btn" onclick="closePaymentProcessing()">關閉</button>
        </div>
      </div>`;
  }

  // Remove existing processing modal if any
  const existingModal = document.getElementById('payment-processing-modal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', processingHTML);
}

// ===== PAYMENT HELPER FUNCTIONS =====
function closePaymentProcessing() {
  const modal = document.getElementById('payment-processing-modal');
  if (modal) {
    modal.classList.remove('show');
    setTimeout(() => modal.remove(), 300);
  }
}

function copyFPSID() {
  const fpsId = '16001234567';
  if (navigator.clipboard) {
    navigator.clipboard.writeText(fpsId).then(() => {
      showToast('✅ FPS ID 已複製到剪貼簿');
    });
  } else {
    showToast('FPS ID: ' + fpsId);
  }
}

function verifyFPSPayment() {
  showToast('⏳ 正在驗證 FPS 支付...');
  setTimeout(() => {
    closePaymentProcessing();
    showToast('✅ 支付成功！歡迎使用我們的服務 🎉');
  }, 2000);
}

function processCardPayment() {
  showToast('⏳ 正在處理信用卡支付...');
  setTimeout(() => {
    closePaymentProcessing();
    showToast('✅ 支付成功！歡迎使用我們的服務 🎉');
  }, 2000);
}
