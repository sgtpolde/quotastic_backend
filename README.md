# Quotastic - Backend
## _Backend for Quotastic Application_

Quoatiastic backend allows the user to register, write one paragraph of motivational quotes, 
review already registered users and their quotes, and upvote or downvote a quote. 
Users can also edit and delete only their own quotes.

## Features
- User Login & Register
- Write one paragraph of motivational quotes
- Update or Delete quote
- Update or delete account
- Review already registered users and their quotes
- Upvote or downvote a quote

## Tech

- Nest.js
- 

## Endpoints

| Endpoint | description |
| ------ | ------ |
| /signup| Sign up to the system (username, password) |
| /login | Logs in an existing user with a password |
| /me | Get the currently logged in user information |
| /me/myquote | Post your quote |
| /me/myquote/:id | Update your quote (you can update only your quotes) |
| /me/myquote/:id/delete | Delete your quote (you can delete only your quotes) |
| /me/update-password | Update the current users password |
| /me/karma | Get Karma of the user |
| /quotes | List users and quotes in a most upvoted to least liked quotes |
| /quotes/:id| List username & result of votes of a user quote |
| /quotes/:id/upvote | Upvote a quote |
| /quotes/:id/downvote| Downvote a quote |
| /quotes/mostliked/:id| Get all quotes from a specific user sorted by Likes |
| /quotes/recent/:id | Get all quotes from a specific user sorted by Date |
| /quote/random | Get a daily random Quote |
