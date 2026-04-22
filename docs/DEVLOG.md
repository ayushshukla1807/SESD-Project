# Development Log: TaskFlow

## Project Roadmap & Milestones

### Phase 1: Foundation (2026-04-18)
- Initialized Next.js 15 project with TypeScript.
- Established Core Layer structure following Clean Architecture principles.
- Implemented Singleton Database pattern for in-memory persistence.

### Phase 2: Domain Modeling & Repositories (2026-04-19)
- Defined abstract `User` class with `Admin` and `Developer` implementations (Polymorphism).
- Implemented Generic `IRepository<T>` interface to decouple business logic from the data store.
- Created `Task` and `Project` entities.

### Phase 3: Service Layer & API (2026-04-20)
- Developed `TaskService` handling business rules (e.g., role-based permissions).
- Integrated RESTful API routes using Next.js Route Handlers.
- Verified end-to-end flow with initial Kanban Board UI.

### Phase 4: Refinement & Advanced Logic (2026-04-21)
- Refactored Services to use Dependency Injection.
- Added `ProjectService` and dedicated Project API endpoints.
- Enhanced Dashboard with Role Switching simulation and Task Creation modal.
- Finalized UML documentation (Class, Sequence, ER, Use Case).

## Engineering Decisions
- **In-Memory Database**: Chosen for the SESD demonstration to ensure zero-latency and ease of setup for evaluators.
- **Repository Pattern**: Extracted to allow future transition to PostgreSQL/Prisma without modifying core business services.
- **Tailwind CSS**: Used for the frontend to create a modern, high-fidelity UI that matches current industry standards.
