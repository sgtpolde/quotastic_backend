## Quotastic - Backend 🌟

Welcome to the Quotastic backend repository! Quotastic is an application that inspires and motivates users through a curated collection of powerful motivational quotes. This backend API provides essential functionalities for user management, quote creation, editing, and voting. Dive in and explore the world of inspiration with us.

---

## Features

- **User Management:** Seamlessly register and log in to the system, ensuring a secure user experience.
- **Quote Creation:** Craft and share your motivational masterpieces with the community effortlessly.
- **Quote Management:** Edit or gracefully retire your quotes, keeping your content relevant and inspiring.
- **Voting System:** Engage with quotes by expressing your appreciation through upvotes or offering constructive feedback with downvotes.
- **User Profile:** Discover the creativity of other registered users and explore their motivational quotes.
- **Quote Sorting:** Embark on a journey of inspiration with sorting options, including popularity, recent submissions, and serendipitous randomness.

---

## Technologies Used 🛠️

The Quotastic backend is built using cutting-edge technologies and libraries, ensuring a reliable and scalable system for managing motivational quotes. Here's a glimpse of the technologies powering Quotastic:

- **Nest.js:** Leverage the power of Nest.js, a progressive Node.js framework, to build a highly efficient, reliable, and scalable server-side application.
- **TypeORM:** Utilize TypeORM, an Object-Relational Mapping (ORM) library for TypeScript and JavaScript, to interact with your PostgreSQL database seamlessly.
- **Passport-JWT:** Implement JSON Web Token (JWT) authentication with Passport-JWT, ensuring secure user authentication and authorization.
- **Bcrypt.js:** Safeguard user passwords using Bcrypt.js, a library for hashing passwords to protect sensitive data.
- **Multer:** Manage file uploads effortlessly with Multer, a middleware for handling `multipart/form-data` used for uploading files.
- **Eslint and Prettier:** Enforce consistent coding styles and formatting with Eslint and Prettier, enhancing the readability and maintainability of your codebase.

---

## API Endpoints 🚪

### Authentication

- `POST /signup`: Embark on your Quotastic journey by registering a new user (requires a username and password).
- `POST /login`: Access your Quotastic account by logging in with your existing credentials.
- `PATCH /me/update-password`: Stay secure by updating your current password whenever you desire.
- `DELETE /me/delete-account`: Bid farewell to Quotastic by deleting your account permanently.

### Quotes

- `GET /quotes`: Immerse yourself in a curated collection of users and their quotes, meticulously sorted from the most celebrated to hidden gems.
- `GET /quotes/:id`: Uncover the essence of a specific user's quote, complete with details such as username and vote count.
- `POST /me/myquote`: Contribute to the community by sharing your own motivational quote, igniting inspiration in others.
- `PATCH /me/myquote/:id`: Polish your creation by updating your quote, ensuring it reflects your vision accurately.
- `DELETE /me/myquote/:id`: Exercise your creative control by retiring your quote when the time is right.
- `POST /quotes/:id/upvote`: Acknowledge outstanding creativity by upvoting quotes from fellow users.
- `POST /quotes/:id/downvote`: Provide constructive feedback by downvoting quotes, promoting growth and improvement.
- `GET /quotes/mostliked/:id`: Explore a specific user's top quotes, meticulously sorted by the number of likes they've received.
- `GET /quotes/recent/:id`: Journey through time by exploring a specific user's latest submissions, showcasing their evolving creativity.
- `GET /quote/random`: Experience the joy of discovery with a daily random quote, waiting to inspire you.

---

## Getting Started 🚀

Ready to embark on your Quotastic adventure? Follow these steps:

**1. Clone the Repository:**

```sh
    git clone https://github.com/your-username/quotastic-backend.git
    cd quotastic-backend
```

**2. Install Dependencies:**

```sh
   npm install
```

**3. Run the Application:**

```sh
   npm run start
   or
   npm run start:dev
```

**4. Access the API:**

```
    The API will be available at http://localhost:3000. 
    You can start making requests to the specified endpoints to interact  with the Quotastic application.
    Feel free to explore and contribute to this project. Let's inspire the world, one quote at a time!
```
