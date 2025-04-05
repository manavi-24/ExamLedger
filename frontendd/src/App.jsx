// import React, { useState } from 'react';
// import { BookOpen, CheckCircle } from 'lucide-react';
// import Login from './components/Login';
// import ExamSelection from './components/ExamSelection';
// import ExamInterface from './components/ExamInterface';

// function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedSubject, setSelectedSubject] = useState('');
//   const [examStarted, setExamStarted] = useState(false);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleSubjectSelect = (subject) => {
//     setSelectedSubject(subject);
//     setExamStarted(true);
//   };

//   const handleExamSubmit = (answers) => {
//     console.log('Exam submitted:', answers);
//     alert('Exam submitted successfully!');
//     setExamStarted(false);
//     setSelectedSubject('');
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//       <nav className="bg-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 py-4">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-2">
//               <BookOpen className="h-6 w-6 text-indigo-600" />
//               <span className="text-xl font-bold text-gray-800">DecentralExam</span>
//             </div>
//             {isLoggedIn && (
//               <div className="flex items-center space-x-2">
//                 <CheckCircle className="h-5 w-5 text-green-500" />
//                 <span className="text-sm text-gray-600">Connected</span>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       <main className="max-w-4xl mx-auto px-4 py-8">
//         {!isLoggedIn ? (
//           <Login onLogin={handleLogin} />
//         ) : !examStarted ? (
//           <ExamSelection onSelectSubject={handleSubjectSelect} />
//         ) : (
//           <ExamInterface 
//             subject={selectedSubject}
//             onSubmit={handleExamSubmit}
//           />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;




import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { BookOpen, CheckCircle } from 'lucide-react';

import Login from './components/Login';
import ExamSelection from './components/ExamSelection';
import ExamInterface from './components/ExamInterface';

function Navbar({ isLoggedIn }) {
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-indigo-600" />
            <span className="text-xl font-bold text-gray-800">DecentralExam</span>
          </div>
          {isLoggedIn && (
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span className="text-sm text-gray-600">Connected</span>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('');

  const navigate = useNavigate();

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/exams');
  };

  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    navigate(`/exam/${subjectId}`);
  };

  const handleExamSubmit = (answers) => {
    console.log('Exam submitted:', answers);
    alert('Exam submitted successfully!');
    navigate('/exams');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <Navbar isLoggedIn={isLoggedIn} />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Routes>
          <Route path="/" element={<Login onLogin={handleLogin} />} />
          <Route
            path="/exams"
            element={<ExamSelection onSelectSubject={handleSubjectSelect} />}
          />
          <Route
            path="/exam/:subjectId"
            element={
              <ExamInterface
                subject={selectedSubject}
                onSubmit={handleExamSubmit}
              />
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
