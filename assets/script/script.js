const formWrapper = document.querySelector(".form-wrapper");
const loginForm = document.forms.loginForm;
const registrationForm = document.forms.registrationForm;
const resetPasswordForm = document.forms.resetPasswordForm;
const formPopupButton = document.querySelector(".login-popup-button");
const formCloseButton = formWrapper.querySelector(".form-close-button");
const logOutButton = document.querySelector(".log-out-button");
const loggedInNavigation = document.querySelector(".navigation.logged-in");

// Form swipes to direction of the next form initial position:
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
logOutButton.addEventListener("click", () => {
  loggedInNavigation.classList.remove("active");
      formPopupButton.classList.add("active");
})

const changeFormLinks = formWrapper.querySelectorAll(".change-form-link");

function handleFormChange(element) {
  element.addEventListener("click", () => {
    const currentFormBox = element.closest(".form-box");
    const nextFormName = element.dataset.linkto;
    const nextFormBox = formWrapper.querySelector(`.${nextFormName}`);
    let hideToClass = "hidden-left";

    if (nextFormBox.classList.contains("hidden-right")) hideToClass = "hidden-right";

    nextFormBox.classList.remove(hideToClass);
    currentFormBox.classList.remove("active");
    currentFormBox.classList.add(hideToClass);
    nextFormBox.classList.add("active");
  });
}

changeFormLinks.forEach((link) => handleFormChange(link));

// Preventing labels merging with input values
const inputList = formWrapper.querySelectorAll("input");
inputList.forEach((input) => {
  input.onblur = () => (input.classList = input.value ? "not-empty" : "");
});

// Form validation:

// I'll use local storage for testing validations
let users = localStorage.getItem("users")
  ? JSON.parse(localStorage.getItem("users"))
  : [{ email: "admin@gmail.com", password: "Admin!123", isRemembered: false }];
localStorage.setItem("users", JSON.stringify(users));
users = JSON.parse(localStorage.getItem("users"));
console.log(users);

const loginEmail = loginForm.elements.email;
const loginPassword = loginForm.elements.password;
const loginRememberMe = loginForm.elements.loginRememberMe;
const loginSubmitButton = formWrapper.querySelector(".login-button");

const loginEmailErrorMessage = loginForm.querySelector(".form-error-email span");
const loginGeneralErrorMessage = loginForm.querySelector(".form-error-general span");

const emailRegex = new RegExp(/^(\D)+(\w)*((\.(\w)+)?)+@(\D)+(\w)*((\.(\D)+(\w)*)+)?(\.)[a-z]{2,}$/);

const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/);

function handleLoginValidation() {
  if (!loginEmail.value) {
    loginSubmitButton.setAttribute("disabled", true);
    loginEmailErrorMessage.textContent = "Please, enter your Email";
    loginEmailErrorMessage.parentElement.classList.add("active");
  } else loginEmailErrorMessage.parentElement.classList.remove("active");

  if (!loginPassword.value) {
    loginSubmitButton.setAttribute("disabled", true);
    loginGeneralErrorMessage.textContent = "Please, enter your Password";
    loginGeneralErrorMessage.parentElement.classList.add("active");
  } else loginEmailErrorMessage.parentElement.classList.remove("active");

  function isLoginValid() {
    if (!loginEmail.value) {
      loginEmailErrorMessage.textContent = "Please, enter your email";
      loginEmailErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    } else if (!emailRegex.test(loginEmail.value)) {
      loginEmailErrorMessage.textContent = "It doesn't look like real email";
      loginEmailErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    } else {
      loginEmailErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  isLoginValid();

  function isPasswordValid() {
    if (!loginPassword.value) {
      loginGeneralErrorMessage.textContent = "Please, enter your password";
      loginGeneralErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    } else if (!passwordRegex.test(loginPassword.value)) {
      loginGeneralErrorMessage.textContent = "We wouldn't let you make this password";
      loginGeneralErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    } else {
      loginGeneralErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  isPasswordValid();

  function buttonAvailable() {
    if (passwordRegex.test(loginPassword.value) && emailRegex.test(loginEmail.value))
      loginSubmitButton.removeAttribute("disabled");
  }

  loginEmail.onfocus = () => loginEmailErrorMessage.parentElement.classList.remove("active");
  loginPassword.onfocus = () => loginGeneralErrorMessage.parentElement.classList.remove("active");

  loginEmail.addEventListener("input", () => {
    isLoginValid();
    buttonAvailable();
  });

  loginPassword.addEventListener("input", () => {
    isPasswordValid();
    buttonAvailable();
  });
}

function loginAccountMatch() {
  users.forEach((user) => {
    if (loginEmail.value === user.email && loginPassword.value === user.password) {
      loggedInNavigation.classList.add("active");
      formPopupButton.classList.remove("active");
      if (loginRememberMe.checked) {
        user.isRemembered = true;
        localStorage.setItem("users", JSON.stringify(users));
      } else {
        user.isRemembered = false;
        localStorage.setItem("users", JSON.stringify(users));
      }
      formCloseButton.click();
    } else if (loginEmail.value === user.email) {
      loginGeneralErrorMessage.textContent = "Email and password doesn't match";
      loginGeneralErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    } else {
      loginEmailErrorMessage.textContent = "There's no account with such email";
      loginEmailErrorMessage.parentElement.classList.add("active");
      loginSubmitButton.setAttribute("disabled", true);
    }
  });
}

// The button will not be able until all neccessary fields are fullfield, meanwhile those fields are validated with "oninput" event early making the button available
loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleLoginValidation();
  if (loginSubmitButton.disabled === false) {
    loginAccountMatch();
  }
});
