// Carregar módulo do express
const express = require("express");

// Criar servidor
const server = express();

// Permite usar json no body do post
server.use(express.json());

let countRequests = 0;

// Array de objetos projects.
const projects = [
  {
    id: "1",
    title: "Projeto 1",
    tasks: ["Tarefa 1-1"]
  },
  {
    id: "2",
    title: "Projeto 2",
    tasks: ["Tarefa 1-2"]
  },
  {
    id: "3",
    title: "Projeto 3",
    tasks: ["Tarefa 1-3"]
  }
];

// Midleware para tratar todas as requisiçòes
server.use((request, response, next) => {
  console.log(request.url);

  next();
});

// GET /projects: Rota que lista todos projetos e suas tarefas;
server.get("/projects", countRequestsMidleware, (request, response) => {
  return response.json(projects);
});

// POST /projects: A rota deve receber id e title dentro do corpo
// e cadastrar um novo projeto dentro de um array no seguinte formato: { id: "1", title: 'Novo projeto', tasks: [] };
// Certifique-se de enviar tanto o ID quanto o título do projeto no formato string com aspas duplas.
server.post("/projects", countRequestsMidleware, (request, response) => {
  // Recupera atributos no body
  const { id, title } = request.body;

  // Novo projeto com atributos
  const project = {
    id: id,
    title: title,
    tasks: []
  };

  // Adiciona no array de projetos
  projects.push(project);

  // Response 200 = OK
  return response.status(200).send("Projeto adicionado!");
});

// PUT /projects/:id: A rota deve alterar apenas o título do projeto com o id presente nos parâmetros da rota;
server.put("/projects/:id", countRequestsMidleware, (request, response) => {
  // Recupera id da rota do request
  const id = request.params.id;

  // Recupera title no body
  const { title } = request.body;

  // Recupera indice do projeto no array
  const index = projects.findIndex(project => project.id == id);

  // Altera title do projeto
  projects[index].title = title;

  // Response 200 = OK
  return response
    .status(200)
    .json({ message: "Projeto atualizado!", project: projects[index] });
});

// DELETE /projects/:id: A rota deve deletar o projeto com o id presente nos parâmetros da rota;
server.delete("/projects/:id", countRequestsMidleware, (request, response) => {
  // Recupera id da rota do request
  const id = request.params.id;

  // Recupera indice do projeto no array
  const index = projects.findIndex(project => project.id == id);

  // Remove projeto na posição de index somente 1
  projects.slice(index, 1);

  // Response 200 = OK
  return response.json({
    message: `Projeto id: ${index} removido!`,
    projetos: projects
  });
});

// POST /projects/:id/tasks: A rota deve receber um campo title e armazenar uma nova tarefa
//     no array de tarefas de um projeto específico escolhido através do id presente nos parâmetros da rota;
server.post(
  "/projects/:id/tasks",
  countRequestsMidleware,
  (request, response) => {
    // Recupera id da rota do request
    const id = request.params.id;

    // Recupera title e tasks no body
    const { title } = request.body;

    // Recupera indice do projeto no array
    const index = projects.findIndex(project => project.id == id);

    // Altera tasks do projeto
    projects[index].tasks = [title];

    // Response 200 = OK
    return response.status(200).json({
      message: "Projeto atualizado com tarefas!",
      project: projects[index]
    });
  }
);

function countRequestsMidleware(request, response, next) {
  countRequests++;

  console.log(`Requisições: ${countRequests}`);

  return next();
}

// Definir porta
server.listen(3030);
