// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className=\"App\">
//       <header className=\"App-header\">
//         <img src={logo} className=\"App-logo\" alt=\"logo\" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className=\"App-link\"
//           href=\"https://reactjs.org\"
//           target=\"_blank\"
//           rel=\"noopener noreferrer\"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;



import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import SignUp from './components/SignUpForm';
import Profile from './components/Profile';
import AllBookings from './components/AllBookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className=\"App\">
        <Routes>
          {/* Public Routes */}
          <Route path=\"/login\" element={<Login />} />
          <Route path=\"/signup\" element={<SignUp />} />
          
          {/* Protected Routes */}
          <Route path=\"/profile\" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          
          <Route path=\"/bookings\" element={
            <ProtectedRoute>
              <AllBookings />
            </ProtectedRoute>
          } />
          
          {/* Default redirect */}
          <Route path=\"/\" element={<Navigate to=\"/login\" replace />} />
          
          {/* 404 fallback */}
          <Route path=\"*\" element={<Navigate to=\"/login\" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App