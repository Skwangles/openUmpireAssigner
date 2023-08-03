Sure! Below is a sample Markdown documentation for the API:

# Umpires API Documentation

The Umpires API provides endpoints to manage umpire data, including authentication to access sensitive information.

## Authentication

To access sensitive umpire information (e.g., Name, Email, Phone), users must provide their credentials via the request headers:

- `username`: The username of the authenticated user.
- `password`: The corresponding password for the authenticated user.

### Authentication Required Endpoints

The following endpoint requires authentication:

- `GET /umpires`: Returns umpire data with limited sensitive information for authenticated users.

## Endpoints

### GET /umpires

Returns a list of umpires with limited sensitive information for authenticated users.

#### Request

```
GET /umpires
Headers:
  username: testuser
  password: testpassword
```

#### Response

```
Status: 200 OK
Body:
[
  {
    "id": 1,
    "club_id": 1,
    "teams_id": 1,
    "restrictedturfs_id": 1,
    "BlockoutDates": "2023-08-01",
    "LimitedTimes": "14:30-15:30",
    "levels_id": 1,
    "communication_id": 1,
    "ToBeAwareOf": "Prefers to umpire around his game time",
    "Notes": null
  },
  {
    "id": 2,
    "club_id": 2,
    "teams_id": 1,
    "restrictedturfs_id": 1,
    "BlockoutDates": "2023-08-02",
    "LimitedTimes": "14:30-15:30",
    "levels_id": 2,
    "communication_id": 2,
    "ToBeAwareOf": "Prefers to umpire around his game time",
    "Notes": null
  },
  ...
]
```

### POST /umpires

Adds a new umpire to the database.

#### Request

```
POST /umpires
Body:
{
  "Name": "John Doe",
  "Email": "john.doe@example.com",
  "Phone": "123-456-7890",
  "club_id": 1,
  "teams_id": 1,
  "restrictedturfs_id": 1,
  "BlockoutDates": "2023-08-03",
  "LimitedTimes": "14:30-15:30",
  "levels_id": 1,
  "communication_id": 1,
  "ToBeAwareOf": "Prefers to umpire around his game time",
  "Notes": "Test umpire"
}
```

#### Response

```
Status: 200 OK
Body:
{
  "message": "Umpire added successfully"
}
```

### PATCH /umpires/:id

Updates an existing umpire's information.

#### Request

```
PATCH /umpires/1
Body:
{
  "Name": "Updated Name",
  "Phone": "987-654-3210",
  "BlockoutDates": "2023-08-04",
  "ToBeAwareOf": "Updated information"
}
```

#### Response

```
Status: 200 OK
Body:
{
  "message": "Umpire updated successfully"
}
```

### DELETE /umpires/:id

Deletes an existing umpire from the database.

#### Request

```
DELETE /umpires/1
```

#### Response

```
Status: 200 OK
Body:
{
  "message": "Umpire deleted successfully"
}
```

## Error Handling

In case of errors or invalid requests, the API will respond with appropriate error messages and corresponding HTTP status codes.

Please ensure you use valid credentials for authentication to access sensitive umpire information.

For any questions or issues, please contact the API administrators.

---

Note: This is a sample API documentation and may not include all possible scenarios or error cases. Please update the documentation according to the actual implementation and specific requirements of the Umpires API.