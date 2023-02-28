const formWrapper = document.querySelector(".form-wrapper");
const loginForm = formWrapper.querySelector(".form-box.login");
const registrationForm = formWrapper.querySelector(".form-box.registration");
const resetPasswordForm = formWrapper.querySelector(".form-box.password-reset");
const formPopupButton = document.querySelector(".login-popup-button");
const formCloseButton = formWrapper.querySelector(".form-close-button");

function handleFormAppearence() {
  formWrapper.classList.toggle("active");

  loginForm.classList.remove("hidden-left", "hidden-right", "active");
  loginForm.classList.add("active");
  registrationForm.classList.remove("hidden-left", "hidden-right", "active");
  registrationForm.classList.add("hidden-right");
  resetPasswordForm.classList.remove("hidden-left", "hidden-right", "active");
  resetPasswordForm.classList.add("hidden-left");
}

formPopupButton.addEventListener("click", () => handleFormAppearence());
formCloseButton.addEventListener("click", () => handleFormAppearence());

const changeFormLinks = formWrapper.querySelectorAll(".change-form-link");

function handleFormChange(element) {
  element.addEventListener("click", () => {
    const currentFormBox = element.closest(".form-box");
    const nextFormName = element.dataset.linkto;
    const nextFormBox = formWrapper.querySelector(`.${nextFormName}`);
    let hideToClass = "hidden-left";

    if (nextFormBox.classList.contains("hidden-right"))
      hideToClass = "hidden-right";

    nextFormBox.classList.remove(hideToClass);
    currentFormBox.classList.remove("active");
    currentFormBox.classList.add(hideToClass);
    nextFormBox.classList.add("active");
  });
}

changeFormLinks.forEach((link) => handleFormChange(link));
