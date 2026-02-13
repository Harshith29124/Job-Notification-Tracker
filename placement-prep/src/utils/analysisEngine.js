const SKILL_MAP = {
    "Core CS": ["DSA", "OOP", "DBMS", "OS", "Networks", "Data Structures", "Algorithms", "Operating Systems", "Computer Networks"],
    "Languages": ["Java", "Python", "JavaScript", "TypeScript", "C", "C++", "C#", "Go", "Rust", "Swift", "Kotlin"],
    "Web": ["React", "Next.js", "Node.js", "Express", "REST", "GraphQL", "Tailwind", "HTML", "CSS", "Frontend", "Backend", "Fullstack"],
    "Data": ["SQL", "MongoDB", "PostgreSQL", "MySQL", "Redis", "Oracle", "NoSQL", "Database"],
    "Cloud/DevOps": ["AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Linux", "Jenkins", "Terraform", "Cloud"],
    "Testing": ["Selenium", "Cypress", "Playwright", "JUnit", "PyTest", "Testing", "Unit Test", "Automation"]
};

const SPECIFIC_QUESTIONS = {
    "React": "Explain the virtual DOM and the diffing algorithm.",
    "Node.js": "How does Node.js handle non-blocking I/O operations?",
    "Java": "Explain the difference between JDK, JRE, and JVM.",
    "Python": "What are decorators in Python and how are they used?",
    "SQL": "Explain the difference between JOIN and UNION.",
    "DSA": "How would you optimize search in a sorted data set with millions of records?",
    "System Design": "Explain how you would handle vertical vs horizontal scaling.",
    "AWS": "What are the common ways to secure an S3 bucket?",
    "Docker": "Explain the difference between a Docker Image and a Docker Container.",
    "JavaScript": "Explain closures and how they are used for data encapsulation.",
    "TypeScript": "What are the benefits of using Interfaces vs Types in TypeScript?",
    "DBMS": "What is ACID property in Database Management Systems?",
    "OS": "Explain the concept of Virtual Memory and Paging.",
    "MongoDB": "What are the advantages of NoSQL over RDBMS?",
    "C++": "Explain the difference between Virtual Functions and Pure Virtual Functions.",
    "Linux": "Explain the Linux file permission system (chmod)."
};

export function analyzeJD(company, role, jdText) {
    const text = jdText.toLowerCase();
    const extractedSkills = {};
    let totalCategories = 0;

    Object.entries(SKILL_MAP).forEach(([category, keywords]) => {
        const found = keywords.filter(kw => text.includes(kw.toLowerCase()));
        if (found.length > 0) {
            extractedSkills[category] = found;
            totalCategories++;
        }
    });

    // Default if empty
    if (Object.keys(extractedSkills).length === 0) {
        extractedSkills["General"] = ["General Fresher Stack"];
    }

    // Readiness Score Calculation
    let score = 35;
    score += Math.min(totalCategories * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;
    score = Math.min(score, 100);

    // Generate Plan
    const isWeb = extractedSkills["Web"] || text.includes("web");
    const plan = [
        { day: "Day 1-2", focus: "Core CS Fundamentals", tasks: ["Revise OS Concepts", "Revise DBMS & SQL", "Networks Networking Basics"] },
        { day: "Day 3-4", focus: "DSA & Problem Solving", tasks: ["Arrays & Strings", "Linked Lists & Trees", "Dynamic Programming Basics"] },
        {
            day: "Day 5", focus: "Technical Stack & Projects", tasks: [
                isWeb ? "React/Node.js deep dive" : "Primary language internals",
                "Project architecture walkthrough",
                "Resume point verification"
            ]
        },
        { day: "Day 6", focus: "Interview Soft Skills", tasks: ["Behavioral Q&A", "Company research", "Body language & communication"] },
        { day: "Day 7", focus: "Final Revision", tasks: ["Mock test", "Weak area review", "Confidence building"] }
    ];

    // Generate Questions
    const questions = [];
    const allFoundSkills = Object.values(extractedSkills).flat();
    allFoundSkills.forEach(skill => {
        if (SPECIFIC_QUESTIONS[skill] && questions.length < 10) {
            questions.push(SPECIFIC_QUESTIONS[skill]);
        }
    });

    // Filler questions if too few
    if (questions.length < 10) {
        const generic = [
            "Explain your most challenging project.",
            "Tell me about a time you handled a conflict in a team.",
            "How do you stay updated with new technologies?",
            "Why do you want to join " + (company || "this company") + "?",
            "Explain OOPS concepts with real-world examples.",
            "What are your strengths and weaknesses?",
            "Where do you see yourself in 5 years?"
        ];
        while (questions.length < 10 && generic.length > 0) {
            const q = generic.shift();
            if (!questions.includes(q)) questions.push(q);
        }
    }

    // Generate Checklist
    const checklist = {
        "Round 1: Aptitude & Basics": ["Quantitative Aptitude", "Logical Reasoning", "Verbal Basics", "Basic Technical MCQs", "Time Management Practice"],
        "Round 2: DSA & Core CS": ["Data Structures", "Algorithm Complexity", "OOPs Principles", "DBMS Normalization", "OS Scheduling Basics"],
        "Round 3: Tech Interview": [
            `Deep dive into ${allFoundSkills[0] || 'Core Stack'}`,
            "Project 1 Walkthrough",
            "System Design Basics",
            "API/Database Integration",
            "Coding on Whiteboard/Text Editor"
        ],
        "Round 4: HR & Managerial": ["Introduction Pitch", "Situational Questions (STAR method)", "Company Value Alignment", "Salary/Relocation Discussion", "Questions for the Interviewer"]
    };

    return {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        plan,
        checklist,
        questions,
        readinessScore: score
    };
}

export function saveToHistory(analysis) {
    const history = JSON.parse(localStorage.getItem('prepHistory') || '[]');
    history.unshift(analysis);
    localStorage.setItem('prepHistory', JSON.stringify(history.slice(0, 50))); // Keep last 50
    localStorage.setItem('lastAnalysisId', analysis.id);
    return analysis;
}

export function getHistory() {
    return JSON.parse(localStorage.getItem('prepHistory') || '[]');
}

export function getAnalysisById(id) {
    const history = getHistory();
    return history.find(a => a.id === Number(id));
}

export function getLastAnalysis() {
    const history = getHistory();
    return history.length > 0 ? history[0] : null;
}
