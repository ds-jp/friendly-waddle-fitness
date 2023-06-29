document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("cadastro-form");
  const loginButton = document.querySelector(
    '#login-form button[type="submit"]'
  );
  const registerButton = document.querySelector(
    '#cadastro-form button[type="submit"]'
  );
  const nameField = document.getElementById("nome");
  const nameInput = document.getElementById("nome");
  const signupLink = document.getElementById("cadastre-se-link");
  const loginLink = document.getElementById("entre-link");
  const logoutSection = document.getElementById("logout-section");
  const logoutButton = document.getElementById("logout-button");

  const showLoginForm = () => {
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    loginButton.style.display = "block";
    registerButton.style.display = "none";
    nameField.style.display = "none";
    clearFields();
  };

  const showRegisterForm = () => {
    loginForm.style.display = "none";
    registerForm.style.display = "block";
    loginButton.style.display = "none";
    registerButton.style.display = "block";
    nameField.style.display = "block";
    clearFields();
  };

  const showAlert = (message) => {
    alert(message);
  };

  const clearFields = () => {
    nameInput.value = "";
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
    document.getElementById("email-cadastro").value = "";
    document.getElementById("password-cadastro").value = "";
  };

  const removeCookie = (name) => {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const senha = document.getElementById("password").value;

    fetch("http://localhost:4000/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, senha }),
    })
      .then(function (response) {
        if (response.ok) {
          showAlert("Login realizado com sucesso");
          showLoginForm();
          setLogoutButton();
          return response.json();
        } else {
          response.json().then(function (data) {
            if (data.error) {
              showAlert(`Não foi possível realizar o login: ${data.error}`);
            } else {
              showAlert("Não foi possível realizar o login");
            }
          });
        }
      })
      .then(function (data) {
        if (data && data.token) {
          document.cookie = `token=${data.token}`;
        }
      })
      .catch(function (error) {
        showAlert("Ocorreu um erro ao realizar o login");
      });
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    const nome = nameInput.value;
    const email = document.getElementById("email-cadastro").value;
    const senha = document.getElementById("password-cadastro").value;

    fetch("http://localhost:4000/api/usuarios/criar", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, senha }),
    })
      .then(function (response) {
        if (response.ok) {
          showAlert("Cadastro realizado com sucesso");
          showLoginForm();
        } else {
          response.json().then(function (data) {
            let errorMessage = "Não foi possível realizar o cadastro";
            if (data && (data.error || data.errors)) {
              errorMessage = `${errorMessage}: ${data.error || data.errors}`;
            }
            showAlert(errorMessage);
          });
        }
      })
      .catch(function (error) {
        showAlert("Ocorreu um erro ao realizar o cadastro");
      });
  };

  const handleLogout = async () => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = token.split("=")[1];
    }

    fetch("http://localhost:4000/api/usuarios/logout", {
      method: "POST",
      headers: headers,
    })
      .then(function (response) {
        if (response.ok) {
          showAlert("Logout realizado com sucesso");
          showLoginForm();
          removeLogoutButton();
          removeCookie("token");
        } else {
          showAlert("Não foi possível realizar o logout");
        }
      })
      .catch(function (error) {
        showAlert("Ocorreu um erro ao realizar o logout");
      });
  };

  const setLogoutButton = () => {
    logoutSection.style.display = "block";
    logoutButton.addEventListener("click", handleLogout);
    document.querySelector(".form-login").style.display = "none";
  };

  const removeLogoutButton = () => {
    logoutSection.style.display = "none";
    logoutButton.removeEventListener("click", handleLogout);
    document.querySelector(".form-login").style.display = "block";
  };

  loginForm.addEventListener("submit", handleLogin);
  registerForm.addEventListener("submit", handleRegister);

  signupLink.addEventListener("click", (event) => {
    event.preventDefault();
    showRegisterForm();
  });

  loginLink.addEventListener("click", (event) => {
    event.preventDefault();
    showLoginForm();
  });

  const token = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  if (token) {
    setLogoutButton();
  } else {
    showLoginForm();
  }
});
