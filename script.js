// 簡單商品資料（實際可改為載入 /products.json 或 API）
const PRODUCTS = [
  { id: 'p1', title: '商品 A', price: 499.00, image: 'https://picsum.photos/seed/p1/600/400' },
  { id: 'p2', title: '商品 B', price: 1299.00, image: 'https://picsum.photos/seed/p2/600/400' },
  { id: 'p3', title: '商品 C', price: 259.00, image: 'https://picsum.photos/seed/p3/600/400' }
];

const el = selector => document.querySelector(selector);
const productsEl = el('#products');
const cartBtn = el('#cart-btn');
const cartCount = el('#cart-count');
const cartEl = el('#cart');
const cartItemsEl = el('#cart-items');
const cartTotalEl = el('#cart-total');
const checkoutBtn = el('#checkout-btn');
const checkoutModal = el('#checkout');
const checkoutForm = el('#checkout-form');
const closeCartBtn = el('#close-cart');
const orderResult = el('#order-result');
const orderMessage = el('#order-message');
const closeResult = el('#close-result');

let cart = JSON.parse(localStorage.getItem('cart')||'{}');

function formatCurrency(n){ return n.toFixed(2); }

function renderProducts(){
  productsEl.innerHTML = '';
  PRODUCTS.forEach(p=>{
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <div class="product-title">${p.title}</div>
      <div class="product-price">NT$ ${formatCurrency(p.price)}</div>
      <div style="margin-top:auto">
        <button data-id="${p.id}" class="add-btn">加入購物車</button>
      </div>
    `;
    productsEl.appendChild(card);
  });
  document.querySelectorAll('.add-btn').forEach(btn=>{
    btn.addEventListener('click', e=>{
      addToCart(e.target.dataset.id);
    });
  });
}

function addToCart(id){
  cart[id] = (cart[id]||0) + 1;
  persistCart(); updateCartUI();
}

function persistCart(){ localStorage.setItem('cart', JSON.stringify(cart)); }

function updateCartUI(){
  const items = Object.keys(cart);
  cartCount.textContent = items.reduce((s,k)=>s+cart[k],0);
  cartItemsEl.innerHTML = '';
  let total = 0;
  items.forEach(id=>{
    const p = PRODUCTS.find(x=>x.id===id);
    const qty = cart[id];
    const li = document.createElement('li');
    const subtotal = p.price * qty;
    total += subtotal;
    li.innerHTML = `${p.title} × ${qty} — NT$ ${formatCurrency(subtotal)}
      <button data-id="${id}" class="dec">−</button>
      <button data-id="${id}" class="inc">＋</button>
      <button data-id="${id}" class="rem">移除</button>
    `;
    cartItemsEl.appendChild(li);
  });
  cartTotalEl.textContent = formatCurrency(total);
  // bind buttons
  document.querySelectorAll('.inc').forEach(b=>b.onclick=e=>{ cart[e.target.dataset.id]++; persistCart(); updateCartUI();});
  document.querySelectorAll('.dec').forEach(b=>b.onclick=e=>{
    const id=e.target.dataset.id;
    cart[id] = Math.max(0, cart[id]-1);
    if(cart[id]===0) delete cart[id];
    persistCart(); updateCartUI();
  });
  document.querySelectorAll('.rem').forEach(b=>b.onclick=e=>{ delete cart[e.target.dataset.id]; persistCart(); updateCartUI(); });
}

// UI events
cartBtn.addEventListener('click', ()=>{ cartEl.classList.toggle('hidden'); cartEl.removeAttribute('aria-hidden'); });
closeCartBtn && closeCartBtn.addEventListener('click', ()=> cartEl.classList.add('hidden'));
checkoutBtn.addEventListener('click', ()=> { checkoutModal.classList.remove('hidden'); checkoutModal.removeAttribute('aria-hidden'); });
el('#cancel-checkout').addEventListener('click', ()=> checkoutModal.classList.add('hidden'));
checkoutForm.addEventListener('submit', e=>{
  e.preventDefault();
  // 模擬送出訂單 — 在實務上此處會呼叫後端 API 建立訂單/付款
  const form = new FormData(checkoutForm);
  const name = form.get('name');
  const email = form.get('email');
  const address = form.get('address');
  const order = { name, email, address, items: cart, total: cartTotalEl.textContent, createdAt: new Date().toISOString() };
  // 顯示結果
  checkoutModal.classList.add('hidden');
  orderMessage.textContent = `感謝 ${name}，我們已收到訂單（模擬）總金額 NT$ ${order.total}。確認信會寄到 ${email}.`;
  orderResult.classList.remove('hidden');
  // 清空
  cart = {}; persistCart(); updateCartUI();
});
closeResult.addEventListener('click', ()=> orderResult.classList.add('hidden'));

// 初始化
renderProducts();
updateCartUI();
