# Schema Design — Personal Productivity Hub

> Fill in every section below. Keep answers concise.

---

## 1. Collections Overview

Briefly describe each collection (1–2 sentences each):

- **users** —
- **projects** —
- **tasks** —
- **notes** —

---

## 2. Document Shapes

For each collection, write the document shape (field name + type + required/optional):

### users
```
{
  _id: ObjectId,
  email: string (required, unique),
  passwordHash: string (required),
  name: string (required),
  createdAt: Date (required)
}
```

### projects
```
{
  _id: ObjectId,
  userId: ObjectId (required, reference to users),
  name: string (required),
  archived: boolean (required),
  createdAt: Date (required)
}
```

### tasks
```
{
  _id: ObjectId,
  projectId: ObjectId (required, reference to projects),
  title: string (required),
  status: string (required),
  priority: number (required),
  tags: [string] (optional),
  subtasks: [
    {
      title: string (required),
      done: boolean (required)
    }
  ] 
}

```

### notes
```
{
  _id: ObjectId,
  userId: ObjectId (required, reference to users),
  projectId: ObjectId (optional, reference to projects),
  content: string (required),
  tags: [string] (optional),
  createdAt: Date (required)
}
```

---

## 3. Embed vs Reference — Decisions

For each relationship, state whether you embedded or referenced, and **why** (one sentence):

| Relationship                       | Embed or Reference? | Why? |
|-----------------------------------|---------------------|------|
| Subtasks inside a task            |    Embed                 |  They are small and always will be used their parent|
| Tags on a task                    |    Embed                 |  They are simple arrays so we donot need their collection    |
| Project → Task ownership          |    Reference                 | Task can be known independent and project conatin many tasks      |
| Note → optional Project link      |    Reference                 |  Notes can be of any other thing but they can be to a project .    |

---

## 4. Schema Flexibility Example

Name one field that exists on **some** documents but not **all** in the same collection. Explain why this is acceptable (or even useful) in MongoDB.

> _Your answer here._
A task may include an optional field such as `deadline`, 
which is not present in all task documents.This is acceptable in MongoDB because documents in the same 
collection are not required to have identical structures.This flexibility allows adding new features 
without modifying existing documents.
