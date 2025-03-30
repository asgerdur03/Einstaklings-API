```
npm install
npm run dev
```

```
open http://localhost:3000
```

prisma:

```
npm install
npx prisma db push
npx prisma db seed

# til að endursetja gagnagrunn
npx prisma db push --force-reset
npx prisma db seed

```
## TODO

- Error handeling, so program returns error, but does not just crash
- laga profile pic upload shit
- Setja postman skrá í rót
- setja api á render
- setja upp .env.example skrá 

## Routes

- [x] `/upload` Uploads images to cloudinary ✅

`/users/...`
- [x] `POST /login` ✅
- [x] `POST /register` ✅
- [x] `GET /` admin route, get all users ❌
- [x] `GET /me` get logged in user (do not need for front end?) ❌ 
- [x] `PATCH /me/` Edit logged in user info (nota id eða ekki?) 🟡✅
- [x] `DELETE /me/` Delete my account + all data 🟡
- [x] `GET /find/:id` Get user by id ✅
---
`/posts` TODO: add the file upload, rn its just link
- [x] `GET /` get all posts ✅
- [x] `GET /:id` Get single post ❌
- [x] `POST /` Create post ✅
- [x] `DELETE /:id` Delete post with id = :id ✅
- [x] `PATCH /:id` Edit post (mabey) 🟡
- [x] `GET /users/:id` Get all post by specific user ✅
---
`/likes`
- [x] `GET /` Get all likes ❌ 
- [x] `POST /` Toggle likes ✅
- [x] `GET /:id` Get likes by post and count ✅
---
`/comments`
- [x] `GET /` Get all comments ❌
- [x] `POST /` Add commnet to post ✅
- [x] `DELETE /:id` delete comment from post ✅
- [x] `PATCH /id` Edit comment with commentId = id ❌
- [x] `GET /:id` Get all comment from a post ✅

