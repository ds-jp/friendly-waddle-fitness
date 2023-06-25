document
  .getElementById("form-email")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const nomeInput = document.querySelector('input[name="nome"]');
    const emailInput = document.querySelector('input[name="email"]');
    const assuntoInput = document.querySelector('input[name="assunto"]');
    const mensagemInput = document.querySelector('textarea[name="mensagem"]');
    const enviarButton = document.querySelector('button[type="submit"]');

    const nome = nomeInput.value;
    const email = emailInput.value;
    const assunto = assuntoInput.value;
    const mensagem = mensagemInput.value;

    enviarButton.disabled = true;
    enviarButton.textContent = "Enviando...";

    fetch("http://localhost:4000/api/enviar-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nome, email, assunto, mensagem }),
    })
      .then(function (response) {
        if (response.ok) {
          alert("E-mail enviado com sucesso.");
          nomeInput.value = "";
          emailInput.value = "";
          assuntoInput.value = "";
          mensagemInput.value = "";
          enviarButton.textContent = "Enviado!";
        } else {
          throw new Error("Ocorreu um erro ao enviar o e-mail.");
        }
      })
      .catch(function (error) {
        enviarButton.disabled = false;
        enviarButton.textContent = "Enviar";
        alert(error.message);
      });
  });
