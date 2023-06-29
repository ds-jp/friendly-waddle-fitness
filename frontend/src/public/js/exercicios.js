function renderExercicios(exercicios) {
  const tbody = document.querySelector("#exerciciosTable tbody");
  tbody.innerHTML = "";

  exercicios.forEach((exercicio) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = exercicio.id;
    row.appendChild(idCell);

    const nomeCell = document.createElement("td");
    nomeCell.textContent = exercicio.nome;
    row.appendChild(nomeCell);

    const descricaoCell = document.createElement("td");
    descricaoCell.textContent = exercicio.descricao;
    row.appendChild(descricaoCell);

    const dificuldadeCell = document.createElement("td");
    dificuldadeCell.textContent = exercicio.dificuldade;
    row.appendChild(dificuldadeCell);

    const categoriaCell = document.createElement("td");
    if (exercicio.categoria_id) {
      const token = document.cookie
        .split(";")
        .find((cookie) => cookie.trim().startsWith("token="));
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers["Authorization"] = token.split("=")[1];
      }
      fetch(`http://localhost:4000/api/categorias/${exercicio.categoria_id}`, {
        headers: headers,
      })
        .then((response) => response.json())
        .then((categoria) => {
          categoriaCell.textContent = categoria.nome;
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      categoriaCell.textContent = "-";
    }

    row.appendChild(categoriaCell);

    const acoesCell = document.createElement("td");

    const editarLink = document.createElement("a");
    editarLink.href = `/exercicios/alterar?id=${exercicio.id}`;
    editarLink.textContent = "Editar";
    acoesCell.appendChild(editarLink);

    const excluirLink = document.createElement("a");
    excluirLink.href = "#";
    excluirLink.textContent = "Excluir";
    excluirLink.dataset.id = exercicio.id;
    excluirLink.classList.add("excluir-exercicio");
    acoesCell.appendChild(excluirLink);

    row.appendChild(acoesCell);

    tbody.appendChild(row);
  });
}

function showAlert(message) {
  alert(message);
}

function excluirExercicio(exercicioId) {
  if (confirm("Deseja realmente excluir este exercício?")) {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = token.split("=")[1];
    }
    fetch(`http://localhost:4000/api/exercicios/${exercicioId}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.errors) {
          let errorMessage = "Não foi possível excluir o exercício";
          if (data && (data.error || data.errors)) {
            errorMessage = `${errorMessage}: ${data.error || data.errors}`;
          }
          showAlert(errorMessage);
        } else {
          showAlert("Exercício excluído com sucesso");
          preencherTabelaExercicios();
        }
      })
      .catch((error) => {
        showAlert("Ocorreu um erro ao excluir o exercício");
        console.error(error);
      });
  }
}

function preencherTabelaExercicios() {
  const token = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = token.split("=")[1];
  }
  fetch("http://localhost:4000/api/exercicios/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error || data.errors) {
        let errorMessage = "Não foi possível resgatar os exercícios";
        if (data && (data.error || data.errors)) {
          errorMessage = `${errorMessage}: ${data.error || data.errors}`;
        }
        showAlert(errorMessage);
      } else {
        renderExercicios(data);
      }
    })
    .catch((error) => {
      showAlert("Ocorreu um erro ao obter os exercícios");
      console.error(error);
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const btnInserirExercicio = document.querySelector("#btnInserirExercicio");
  const table = document.querySelector("#exerciciosTable");
  const headers = table.querySelectorAll("th");

  btnInserirExercicio.addEventListener("click", () => {
    location.href = "/exercicios/inserir";
  });

  headers.forEach((header) => {
    header.addEventListener("click", () => {
      const order = header.dataset.order;
      const column = header.dataset.column;

      if (order === "asc") {
        header.dataset.order = "desc";
        header.classList.add("desc");
      } else {
        header.dataset.order = "asc";
        header.classList.remove("desc");
      }

      const sortedExercicios = Array.from(
        table.querySelectorAll("tbody tr")
      ).sort((a, b) => {
        const aValue = a.querySelector(`td:nth-child(${column})`).textContent;
        const bValue = b.querySelector(`td:nth-child(${column})`).textContent;
        if (order === "asc") {
          if (column === "1") {
            return parseInt(aValue) - parseInt(bValue);
          } else {
            return aValue.localeCompare(bValue);
          }
        } else {
          if (column === "1") {
            return parseInt(bValue) - parseInt(aValue);
          } else {
            return bValue.localeCompare(aValue);
          }
        }
      });

      table.querySelector("tbody").innerHTML = "";
      sortedExercicios.forEach((exercicio) => {
        table.querySelector("tbody").appendChild(exercicio);
      });
    });
  });

  table.addEventListener("click", (event) => {
    if (event.target.classList.contains("excluir-exercicio")) {
      const exercicioId = event.target.dataset.id;
      excluirExercicio(exercicioId);
    }
  });

  preencherTabelaExercicios();
});
