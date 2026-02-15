# MsgFuture - Time Capsules for Your Future Self

A secure, minimalist application to send encrypted messages to your future self.

## Features

- **Time-Locked Encryption:** Messages are encrypted with AES-256-GCM and can only be decrypted after the reveal date.
- **Echo Wall:** Share your unlocked messages anonymously with the world.
- **Reflections:** Capture your thoughts when you finally read your past message.
- **Minimalist Design:** Stark black and white aesthetic with smooth animations.
- **Email Notifications:** Get notified when your time capsule is sealed (via Resend).

## Setup

1. **Clone the repository:**
   `git clone https://github.com/aryanspaceconnect/msgfuture.git`
   `cd msgfuture`

2. **Install dependencies:**
   `npm install`

3. **Configure Environment Variables:**
   Create a `.env` file with the following:
   - DATABASE_URL
   - NEXTAUTH_SECRET
   - NEXTAUTH_URL
   - ENCRYPTION_KEY
   - RESEND_API_KEY

4. **Initialize Database:**
   `npx prisma generate`
   `npx prisma db push`

5. **Run Development Server:**
   `npm run dev`

## Deployment on Render

1. Create a Web Service connected to your GitHub repo.
2. Set the Build Command: `npm install && npx prisma generate && npm run build`
3. Set the Start Command: `npm start`
4. Add all environment variables in the Render dashboard.

## Security Notes

- Use a strong `ENCRYPTION_KEY`. You can generate one with `openssl rand -hex 32`.
- Keep the `DATABASE_URL` private.
