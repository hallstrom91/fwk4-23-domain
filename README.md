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
    - [Update Task](#update-task)
    - [Delete Task](#delete-task)
    - [Update Task Comment](#update-task-comment)
    - [Delete Task Comment](#delete-task-comment)
  - [Boards](#boards)
    - [Create Board](#create-board)
    - [Get User Boards](#get-user-boards)
    - [Get Board With Tasks](#get-board-with-tasks)
    - [Update Board](#update-board)
    - [Delete Board](#delete-board)
    - [Add Board Member](#add-board-member)
    - [Remove Board Member](#remove-board-member)
    - [Update Board Member Role](#update-board-member-role)
  - [Invites](#invites)
    - [Create Invite](#create-invite)
    - [Get Invites](#get-invites)
    - [Accept Invite](#accept-invite)
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

**PARAMETERS:**

`boardId`: The ID of the board where the task will be created.

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

**RESPONSE(400 - ERROR):**

```JSON
{
  "error": "Title is required"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to create new task"
}
```

### Get Tasks for Board

**GET** `/task/:boardId/tasks`

Retrieves all tasks for a specific board.

- Requires JWT authentication.

**PARAMETERS:**

- `boardId`: The ID of the board for which to retrieve tasks.

**RESPONSE(200 - SUCCESS):**

```JSON
[
  {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "assigned_to": "UserId",
    "created_by": "UserId",
    "status": "undone"
  },
  ...
]
```

**RESPONSE(404 - ERROR):**

```JSON
{
  "error": "No tasks found for this board. Create one to get started!"
}
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

**PARAMETERS:**

- `taskId`: The ID of the task to open.
- `boardId`: The ID of the board to which the task belongs.

**RESPONSE(200 - SUCCESS):**

```JSON
{
  "task": {
    "id": 1,
    "title": "Task Title",
    "description": "Task Description",
    "assigned_to": "UserId",
    "created_by": "UserId",
    "status": "undone"
  },
  "comments": [
    {
      "id": 1,
      "comment": "This is a comment",
      "user_id": "UserId"
    },
    ...
  ]
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Task not found"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to open selected task"
}
```

### Add Comment to Task

**POST** `/tasks/addcomment/:taskId`

Adds a comment to a specific task.

- Requires JWT authentication.

**PARAMETERS:**

`taskId`: The ID of the task to which the comment will be added.

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

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "Comment value is required"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to add comment to selected task"
}
```

### Update Task

**PUT** `/task/update/:taskId`

- Requires JWT authentication.

**PARAMETERS:**

- `taskId`: The ID of the task to update.
- `boardId`: The ID of the board to which the task belongs.

**REQUEST BODY:**

```JSON
{
  "description": "Updated Task Description",
  "assignedTo": "NewUserId",
  "status": "done"
}
```

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Task updated successfully"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Task not found or unauthorized"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to update task"
}
```

### Delete Task

**DELETE** `/task/delete/:taskId`

- Requires JWT authentication.

**PARAMETERS:**

- `taskId`: The ID of the task to delete.
- `boardId`: The ID of the board to which the task belongs.

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Task deleted successfully"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Task not found or unauthorized"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to delete task"
}
```

### Update Task Comment

**PUT** `/task/update/:commentId`

- Requires JWT authentication.

**PARAMETERS:**

- `commentId`: The ID of the comment to update.

**REQUEST BODY:**

```JSON
{
  "comment": "Updated comment text"
}
```

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Comment updated successfully"
}
```

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "Comment is required"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Comment not found or unauthorized"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to update comment"
}
```

### Delete Task Comment

**DELETE** `/task/delete/:commentId`

- Requires JWT authentication.

**PARAMETERS:**

- `commentId`: The ID of the comment to delete.

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Comment deleted successfully"
}
```

**REQUEST BODY:**

```JSON
{
  "error": "Comment not found or unauthorized"
}
```

**REQUEST BODY:**

```JSON
{
  "error": "Failed to delete comment"
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

**RESPONSE(400 - ERROR):**

```JSON
{
  "error": "Name and description is required"
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

**RESPONSE(404 - NOT FOUND):**

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

### Get Board With Tasks

**GET** `/board/:boardId`

Retrieves a specific board along with its tasks.

- Requires JWT authentication.

**PARAMETERS:**

`boardId`: The ID of the board.

**RESPONSE(200 - SUCCESS):**

```JSON
{
  "board": {
    "id": 1,
    "name": "Board Name",
    "description": "Board Description",
    "created_at": "2024-01-01T00:00:00Z",
    "created_by": "UserId"
  },
  "tasks": [
    {
      "id": 1,
      "title": "Task Title",
      "description": "Task Description",
      "assignedTo": "UserId"
    },
    ...
  ]
}
```

**RESPONSE(403 - ERROR):**

```JSON
{
  "error": "Unauthorized"
}
```

**RESPONSE(404 - NOT FOUND):**

```JSON
{
  "error": "Board not found"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to get board and tasks"
}
```

### Update Board

**PUT** `/board/update/:boardId`

Updates the details of an existing board.

- Requires JWT authentication.

**PARAMETERS:**

`boardId`: The ID of the board to update.

**REQUEST BODY:**

```JSON
{
  "name": "Updated Board Name",
  "description": "Updated Board Description"
}
```

**RESPONSE(200 - SUCCESS):**

```JSON
{
  "message": "Board updated successfully"
}
```

**RESPONSE(400 - ERROR)**

```JSON
{
  "error": "Board name and description is required"
}
```

**RESPONSE(404 - NOT FOUND):**

```JSON
{
  "message": "Board not found or unauthorized"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to update board"
}
```

### Delete Board

**DELETE** `/board/delete/:boardId`

Deletes the specified board along with its members.

- Requires JWT authentication.

**PARAMETERS:**

- `boardId`: The ID of the board to delete.

RESPONSE (200 - SUCCESS):

```JSON
{
  "message": "Board deleted successfully"
}
```

RESPONSE (404 - ERROR):

```JSON
{
  "error": "Board not found or unauthorized"
}
```

RESPONSE (500 - ERROR):

```JSON
{
  "error": "Failed to delete board"
}
```

### Add Board Member

**POST** `/board/adduser/:boardId`

Adds a new member to a specific board.

- Requires JWT authentication.

**PARAMETERS:**
`boardId`: The ID of the board to which the member will be added.

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

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "User ID and role are required"
}
```

**RESPONSE (409 - ERROR):**

```JSON
{
  "error": "User is already member of this board"
}
```

**RESPONSE(500 - ERROR):**

```JSON
{
  "error": "Failed to add member to board"
}
```

### Remove Board Member

**DELETE** `/board/removeuser/:userIdToRemove`

Removes a member from the specified board.

- Requires JWT authentication.

PARAMETERS:

`boardId`: The ID of the board.
`userIdToRemove`: The ID of the user to be removed.

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Member removed from board"
}
```

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "User ID for removal of access is required"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Board not found"
}
```

**RESPONSE (403 - ERROR):**

```JSON
{
  "error": "Only board admins can remove users"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to remove member from board"
}
```

### Update Board Member Role

**PUT** `/:boardId/updateuser/:userIdToUpdate`

Updates the role of an existing member in the specified board.

- Requires JWT authentication.
  **PARAMETERS:**

`boardId`: The ID of the board.
`userIdToUpdate`: The ID of the user whose role will be updated.

**REQUEST BODY:**

```JSON
{
  "role": "NewMemberRole"
}
```

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Member role updated successfully"
}
```

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "Role is required"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Board not found"
}
```

**RESPONSE (403 - ERROR):**

```JSON
{
  "error": "Only board admins can update member roles"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to update member role"
}
```

### Invites

### Create Invite

**POST** `/invite/send`

Sends an invite to a user to join a specific board.

- Requires JWT authentication.

**REQUEST BODY:**

```JSON
{
  "boardId": 1,
  "invitedEmail": "user@example.com"
}
```

**RESPONSE (201 - SUCCESS):**

```JSON
{
  "message": "Invite sent successfully"
}
```

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "You can not invite yourself madman!"
}
```

**RESPONSE (400 - ERROR):**

```JSON
{
  "error": "Invite already exists for this user on this board"
}
```

**RESPONSE (403 - ERROR):**

```JSON
{
  "error": "Only board admins can send invites"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "User email not found"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to send invite"
}
```

### Get Invites

**GET** `/invite/get`

Retrieves all invites sent to the authenticated user.

- Requires JWT authentication.

**RESPONSE (200 - SUCCESS):**

```JSON
[
  {
    "id": 1,
    "board_id": 1,
    "invited_by": "UserId",
    "invited_user_id": "UserId",
    "invited_email": "user@example.com",
    "accepted": false
  },
  ...
]
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "No invites found"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to get invites"
}
```

### Accept Invite

**PUT** `/invite/:inviteId/accept`

Accepts an invite for a specific board.

- Requires JWT authentication.

**PARAMETERS:**

- `inviteId`: The ID of the invite to accept.

**RESPONSE (200 - SUCCESS):**

```JSON
{
  "message": "Invite accepted"
}
```

**RESPONSE (404 - ERROR):**

```JSON
{
  "error": "Invite not found"
}
```

**RESPONSE (500 - ERROR):**

```JSON
{
  "error": "Failed to accept invite"
}
```

## Testing with Insomnia or Postman

You can use Insomnia or Postman to test the API endpoints by sending the appropriate requests as documented above.
