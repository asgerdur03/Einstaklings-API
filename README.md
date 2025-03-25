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

Error handeling, so program returns error, but does not just crash
learn the like-comment shit
add some types on the insert
just some genetal quality assurance

## Routes


`/users/...`
- [ ] `POST /login`
- [ ] `POST /register`
- [ ] `GET /` admin route, get all users
- [ ] `GET /me` get logged in user, and their posts
- [ ] `PATCH /me/:id` Edit logged in user info (nota id eða ekki?)
- [ ] `DELETE /me/:id` Delete my account + all data
---
`/posts`
- [ ] `GET /` get all posts
- [ ] `GET /:id` Get single post
- [ ] `POST /` Create post
- [ ] `DELETE /:id` Delete post with id = :id
- [ ] `PATCH /:id` Edit post (mabey)
---
`/likes`
- [ ] `GET /`
- [ ] `POST /`
- [ ] `DELETE /`
---
`/comments`
- [ ] `GET /`
- [ ] `POST /`
- [ ] `DELETE /:id`
- [ ] `PATCH /id`

