// ===== PAYMENT MODAL =====
const paymentPlans = {
  free: { name_zh: '免費體驗', name_en: 'Free Trial', price: 0 },
  basic: { name_zh: '基礎版', name_en: 'Basic Plan', price: 48 },
  pro: { name_zh: '高級版', name_en: 'Pro Plan', price: 128 },
  enterprise: { name_zh: '企業版', name_en: 'Enterprise Plan', price: 388 }
};

let selectedPaymentMethod = null;
let selectedPlanType = null;

function showPaymentModal(planType) {
  const L = i18n[currentLang];
  const plan = paymentPlans[planType];
  if (!plan) return;

  selectedPaymentMethod = null;
  selectedPlanType = planType;
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
          <div class="price">${plan.price === 0 ? 'HK$0' : 'HK$' + plan.price}<small style="font-size:16px;font-weight:400;color:var(--x-gray);">/月</small></div>
        </div>

        ${plan.price === 0 ? `
          <button class="btn btn-lg" onclick="confirmFreePlan()" style="width:100%;margin-top:20px;">
            ${L.pay_confirm || '確認激活免費套餐'}
          </button>
        ` : `
          <div class="payment-options" id="payment-options" style="margin-top:20px;">
            <div class="payment-option" onclick="selectPaymentMethod('stripe')" id="payment-option-stripe">
              <div class="icon">💳</div>
              <div class="info">
                <h4>信用卡 / Debit Card</h4>
                <p>Visa, Mastercard, UnionPay - 即時到賬</p>
              </div>
              <div class="check">✓</div>
            </div>
            <div class="payment-option" onclick="selectPaymentMethod('alipay')" id="payment-option-alipay">
              <div class="icon">💰</div>
              <div class="info">
                <h4>Alipay HK</h4>
                <p>香港支付寶 - 即時到賬</p>
              </div>
              <div class="check">✓</div>
            </div>
            <div class="payment-option" onclick="selectPaymentMethod('wechat')" id="payment-option-wechat">
              <div class="icon">💬</div>
              <div class="info">
                <h4>WeChat Pay</h4>
                <p>微信支付 - 即時到賬</p>
              </div>
              <div class="check">✓</div>
            </div>
            <div class="payment-option" onclick="selectPaymentMethod('fps')" id="payment-option-fps">
              <div class="icon">⚡</div>
              <div class="info">
                <h4>轉數快 FPS</h4>
                <p>銀行轉賬 - 需上傳憑證</p>
              </div>
              <div class="check">✓</div>
            </div>
            <div class="payment-option" onclick="selectPaymentMethod('payme')" id="payment-option-payme">
              <div class="icon">📱</div>
              <div class="info">
                <h4>PayMe</h4>
                <p>滙豐 PayMe - 需上傳憑證</p>
              </div>
              <div class="check">✓</div>
            </div>
          </div>

          <button class="btn btn-lg payment-confirm" onclick="confirmPayment()" id="payment-confirm-btn" disabled style="opacity:0.5;cursor:not-allowed;width:100%;margin-top:20px;">
            ${L.pay_confirm || '確認支付'}
          </button>
          <div class="payment-secure"><span class="lock">🔒</span> ${L.pay_secure || '安全加密支付，支持退款保證'}</div>
        `}
      </div>
    </div>
  `;

  const existingModal = document.getElementById('payment-modal');
  if (existingModal) existingModal.remove();

  document.body.insertAdjacentHTML('beforeend', modalHTML);
  setTimeout(() => {
    document.getElementById('payment-modal').classList.add('show');
  }, 10);
}

function confirmFreePlan() {
  closePaymentModal();
  showToast('✅ 免費套餐已激活！歡迎使用我們的服務 🎉');
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
  document.querySelectorAll('.payment-option').forEach(el => el.classList.remove('selected'));
  const selectedEl = document.getElementById('payment-option-' + methodId);
  if (selectedEl) selectedEl.classList.add('selected');

  const confirmBtn = document.getElementById('payment-confirm-btn');
  if (confirmBtn) {
    confirmBtn.disabled = false;
    confirmBtn.style.opacity = '1';
    confirmBtn.style.cursor = 'pointer';
  }
}

async function confirmPayment() {
  if (!selectedPaymentMethod || !selectedPlanType) return;

  const L = i18n[currentLang];

  // Stripe payment methods (card, alipay, wechat)
  if (['stripe', 'alipay', 'wechat'].includes(selectedPaymentMethod)) {
    try {
      showToast('⏳ 正在跳轉到支付頁面...');

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planType: selectedPlanType,
          locale: currentLang,
          paymentMethod: selectedPaymentMethod
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Payment error:', error);
      showToast('❌ 支付失敗：' + error.message);
    }
  } else if (selectedPaymentMethod === 'fps') {
    closePaymentModal();
    showFPSPayment();
  } else if (selectedPaymentMethod === 'payme') {
    closePaymentModal();
    showPayMePayment();
  }
}

// ===== FPS PAYMENT =====
function showFPSPayment() {
  const plan = paymentPlans[selectedPlanType];
  const fpsHTML = `
    <div class="payment-modal show" id="fps-modal">
      <div class="payment-box" style="max-width:420px;">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
          <h2>⚡ 轉數快 FPS 支付</h2>
          <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closeFPSModal()">×</span>
        </div>
        <div style="background:#fff3e0;color:#e65100;padding:16px;border-radius:8px;font-size:14px;margin-bottom:20px;text-align:left;">
          <p style="font-weight:700;margin-bottom:8px;">📋 支付指引：</p>
          <ol style="margin:0;padding-left:20px;line-height:1.8;">
            <li>打開銀行 App，選擇「轉數快」</li>
            <li>輸入 FPS ID：<strong>16001234567</strong></li>
            <li>輸入金額：<strong>HK$${plan.price}</strong></li>
            <li>完成轉賬後上傳截圖</li>
          </ol>
        </div>
        <div style="background:#f5f5f5;padding:12px;border-radius:8px;margin-bottom:20px;text-align:center;">
          <p style="margin:0 0 4px;color:#71767b;font-size:14px;">FPS ID</p>
          <p style="margin:0;font-weight:700;font-size:20px;color:#000;">16001234567</p>
          <button onclick="copyFPSID()" style="margin-top:8px;padding:6px 16px;border-radius:9999px;border:1px solid #ddd;background:#fff;cursor:pointer;font-size:12px;">📋 複製</button>
        </div>
        <input type="file" accept="image/*" id="fps-receipt" style="width:100%;margin-bottom:16px;padding:12px;border:1px solid var(--x-border);border-radius:8px;background:#fff;color:var(--x-text);">
        <button class="btn" onclick="submitFPSReceipt()" style="width:100%;">✅ 提交憑證</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', fpsHTML);
}

function closeFPSModal() {
  const modal = document.getElementById('fps-modal');
  if (modal) modal.remove();
}

function copyFPSID() {
  if (navigator.clipboard) navigator.clipboard.writeText('16001234567');
  showToast('✅ FPS ID 已複製');
}

function submitFPSReceipt() {
  const file = document.getElementById('fps-receipt').files[0];
  if (!file) { showToast('⚠️ 請先上傳截圖'); return; }
  showToast('⏳ 提交中，24小時內審核...');
  setTimeout(() => { closeFPSModal(); showToast('✅ 已提交！審核後激活 🎉'); }, 1500);
}

// ===== PAYME PAYMENT =====
function showPayMePayment() {
  const plan = paymentPlans[selectedPlanType];
  const paymeHTML = `
    <div class="payment-modal show" id="payme-modal">
      <div class="payment-box" style="max-width:420px;text-align:center;">
        <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:20px;">
          <h2>📱 PayMe 支付</h2>
          <span style="cursor:pointer;font-size:24px;color:var(--x-gray);" onclick="closePayMeModal()">×</span>
        </div>
        <div style="background:#fff;border-radius:12px;padding:24px;margin-bottom:20px;">
          <div style="width:200px;height:200px;margin:0 auto 16px;background:#f5f5f5;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;color:#999;">
            📱 PayMe 二維碼<br>（請上傳真實QR Code）
          </div>
          <p style="font-size:14px;color:#71767b;margin-bottom:8px;">掃描二維碼支付 HK$${plan.price}</p>
        </div>
        <input type="file" accept="image/*" id="payme-receipt" style="width:100%;margin-bottom:16px;padding:12px;border:1px solid var(--x-border);border-radius:8px;background:#fff;color:var(--x-text);">
        <button class="btn" onclick="submitPayMeReceipt()" style="width:100%;">✅ 提交憑證</button>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', paymeHTML);
}

function closePayMeModal() {
  const modal = document.getElementById('payme-modal');
  if (modal) modal.remove();
}

function submitPayMeReceipt() {
  const file = document.getElementById('payme-receipt').files[0];
  if (!file) { showToast('⚠️ 請先上傳截圖'); return; }
  showToast('⏳ 提交中，24小時內審核...');
  setTimeout(() => { closePayMeModal(); showToast('✅ 已提交！審核後激活 🎉'); }, 1500);
}
