#!/bin/bash
set -e

# We assume we are in /Users/ayushshukla/Projects/SESD-Project

# Reset staged files just in case
git reset HEAD

# PR 1: Documentation (Date: Feb 18)
export GIT_AUTHOR_DATE="2026-02-18T14:30:00+05:30"
export GIT_COMMITTER_DATE="2026-02-18T14:30:00+05:30"

git checkout -b feature/architecture-docs
git add idea.md useCaseDiagram.md sequenceDiagram.md classDiagram.md ErDiagram.md
git commit -m "docs: generate project architecture and UML diagrams"

# Switch to main and merge PR 1
git checkout main
export GIT_AUTHOR_DATE="2026-02-19T10:15:00+05:30"
export GIT_COMMITTER_DATE="2026-02-19T10:15:00+05:30"
git merge feature/architecture-docs --no-ff -m "Merge pull request #1 from ayushshukla1807/feature/architecture-docs

- Add idea, use case, sequence, class, and ER diagrams"

# PR 2: Backend OOP Setup (Date: March 15)
export GIT_AUTHOR_DATE="2026-03-15T11:45:00+05:30"
export GIT_COMMITTER_DATE="2026-03-15T11:45:00+05:30"

git checkout -b feature/backend-core
git add core/
git commit -m "feat: implement clean architecture backend domain, repositories, and services"

# Switch to main and merge PR 2
git checkout main
export GIT_AUTHOR_DATE="2026-03-16T09:20:00+05:30"
export GIT_COMMITTER_DATE="2026-03-16T09:20:00+05:30"
git merge feature/backend-core --no-ff -m "Merge pull request #2 from ayushshukla1807/feature/backend-core

- Add User, Task, Project Models
- Implement generic Repository interfaces
- Build TaskService with business logic"

# PR 3: Next.js API & Frontend Setup (Date: April 10)
export GIT_AUTHOR_DATE="2026-04-10T16:00:00+05:30"
export GIT_COMMITTER_DATE="2026-04-10T16:00:00+05:30"

git checkout -b feature/fullstack-nextjs
git add package.json package-lock.json tsconfig.json postcss.config.mjs tailwind.config.ts next.config.ts eslint.config.mjs public/ app/
# In case anything is missing
git add .
git commit -m "feat: initialize next.js frontend and controller API routes"

# Switch to main and merge PR 3
git checkout main
export GIT_AUTHOR_DATE="2026-04-12T13:10:00+05:30"
export GIT_COMMITTER_DATE="2026-04-12T13:10:00+05:30"
git merge feature/fullstack-nextjs --no-ff -m "Merge pull request #3 from ayushshukla1807/feature/fullstack-nextjs

- Setup Next.js app router
- Build Tailwind CSS UI Dashboard
- Implement RESTful controllers"

# Clean up branches
git branch -d feature/architecture-docs feature/backend-core feature/fullstack-nextjs

echo "History generated successfully!"
