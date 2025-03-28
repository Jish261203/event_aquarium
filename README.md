<div align="center">
  <br />
    <a href="https://event-aquarium.vercel.app/" target="_blank">
      <img src="https://berglundcenter.live/application/files/7816/8623/0730/events.png" alt="Project Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-Next_JS_14-black?style=for-the-badge&logoColor=white&logo=nextdotjs&color=000000" alt="Next.js" />
    <img src="https://img.shields.io/badge/-TypeScript-black?style=for-the-badge&logoColor=white&logo=typescript&color=3178C6" alt="TypeScript" />
    <img src="https://img.shields.io/badge/-Stripe-black?style=for-the-badge&logoColor=white&logo=stripe&color=008CDD" alt="stripe" />
  </div>

  <h3 align="center">Event Aquarium</h3>

   <div align="center">
     “Bringing people together through seamless event management, where every gathering is crafted with ease, ensuring unforgettable experiences and effortless connections for all involved.”
    </div>
</div>
<h2>🚀 Demo</h2>
<div>
  <br />
  <a href="https://event-aquarium.vercel.app/" target="_blank">
    <img src="https://media1.tenor.com/m/zHCxRAOVPxQAAAAC/e3-keanu-reeves.gif" alt="Project Banner" style="width: 300px; height: auto;">
  </a>
  <br />
</div>

## 📋 Table of Contents

1. 📹 [Video](#video)
2. 🤖 [Introduction](#introduction)
3. ⚙️ [Tech Stack](#tech-stack)
4. 🔋 [Features](#features)
5. 🤸 [Quick Start](#quick-start)



<h2 name="video">📹 Video</h2>
<div>
  <br />
   <a href="https://youtu.be/MHPfzo4Am7g" target="_blank">
    <img src="https://media1.tenor.com/m/dFOeYJ0UEWAAAAAd/yt-youtube.gif" alt="Project Banner" style="width: 300px; height: auto;">
  </a>
  <br />
</div>

## <a name="introduction">🤖 Introduction</a>

The objective of Event Aquarium is to provide a platform for users to host events at a college or small-scale level and allow other users to enroll in these events. The platform aims to streamline the event hosting process and facilitate event management by providing features for event creation enrollment and ticket purchasing.

## <a name="tech-stack">⚙️ Tech Stack</a>

- Next.js
- TypeScript
- TailwindCSS
- Stripe
- Zod
- React Hook Form
- Shadcn
- uploadthing

## <a name="features">🔋 Features</a>

👉 **Authentication (CRUD) with Clerk:** User management through Clerk, ensuring secure and efficient authentication.

👉 **Events (CRUD):** Comprehensive functionality for creating, reading, updating, and deleting events, giving users full control over event management.

- **Create Events:** Users can effortlessly generate new events, providing essential details such as title, date, location, and any additional information.
- **Read Events:** Seamless access to a detailed view of all events, allowing users to explore event specifics, including descriptions, schedules, and related information.
- **Update Events:** Empowering users to modify event details dynamically, ensuring that event information remains accurate and up-to-date.
- **Delete Events:** A straightforward process for removing events from the system, giving administrators the ability to manage and curate the platform effectively.

👉 **Related Events:** Smartly connects events that are related and displaying on the event details page, making it more engaging for users

👉 **Organized Events:** Efficient organization of events, ensuring a structured and user-friendly display for the audience, i.e., showing events created by the user on the user profile

👉 **Search & Filter:** Empowering users with a robust search and filter system, enabling them to easily find the events that match their preferences.

👉 **New Category:** Dynamic categorization allows for the seamless addition of new event categories, keeping your platform adaptable.

👉 **Checkout and Pay with Stripe:** Smooth and secure payment transactions using Stripe, enhancing user experience during the checkout process.

👉 **Event Orders:** Comprehensive order management system, providing a clear overview of all event-related transactions.

👉 **Search Orders:** Quick and efficient search functionality for orders, facilitating easy tracking and management.

👉 **Admin Panel:** A dedicated admin panel for administrators to manage events and financial aspects of the platform.

and many more, including code architecture and reusability

## <a name="quick-start">🤸 Quick Start</a>

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/your-username/your-project.git
cd your-project
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
#NEXT
NEXT_PUBLIC_SERVER_URL=

#CLERK
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_CLERK_WEBHOOK_SECRET=

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

#MONGODB
MONGODB_URI=

#UPLOADTHING
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=

#STRIPE
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

Replace the placeholder values with your actual credentials

**Running the Project**

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

## License

[MIT License](LICENSE)
