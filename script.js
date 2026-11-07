const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

menuToggle?.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  });
});

const currentYear = document.querySelector("#current-year");
if (currentYear) currentYear.textContent = new Date().getFullYear();

document.querySelectorAll("[data-whatsapp-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const message = [...formData.entries()]
      .filter(([key]) => key !== "form_type")
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const request = `${formData.get("form_type")} — RK Farmer’s House\n${message}`;
    const whatsappUrl = `https://wa.me/917382765588?text=${encodeURIComponent(request)}`;
    const status = form.querySelector(".form-status");

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    const fallbackLink = document.createElement("a");
    fallbackLink.href = whatsappUrl;
    fallbackLink.target = "_blank";
    fallbackLink.rel = "noopener noreferrer";
    fallbackLink.textContent = "Open WhatsApp";
    status.replaceChildren(
      document.createTextNode("WhatsApp should open with your message ready to send. "),
      fallbackLink,
      document.createTextNode(" or call 73827 65588.")
    );
  });
});

const catalogPage = document.querySelector(".catalog-page");

if (catalogPage) {
  const cart = new Map();
  const cartPanel = document.createElement("aside");
  cartPanel.className = "cart-panel";
  cartPanel.id = "shopping-cart";
  cartPanel.hidden = true;
  cartPanel.setAttribute("aria-label", "Shopping cart");
  cartPanel.innerHTML = `
    <div class="cart-heading">
      <div><p class="eyebrow"><span></span> Your selection</p><h2>Your cart</h2></div>
      <div class="cart-heading-actions">
        <button class="cart-clear" type="button">Clear all</button>
        <button class="cart-close" type="button" aria-label="Close cart">×</button>
      </div>
    </div>
    <div class="cart-items" aria-live="polite">
      <p class="cart-empty">Your cart is empty.</p>
    </div>
    <div class="cart-summary">
      <span>Listed-price subtotal</span>
      <strong class="cart-total">₹0</strong>
    </div>
    <p class="cart-note" hidden>Items without a listed price will be confirmed on WhatsApp.</p>
    <a class="button button-dark cart-checkout" href="#" target="_blank" rel="noopener noreferrer">Order on WhatsApp <span aria-hidden="true">↗</span></a>
  `;
  const cartToggle = document.createElement("button");
  cartToggle.className = "cart-toggle";
  cartToggle.type = "button";
  cartToggle.setAttribute("aria-controls", "shopping-cart");
  cartToggle.setAttribute("aria-expanded", "false");
  cartToggle.hidden = true;
  document.body.append(cartPanel, cartToggle);

  const formatPrice = (amount) => `₹${amount.toLocaleString("en-IN")}`;

  function renderCart() {
    const items = [...cart.values()];
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce(
      (sum, item) => sum + (item.unitPrice ?? 0) * item.quantity,
      0
    );
    const needsQuote = items.some((item) => item.unitPrice === null);

    cartToggle.hidden = itemCount === 0;
    cartToggle.textContent = `＋  Cart · ${itemCount} · ${formatPrice(subtotal)}${needsQuote ? " + quote" : ""}`;
    cartToggle.setAttribute(
      "aria-label",
      `Open cart: ${itemCount} item${itemCount === 1 ? "" : "s"}, listed-price subtotal ${formatPrice(subtotal)}${needsQuote ? ", plus items requiring a price quote" : ""}`
    );
    cartPanel.querySelector(".cart-total").textContent = formatPrice(subtotal);
    cartPanel.querySelector(".cart-note").hidden = !needsQuote;

    const cartItems = cartPanel.querySelector(".cart-items");
    cartItems.replaceChildren();
    cartPanel.querySelector(".cart-clear").disabled = items.length === 0;
    cartPanel.querySelector(".cart-checkout").hidden = items.length === 0;
    if (items.length === 0) {
      const emptyMessage = document.createElement("p");
      emptyMessage.className = "cart-empty";
      emptyMessage.textContent = "Your cart is empty.";
      cartItems.append(emptyMessage);
    }

    items.forEach((item) => {
      const row = document.createElement("article");
      row.className = "cart-item";
      const itemInfo = document.createElement("div");
      itemInfo.className = "cart-item-info";
      const title = document.createElement("strong");
      title.textContent = item.name;
      const pack = document.createElement("span");
      pack.textContent = `${item.pack} · ${item.unitPrice === null ? "Price to confirm" : `${formatPrice(item.unitPrice)} each`}`;
      const lineTotal = document.createElement("b");
      lineTotal.textContent = item.unitPrice === null
        ? "Price to confirm"
        : formatPrice(item.unitPrice * item.quantity);
      itemInfo.append(title, pack, lineTotal);

      const quantity = document.createElement("div");
      quantity.className = "cart-quantity";
      quantity.setAttribute("aria-label", `Quantity for ${item.name}, ${item.pack}`);
      const decrease = document.createElement("button");
      decrease.type = "button";
      decrease.textContent = "−";
      decrease.setAttribute("aria-label", `Remove one ${item.name}`);
      decrease.addEventListener("click", () => {
        if (item.quantity === 1) cart.delete(item.id);
        else item.quantity -= 1;
        renderCart();
      });
      const count = document.createElement("span");
      count.textContent = String(item.quantity);
      count.setAttribute("aria-live", "polite");
      const increase = document.createElement("button");
      increase.type = "button";
      increase.textContent = "+";
      increase.setAttribute("aria-label", `Add one ${item.name}`);
      increase.addEventListener("click", () => {
        item.quantity += 1;
        renderCart();
      });
      quantity.append(decrease, count, increase);
      row.append(itemInfo, quantity);
      cartItems.append(row);
    });

    const orderLines = items.map((item) => {
      const unit = item.unitPrice === null ? "price to confirm" : `${formatPrice(item.unitPrice)} each`;
      const lineTotal = item.unitPrice === null
        ? "line total to confirm"
        : `${formatPrice(item.unitPrice * item.quantity)} line total`;
      return `• ${item.name} — ${item.pack} × ${item.quantity} — ${unit} — ${lineTotal}`;
    });
    const message = [
      "Hi RK Farmer’s House, I’d like to place this order:",
      "",
      ...orderLines,
      "",
      `Listed-price subtotal: ${formatPrice(subtotal)}`,
      ...(needsQuote ? ["Please confirm prices and availability for items marked price to confirm."] : []),
    ].join("\n");
    cartPanel.querySelector(".cart-checkout").href =
      items.length > 0
        ? `https://wa.me/917382765588?text=${encodeURIComponent(message)}`
        : "#";
  }

  function addCartButton(name, pack, unitPrice) {
    const id = `${name}|${pack}`;
    const button = document.createElement("button");
    button.className = "add-to-cart";
    button.type = "button";
    button.textContent = "+";
    button.setAttribute("aria-label", `Add ${name}, ${pack}, ${unitPrice === null ? "price to confirm" : formatPrice(unitPrice)} to cart`);
    button.addEventListener("click", () => {
      const existing = cart.get(id);
      if (existing) existing.quantity += 1;
      else cart.set(id, { id, name, pack, unitPrice, quantity: 1 });
      renderCart();
      cartToggle.setAttribute("aria-expanded", "true");
      cartPanel.hidden = false;
    });
    return button;
  }

  catalogPage.querySelectorAll(".catalog-item:not(.catalog-item-availability)").forEach((row) => {
    const name = row.querySelector("strong").textContent.trim();
    const pack = row.querySelector("span:not(.no-discount)").textContent.trim();
    const amount = Number(row.querySelector("b").textContent.replace(/[^\d]/g, ""));
    row.append(addCartButton(name, pack, amount));
  });

  catalogPage.querySelectorAll(".produce-card").forEach((card) => {
    const name = card.querySelector("h3").textContent.trim();
    const button = addCartButton(name, "As requested", null);
    card.querySelector("div").append(button);
  });

  cartToggle.addEventListener("click", () => {
    const isOpen = cartToggle.getAttribute("aria-expanded") === "true";
    cartToggle.setAttribute("aria-expanded", String(!isOpen));
    cartPanel.hidden = isOpen;
    if (!isOpen) cartPanel.querySelector(".cart-close").focus();
  });

  cartPanel.querySelector(".cart-close").addEventListener("click", () => {
    cartPanel.hidden = true;
    cartToggle.setAttribute("aria-expanded", "false");
    cartToggle.focus();
  });

  cartPanel.querySelector(".cart-clear").addEventListener("click", () => {
    cart.clear();
    renderCart();
  });

  renderCart();
}
