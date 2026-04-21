# TaskFlow — Team Task & Project Management System

> **SESD Course Project** · Full Stack Application  
> Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**  
> **Live Demo:** [https://sesd-project-ayush.onrender.com](https://sesd-project-ayush.onrender.com)

---

## 📌 Overview

TaskFlow is a modern, role-based project management platform designed for engineering teams. It demonstrates clean software engineering principles including OOP, design patterns (Singleton, Repository, Factory), and layered architecture.

## 🏗️ Architecture

core/
├── models/         # Domain Entities (User abstract class, Admin, Developer, Task, Project)
├── repositories/   # Data Access Layer (IRepository<T> interface + implementations)
├── services/       # Business Logic Layer (TaskService, ProjectService)
└── db/             # Singleton In-Memory Database

app/
├── api/            # RESTful Controller Layer (tasks, projects)
├── layout.tsx      # Root Layout
└── page.tsx        # Dashboard UI (Role-based Sprint Board)

## 🎯 OOP Principles Demonstrated

| Principle       | Implementation                                            |
|----------------|-----------------------------------------------------------|
| Abstraction    | `User` abstract class with `getPermissions()` contract    |
| Inheritance    | `Admin` and `Developer` extend `User`                     |
| Polymorphism   | Runtime dispatch of `getPermissions()` per role            |
| Encapsulation  | Repository pattern hides data store internals              |

## 🔧 Design Patterns

- **Singleton** — `Database.getInstance()` ensures a single data store
- **Repository** — `IRepository<T>` generic interface decouples data access
- **Dependency Injection** — Services receive repositories via constructor, enabling loose coupling
- **Service Layer** — Business rules enforced before data mutations

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📄 Documentation

- [idea.md](./idea.md) — Project scope & key features
- [useCaseDiagram.md](./useCaseDiagram.md) — Use Case Diagram
- [sequenceDiagram.md](./sequenceDiagram.md) — Sequence Diagram (end-to-end flow)
- [classDiagram.md](./classDiagram.md) — Class Diagram
- [ErDiagram.md](./ErDiagram.md) — ER Diagram

## 📡 API Endpoints

| Method  | Endpoint           | Description          |
|---------|--------------------|----------------------|
| GET     | `/api/tasks`       | List all tasks       |
| POST    | `/api/tasks`       | Assign a new task    |
| PATCH   | `/api/tasks/:id`   | Update task status   |
| GET     | `/api/projects`    | List all projects    |
| POST    | `/api/projects`    | Create new project   |

## 👤 Author

**Ayush Shukla**
