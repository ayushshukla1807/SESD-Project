# Synapse — Enterprise Engineering Management System

> **SESD Course Project** · 6-Month Iterative Development (Oct 2025 - Apr 2026)  
> Built with **Next.js 15**, **TypeScript**, and **Tailwind CSS (Glassmorphism)**  
> **Live Demo:** [https://sesd-project-ayush.onrender.com](https://sesd-project-ayush.onrender.com)

---

## 📌 Overview

Synapse is a production-grade, role-based project management platform designed for high-performance engineering teams. Evolved over **6 months**, this project demonstrates deep architectural maturity, implementing Clean Architecture, DDD principles, and enterprise features like real-time analytics and system auditing.

## 🏗️ Architecture

```
core/
├── models/         # Domain Entities (User abstract class, Admin, Developer, Task, Project)
├── repositories/   # Data Access Layer (IRepository<T> interface + implementations)
├── services/       # Business Logic Layer (TaskService, ProjectService)
└── db/             # Singleton In-Memory Database

app/
├── api/            # RESTful Controller Layer (tasks, projects)
├── layout.tsx      # Root Layout
└── page.tsx        # Dashboard UI (Role-based Sprint Board)
```

## 🎯 OOP Principles Demonstrated

| Principle       | Implementation                                            |
|----------------|-----------------------------------------------------------|
| Abstraction    | `User` abstract class with `getPermissions()` contract    |
| Inheritance    | `Admin` and `Developer` extend `User`                     |
| Polymorphism   | Runtime dispatch of `getPermissions()` per role            |
| Encapsulation  | Repository pattern hides data store internals              |

## 🔧 Design Patterns & Core Services

- **Singleton** — `Database` and `AuditService` ensure consistent state across the platform.
- **Repository** — `IRepository<T>` generic interface decouples data access for tasks, users, and projects.
- **Dependency Injection** — Services receive repositories via constructor, enabling loose coupling and testability.
- **Analytics Engine** — `AnalyticsService` calculates engineering velocity and project health using throughput algorithms.
- **Audit Logging** — `AuditService` tracks system-wide entity mutations for enterprise compliance.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## 📄 Documentation

- [Idea.md](./Idea.md) — Project scope & key features
- [ARCHITECTURE.md](./ARCHITECTURE.md) — **Deep dive into 6-month evolution & design patterns**
- [ROADMAP.md](./ROADMAP.md) — **Historical milestones and future vision**
- [UseCaseDiagram.md](./UseCaseDiagram.md) — Use Case Diagram
- [SequenceDiagram.md](./SequenceDiagram.md) — Sequence Diagram (end-to-end flow)
- [ClassDiagram.md](./ClassDiagram.md) — Class Diagram
- [ERDiagram.md](./ERDiagram.md) — ER Diagram

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
