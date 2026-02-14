import { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { FileText, Award, CheckCircle } from 'lucide-react';
import Home from './pages/Home';
import Builder from './pages/Builder';
import Preview from './pages/Preview';
import Proof from './pages/Proof';

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('resumeBuilderData');
    return saved ? JSON.parse(saved) : {
      personal: {
        fullName: '',
        email: '',
        phone: '',
        location: '',
        linkedin: '',
        github: ''
      },
      summary: '',
      education: [],
      experience: [],
      projects: [],
      skills: {
        technical: [],
        soft: [],
        tools: []
      }
    };
  });

  const [selectedTemplate, setSelectedTemplate] = useState(() => {
    return localStorage.getItem('resumeBuilderTemplate') || 'modern';
  });
  const [selectedColor, setSelectedColor] = useState(() => {
    return localStorage.getItem('resumeBuilderColor') || 'teal';
  });
  const [score, setScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    localStorage.setItem('resumeBuilderData', JSON.stringify(data));
    localStorage.setItem('resumeBuilderTemplate', selectedTemplate);
    localStorage.setItem('resumeBuilderColor', selectedColor);
    calculateScore();
  }, [data, selectedTemplate, selectedColor]);

  const calculateScore = () => {
    let s = 0;
    const suggs = [];

    // Rules
    if (data.personal.fullName) s += 10;
    else suggs.push("Add your full name (+10 pts)");

    if (data.personal.email) s += 10;
    else suggs.push("Add a professional email (+10 pts)");

    if (data.summary.length > 50) s += 10;
    else suggs.push("Add a professional summary > 50 chars (+10 pts)");

    if (data.experience.length >= 1 && data.experience.some(e => e.description && e.description.trim().length > 0)) s += 15;
    else suggs.push("Add experience with achievements (+15 pts)");

    if (data.education.length >= 1) s += 10;
    else suggs.push("Add your education details (+10 pts)");

    const skillCount = (data.skills.technical?.length || 0) + (data.skills.soft?.length || 0) + (data.skills.tools?.length || 0);
    if (skillCount >= 5) s += 10;
    else suggs.push("Add at least 5 skills (+10 pts)");

    if (data.projects && data.projects.length >= 1) s += 10;
    else suggs.push("Add at least 1 project (+10 pts)");

    if (data.personal.phone) s += 5;
    else suggs.push("Add your phone number (+5 pts)");

    if (data.personal.linkedin) s += 5;
    else suggs.push("Add LinkedIn profile (+5 pts)");

    if (data.personal.github) s += 5;
    else suggs.push("Add GitHub profile (+5 pts)");

    const actionVerbs = ['built', 'led', 'designed', 'improved', 'developed', 'implemented', 'managed', 'created', 'optimized'];
    const hasActionVerb = actionVerbs.some(v => data.summary.toLowerCase().includes(v));
    if (hasActionVerb) s += 10;
    else suggs.push("Use action verbs (built, led, etc.) (+10 pts)");

    setScore(s);
    setSuggestions(suggs);
  };

  const location = useLocation();

  const loadSampleData = () => {
    setData({
      personal: {
        fullName: 'Harshith KodNest',
        email: 'harshith@kodnest.com',
        phone: '+91 98765 43210',
        location: 'Bangalore, India',
        linkedin: 'linkedin.com/in/harshith',
        github: 'github.com/harshith'
      },
      summary: 'Passionate Full Stack Developer with 2+ years of experience building scalable web applications. Expert in React ecosystem and modern UI/UX principles.',
      education: [
        { id: 1, institution: 'KodNest Institute', degree: 'Full Stack Development', year: '2024' },
        { id: 2, institution: 'VTU University', degree: 'B.E. Computer Science', year: '2023' }
      ],
      experience: [
        { id: 1, company: 'Tech Innovators', role: 'Frontend Developer', duration: '2023 - Present', description: 'Led the migration of legacy app to React 18. Improved performance by 40%.' },
      ],
      projects: [
        { id: 1, name: 'AI Resume Builder', tech: ['React', 'Tailwind', 'OpenAI'], description: 'A premium resume generation tool with real-time preview.', link: 'https://resume.kodnest.com', github: 'https://github.com/kodnest/resume' }
      ],
      skills: {
        technical: ['React', 'JavaScript', 'TypeScript', 'Node.js'],
        soft: ['Communication', 'Leadership'],
        tools: ['Git', 'VS Code', 'Docker']
      }
    });
  };

  return (
    <div className="min-h-screen bg-background font-sans text-foreground flex flex-col">
      {/* Top Navigation */}
      <nav className="border-b border-border bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl text-primary">
            <FileText className="w-6 h-6" />
            <span>AI Resume Builder</span>
          </Link>

          <div className="flex items-center gap-1 bg-muted p-1 rounded-lg">
            <Link to="/builder" className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${location.pathname === '/builder' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Builder</Link>
            <Link to="/preview" className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${location.pathname === '/preview' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Preview</Link>
            <Link to="/proof" className={`px-4 py-1.5 rounded text-sm font-medium transition-colors ${location.pathname === '/proof' ? 'bg-white shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'}`}>Proof</Link>
          </div>

          <div className="text-xs font-mono bg-accent/20 text-accent-foreground px-2 py-1 rounded border border-accent/20">
            v1.0 PREMIUM
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/builder" element={<Builder data={data} setData={setData} loadSampleData={loadSampleData} score={score} suggestions={suggestions} template={selectedTemplate} setTemplate={setSelectedTemplate} color={selectedColor} setColor={setSelectedColor} />} />
          <Route path="/preview" element={<Preview data={data} template={selectedTemplate} color={selectedColor} score={score} suggestions={suggestions} />} />
          <Route path="/proof" element={<Proof />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
