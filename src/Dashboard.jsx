import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { BarChart3, GraduationCap, FileText, Trash2, Edit, Check } from "lucide-react";~
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


const MetricCard = ({ Icon, title, value, unit, color }) => (
  <motion.div
    className={`bg-card p-4 rounded-xl shadow-lg border-b-4 ${color}`}
    whileHover={{ scale: 1.02 }}
  >
    <div className="flex items-center space-x-4">
      <Icon className="w-8 h-8 text-white" />
      <div>
        <p className="text-sm font-light text-gray-400">{title}</p>
        <p className="text-3xl font-bold text-white">
          {value}
          <span className="text-base font-normal ml-1">{unit}</span>
        </p>
      </div>
    </div>
  </motion.div>
);


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
  
  const [editingId, setEditingId] = useState(null); 
  const [editMarks, setEditMarks] = useState('');
  
  const calculateGPA = (marks) => {
    if (marks >= 90) return 10;
    if (marks >= 80) return 9;
    if (marks >= 70) return 8;
    if (marks >= 60) return 7;
    if (marks >= 50) return 6;
    if (marks >= 40) return 5;
    return 0;
  };

  useEffect(() => {
    const loadSubjects = async () => {
      setIsUpdatingData(true);
      try {
        const response = await fetch('/api/subjects');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
        setSubjects([]); 
      } finally {
        setIsUpdatingData(false);
      }
    };
    loadSubjects();
  }, []);

  const fetchCgpa = useCallback(async () => {
    setIsLoadingCgpa(true);
    try {
      const response = await fetch('/api/calculate-cgpa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(subjects.map(s => ({ id: s.id, gpa: s.gpa, credits: s.credits }))),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
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

  const addSubject = async () => {
    if (!subjectName || !marks || !credits) return;
    setIsUpdatingData(true);
    
    const newSubjectData = {
      name: subjectName,
      marks: parseFloat(marks),
      credits: parseFloat(credits),
      examType,
    };
    
    try {
      const response = await fetch('/api/subjects', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSubjectData) 
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const addedSubject = await response.json();

      if (!addedSubject.gpa) {
          addedSubject.gpa = calculateGPA(addedSubject.marks);
      }
      
      setSubjects(prev => [...prev, addedSubject]);
      
      setSubjectName("");
      setMarks("");
      setCredits("");

    } catch (error) {
      console.error("Failed to add subject:", error);
      alert("Failed to add subject. Please check if the backend server is running."); 
    } finally {
      setIsUpdatingData(false);
    }
  };

  const updateSubject = async (subjectToUpdate) => {
    if (isNaN(subjectToUpdate.marks)) return;
    setIsUpdatingData(true);
    setEditingId(null); 
    
    try {
      const dataToSend = {
          marks: parseFloat(subjectToUpdate.marks),
      };
      
      const response = await fetch(`/api/subjects/${subjectToUpdate.id}`, { 
          method: 'PUT', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dataToSend)
      });
      
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const updatedSub = await response.json();

      if (!updatedSub.gpa) {
          updatedSub.gpa = calculateGPA(updatedSub.marks);
      }

      setSubjects(prev => prev.map(subj => 
        subj.id === updatedSub.id ? updatedSub : subj
      ));
      
    } catch (error) {
      console.error("Failed to update subject:", error);
      alert("Failed to update subject. Please check the API connection.");
    } finally {
      setIsUpdatingData(false);
    }
  };

  const deleteSubject = async (id) => {
    setIsUpdatingData(true);
    try {
      const response = await fetch(`/api/subjects/${id}`, { method: 'DELETE' });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      setSubjects(prev => prev.filter((subj) => subj.id !== id));

    } catch (error) {
      console.error("Failed to delete subject:", error);
      alert("Failed to delete subject. Please check the API connection.");
    } finally {
      setIsUpdatingData(false);
    }
  };

  const handleEditClick = (subj) => {
      setEditingId(subj.id);
      setEditMarks(String(subj.marks));
  };
  
  const handleSaveClick = (subjId) => {
      const subjectToSave = subjects.find(s => s.id === subjId);
      if (subjectToSave) {
          updateSubject({
              id: subjId,
              marks: editMarks 
          });
      }
  };

  const overallPercentage = subjects.length
    ? subjects.reduce((acc, subj) => acc + subj.marks, 0) / subjects.length
    : 0;

  const totalCredits = subjects.reduce((acc, subj) => acc + subj.credits, 0);
  const cgpaDisplayValue = isLoadingCgpa 
    ? "Loading..." 
    : (subjects.length ? cgpa.toFixed(2) : "N/A");
  
  const buttonDisabled = isUpdatingData;

  const generateAnalysis = () => {
    // GPA > 0 implies passing based on the calculateGPA function
    const passedSubjects = subjects.filter(s => s.gpa > 0).length;
    const failRate = subjects.length > 0 ? ((subjects.length - passedSubjects) / subjects.length) * 100 : 0;
    
    let advice = "Overall performance is excellent. Keep up the hard work!";
    if (cgpa < 8 && cgpa >= 7) {
      advice = "Good job! Focus on core subjects to push your CGPA higher.";
    } else if (cgpa < 7 && cgpa >= 5) {
      advice = "Current performance is average. Identify subjects below 60 marks and schedule extra study time.";
    } else if (cgpa < 5 && subjects.length > 0) {
      advice = "Critical alert! Your CGPA is low. Immediately seek tutoring and prioritize studying for failed/low-scoring subjects.";
    }

    return (
      <div className="bg-gray-800/50 p-6 rounded-xl border border-red-700/50">
        <h4 className="text-xl font-semibold mb-3 text-red-300">Performance Summary</h4>
        <p className="text-gray-300 mb-2">
          You passed **{passedSubjects}** out of **{subjects.length}** subjects.
        </p>
        <p className="text-gray-300 mb-4">
          The failure rate is **{failRate.toFixed(1)}%**.
        </p>
        <div className="p-3 mt-4 rounded bg-gray-700 text-yellow-300">
          **Actionable Advice:** {advice}
        </div>
      </div>
    );
  };
  
  const chartData = () => {
    return subjects.map(s => ({
      name: s.name,
      Marks: s.marks,
      GPA: s.gpa,
      Credits: s.credits
    }));
  };
  
  const avgMarksData = () => {
    const types = subjects.reduce((acc, subj) => {
      if (!acc[subj.examType]) {
        acc[subj.examType] = { totalMarks: 0, count: 0 };
      }
      acc[subj.examType].totalMarks += subj.marks;
      acc[subj.examType].count += 1;
      return acc;
    }, {});

    return Object.keys(types).map(key => ({
      type: key,
      "Average Marks": types[key].totalMarks / types[key].count,
    }));
  };
  
}