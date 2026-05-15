````md
# Online Food Ordering System - Frontend

A modern and responsive food ordering web application built with React and TypeScript.

## Tech Stack

- React
- TypeScript
- React Router
- Axios
- Tailwind CSS

## Features

### Authentication
- User Sign Up
- User Login
- JWT Authentication
- Protected Routes
- Form Validation

### Food Management
- View food items
- View food categories
- Add food items to cart
- Remove items from cart
- Update cart quantity

### Order Management
- Place orders
- Track orders
- Payment interface

### Admin Endpoints
- Catrgory creation
- Add new food items

### API Integration
- Axios API integration
- GET, POST, PUT, DELETE requests
- Error handling
- Loading states

### UI/UX
- Responsive design
- Clean and modern UI
- Mobile-friendly layout
- Reusable components

---

## Project Structure

```bash
src/
│
├── assets/
├── components/
├── pages/
│   ├── auth/
│   ├── cart/
│   ├── food/
│   ├── order/
│   ├── payment/
│   ├── login/
│   ├── layout/
│   └── layout/
├── services/
├── nav/
├── context/
├── utils/
├── types/
└── App.tsx
````

---

## Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Navigate into the project

```bash
cd frontend
```

### Install dependencies

```bash
npm install
```

### Run the development server

```bash
npm run dev
```

---

## Authentication Flow

1. User logs in
2. Backend returns JWT token
3. Token stored in local storage
4. Protected routes validate token
5. Axios interceptor sends token with requests

---

## API Configuration


```env
BASE_URL=http://localhost:8080/api
```

---

## Main Dependencies

```json
{
  "react": "latest",
  "typescript": "latest",
  "axios": "latest",
  "react-router-dom": "latest",
  "tailwindcss": "latest"
}
```

---


## Learning Outcomes

* React component architecture
* TypeScript fundamentals
* API integration using Axios
* Route protection
* State management
* Responsive frontend development

