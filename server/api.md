# Echoes API Documentation

**Base URL:** `{{server}}` resolves to `http://localhost:8000/api/v1`

**Authentication:**
All protected routes require an `accessToken` sent via cookies. This token is verified by the server before processing the request.

**Response Structure:**
All API responses follow a consistent standard based on the `ApiResponse` class:

```json
{
    "statusCode": 200,
    "message": "Success",
    "data": {},
    "success": true
}
```

---

## Authentication

### Signup

- **Method:** `POST`
- **URL:** `{{server}}/auth/signup`

### Login

- **Method:** `POST`
- **URL:** `{{server}}/auth/login`

### Logout

- **Method:** `POST`
- **URL:** `{{server}}/auth/logout`

---

## Users

### Get Users By Name

- **Method:** `GET`
- **URL:** `{{server}}/users/search/:name`

### Get User By Email

- **Method:** `GET`
- **URL:** `{{server}}/users/email/:email`

### Add Event

- **Method:** `POST`
- **URL:** `{{server}}/event`

### User Presence

- **Method:** `GET`
- **URL:** `{{server}}/users/presence`

---

## Relations

### Create Relation

- **Method:** `POST`
- **URL:** `{{server}}/relations`

### All Relations

- **Method:** `GET`
- **URL:** `{{server}}/relations`

### Particular Relation

- **Method:** `GET`
- **URL:** `{{server}}/relations/:relationType`

---

## Time Capsule

### Upload Images

- **Method:** `POST`
- **URL:** `{{server}}/upload/images/:timecapsuleId`

### Delete Image

- **Method:** `DELETE`
- **URL:** `{{server}}/upload/images/:contentId`

### Get Images

- **Method:** `GET`
- **URL:** `{{server}}/upload/images/:timecapsuleId`

### Upload Video

- **Method:** `POST`
- **URL:** `{{server}}/upload/video/:timecapsuleId`

### Delete Video

- **Method:** `DELETE`
- **URL:** `{{server}}/upload/video/:contentId`

### Get Video

- **Method:** `GET`
- **URL:** `{{server}}/upload/video/:timecapsuleId`

### Upload Audio

- **Method:** `POST`
- **URL:** `{{server}}/upload/audio/:timecapsuleId`

### Delete Audio

- **Method:** `DELETE`
- **URL:** `{{server}}/upload/audio/:contentId`

### Get Audio

- **Method:** `GET`
- **URL:** `{{server}}/upload/audio/:timecapsuleId`

### Upload Text

- **Method:** `POST`
- **URL:** `{{server}}/upload/texts/:timecapsuleId`

### Delete Text

- **Method:** `DELETE`
- **URL:** `{{server}}/upload/texts/:contentId`

### Get Text

- **Method:** `GET`
- **URL:** `{{server}}/upload/texts/:timecapsuleId`

### Create Time Capsule

- **Method:** `POST`
- **URL:** `{{server}}/timecapsule`

### Modify Time Capsule

- **Method:** `PUT`
- **URL:** `{{server}}/timecapsule/:timecapsuleId`

### Delete Time Capsule

- **Method:** `DELETE`
- **URL:** `{{server}}/timecapsule/:timecapsuleId`

### Get Time Capsule

- **Method:** `GET`
- **URL:** `{{server}}/timecapsule/:timecapsuleId`

### Get All Time Capsules

- **Method:** `GET`
- **URL:** `{{server}}/timecapsule`

### Open Time Capsule

- **Method:** `POST`
- **URL:** `{{server}}/timecapsule/open/:timecapsuleId`

### Add Reaction

- **Method:** `POST`
- **URL:** `{{server}}/timecapsule/reaction/:timecapsuleId`

### Get Reaction

- **Method:** `GET`
- **URL:** `{{server}}/timecapsule/reaction/:timecapsuleId`

### Get Entire Time Capsule

- **Method:** `GET`
- **URL:** `{{server}}/timecapsule/view/:timecapsuleId`

---

## Extras

### Visitors

- **Method:** `POST`
- **URL:** `{{server}}/visitors`

### Analytics

- **Method:** `GET`
- **URL:** `{{server}}/analytics`

---

## Health Check

### Check Health

- **Method:** `GET`
- **URL:** `{{server}}/check-health`

---

_Note: There might be additional endpoints or modifications in the future. Please refer to the latest documentation for updates._

---
