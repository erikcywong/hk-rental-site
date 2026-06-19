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
  closePaymentModal();
  showToast(L.pay_success || '支付成功！歡迎使用我們的服務 🎉');
}
