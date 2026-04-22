# Synapse: Team Task & Project Management System

## Project Idea
Synapse is a modern, full-stack event and project management platform designed specifically to streamline engineering team workflows. It provides targeted role-based access for Administrators (who manage overall project scopes and user permissions) and Developers (who execute on technical tickets).

## Scope
The scope of Synapse includes:
1. **User Authentication & Authorization**: Distinct access controls.
2. **Project Creation**: Administrators can initialize new projects with timelines.
3. **Task Assignment**: Tasks are created under projects and assigned to specific Developers.
4. **State Management**: Tasks pass through statuses (TODO, IN PROGRESS, DONE) mirroring an Agile sprint board without the excess metadata of Jira.

## Key Features
- **Role-Based Architecture**: Strictly enforces abstract user principles, demonstrating clear runtime polymorphism in logic layers.
- **RESTful API**: Structured controllers handling the domain boundary.
- **Repository Pattern abstraction**: Clean architectural boundary abstracting the datastore layer.
- **In-Memory/Persistent Switchover**: Ensures high availability without provisioning latency during demonstrations.
- **Dynamic Frontend**: Modern UI prioritizing spatial design, fast interactions, and aesthetic clarity.
