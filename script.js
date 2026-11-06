const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".navigation");

menuToggle.addEventListener("click", () => {
  const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isExpanded));
  menuToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navigation.classList.toggle("is-open", !isExpanded);
});

navigation.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    navigation.classList.remove("is-open");
  });
});

document.querySelector("#current-year").textContent = new Date().getFullYear();

document.querySelectorAll("[data-mail-form]").forEach((form) => {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const subject = `${formData.get("form_type")} — RK Farmhouse`;
    const message = [...formData.entries()]
      .filter(([key]) => key !== "form_type")
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n");
    const mailto = `mailto:hello@rkfarmhouse.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
    const status = form.querySelector(".form-status");

    window.location.href = mailto;
    status.textContent = "Your email app should open with your message ready to send. If it doesn't, write to hello@rkfarmhouse.in.";
  });
});
