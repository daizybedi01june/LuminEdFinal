import React, { useState, useEffect, useCallback } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartLine, faUserGraduate, faFileAlt, faTrashAlt, faExclamationCircle, faBookOpen } from '@fortawesome/free-solid-svg-icons'; // Added faBookOpen
import { motion, AnimatePresence } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
// NOTE: MetricCard component content is omitted; assume it is imported or defined elsewhere

// --- API CONFIGURATION ---
const API_BASE_URL = "https://691168ea7686c0e9c20d4bd1.mockapi.io";
const SUBJECTS_ENDPOINT = `${API_BASE_URL}/subjects`;
// New Mock Endpoint (Conceptual)
const BOOK_SUGGESTIONS_ENDPOINT = (subjectName) => 
    `${API_BASE_URL}/books?subject=${encodeURIComponent(subjectName)}`;


// --- Utility Function ---
const calculateGPA = (marks) => {
    // Ensure marks is treated as a number
    marks = parseFloat(marks) || 0; 
    if (marks >= 90) return 10;
    if (marks >= 80) return 9;
    if (marks >= 70) return 8;
    if (marks >= 60) return 7;
    if (marks >= 50) return 6;
    if (marks >= 40) return 5;
    return 0;
};

// --- API CALL FUNCTIONS ---

// READ (GET)
const apiFetchSubjects = async () => {
  const response = await fetch(SUBJECTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Failed to fetch subjects. Status: ${response.status}`);
  }
  const data = await response.json();
  return data.map(subject => {
    const marks = parseFloat(subject.marks) || 0;
    const credits = parseFloat(subject.credits) || 0;
    return {
      ...subject,
      marks,
      credits,
      gpa: calculateGPA(marks),
    };
  });
};

// CREATE (POST)
const apiAddSubject = async (newSubjectData) => {
  const gpa = calculateGPA(newSubjectData.marks);
  const subjectWithGpa = { ...newSubjectData, gpa };

  const response = await fetch(SUBJECTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(subjectWithGpa),
  });
  
  if (!response.ok) {
    const errorText = await response.text(); 
    throw new Error(`Failed to add subject. Status: ${response.status}. Server response: ${errorText.substring(0, 100)}`);
  }
  
  const addedSubject = await response.json(); 
  
  // Re-map the returned data to ensure local state has correct numeric types
  const marks = parseFloat(addedSubject.marks) || 0;
  const credits = parseFloat(addedSubject.credits) || 0;
  return { 
      ...addedSubject, 
      marks: marks,
      credits: credits,
      gpa: calculateGPA(marks) 
  };
};

// DELETE (DELETE)
const apiDeleteSubject = async (id) => {
  const response = await fetch(`${SUBJECTS_ENDPOINT}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`Failed to delete subject with ID: ${id}. Status: ${response.status}`);
  }
  return { success: true, id };
};

// Mock CGPA Calculation API
const apiCalculateCGPA = (subjects) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!subjects || subjects.length === 0) {
        resolve({ cgpa: 0 });
        return;
      }
      const validSubjects = subjects.filter(s => s.credits > 0 && s.gpa !== undefined);
      const totalWeightedGPA = validSubjects.reduce((acc, subj) => acc + (subj.gpa * subj.credits), 0);
      const totalCredits = validSubjects.reduce((acc, subj) => acc + subj.credits, 0);
      const calculatedCGPA = totalCredits > 0 ? totalWeightedGPA / totalCredits : 0;
      resolve({ cgpa: calculatedCGPA });
    }, 300);
  });
};


const apiFetchBookSuggestions = async (subjectName) => {
    // Mock Data based on subject name
    const mockBooks = {
        // --- UPDATED SUBJECTS (9 Books Each) ---
        
        Physics: [
            { id: 101, title: "Concepts of Physics (Vol 1 & 2)", author: "H.C. Verma", rating: 4.8 },
            { id: 102, title: "Fundamentals of Physics", author: "Halliday, Resnick & Walker", rating: 4.5 },
            { id: 103, title: "University Physics", author: "Young and Freedman", rating: 4.4 },
            { id: 104, title: "The Feynman Lectures on Physics (Vol I, II, III)", author: "Richard Feynman", rating: 4.9 },
            { id: 105, title: "Introduction to Electrodynamics", author: "David J. Griffiths", rating: 4.7 },
            { id: 106, title: "Classical Mechanics", author: "Herbert Goldstein", rating: 4.6 },
            { id: 107, title: "Quantum Mechanics", author: "D.J. Griffiths", rating: 4.5 },
            { id: 108, title: "Optics", author: "Eugene Hecht", rating: 4.3 },
            { id: 109, title: "Solid State Physics", author: "Charles Kittel", rating: 4.2 },
        ],
        Mathematics: [
            { id: 201, title: "Higher Engineering Mathematics", author: "B.S. Grewal", rating: 4.7 },
            { id: 202, title: "Calculus: Early Transcendentals", author: "James Stewart", rating: 4.6 },
            { id: 203, title: "Advanced Modern Algebra", author: "Joseph Rotman", rating: 4.2 },
            { id: 204, title: "Principles of Mathematical Analysis", author: "Walter Rudin", rating: 4.9 },
            { id: 205, title: "Differential Equations with Boundary Value Problems", author: "Dennis G. Zill", rating: 4.3 },
            { id: 206, title: "Topology", author: "James Munkres", rating: 4.5 },
            { id: 207, title: "Concrete Mathematics", author: "Graham, Knuth, Patashnik", rating: 4.8 },
            { id: 208, title: "Introduction to Linear Algebra", author: "Gilbert Strang", rating: 4.6 },
            { id: 209, title: "Complex Analysis", author: "Lars V. Ahlfors", rating: 4.4 },
        ],
        Programming: [
            { id: 301, title: "The Mythical Man-Month", author: "Frederick Brooks", rating: 4.1 },
            { id: 302, title: "Clean Code: A Handbook of Agile Software Craftsmanship", author: "Robert C. Martin", rating: 4.9 },
            { id: 303, title: "Design Patterns: Elements of Reusable Object-Oriented Software", author: "Gamma, Helm, Johnson, Vlissides", rating: 4.7 },
            { id: 304, title: "Code Complete: A Practical Handbook of Software Construction", author: "Steve McConnell", rating: 4.8 },
            { id: 305, title: "The Pragmatic Programmer: Your Journey To Mastery", author: "David Thomas, Andrew Hunt", rating: 4.6 },
            { id: 306, title: "Introduction to Algorithms (CLRS)", author: "Cormen, Leiserson, Rivest, Stein", rating: 4.5 },
            { id: 307, title: "Refactoring: Improving the Design of Existing Code", author: "Martin Fowler", rating: 4.4 },
            { id: 308, title: "Structure and Interpretation of Computer Programs (SICP)", author: "Abelson & Sussman", rating: 4.3 },
            { id: 309, title: "Cracking the Coding Interview", author: "Gayle Laakmann McDowell", rating: 4.7 },
        ],
        
        // --- OTHER SUBJECTS (from previous response, maintained) ---

        English: [
            { id: 401, title: "The Elements of Style", author: "Strunk and White", rating: 4.6 },
            { id: 402, title: "On Writing Well", author: "William Zinsser", rating: 4.5 },
            { id: 403, title: "The Great Gatsby", author: "F. Scott Fitzgerald", rating: 4.8 },
            { id: 404, title: "To Kill a Mockingbird", author: "Harper Lee", rating: 4.7 },
            { id: 405, title: "Sapiens: A Brief History of Humankind", author: "Yuval Noah Harari", rating: 4.9 },
            { id: 406, title: "1984", author: "George Orwell", rating: 4.8 },
            { id: 407, title: "The Art of Fiction", author: "David Lodge", rating: 4.3 },
            { id: 408, title: "Word Power Made Easy", author: "Norman Lewis", rating: 4.5 },
            { id: 409, title: "Bird by Bird", author: "Anne Lamott", rating: 4.4 },
        ],
        Hindi: [
            { id: 501, title: "Godaan", author: "Munshi Premchand", rating: 4.7 },
            { id: 502, title: "Rashmirathi", author: "Ramdhari Singh 'Dinkar'", rating: 4.8 },
            { id: 503, title: "Madhushala", author: "Harivansh Rai Bachchan", rating: 4.6 },
            { id: 504, title: "Agan Ke Paar", author: "Sachchidananda Vatsyayan 'Agyeya'", rating: 4.5 },
            { id: 505, title: "Chidambara", author: "Sumitranandan Pant", rating: 4.4 },
            { id: 506, title: "Kashi Ka Assi", author: "Kashinath Singh", rating: 4.2 },
            { id: 507, title: "Maila Anchal", author: "Phanishwar Nath 'Renu'", rating: 4.3 },
            { id: 508, title: "Ek Chammach Dhoop", author: "Divik Ramesh", rating: 4.1 },
            { id: 509, title: "Nirmala", author: "Munshi Premchand", rating: 4.7 },
        ],
        Maths: [ 
            { id: 601, title: "Calculus, 7th Edition", author: "James Stewart", rating: 4.6 },
            { id: 602, title: "Discrete Mathematics and Its Applications", author: "Kenneth H. Rosen", rating: 4.5 },
            { id: 603, title: "Linear Algebra Done Right", author: "Sheldon Axler", rating: 4.7 },
            { id: 604, title: "A Book of Abstract Algebra", author: "Charles C. Pinter", rating: 4.4 },
            { id: 605, title: "Real Analysis: A First Course", author: "Russell A. Gordon", rating: 4.3 },
            { id: 606, title: "Differential Equations with Boundary Value Problems", author: "Dennis G. Zill", rating: 4.2 },
            { id: 607, title: "Probability and Statistics for Engineers", author: "Ronald E. Walpole", rating: 4.1 },
            { id: 608, title: "Introduction to Topology", author: "James R. Munkres", rating: 4.0 },
            { id: 609, title: "Complex Variables and Applications", author: "Churchill & Brown", rating: 4.5 },
        ],
        Science: [
            { id: 701, title: "Cosmos", author: "Carl Sagan", rating: 4.9 },
            { id: 702, title: "A Brief History of Time", author: "Stephen Hawking", rating: 4.7 },
            { id: 703, title: "The Selfish Gene", author: "Richard Dawkins", rating: 4.6 },
            { id: 704, title: "Silent Spring", author: "Rachel Carson", rating: 4.8 },
            { id: 705, title: "The Fabric of the Cosmos", author: "Brian Greene", rating: 4.5 },
            { id: 706, title: "Physics of the Impossible", author: "Michio Kaku", rating: 4.4 },
            { id: 707, title: "Chemistry: The Central Science", author: "Brown, LeMay, Bursten", rating: 4.3 },
            { id: 708, title: "Biology: A Global Approach", author: "Campbell & Reece", rating: 4.2 },
            { id: 709, title: "The Demon-Haunted World", author: "Carl Sagan", rating: 4.7 },
        ],
        "Social Studies": [
            { id: 801, title: "A People's History of the United States", author: "Howard Zinn", rating: 4.6 },
            { id: 802, title: "The Wealth of Nations", author: "Adam Smith", rating: 4.5 },
            { id: 803, title: "Guns, Germs, and Steel", author: "Jared Diamond", rating: 4.8 },
            { id: 804, title: "Orientalism", author: "Edward Said", rating: 4.7 },
            { id: 805, title: "The Communist Manifesto", author: "Karl Marx", rating: 4.1 },
            { id: 806, title: "Democracy in America", author: "Alexis de Tocqueville", rating: 4.2 },
            { id: 807, title: "The Power of Geography", author: "Tim Marshall", rating: 4.4 },
            { id: 808, title: "Why Nations Fail", author: "Acemoglu & Robinson", rating: 4.5 },
            { id: 809, title: "Manufacturing Consent", author: "Chomsky & Herman", rating: 4.3 },
        ],
        Deca: [ 
            { id: 901, title: "The 4-Hour Workweek", author: "Timothy Ferriss", rating: 4.3 },
            { id: 902, title: "Contagious: Why Things Catch On", author: "Jonah Berger", rating: 4.4 },
            { id: 903, title: "Good to Great", author: "Jim Collins", rating: 4.7 },
            { id: 904, title: "Purple Cow", author: "Seth Godin", rating: 4.6 },
            { id: 905, title: "The Lean Startup", author: "Eric Ries", rating: 4.5 },
            { id: 906, title: "Influence: The Psychology of Persuasion", author: "Robert Cialdini", rating: 4.8 },
            { id: 907, title: "Ogilvy on Advertising", author: "David Ogilvy", rating: 4.7 },
            { id: 908, title: "Built to Last", author: "Collins & Porras", rating: 4.5 },
            { id: 909, title: "Crossing the Chasm", author: "Geoffrey Moore", rating: 4.3 },
        ],
        Python: [
            { id: 1001, title: "Fluent Python", author: "Luciano Ramalho", rating: 4.9 },
            { id: 1002, title: "Python Crash Course", author: "Eric Matthes", rating: 4.6 },
            { id: 1003, title: "Automate the Boring Stuff with Python", author: "Al Sweigart", rating: 4.5 },
            { id: 1004, title: "Introduction to Machine Learning with Python", author: "Müller & Guido", rating: 4.7 },
            { id: 1005, title: "Serious Python", author: "Julien Danjou", rating: 4.3 },
            { id: 1006, title: "Code Complete: Second Edition", author: "Steve McConnell", rating: 4.8 },
            { id: 1007, title: "Grokking Algorithms", author: "Aditya Bhargava", rating: 4.6 },
            { id: 1008, title: "Dive Into Python 3", author: "Mark Pilgrim", rating: 4.4 },
            { id: 1009, title: "Head First Python", author: "Paul Barry", rating: 4.2 },
        ],

        default: [
            { id: 999, title: "The Art of Learning", author: "Josh Waitzkin", rating: 4.5 },
            { id: 998, title: "Deep Work", author: "Cal Newport", rating: 4.6 },
        ]
    };
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500)); 

    const books = mockBooks[subjectName] || mockBooks.default;

    // Simulate potential API error
    // if (Math.random() < 0.05) { 
    //     throw new Error("Mock API failed to fetch books.");
    // }

    return books;
};


const BookSuggestions = ({ subjects }) => {
    // 1. Get unique subject names from the data
    const uniqueSubjectNames = [...new Set(subjects.map(s => s.name))];
    
    // 2. Initialize with the first unique subject name found
    const [selectedSubject, setSelectedSubject] = useState(uniqueSubjectNames[0] || '');
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    // State for Load More: Tracks how many books are currently visible
    const BOOKS_PER_PAGE = 3;
    const [visibleBookCount, setVisibleBookCount] = useState(BOOKS_PER_PAGE); // MODIFIED: Tracks visible items

    const fetchBooks = useCallback(async (subjectName) => {
        if (!subjectName) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const books = await apiFetchBookSuggestions(subjectName);
            setSuggestions(books);
            // MODIFIED: Reset visible book count to 3 when new subject data is fetched
            setVisibleBookCount(BOOKS_PER_PAGE); 
        } catch (err) {
            setError(err.message);
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // 🌟 FIX 1: Set initial subject on mount or when the subject list is first loaded/changes
    useEffect(() => {
        // If there are subjects, and the currently selected subject is not in the list (or is empty), 
        // set the selection to the first subject.
        if (uniqueSubjectNames.length > 0 && !uniqueSubjectNames.includes(selectedSubject)) {
            setSelectedSubject(uniqueSubjectNames[0]);
        } else if (uniqueSubjectNames.length === 0) {
             setSelectedSubject('');
        }
    }, [subjects.length, uniqueSubjectNames, selectedSubject]);


    // 🌟 FIX 2: Only fetch books when the selectedSubject state *actually* changes.
    useEffect(() => {
        fetchBooks(selectedSubject);
    }, [selectedSubject, fetchBooks]);

    // 🌟 FIX: The handler only updates state. The calculation logic is moved out of it.
    const handleSubjectChange = (e) => {
        // This function is the single source of truth for changing the selection.
        setSelectedSubject(e.target.value);
    }; // <-- CORRECTLY CLOSED FUNCTION

    // --- LOAD MORE LOGIC --- // MODIFIED: Replaced Pagination Logic
    
    // The final array slice used for rendering
    const currentBooks = suggestions.slice(0, visibleBookCount);

    const handleLoadMore = () => {
        // Increment the visible count, capping it at the total number of suggestions
        setVisibleBookCount(prevCount => Math.min(prevCount + BOOKS_PER_PAGE, suggestions.length));
    };
    // --- END LOAD MORE LOGIC ---


    return (
        <section className="content-section">
            <h3 className="text-3xl font-semibold text-blue-400 mb-6">4. Personalized Book Suggestions 📚</h3>
            
            <div className="bg-card p-6 rounded-xl border border-blue-700/50 space-y-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <label className="text-gray-300 font-medium whitespace-nowrap">Select Subject:</label>
                    <select
                        value={selectedSubject}
                        onChange={handleSubjectChange}
                        className="p-2 rounded bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-white flex-1 min-w-48"
                        disabled={uniqueSubjectNames.length === 0}
                    >
                        {uniqueSubjectNames.length > 0 ? (
                            uniqueSubjectNames.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))
                        ) : (
                            <option value="">No subjects added</option>
                        )}
                    </select>
                </div>

                {uniqueSubjectNames.length === 0 && (
                    <p className="text-gray-400 italic">Please add subjects in the Entry section to receive book suggestions.</p>
                )}
                
                {isLoading && uniqueSubjectNames.length > 0 && (
                    <p className="text-yellow-400 italic">Loading suggestions for **{selectedSubject}**...</p>
                )}

                {error && (
                    <div className="p-3 bg-red-800/50 border border-red-500 rounded-lg text-red-300">
                        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                        Error fetching books: {error}
                    </div>
                )}

                {!isLoading && !error && uniqueSubjectNames.length > 0 && (
                    <>
                        <h4 className="text-xl font-semibold mt-6 text-white">Suggested Reading List for **{selectedSubject}**</h4>
                        
                        {/* 1. Book List: Iterates over the sliced array (currentBooks) */}
                        <div className="book-list">
                            {currentBooks.length > 0 ? (
                                <ul className="list-none space-y-3">
                                    <AnimatePresence initial={false}>
                                    {currentBooks.map((book) => (
                                        <motion.li 
                                            key={book.id} 
                                            className="p-4 bg-gray-800 rounded-lg shadow-md border-l-4 border-blue-500"
                                            initial={{ opacity: 0, y: 10 }} // Adjusted for Load More effect
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <p className="text-lg font-bold text-blue-300">{book.title}</p>
                                            <p className="text-sm text-gray-400">By: {book.author}</p>
                                            <p className="text-sm text-yellow-500">Rating: {book.rating.toFixed(1)}/5.0</p>
                                        </motion.li>
                                    ))}
                                    </AnimatePresence>
                                </ul>
                            ) : (
                                <p className="text-gray-400 italic">No specific book suggestions found for {selectedSubject}. Try adding more diverse subjects!</p>
                            )}
                        </div>

                        {/* 2. Load More Control: Only show if not all books are visible */}
                        {visibleBookCount < suggestions.length && (
                            <div className="flex justify-center mt-6">
                                <button 
                                    onClick={handleLoadMore} 
                                    className="px-6 py-3 bg-green-600 rounded-lg font-semibold hover:bg-green-500 transition shadow-lg"
                                >
                                    Load More ({suggestions.length - visibleBookCount} remaining)
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    );
};


const SubjectAnalysis = ({ subjects }) => {
    // Calculate overall performance
    const calculateOverallPerformance = () => {
        if (!subjects || subjects.length === 0) return 0;
        const totalMarksObtained = subjects.reduce((sum, subj) => sum + subj.marks * subj.credits, 0);
        const totalMaxMarks = subjects.reduce((sum, subj) => sum + 100 * subj.credits, 0); // Assuming 100 max marks
        
        return totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    };
    
    const overallPercentage = calculateOverallPerformance();
    
    // Group data for the charts
    const chartDataByExamType = () => {
        const grouped = subjects.reduce((acc, curr) => {
            const key = curr.examType;
            if (!acc[key]) acc[key] = { examType: key, totalMarks: 0, totalCredits: 0, count: 0 };
            acc[key].totalMarks += curr.marks * curr.credits;
            acc[key].totalCredits += curr.credits;
            acc[key].count++;
            return acc;
        }, {});

        return Object.values(grouped).map(item => ({
            ...item,
            avgMarks: item.totalCredits > 0 ? (item.totalMarks / item.totalCredits) : 0, // Use weighted average with guard
        }));
    };
    
    const chartDataBySubject = () => {
        const grouped = subjects.reduce((acc, curr) => {
            // Key is subject name + exam type for unique entries
            const key = `${curr.name}_${curr.examType}`; 
            if (!acc[key]) acc[key] = { 
                name: curr.name, 
                examType: curr.examType, 
                marks: curr.marks 
            };
            return acc;
        }, {});
        // Convert back to an array for recharts
        return Object.values(grouped);
    };

    // Fix for CGPA display calculation (preserve UI but ensure result formatting)
    const cgpaValue = subjects.length > 0
      ? (subjects.reduce((acc, subj) => acc + (subj.gpa * subj.credits), 0) / Math.max(1, subjects.reduce((acc, subj) => acc + subj.credits, 0)))
      : null;

    const cgpaDisplay = cgpaValue !== null ? cgpaValue.toFixed(2) : "N/A";

    return (
        <section className="content-section">
            <h3 className="text-3xl font-semibold text-blue-400 mb-6">2. Performance Analysis 📈</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {/* MetricCard Placeholder 1: CGPA */}
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-blue-700/30">
                    <p className="text-sm text-gray-400">Calculated CGPA</p>
                    <p className="text-2xl font-bold text-green-400">
                        {cgpaDisplay}
                    </p>
                </div>
                {/* MetricCard Placeholder 2: Total Credits */}
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-blue-700/30">
                    <p className="text-sm text-gray-400">Total Credits Attempted</p>
                    <p className="text-2xl font-bold text-blue-400">
                        {subjects.reduce((sum, subj) => sum + subj.credits, 0)}
                    </p>
                </div>
                {/* MetricCard Placeholder 3: Overall Percentage */}
                <div className="bg-gray-800 p-4 rounded-xl shadow-lg border border-blue-700/30">
                    <p className="text-sm text-gray-400">Overall Percentage</p>
                    <p className="text-2xl font-bold text-green-400">
                        {subjects.length ? `${overallPercentage.toFixed(2)}%` : "N/A"}
                    </p>
                </div>
            </div>

            <div className="bg-card p-6 rounded-xl border border-blue-700/50 space-y-8">
                <h4 className="text-xl font-semibold text-blue-300">Performance Trend by Subject</h4>

                {/* NEW: make the two charts appear side-by-side on md+ screens while keeping responsive stacking on small screens */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full h-[300px] bg-transparent">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartDataBySubject()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="name" stroke="#9CA3AF" interval={0} angle={-15} textAnchor="end" height={50} />
                                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                                    formatter={(value, name, props) => [`${value}% (${props.payload.examType})`, props.payload.name]}
                                />
                                <Legend />
                                <Line type="monotone" dataKey="marks" stroke="#3B82F6" strokeWidth={2} activeDot={{ r: 8 }} name="Marks (%)" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="w-full h-[300px] bg-transparent">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartDataByExamType()}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="examType" stroke="#9CA3AF" />
                                <YAxis stroke="#9CA3AF" domain={[0, 100]} />
                                <Tooltip 
                                    contentStyle={{ backgroundColor: '#1F2937', border: '1px solid #4B5563' }}
                                    formatter={(value) => [`${value.toFixed(2)}%`, 'Average Weighted Marks']}
                                />
                                <Legend />
                                <Bar dataKey="avgMarks" fill="#4ADE80" name="Avg Marks (%)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </section>
    );
};

const SubjectReport = ({ subjects }) => {
    // Calculate overall performance
    const calculateOverallPerformance = () => {
        if (!subjects || subjects.length === 0) return 0;
        const totalMarksObtained = subjects.reduce((sum, subj) => sum + subj.marks * subj.credits, 0);
        const totalMaxMarks = subjects.reduce((sum, subj) => sum + 100 * subj.credits, 0); // Assuming 100 max marks
        
        return totalMaxMarks > 0 ? (totalMarksObtained / totalMaxMarks) * 100 : 0;
    };
    
    const overallPercentage = calculateOverallPerformance();
    
    // Group by subject for detailed feedback
    const groupedBySubject = subjects.reduce((acc, subj) => {
        if (!acc[subj.name]) {
            acc[subj.name] = [];
        }
        acc[subj.name].push({
            id: subj.id,
            examType: subj.examType,
            marks: subj.marks,
            credits: subj.credits,
        });
        return acc;
    }, {});

    return (
        <section className="content-section">
            <h3 className="text-3xl font-semibold text-blue-400 mb-6">3. Detailed Performance Report 📋</h3>
            
            <div className="bg-card p-6 rounded-xl border border-blue-700/50 space-y-8">
                {/* Subject-wise Feedback Section */}
                <div className="space-y-6">
                    <h4 className="text-2xl font-bold text-blue-300">Subject-wise Feedback</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {Object.entries(groupedBySubject).map(([subj, exams]) => {
                            const avgMarks = exams.reduce((a, e) => a + e.marks, 0) / exams.length;
                            let feedback = "";
                            if (avgMarks >= 90) 
                                feedback = "Exceptional performance! This is a core strength.";
                            else if (avgMarks >= 80) 
                                feedback = "Excellent work! Keep aiming for consistency to master this subject.";
                            else if (avgMarks >= 70) 
                                feedback = "Very solid results. Focus on reinforcing key areas for higher grades.";
                            else if (avgMarks >= 60) 
                                feedback = "Good progress! With sharper consistency, you’ll turn this into a strength.";
                            else if (avgMarks >= 50) 
                                feedback = "Decent foundation! Regular practice will help you unlock better results.";
                            else 
                                feedback = "Needs immediate attention—strengthen your basics and seek conceptual clarity.";

                            return (
                                <div key={subj} className="p-4 bg-gray-800 rounded-lg shadow-md border-l-4 border-blue-500">
                                  <h5 className="text-lg font-semibold text-blue-400">{subj} (Avg: {avgMarks.toFixed(1)}%)</h5>
                                  <p className="text-sm text-gray-300 mb-2">{feedback}</p>
                                  <ul className="text-gray-400 ml-4 list-disc text-sm"> 
                                    {exams.map((e, index) => (
                                      <li key={e.id || index}>**{e.examType}**: {e.marks}%</li> 
                                    ))}
                                  </ul>
                                </div>
                            );
                        })}
                    </div>
                </div>
                {/* Summary Feedback */}
                <div className="p-4 bg-gray-700/50 rounded-lg border border-blue-600/50">
                    <h4 className="text-xl font-bold text-white mb-2">Overall Summary ({overallPercentage.toFixed(2)}%)</h4>
                    
                    {overallPercentage >= 85 && (
                        <p className="text-green-400 font-semibold">
                            Outstanding work! Your consistency and dedication across all subjects are commendable.
                        </p>
                    )}
                    {overallPercentage >= 70 && overallPercentage < 85 && (
                        <p className="text-yellow-400 font-semibold">
                            Strong academic journey so far! Maintain this momentum and fine-tune weaker areas.
                        </p>
                    )}
                    {overallPercentage < 70 && (
                        <p className="text-red-400 font-semibold">
                            A dedicated effort in conceptual understanding across multiple subjects could significantly boost your overall percentage.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
};


// Custom component for floating error message (omitted content)
const ErrorTooltip = ({ message }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 bottom-full mb-2 p-2 bg-red-700 text-white text-xs rounded shadow-lg z-10 whitespace-nowrap"
        >
            {message}
        </motion.div>
    );
};

// Custom component for Delete Confirmation Modal (omitted content)
const DeleteModal = ({ subject, isUpdatingData, executeDelete, closeModal }) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-75 z-40 flex items-center justify-center p-4"
        >
            <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 50, opacity: 0 }}
                className="bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl border border-red-500/50"
            >
                <h3 className="text-2xl font-bold text-red-400 mb-4">Confirm Deletion</h3>
                <p className="text-gray-300 mb-6">
                    Are you sure you want to delete the entry for **{subject.name}** ({subject.examType}, {subject.marks}%)? This action cannot be undone.
                </p>
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={closeModal}
                        className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition disabled:opacity-50"
                        disabled={isUpdatingData}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={executeDelete}
                        className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-500 transition disabled:opacity-50"
                        disabled={isUpdatingData}
                    >
                        {isUpdatingData ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            </motion.div>
        </motion.div>
    );
};


const StudentDashboard = () => {
  const [activeSection, setActiveSection] = useState("entry-view");
  const [subjectName, setSubjectName] = useState("");
  const [marks, setMarks] = useState("");
  const [credits, setCredits] = useState("");
  const [examType, setExamType] = useState("Midterm");
  const [subjects, setSubjects] = useState([]);
  const [cgpa, setCgpa] = useState(0);
  const [isLoadingCgpa, setIsLoadingCgpa] = useState(false);
  const [isUpdatingData, setIsUpdatingData] = useState(false); 

    // STATE FOR INLINE FIELD VALIDATION POP-UPS
    const [validationErrors, setValidationErrors] = useState({}); 
    
    // STATE FOR DELETE MODAL
    const [modalSubjectId, setModalSubjectId] = useState(null); 
    
    // STATE FOR GLOBAL TOAST (Success/API failures)
    const [globalToast, setGlobalToast] = useState(null); 

  // --- Initial Data Load (READ) ---
  useEffect(() => {
    const loadSubjects = async () => {
      setIsUpdatingData(true);
      try {
        const data = await apiFetchSubjects();
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setGlobalToast({ type: 'error', message: `Initial load failed: ${error.message.substring(0, 50)}...` });
      } finally {
        setIsUpdatingData(false);
      }
    };
    loadSubjects();
  }, []);

    // --- GLOBAL TOAST AUTOHIDE EFFECT (Modal/Toast components omitted for brevity, but logic remains) ---
    useEffect(() => {
        if (globalToast) {
            const timer = setTimeout(() => {
                setGlobalToast(null);
            }, 5000); // Hide after 5 seconds
            return () => clearTimeout(timer);
        }
    }, [globalToast]);

  // --- CGPA Calculation ---
  const fetchCgpa = useCallback(async () => {
    setIsLoadingCgpa(true);
    try {
      const data = await apiCalculateCGPA(subjects); 
      setCgpa(data.cgpa);
    } catch (error) {
      console.error("Error fetching CGPA:", error);
      setCgpa(0);
    } finally {
      setIsLoadingCgpa(false);
    }
  }, [subjects]);

  useEffect(() => {
    fetchCgpa();
  }, [fetchCgpa]);

    // --- INLINE POP-UP VALIDATION LOGIC ---
    const validateInputs = () => {
        const errors = {};
        const parsedMarks = parseFloat(marks);
        const parsedCredits = parseFloat(credits);

        if (!subjectName.trim()) {
            errors.subjectName = "Subject name cannot be empty.";
        }
        if (isNaN(parsedMarks) || parsedMarks < 0 || parsedMarks > 100) {
            errors.marks = "Marks must be between 0 and 100.";
        }
        if (isNaN(parsedCredits) || parsedCredits <= 0) {
            errors.credits = "Credits must be a positive number.";
        }

        setValidationErrors(errors);
        return Object.keys(errors).length === 0;
    };
    
    // Helper function to validate a single field on blur or change
    // Accepts optional value param to validate against the new value immediately
    const validateField = (fieldName, value) => {
        const nextErrors = { ...validationErrors };

        if (fieldName === 'subjectName') {
            const val = value !== undefined ? value : subjectName;
            if (!val.trim()) {
                nextErrors.subjectName = "Subject name cannot be empty.";
            } else {
                delete nextErrors.subjectName;
            }
        } else if (fieldName === 'marks') {
            const val = value !== undefined ? value : marks;
            const parsed = parseFloat(val);
            if (isNaN(parsed) || parsed < 0 || parsed > 100) {
                nextErrors.marks = "Marks must be between 0 and 100.";
            } else {
                delete nextErrors.marks;
            }
        } else if (fieldName === 'credits') {
            const val = value !== undefined ? value : credits;
            const parsed = parseFloat(val);
            if (isNaN(parsed) || parsed <= 0) {
                nextErrors.credits = "Credits must be a positive number.";
            } else {
                delete nextErrors.credits;
            }
        }

        // Clean any undefined keys and update state
        Object.keys(nextErrors).forEach(k => {
            if (nextErrors[k] === undefined) delete nextErrors[k];
        });

        setValidationErrors(nextErrors);
    };

  // --- Add Subject (CREATE API) ---
  const addSubject = async () => {
    
    if (!validateInputs()) {
        return; // Stop if validation failed 
    }
    
    const parsedMarks = parseFloat(marks);
    const parsedCredits = parseFloat(credits);
    
    setIsUpdatingData(true);
    
    const newSubjectData = {
      name: subjectName.trim(), 
      marks: parsedMarks,
      credits: parsedCredits,
      examType,
    };
    
    try {
      const addedSubject = await apiAddSubject(newSubjectData);
      // Append the newly added subject to local state so UI updates immediately
      setSubjects(prev => [...prev, addedSubject]);
      setValidationErrors({}); // Clear all errors on successful submission
      // Clear form inputs on successful addition
      setSubjectName("");
      setMarks("");
      setCredits("");

      // Show SUCCESS Global Toast 
      setGlobalToast({ 
          type: 'success', 
          message: `Subject '${addedSubject.name}' added successfully!` 
      });

    } catch (error) {
      console.error("Failed to add subject:", error);
      // Show ERROR Global Toast for network/API failures 
      setGlobalToast({ 
          type: 'error', 
          message: `API Error: Could not add subject.` 
      });
    } finally {
      setIsUpdatingData(false);
    }
  };
    
    // --- Delete Subject Logic (Uses Modal) ---
    const confirmDelete = (id) => {
        setModalSubjectId(id); // Open the modal
    };
  const executeDelete = async () => {
        if (!modalSubjectId) return;
    setIsUpdatingData(true);
        const idToDelete = modalSubjectId;
        setModalSubjectId(null); // Close the modal immediately
    try {
      await apiDeleteSubject(idToDelete);
      // Update local state by filtering out the deleted item
      setSubjects(prev => prev.filter((subj) => subj.id !== idToDelete));
                setGlobalToast({ type: 'success', message: `Subject (ID: ${idToDelete}) successfully deleted.` });
    } catch (error) {
      console.error("Failed to delete subject:", error);
      setGlobalToast({ type: 'error', message: `Deletion failed: ${error.message.substring(0, 50)}...` });
    } finally {
      setIsUpdatingData(false);
    }
  };
    
    
  // Button disabled if updating or any validation error exists
  const buttonDisabled = isUpdatingData || Object.keys(validationErrors).length > 0;

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8">
      <header className="text-center mb-10">
        <h1 className="text-5xl font-extrabold text-blue-500">Student Dashboard</h1>
        <p className="text-gray-400 mt-2">Track. Analyze. Succeed.</p>
      </header>

      {/* Navigation Tabs */}
      <nav className="mb-10 flex flex-wrap justify-center gap-4 border-b border-gray-700 pb-4">
            {[
                { id: "entry-view", icon: faUserGraduate, label: "Entry" }, 
                { id: "analysis-view", icon: faChartLine, label: "Analysis" }, 
                { id: "report-view", icon: faFileAlt, label: "Report" }, 
                { id: "books-view", icon: faBookOpen, label: "Book Suggestions" }, // NEW NAVIGATION ITEM
            ].map((item) => (
                <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`px-4 py-2 rounded-lg font-semibold transition flex items-center space-x-2 ${
                        activeSection === item.id 
                            ? 'bg-blue-600 text-white shadow-lg' 
                            : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                    }`}
                >
                    <FontAwesomeIcon icon={item.icon} />
                    <span>{item.label}</span>
                </button>
            ))}
      </nav>

       <div className="max-w-6xl mx-auto">
  {/* 1. ENTRY VIEW */}
  {activeSection === "entry-view" && (
    <section className="content-section">
      <h3 className="text-3xl font-semibold text-blue-400 mb-6">
        1. Subject Entry ✍️
      </h3>

      {/* Grid: Left form + Right table */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column: Input Form */}
        <div className="bg-card p-6 rounded-xl border border-blue-700/50 space-y-6">
          <div className="flex flex-col space-y-5">
            {/* Subject Name */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Subject Name
              </label>
              <input
                type="text"
                value={subjectName}
                onChange={(e) => {
                  setSubjectName(e.target.value);
                  validateField("subjectName", e.target.value);
                }}
                onBlur={() => validateField("subjectName")}
                placeholder="e.g., Physics"
                className={`w-full p-2 rounded bg-gray-900 border ${
                  validationErrors.subjectName
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-700 focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={isUpdatingData}
              />
              <AnimatePresence>
                {validationErrors.subjectName && (
                  <ErrorTooltip message={validationErrors.subjectName} />
                )}
              </AnimatePresence>
            </div>

            {/* Marks */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Marks (%)
              </label>
              <input
                type="number"
                value={marks}
                onChange={(e) => {
                  setMarks(e.target.value);
                  validateField("marks", e.target.value);
                }}
                onBlur={() => validateField("marks")}
                placeholder="e.g., 85.5"
                className={`w-full p-2 rounded bg-gray-900 border ${
                  validationErrors.marks
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-700 focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={isUpdatingData}
              />
              <AnimatePresence>
                {validationErrors.marks && (
                  <ErrorTooltip message={validationErrors.marks} />
                )}
              </AnimatePresence>
            </div>

            {/* Credits */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Credits/Weight
              </label>
              <input
                type="number"
                value={credits}
                onChange={(e) => {
                  setCredits(e.target.value);
                  validateField("credits", e.target.value);
                }}
                onBlur={() => validateField("credits")}
                placeholder="e.g., 3, 4"
                className={`w-full p-2 rounded bg-gray-900 border ${
                  validationErrors.credits
                    ? "border-red-500 ring-1 ring-red-500"
                    : "border-gray-700 focus:ring-2 focus:ring-blue-500"
                }`}
                disabled={isUpdatingData}
              />
              <AnimatePresence>
                {validationErrors.credits && (
                  <ErrorTooltip message={validationErrors.credits} />
                )}
              </AnimatePresence>
            </div>

            {/* Exam Type */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value)}
                className="w-full p-2 rounded bg-gray-900 border border-gray-700 focus:ring-2 focus:ring-blue-500 text-white"
                disabled={isUpdatingData}
              >
                <option>Midterm</option>
                <option>Final</option>
                <option>Quiz</option>
                <option>Assignment</option>
              </select>
            </div>
          </div>

          {/* Add Button */}
          <div className="pt-4">
            <button
              onClick={addSubject}
              className="w-full px-4 py-2 bg-blue-600 rounded-lg font-semibold hover:bg-blue-500 transition disabled:opacity-50 shadow-md"
              disabled={buttonDisabled}
            >
              {isUpdatingData ? "Adding..." : "Add Subject Entry"}
            </button>
          </div>
        </div>

        {/* Right Column: Current Entries */}
        <div className="bg-card p-6 rounded-xl border border-blue-700/50">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-2xl font-bold text-blue-300">
              Current Entries ({subjects.length})
              {isUpdatingData && !subjectName && (
                <span className="text-sm text-yellow-400 ml-2">
                  (Updating...)
                </span>
              )}
            </h4>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Marks (%)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Credits
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    GPA
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                <AnimatePresence initial={false}>
                  {subjects.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-4 text-center text-gray-500 italic"
                      >
                        No subject entries found.
                      </td>
                    </tr>
                  ) : (
                    subjects.map((subj) => (
                      <motion.tr
                        key={subj.id}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="hover:bg-gray-700 transition"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                          {subj.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                          {subj.examType}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">
                          {subj.marks.toFixed(1)}%
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">
                          {subj.credits.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400">
                          {subj.gpa.toFixed(1)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => confirmDelete(subj.id)}
                            className="text-red-500 hover:text-red-700 disabled:opacity-50"
                            disabled={isUpdatingData}
                          >
                            <FontAwesomeIcon icon={faTrashAlt} />
                          </button>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )}
</div>

        {/* 2. ANALYSIS VIEW */}
        {activeSection === "analysis-view" && <SubjectAnalysis subjects={subjects} />}
        
        {/* 3. REPORT VIEW */}
        {activeSection === "report-view" && <SubjectReport subjects={subjects} />}

        {/* 4. BOOK SUGGESTIONS VIEW */}
        {activeSection === "books-view" && <BookSuggestions subjects={subjects} />}


        {/* Delete Confirmation Modal */}
        <AnimatePresence>
            {modalSubjectId && subjects.find(s => s.id === modalSubjectId) && (
                <DeleteModal 
                    subject={subjects.find(s => s.id === modalSubjectId)} 
                    isUpdatingData={isUpdatingData}
                    executeDelete={executeDelete}
                    closeModal={() => setModalSubjectId(null)}
                />
            )}
        </AnimatePresence>
        
        {/* Global Toast Notification */}
        <AnimatePresence>
            {globalToast && (
                <motion.div
                    key="global-toast"
                    initial={{ y: -50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -50, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`fixed top-4 right-4 p-4 rounded-lg shadow-xl z-50 text-white font-medium ${
                        globalToast.type === 'success' ? 'bg-green-600' : 'bg-red-600'
                    }`}
                >
                    <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
                    {globalToast.message}
                </motion.div>
            )}
        </AnimatePresence>
        
      </div>
  );
};

// Assuming this is the default...

export default StudentDashboard;
