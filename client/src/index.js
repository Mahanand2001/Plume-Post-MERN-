import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Layout from './components/Layout';
import ErrorPage from './Pages/ErrorPage';
import Home from './Pages/Home';
import PostDetails from './Pages/PostDetail';
import Register from './Pages/Register';
import Login from './Pages/Login';
import UserProfile from './Pages/UserProfile';
import Authors from './Pages/Authors';
import CreatePosts from './Pages/CreatePosts';
import EditPost from './Pages/EditPost';
import CategoryPosts from './Pages/CategoryPosts';
import AuthorPosts from './Pages/AuthorPosts';
import Dashboard from './Pages/Dashboard';
import Logout from './Pages/Logout';
import DeletePost from './Pages/DeletePost';
import UserProvider from './context/userContext';

const router = createBrowserRouter([
  {
    path: "/",
    element: <UserProvider><Layout/></UserProvider>,
    errorElement: <ErrorPage />,
    children:[
      {index: true, element: <Home />},
      {path: "posts/:id", element: <PostDetails />},
      {path:"/register", element: <Register/>},
      {path:"login", element: <Login/>},
      {path:"profile/:id", element: <UserProfile/>},
      {path:"authors", element: <Authors/>},
      {path:"create", element: <CreatePosts/>},
      {path:"posts/:id/edit", element: <EditPost/>},
      {path:"posts/:id/delete", element: <DeletePost/>},
      {path:"posts/:categories/:category", element: <CategoryPosts/>},
      {path:"posts/users/:id", element: <AuthorPosts/>},
      {path:"myposts/:id", element: <Dashboard/>},
      {path:"logout", element: <Logout/>},
      {path:"myposts/:id", element: <Dashboard/>},
    ] 
  }

])

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

