// seed.js
// =============================================================================
//  Seed the database with realistic test data.
//  Run with: npm run seed
//
//  Required minimum:
//    - 2 users
//    - 4 projects (split across the users)
//    - 5 tasks (with embedded subtasks and tags arrays)
//    - 5 notes (some attached to projects, some standalone)
//
//  Use the bcrypt module to hash passwords before inserting users.
//  Use ObjectId references for relationships (projectId, ownerId).
// =============================================================================

require('dotenv').config();
const bcrypt = require('bcryptjs');
const { connect } = require('./db/connection');

(async () => {
  const db = await connect();

  // OPTIONAL: clear existing data so re-seeding is idempotent
  // await db.collection('users').deleteMany({});
  // await db.collection('projects').deleteMany({});
  // await db.collection('tasks').deleteMany({});
  // await db.collection('notes').deleteMany({});

    // 1. Hash passwords
  const hash1 = await bcrypt.hash('password123', 10);
  const hash2 = await bcrypt.hash('password456', 10);

  // 2. Insert Users
  const u1 = await db.collection('users').insertOne({
    email: "abdul@gmail.com",
    passwordHash: hash1,
    name: "User One",
    createdAt: new Date()
  });

  const u2 = await db.collection('users').insertOne({
    email: "rehman@gmail.com",
    passwordHash: hash2,
    name: "User Two",
    createdAt: new Date()
  });

  const user1Id = u1.insertedId;
  const user2Id = u2.insertedId;

  // 3. Insert Projects
  const p1 = await db.collection('projects').insertOne({
    userId: user1Id,
    name: "DB Lab",
    archived: false,
    createdAt: new Date()
  });

  const p2 = await db.collection('projects').insertOne({
    userId: user1Id,
    name: "Web App",
    archived: false,
    createdAt: new Date()
  });

  const p3 = await db.collection('projects').insertOne({
    userId: user2Id,
    name: "AI Project",
    archived: false,
    createdAt: new Date()
  });

  const p4 = await db.collection('projects').insertOne({
    userId: user2Id,
    name: "ML Study",
    archived: false,
    createdAt: new Date()
  });

  const projectIds = [
    p1.insertedId,
    p2.insertedId,
    p3.insertedId,
    p4.insertedId
  ];

  // 4. Insert Tasks
  await db.collection('tasks').insertMany([
    {
      ownerId: user1Id,
      projectId: projectIds[0],
      title: "Design schema",
      status: "todo",
      priority: 1,
      tags: ["db", "important"],
      subtasks: [
        { title: "users schema", done: false },
        { title: "tasks schema", done: false }
      ],
      createdAt: new Date(),
      dueDate: new Date() // schema flexibility
    },
    {
      ownerId: user1Id,
      projectId: projectIds[0],
      title: "Write queries",
      status: "in-progress",
      priority: 2,
      tags: ["code"],
      subtasks: [{ title: "query 1", done: false }],
      createdAt: new Date()
    },
    {
      ownerId: user1Id,
      projectId: projectIds[1],
      title: "Frontend UI",
      status: "done",
      priority: 3,
      tags: ["ui"],
      subtasks: [],
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[2],
      title: "Train model",
      status: "todo",
      priority: 1,
      tags: ["ai"],
      subtasks: [{ title: "collect data", done: false }],
      createdAt: new Date()
    },
    {
      ownerId: user2Id,
      projectId: projectIds[3],
      title: "Study ML",
      status: "todo",
      priority: 2,
      tags: ["ml"],
      subtasks: [],
      createdAt: new Date()
    }
  ]);

  // 5. Insert Notes
  await db.collection('notes').insertMany([
    {
      userId: user1Id,
      projectId: projectIds[0],
      content: "Important DB concepts",
      tags: ["db"],
      createdAt: new Date()
    },
    {
      userId: user1Id,
      content: "Random standalone note",
      tags: ["idea"],
      createdAt: new Date()
    },
    {
      userId: user2Id,
      projectId: projectIds[2],
      content: "AI notes",
      tags: ["ai"],
      createdAt: new Date()
    },
    {
      userId: user2Id,
      content: "ML thoughts",
      tags: ["ml"],
      createdAt: new Date()
    },
    {
      userId: user1Id,
      projectId: projectIds[1],
      content: "Frontend ideas",
      tags: ["ui"],
      createdAt: new Date()
    }
  ]);

  console.log("Seed data inserted successfully!");
  process.exit(0);
})();
