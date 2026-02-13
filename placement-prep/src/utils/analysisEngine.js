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

const ENTERPRISE_COMPANIES = ["amazon", "google", "microsoft", "apple", "meta", "tcs", "infosys", "wipro", "hcl", "accenture", "ibm", "oracle", "cisco", "intel", "adobe"];
const MIDSIZE_COMPANIES = ["zomato", "swiggy", "paytm", "ola", "uber", "delivery", "makemytrip", "cred"];

export function analyzeJD(company, role, jdText) {
    const text = jdText.toLowerCase();
    const companyLower = company.toLowerCase();
    const extractedSkills = {};
    let totalCategories = 0;

    Object.entries(SKILL_MAP).forEach(([category, keywords]) => {
        const found = keywords.filter(kw => text.includes(kw.toLowerCase()));
        if (found.length > 0) {
            extractedSkills[category] = found;
            totalCategories++;
        }
    });

    if (Object.keys(extractedSkills).length === 0) {
        extractedSkills["General"] = ["General Fresher Stack"];
    }

    // Company Intel Heuristics
    const companyIntel = {
        name: company || "Strategic Enterprise",
        industry: "Technology Services",
        sizeCategory: "Startup (<200)",
        hiringFocus: "Practical problem solving + tech stack depth",
        type: "startup"
    };

    if (ENTERPRISE_COMPANIES.some(c => companyLower.includes(c))) {
        companyIntel.sizeCategory = "Enterprise (2000+)";
        companyIntel.hiringFocus = "Highly structured DSA + core fundamentals + scale understanding";
        companyIntel.type = "enterprise";
    } else if (MIDSIZE_COMPANIES.some(c => companyLower.includes(c))) {
        companyIntel.sizeCategory = "Mid-size (200-2000)";
        companyIntel.hiringFocus = "Hybrid focus: Product thinking + strong DS fundamentals";
        companyIntel.type = "midsize";
    }

    // Round Mapping Logic
    const allSkills = Object.values(extractedSkills).flat();
    const hasWeb = extractedSkills["Web"] || text.includes("web");
    const hasDSA = extractedSkills["Core CS"] || text.includes("dsa");

    let roundMapping = [];
    if (companyIntel.type === "enterprise") {
        roundMapping = [
            { name: "Online Assessment", focus: "DSA + Aptitude", importance: "Elimination round focusing on speed and accuracy in logic." },
            { name: "Technical Round 1", focus: "DSA + Core CS", importance: "Deep dive into data structures and operating system fundamentals." },
            { name: "Technical Round 2", focus: "Projects + Tech Stack", importance: "Verification of your practical application and architectural understanding." },
            { name: "HR / Managerial", focus: "Cultural Fit", importance: "Long-term alignment with company values and behavior." }
        ];
    } else {
        roundMapping = [
            { name: "Practical Coding", focus: hasWeb ? "Web App Task" : "System Coding", importance: "Focus on writing clean, production-ready code under pressure." },
            { name: "System Discussion", focus: "Architecture + Scalability", importance: "Testing how you think about data flow and system constraints." },
            { name: "Culture Fit", focus: "Ownership + Mindset", importance: "Critical for startups to ensure high ownership and fast-paced alignment." }
        ];
    }

    // Readiness Score
    let score = 35;
    score += Math.min(totalCategories * 5, 30);
    if (company.trim()) score += 10;
    if (role.trim()) score += 10;
    if (jdText.length > 800) score += 10;
    score = Math.min(score, 100);

    return {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        company,
        role,
        jdText,
        extractedSkills,
        companyIntel,
        roundMapping,
        plan: [
            { day: "Day 1-2", focus: "Core CS Fundamentals", tasks: ["Revise OS Concepts", "Revise DBMS & SQL"] },
            { day: "Day 3-4", focus: "DSA Practice", tasks: ["Arrays & Strings", "Trees & Graphs"] },
            { day: "Day 5", focus: "Stack & Projects", tasks: [hasWeb ? "Web deep dive" : "Core internals", "Project walkthrough"] },
            { day: "Day 6", focus: "Mock Interviews", tasks: ["Behavioral prep", "Technical mock"] },
            { day: "Day 7", focus: "Revision", tasks: ["Weak area review"] }
        ],
        checklist: {
            "Preparation Milestones": ["Core CS Mastery", "Projects Polished", "Behavioral Ready"]
        },
        questions: allSkills.map(s => SPECIFIC_QUESTIONS[s]).filter(Boolean).slice(0, 10),
        baseReadinessScore: score,
        readinessScore: score,
        skillConfidenceMap: {}
    };
}

export function saveToHistory(analysis) {
    const history = JSON.parse(localStorage.getItem('prepHistory') || '[]');
    const index = history.findIndex(a => a.id === analysis.id);
    if (index !== -1) history[index] = analysis;
    else history.unshift(analysis);
    localStorage.setItem('prepHistory', JSON.stringify(history.slice(0, 50)));
    return analysis;
}

export function updateAnalysis(id, updates) {
    const history = getHistory();
    const index = history.findIndex(a => a.id === Number(id));
    if (index !== -1) {
        history[index] = { ...history[index], ...updates };
        localStorage.setItem('prepHistory', JSON.stringify(history));
        return history[index];
    }
    return null;
}

export function getHistory() { return JSON.parse(localStorage.getItem('prepHistory') || '[]'); }
export function getAnalysisById(id) { return getHistory().find(a => a.id === Number(id)); }
export function getLastAnalysis() { const h = getHistory(); return h.length > 0 ? h[0] : null; }
