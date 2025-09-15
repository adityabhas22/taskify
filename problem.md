---
# 1) **Taskify — To-Do App with Categories**

### Problem

Students build a task manager where users log in, add tasks, categorize them, and mark them as done.
---

### Data Model (MongoDB Example)

```ts
User {
  _id: ObjectId,
  name: string,
  email: string (unique),
  passwordHash: string,
  createdAt: Date
}

Task {
  _id: ObjectId,
  userId: ObjectId (ref User),
  title: string,
  description?: string,
  category: string,
  isDone: boolean (default: false),
  createdAt: Date
}
```

---

### API Design

**Auth**

- `POST /auth/register`

```json
{ "name": "Alice", "email": "alice@test.com", "password": "secret123" }
```

Response: `201 Created`

- `POST /auth/login`

```json
{ "email": "alice@test.com", "password": "secret123" }
```

Response: `{ "token": "jwt_token_here" }`

**Tasks**

- `GET /tasks?category=work`
  Response:

```json
[
  { "id": "1", "title": "Finish report", "category": "work", "isDone": false },
  { "id": "2", "title": "Send email", "category": "work", "isDone": true }
]
```

- `POST /tasks`

```json
{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread",
  "category": "personal"
}
```

- `PATCH /tasks/:id`

```json
{ "isDone": true }
```

- `DELETE /tasks/:id`

---

### Frontend Pages

- **Login/Register Page** → form with JWT save in localStorage
- **Dashboard Page** → list of tasks with filters by category, checkbox to mark done
- **Task Form** → modal or inline form for adding/updating tasks
