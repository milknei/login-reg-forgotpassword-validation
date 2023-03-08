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
});

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
  : [{ email: "admin@gmail.com", password: "Admin!123", isRemembered: false, hasAcceptedTerms: true }];
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

  loginEmail.oninput = () => {
    isLoginValid();
    buttonAvailable();
  };

  loginPassword.oninput = () => {
    isPasswordValid();
    buttonAvailable();
  };
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
      loginForm.reset();
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

const registrationEmail = registrationForm.email;
const registrationPassword = registrationForm.password;
const registrationRepeatPassword = registrationForm.repeatPassword;
const registrationTermsAgreed = registrationForm.registrationTerms;

const registrationSubmitButton = registrationForm.submitButton;

const registrationEmailErrorMessage = registrationForm.querySelector(".form-error-email span");
const registrationPasswordErrorMessage = registrationForm.querySelector(".form-error-password span");
const registrationGeneralErrorMessage = registrationForm.querySelector(".form-error-general span");

registrationPasswordErrorMessage.parentElement.style.color = "#ffd75d";

function handleRegistrationValidation() {
  function isEmailValid() {
    if (!registrationEmail.value) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationEmailErrorMessage.textContent = "Please, enter your Email";
      registrationEmailErrorMessage.parentElement.classList.add("active");
    } else if (!emailRegex.test(registrationEmail.value)) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationEmailErrorMessage.textContent = "It doesn't look like real email";
      registrationEmailErrorMessage.parentElement.classList.add("active");
    } else {
      registrationEmailErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  isEmailValid();

  function isPasswordValid() {
    if (!registrationPassword.value) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationPasswordErrorMessage.textContent = "Please, create your Password";
      registrationPasswordErrorMessage.parentElement.classList.remove("two-lines");
      registrationPasswordErrorMessage.parentElement.querySelector("i").classList.remove("fa-circle-info");
      registrationPasswordErrorMessage.parentElement.querySelector("i").classList.add("fa-circle-exclamation");
      registrationPasswordErrorMessage.parentElement.style.color = "rgb(255, 131, 131)";
      registrationPasswordErrorMessage.parentElement.classList.add("active");
    } else if (!passwordRegex.test(registrationPassword.value)) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationPasswordErrorMessage.innerHTML =
        "Must be 8+ digits and include:<br />Capital letter, a Number, a Special character";
      registrationPasswordErrorMessage.parentElement.classList.add("two-lines");
      registrationPasswordErrorMessage.parentElement.querySelector("i").classList.add("fa-circle-info");
      registrationPasswordErrorMessage.parentElement.querySelector("i").classList.remove("fa-circle-exclamation");
      registrationPasswordErrorMessage.parentElement.style.color = "rgb(255, 131, 131)";
      registrationPasswordErrorMessage.parentElement.classList.add("active");
    } else {
      registrationPasswordErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  isPasswordValid();

  function arePasswordsMatch() {
    if (!registrationRepeatPassword.value) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationGeneralErrorMessage.textContent = "Please, repeat your new Password";
      registrationGeneralErrorMessage.parentElement.classList.add("active");
    } else if (registrationRepeatPassword.value !== registrationPassword.value) {
      registrationSubmitButton.setAttribute("disabled", true);
      registrationGeneralErrorMessage.textContent = "Your passwords doesn't match";
      registrationGeneralErrorMessage.parentElement.classList.add("active");
    } else {
      registrationGeneralErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  arePasswordsMatch();

  function buttonAvailable() {
    if (
      passwordRegex.test(registrationPassword.value) &&
      emailRegex.test(registrationEmail.value) &&
      registrationRepeatPassword.value === registrationPassword.value
    )
      registrationSubmitButton.removeAttribute("disabled");
  }

  registrationEmail.oninput = () => {
    isEmailValid();
    buttonAvailable();
  };

  registrationPassword.oninput = () => {
    isPasswordValid();
    arePasswordsMatch();
    buttonAvailable();
  };

  registrationRepeatPassword.oninput = () => {
    arePasswordsMatch();
    buttonAvailable();
  };
}

function isAgreedTurms() {
  if (!registrationTermsAgreed.checked) {
    registrationSubmitButton.setAttribute("disabled", true);
    registrationGeneralErrorMessage.textContent = "Please, agree to our Terms and Conditions";
    registrationGeneralErrorMessage.parentElement.classList.add("active");
  } else {
    registrationGeneralErrorMessage.parentElement.classList.remove("active");
    return true;
  }
}

function handleRegistrationSubmit() {
  let isUser = !!users.find((user) => user.email === registrationEmail.value);
  if (!isUser && registrationTermsAgreed.checked) {
    users.push({
      email: registrationEmail.value,
      password: registrationPassword.value,
      isRemembered: false,
      hasAcceptedTerms: true,
    });
    localStorage.setItem("users", JSON.stringify(users));
    loggedInNavigation.classList.add("active");
    formPopupButton.classList.remove("active");
    formCloseButton.click();
    registrationForm.reset();
  } else if (isUser) {
    registrationEmailErrorMessage.textContent = "This email is already used";
    registrationEmailErrorMessage.parentElement.classList.add("active");
    registrationSubmitButton.setAttribute("disabled", true);
  } else {
    registrationSubmitButton.setAttribute("disabled", true);
    registrationGeneralErrorMessage.textContent = "Please, agree to our Terms and Conditions";
    registrationGeneralErrorMessage.parentElement.classList.add("active");
    registrationTermsAgreed.oninput = () => {
      if (!registrationTermsAgreed.checked) {
        registrationSubmitButton.setAttribute("disabled", true);
        registrationGeneralErrorMessage.textContent = "Please, agree to our Terms and Conditions";
        registrationGeneralErrorMessage.parentElement.classList.add("active");
      } else {
        registrationGeneralErrorMessage.parentElement.classList.remove("active");
        registrationSubmitButton.disabled = false;
      }
    };
  }
}

registrationForm.addEventListener("submit", (event) => {
  event.preventDefault();
  handleRegistrationValidation();
  if (registrationSubmitButton.disabled === false) {
    handleRegistrationSubmit();
  }
});

const resetPasswordEmail = resetPasswordForm.email;
const resetPasswordErrorMessage = resetPasswordForm.querySelector(".form-error-message");
const resetPasswordMessage = resetPasswordForm.querySelector(".reset-password-message");
const resetPasswordSubmitButton = resetPasswordForm.submitButton;

function resetPasswordValidaion() {
  function isEmailValid() {
    if (!resetPasswordEmail.value) {
      resetPasswordSubmitButton.setAttribute("disabled", true);
      resetPasswordErrorMessage.textContent = "Please, enter your Email";
      resetPasswordErrorMessage.parentElement.classList.add("active");
    } else if (!emailRegex.test(resetPasswordEmail.value)) {
      resetPasswordSubmitButton.setAttribute("disabled", true);
      resetPasswordErrorMessage.textContent = "It doesn't look like real email";
      resetPasswordErrorMessage.parentElement.classList.add("active");
    } else {
      resetPasswordSubmitButton.disabled = false;
      resetPasswordErrorMessage.parentElement.classList.remove("active");
      return true;
    }
  }
  isEmailValid();
}

function handleResetPasswordSubmit() {
  let isUser = !!users.find((user) => user.email === resetPasswordEmail.value);
  if (isUser) {
    resetPasswordMessage.classList.add("active");
    resetPasswordForm.reeset();
  } else if (!isUser) {
    resetPasswordSubmitButton.setAttribute("disabled", true);
    resetPasswordErrorMessage.textContent = "There is no account with such email";
    resetPasswordErrorMessage.parentElement.classList.add("active");
    resetPasswordEmail.oninput = () => resetPasswordValidaion();
  }
}

resetPasswordForm.addEventListener("submit", (event) => {
  event.preventDefault();
  resetPasswordValidaion();
  resetPasswordEmail.oninput = () => resetPasswordValidaion();
  if (resetPasswordSubmitButton.disabled === false) {
    handleResetPasswordSubmit();
  }
});