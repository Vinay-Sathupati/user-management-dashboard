# 🚀 Tech Assignment - User Management App 
A full-stack **User Management Application** for performing CRUD operations on user data.
Built using **React** for the frontend integrated with a **mock backend API (JSONPlaceholder)**.


## 🛠 Tools & Libraries Used

### 🖥️ Frontend
![React](https://img.shields.io/badge/Frontend-React-blue)
![CSS](https://img.shields.io/badge/Styling-CSS3-blueviolet)
- **React.js (Class Components)**  
- **CSS3** (responsive, clean styling)  
- **React Router** for navigation  
- **React Icons** for UI icons  
- **React Popup** for modal popups (edit & delete)  
- **axios** for API calls

### 🌐 Backend
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) as a fake REST API for testing.  
- All CRUD operations are simulated via this service.


## ✨ Key Feature

### User Management Component (Main/Parent Component)
- Serves as the **central hub** for user operations.
- Contains **three main tabs**:
  1. **User Dashboard**
  2. **Add User Form** 
  3. **User Details**
---
### 📋 User Dashboard
- Displays a **list of all users**  in a table.
- Supports **searching, sorting, and filtering**.
- Clean **tabular layout** for better readability.
- Filter users by fields like `firstName`, `lastName`, `email`, etc.

---
### ✏️ Edit & Delete Pop-ups
- Implemented using the **react-popup** library.
- **Edit Pop-up**:
  - Enables modifying user details.
  - Pre-fills form fields with the selected user’s details for a better user experience.
  - Submits updates via `PUT /users/:id`.
- **Delete Confirmation Pop-up**:
  - Ensures user details are not removed accidentally.
  - Displays a confirmation message before final deletion.
  - Shows success message upon deletion.

  ---
### 📝 User Form Page
-  Add a new user with required details.
- Includes **form validations**:
  - Required fields (first name, last name, email, department).
  - Duplicate email check.
- Submits new users via `POST /users`.

---
### 👤 user Details Page
- Fetch and display **details of a specific user** by entering a user ID.
- Uses `GET /users/:id` for retrieval.


## 🔌 API Endpoints

- **Endpoint:** All user operations interact with `/users` endpoint of JSONPlaceholder.

    - **POST** `/users` → Create a new customer.
    - **GET** `/users` → Get a list of all customers.
    - **GET** `/users/:id` → Get details for a single customer by ID.
    - **PUT** `/users/:id` → Update an existing customer’s information.
    - **DELETE** `/users/:id` → Delete a customer.


## Error Handling
- **API Errors** → Displays clear error messages when requests fail (e.g., network failure).  
- **Client-Side Validation** → Ensures input data is valid before making API calls (e.g., email format check, required fields).
- **Not-Found Route:** A 404 page is implemented to handle invalid routes and enhance navigation.

## 📂 Project Structure

```
src/
├── components/
│   ├── UserManagement/        # Parent Component with 3 tabs
|   |   |
│   │   ├── UserDashboard/     # Displays list of all users in a table
│   │   |    |
│   │   |    ├── EditPopup/    # Enables modifying user details
│   │   |    └── DeletePopup/  # Confirms before final deletion
|   |   |
│   │   ├── AddUserForm/       # Add a new user with required details
|   |   |       
│   │   ├── ViewUser/          # displays details of a specific user
│   │   
│   │       
│   └── NotFound/              # handles invalid routes
|
├── App.js
|
├── index.js
|
```
---

## 🚦 Getting Started

### 1️⃣ Clone the Repository  
        ```bash
        git clone https://github.com/Vinay-Sathupati/user-management-dashboard.git
        cd user-management-app
        ```
### 2️⃣ Install Dependencies
        ```
        npm install
        ```
### 3️⃣ Start the Development Server
        ```
        npm start
        ```

The app will run at http://localhost:3000/

## 🪞 Reflections

### 🔧 Challenges Faced  
- **UI/UX Decisions:** Initially, I was unsure how to structure the UI in a clean and scalable way. I experimented with different layouts and flows before finally deciding to make **User Management the parent component**, containing **three main tabs** (User List, Add User, User Details).
- **Form Validation with Pop-ups:** A key challenge was that **form validations (`required` fields)** were being bypassed whenever the **confirmation popup** was triggered. Since the popup button could not use the default `submit` type, the validation step was skipped. To fix this, I introduced a **new state variable** that ensured all form fields were validated **before the popup was shown**. This guaranteed a proper validation workflow.

---

### 🚀 Improvements & Future Enhancements
- **Responsive Design:** Due to time constraints, the current version is optimized for desktop view. Implementing **mobile and tablet responsiveness** will be a priority in future updates.
- **Real Backend Integration:** Connect to a real backend with persistent storage instead of the mock JSONPlaceholder API.

## 🎁 Contribution
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.