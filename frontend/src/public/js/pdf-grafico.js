async function visualizarRelatorio() {
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
    const response = await fetch("http://localhost:4000/api/relatorio/", {
      headers,
    });
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    window.open(url);
  } catch (error) {
    console.error("Erro ao visualizar o relatório:", error);
  }
}

const btnVisualizar = document.querySelector("#btnVisualizar");
btnVisualizar.addEventListener("click", visualizarRelatorio);
