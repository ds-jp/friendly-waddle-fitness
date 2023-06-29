function renderCategorias(categorias) {
  const tbody = document.querySelector("#categoriasTable tbody");
  tbody.innerHTML = "";

  categorias.forEach((categoria) => {
    const row = document.createElement("tr");

    const idCell = document.createElement("td");
    idCell.textContent = categoria.id;
    row.appendChild(idCell);

    const nomeCell = document.createElement("td");
    nomeCell.textContent = categoria.nome;
    row.appendChild(nomeCell);

    const acoesCell = document.createElement("td");

    const alterarLink = document.createElement("a");
    alterarLink.href = `categorias/alterar?id=${categoria.id}`;
    alterarLink.textContent = "Alterar";
    acoesCell.appendChild(alterarLink);

    const excluirLink = document.createElement("a");
    excluirLink.href = "#";
    excluirLink.textContent = "Excluir";
    excluirLink.dataset.id = categoria.id;
    excluirLink.classList.add("excluir-categoria");
    acoesCell.appendChild(excluirLink);

    row.appendChild(acoesCell);

    tbody.appendChild(row);
  });
}

function excluirCategoria(categoriaId) {
  if (confirm("Deseja realmente excluir esta categoria?")) {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));
    const headers = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers["Authorization"] = token.split("=")[1];
    }
    fetch(`http://localhost:4000/api/categorias/${categoriaId}`, {
      method: "DELETE",
      headers: headers,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error || data.errors) {
          let errorMessage = "Não foi possível excluir a categoria";
          if (data && (data.error || data.errors)) {
            errorMessage = `${errorMessage}: ${data.error || data.errors}`;
          }
          showAlert(errorMessage);
        } else {
          showAlert("Categoria excluída com sucesso");
          listarCategorias();
        }
      })
      .catch((error) => {
        showAlert("Ocorreu um erro ao excluir a categoria");
        console.error(error);
      });
  }
}

function listarCategorias() {
  const token = document.cookie
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = token.split("=")[1];
  }
  fetch("http://localhost:4000/api/categorias/", {
    method: "GET",
    headers: headers,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.error || data.errors) {
        let errorMessage = "Não foi possível resgatar as categorias";
        if (data && (data.error || data.errors)) {
          errorMessage = `${errorMessage}: ${data.error || data.errors}`;
        }
        showAlert(errorMessage);
      } else {
        renderCategorias(data);
      }
    })
    .catch((error) => {
      showAlert("Ocorreu um erro ao obter as categorias");
      console.error(error);
    });
}

function showAlert(message) {
  alert(message);
}

document.addEventListener("DOMContentLoaded", () => {
  const btnInserirCategoria = document.querySelector("#btnInserirCategoria");
  const table = document.querySelector("#categoriasTable");
  const headers = table.querySelectorAll("th");

  btnInserirCategoria.addEventListener("click", () => {
    location.href = "/categorias/inserir";
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

      const sortedCategorias = Array.from(
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
      sortedCategorias.forEach((categoria) => {
        table.querySelector("tbody").appendChild(categoria);
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("excluir-categoria")) {
      event.preventDefault();
      const categoriaId = event.target.dataset.id;
      excluirCategoria(categoriaId);
    }
  });

  listarCategorias();
});
