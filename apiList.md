## AUTH ROUTER
- POST /signup
- POST /login
- POST /logout

## PROFILE ROUTER
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

## CONNECTION REQUEST ROUTER
- POST /request/send/interested/:userId
- POST /request/send/ignored/:userId
- POST /request/review/rejected/:requestId
- POST /request/review/accepted/:requestId

## USER ROUTER
- GET user/connections
- GET user/request/received
- GET user/feed



STATUS - IGNORE, INTERESTED, ACCEPTED, REJECTED