# Domain Server

A server handling tasks, task comments, cookie consent, and board management for project boards.

## Table of Contents

- [Setup](#setup)
- [API Endpoints](#api-endpoints)
  - [Cookie Consent](#cookie-consent)
    - [Accept Cookie Consent](#accept-cookie-consent)
    - [Decline Cookie Consent](#decline-cookie-consent)
    - [Check Cookie Consent](#check-cookie-consent)
  - [Tasks](#tasks)
    - [Create Task](#create-task)
    - [Get Tasks for Board](#get-tasks-for-board)
    - [Open Task](#open-task)
    - [Add Comment to Task](#add-comment-to-task)
  - [Boards](#boards)
    - [Create Board](#create-board)
    - [Get User Boards](#get-user-boards)
    - [Add Board Member](#add-board-member)
- [Testing with Insomnia or Postman](#testing-with-insomnia-or-postman)

## Setup

### To Get Started

1. Clone the repository:

```bash
git clone https://github.com/hallstrom91/fwk4-23-domain.git
```

2. Enter cloned repository directory:

```bash
cd fwk4-23-domain
```

3. Install required packages:

```
npm install
```

4. Create .env file in the root folder of the project:

```bash
DB_HOST=
DB_USER=
DB_DATABASE=
DB_PASSWORD=
PORT=
JWT_SECRET=
```

5. Start the domain server:

```
npm run dev
```

## API Endpoints

### Cookie Consent

### Accept Cookie Consent

**POST** `/cookie/accept`

Accepts the cookie consent by setting a `cookieConsent=accepted` cookie.

**RESPONSE(200)**

```JSON
{
  "message": "Cookie consent accepted"
}
```

### Decline Cookie Consent

**POST** `/cookie/decline`

Declines the cookie consent by setting a `cookieConsent=declined` cookie.

**RESPONSE**

```JSON
{
  "message": "Cookie consent declined"
}
```

### Check Cookie Consent

**GET** `/cookie/check`

Checks the current cookie consent status.

**RESPONSE(200 - ACCEPTED or DECLINED)**

```JSON
{
  "cookieConsent": "accepted"
}
```

**RESPONSE(200 - MISSING)**

```JSON
{
  "cookieConsent": "missing"
}
```

### Tasks

### Create Task

**POST** `/task/create/:boardId`

Creates new task in the specified board.

- Requires JWT authentication.

**REQUEST BODY:**

```JSON
{
  "title": "Task Title",
  "description": "Task Description",
  "assignedTo": "UserId"
}
```

**RESPONSE(201 - SUCCESS):**

```JSON
{
  "message": "Task created",
  "taskId": 1
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to create new task"
}
```

### Get Tasks for Board

**GET** `/task/:boardId`

Retrieves all tasks for a specific board.

- Requires JWT authentication.

**RESPONSE(200 - SUCCESS):**

```JSON
[
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "status": "undone"
  }
]
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to get tasks"
}
```

### Open Task

**GET** `/task/:boardId/open/:taskId`

Retrieves detailed information about a specific task, including any comments.

- Requires JWT authentication.

**RESPONSE(200 - SUCCESS):**

```JSON
{
  "task": {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description"
  },
  "comments": [
    {
      "id": 1,
      "comment": "This is a comment",
      "user_id": 2
    }
  ]
}
```

### Add Comment to Task

**POST** `/tasks/addcomment/:taskId`

Adds a comment to a specific task.

- Requires JWT authentication.

**REQUEST BODY:**

```JSON
{
  "comment": "This is a comment"
}
```

**RESPONSE(201 - SUCCESS):**

```JSON
{
  "message": "Comment added to task"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to add comment to selected task"
}
```

### Boards

### Create Board

**POST** `/board/create`

Creates a new board and automatically assigns the user who created it as an admin.

- Requires JWT authentication.

**REQUEST BODY:**

```JSON
{
  "name": "Board Name",
  "description": "Board Description"
}
```

**RESPONSE(201 - SUCCESS):**

```JSON
{
  "message": "Board created successfully",
  "boardId": 1
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to create new board"
}
```

### Get User Boards

**GET** `/board/my-boards`

Retrieves all boards that the authenticated user is a member of, along with the user's role in each board.

- Requires JWT authentication.

**RESPONSE(200 - SUCCESS):**

```JSON
[
  {
    "id": 1,
    "name": "Board Name",
    "description": "Board Description",
    "created_at": "2024-10-01",
    "created_by": 1,
    "role": "admin"
  }
]
```

**RESPONSE(404 - NO BOARDS):**

```JSON
{
  "message": "No boards found"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to get boards related to user"
}
```

### Add Board Member

**POST** `/board/adduser/:boardId`

Adds a new member to a specific board.

- Requires JWT authentication.

**REQUEST BODY:**

```JSON
{
  "userId": 2,
  "role": "member"
}
```

**RESPONSE(201 - SUCCESS):**

```JSON
{
  "message": "Member added to board"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to add member to board"
}
```

## Testing with Insomnia or Postman

You can use Insomnia or Postman to test the API endpoints by sending the appropriate requests as documented above.
