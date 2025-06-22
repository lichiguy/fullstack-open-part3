const express = require("express");
const morgan = require("morgan");
const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

morgan.token("body", (request) => {
  if (request.body) {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

app.use(express.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

const getPersonsNumber = () => {
  return persons.length;
};

app.get("/info", (request, response) => {
  const number = getPersonsNumber();
  const date = Date();
  response.send(
    `<p>Phonebook has info for ${number} people</p> <p>${date}</p>`
  );
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

const generateId = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
};

app.post("/api/persons", (request, response) => {
  const body = request.body;
  const nameMatches = persons.filter((person) => person.name === body.name);

  if (!body.name) {
    return response.status(400).json({
      error: "missing name",
    });
  } else if (!body.number) {
    return response.status(400).json({
      error: "missing number",
    });
  } else if (nameMatches.length > 0) {
    return response.status(400).json({
      error: "name must be unique",
    });
  }

  const person = {
    id: generateId(1000),
    name: body.name,
    number: body.number,
  };

  persons.concat(person);

  response.json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  persons = persons.filter((person) => person.id !== id);

  response.status(204).end();
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
