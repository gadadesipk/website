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
