async function realizarCargaAutomatica() {
  const token = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `${token.split("=")[1]}`;
  }
  try {
    await fetch("http://localhost:4000/api/carga-automatica/", {
      method: "POST",
      headers,
    });
  } catch (error) {
    console.error("Erro ao fazer a carga automática:", error);
  }
}

const btnVisualizar = document.querySelector("#btnCarga");
btnVisualizar.addEventListener("click", realizarCargaAutomatica);
