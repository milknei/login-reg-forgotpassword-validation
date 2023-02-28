const wrapper = document.querySelector(".wrapper");
const loginLink = document.querySelector(".login-link");
const registrationLink = document.querySelector(".registration-link");

registrationLink.addEventListener("click", () => {
  wrapper.classList.remove("wrapper-login");
  wrapper.classList.add("wrapper-registration");
})

loginLink.addEventListener("click", () => {
  wrapper.classList.remove("wrapper-registration");
  wrapper.classList.add("wrapper-login");
})