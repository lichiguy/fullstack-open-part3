require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const Person = require("./models/person");

const app = express();

let persons = [];

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

morgan.token("body", (request) => {
  if (request.body) {
    return JSON.stringify(request.body);
  } else {
    return " ";
  }
});

console.log(Person)
app.use(express.static("dist"));
app.use(requestLogger)
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);
app.use(express.json());

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
  Person.find({}).then((persons) => {
    console.log(response.body)
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then(person => response.json(person))
});

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

  const person = new Person({
    name: body.name,
    number: body.number,
  });

  person.save().then((savedPerson) => {
    response.json(savedPerson);
  });
});

app.delete("/api/persons/:id", (request, response) => {
  Person.findById(request.params.id).then((person) => {
    response.json(person);
  });
});

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
