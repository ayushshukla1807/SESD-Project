# Synapse Architecture Deep Dive

This document outlines the architectural evolution of Synapse over the past 6 months, transitioning from a rapid prototype to a scalable enterprise-grade engineering management platform.

## 1. Domain-Driven Design (DDD)
Synapse is structured around three primary domains:
- **Identity & Access**: Managed via the `User` abstract model with role-based polymorphism.
- **Project Governance**: Handled by the `Project` entity and associated `ProjectService`.
- **Execution**: The core `Task` engine with state machine logic.

## 2. Layered Architecture
We strictly enforce a 4-layer separation of concerns:

### Controller Layer (`app/api/*`)
Handles HTTP protocol concerns, request validation, and mapping to service-layer response formats.

### Service Layer (`core/services/*`)
The "Brain" of the application. Enforces business rules (e.g., "Only Admins can assign tasks") and orchestrates between repositories.
- **AnalyticsService**: High-compute layer for throughput calculation.
- **AuditService**: Event-sourced tracking for compliance.

### Repository Layer (`core/repositories/*`)
Abstracts the persistence mechanism. Uses `IRepository<T>` generic interface to allow hot-swapping between in-memory and persistent databases without affecting higher layers.

### Model Layer (`core/models/*`)
Pure domain logic. Entities like `User`, `Task`, and `Project` encapsulate their own state transitions.

## 3. Design Patterns Implemented
- **Singleton**: Ensures a single source of truth for the system-wide `Database` instance and `AuditService`.
- **Repository Pattern**: Decouples business logic from data access.
- **Dependency Injection**: Services receive repositories through constructors, facilitating unit testing.
- **Factory Pattern**: Used in the API layer for entity instantiation.

## 4. Evolution History
- **Oct 2025**: Initial monolithic prototype.
- **Dec 2025**: Implementation of the Repository pattern.
- **Feb 2026**: Transition to Next.js 15 App Router and server-side logic separation.
- **Apr 2026**: UI/UX overhaul with Glassmorphism and Analytics integration.
