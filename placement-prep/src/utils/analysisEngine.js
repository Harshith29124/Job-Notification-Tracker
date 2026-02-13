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

const ENTERPRISE_COMPANIES = ["amazon", "google", "microsoft", "apple", "meta", "tcs", "infosys", "wipro", "hcl", "accenture", "ibm", "oracle", "cisco", "intel", "adobe", "samsung", "deloitte", "pwc", "ey", "kpmg", "morgan stanley", "jpmorgan", "goldman sachs"];
const MIDSIZE_COMPANIES = ["zomato", "swiggy", "paytm", "ola", "uber", "delivery", "makemytrip", "cred", "razorpay", "phonepe", "flipkart", "meesho", "unacademy", "byjus"];

const INDUSTRY_KEYWORDS = {
    "Banking & Finance": ["bank", "finance", "fintech", "payment", "wealth", "trading", "insurance", "invest"],
    "E-commerce": ["commerce", "retail", "shop", "delivery", "marketplace", "logistics"],
    "EdTech": ["education", "learn", "academy", "school", "course", "training"],
    "HealthTech": ["health", "medical", "clinic", "hospital", "pharma"],
    "Technology Services": ["software", "service", "consulting", "it", "cloud", "solutions"]
};

export function analyzeJD(company, role, jdText) {
    const text = jdText.toLowerCase();
    const companyLower = (company || "").toLowerCase();

    // 1) Initialize Schema Structure
    const extractedSkills = {
        coreCS: [],
        languages: [],
        web: [],
        data: [],
        cloud: [],
        testing: [],
        other: []
    };

    // 2) Extraction with Category Mapping
    let foundAny = false;
    Object.entries(SKILL_MAP).forEach(([category, keywords]) => {
        const found = keywords.filter(kw => text.includes(kw.toLowerCase()));
        if (found.length > 0) {
            foundAny = true;
            // Map SKILL_MAP keys to our strict schema keys
            const keyMap = {
                "Core CS": "coreCS",
                "Languages": "languages",
                "Web": "web",
                "Data": "data",
                "Cloud/DevOps": "cloud",
                "Testing": "testing"
            };
            const targetKey = keyMap[category] || "other";
            extractedSkills[targetKey] = [...new Set([...(extractedSkills[targetKey] || []), ...found])];
        }
    });

    // 3) Default behavior if no skills detected
    if (!foundAny) {
        extractedSkills.other = ["Communication", "Problem solving", "Basic coding", "Projects"];
    }

    // Advanced Industry Inference
    let inferredIndustry = "Technology Services";
    for (const [industry, keywords] of Object.entries(INDUSTRY_KEYWORDS)) {
        if (keywords.some(kw => text.includes(kw) || companyLower.includes(kw))) {
            inferredIndustry = industry;
            break;
        }
    }

    // Company Type Heuristic
    const companyType = ENTERPRISE_COMPANIES.some(c => companyLower.includes(c)) ? "enterprise" :
        (MIDSIZE_COMPANIES.some(c => companyLower.includes(c)) ? "midsize" : "startup");

    const hasWeb = extractedSkills.web.length > 0 || text.includes("web");
    const hasDSA = extractedSkills.coreCS.length > 0 || text.includes("dsa");

    // 4) Round Mapping & Checklist standardizing
    let roundMapping = [];
    if (companyType === "enterprise") {
        roundMapping = [
            { roundTitle: "Online Assessment", focusAreas: [hasDSA ? "DSA" : "Tech Literacy", "Aptitude"], whyItMatters: "Elimination round focusing on speed and accuracy point benchmark." },
            { roundTitle: "Technical Round 1", focusAreas: ["DSA", "Core CS"], whyItMatters: "Deep dive into data structures and OS fundamentals." },
            { roundTitle: "Technical Round 2", focusAreas: ["System Design", "Projects"], whyItMatters: "Verification of practical application and impact." },
            { roundTitle: "HR / Values", focusAreas: ["Behavioral", "Culture"], whyItMatters: "Long-term alignment with leadership principles." }
        ];
    } else {
        roundMapping = [
            { roundTitle: "Coding Assignment", focusAreas: [hasWeb ? "Fullstack Task" : "Logic"], whyItMatters: "Testing if you can ship clean, production-ready features." },
            { roundTitle: "Technical Interview", focusAreas: ["Stack Depth", "Architecture"], whyItMatters: "Ensuring you know the 'why' behind your tools." },
            { roundTitle: "Founder Round", focusAreas: ["Mission", "Grit"], whyItMatters: "Alignment with high-growth startup culture." }
        ];
    }

    const checklist = roundMapping.map(r => ({
        roundTitle: r.roundTitle,
        items: ["Review " + r.focusAreas[0], "Practice mock for " + r.roundTitle, "Revise relevant projects"]
    }));

    // Company Intel (Heuristics)
    const companyIntel = {
        industry: inferredIndustry,
        sizeCategory: companyType === "enterprise" ? "Enterprise (2000+)" : (companyType === "midsize" ? "Mid-size (200-2000)" : "Startup (<200)"),
        hiringFocus: companyType === "enterprise" ? "Scale, Reliability, Optimization" : (companyType === "midsize" ? "Product thinking, Stack ownership" : "Speed, Grit, Adaptability")
    };

    // 5) Readiness Score (Base)
    let baseScore = 40;
    const catCount = Object.values(extractedSkills).filter(arr => arr.length > 0).length;
    baseScore += Math.min(catCount * 8, 40);
    if (jdText.length > 500) baseScore += 10;
    if (company) baseScore += 5;
    if (role) baseScore += 5;
    baseScore = Math.min(baseScore, 95);

    const allExtracted = Object.values(extractedSkills).flat();

    // 6) Build Final Entry
    return {
        id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        company: company || "",
        role: role || "",
        jdText,
        extractedSkills,
        companyIntel,
        roundMapping,
        checklist,
        plan7Days: [
            { day: "Day 1-2", focus: "Foundation", tasks: ["Revise " + (extractedSkills.coreCS[0] || "Foundations"), "Setup dev environment"] },
            { day: "Day 3-5", focus: "Deep Dive", tasks: ["Practice " + (allExtracted[0] || "Core coding"), "Build small prototype"] },
            { day: "Day 6-7", focus: "Optimization", tasks: ["Mock interviews", "Final review of " + (company || "Target Role")] }
        ],
        questions: allExtracted.map(s => SPECIFIC_QUESTIONS[s]).filter(Boolean).slice(0, 10),
        baseScore: baseScore,
        skillConfidenceMap: {},
        finalScore: baseScore
    };
}

export function saveToHistory(analysis) {
    const history = getHistory();
    const index = history.findIndex(a => a.id === analysis.id);
    if (index !== -1) history[index] = analysis;
    else history.unshift(analysis);
    localStorage.setItem('prepHistory', JSON.stringify(history.slice(0, 50)));
    return analysis;
}

export function updateAnalysis(id, updates) {
    const history = getHistory();
    const index = history.findIndex(a => String(a.id) === String(id));
    if (index !== -1) {
        const entry = { ...history[index], ...updates };

        // Final score stability rule: derived from baseScore + confidence map
        if (updates.skillConfidenceMap || updates.baseScore !== undefined) {
            const allSkills = Object.values(entry.extractedSkills).flat();
            const knowCount = Object.values(entry.skillConfidenceMap).filter(v => v === 'know').length;
            const practiceCount = allSkills.length - knowCount;

            let newScore = entry.baseScore + (knowCount * 2) - (practiceCount * 1);
            entry.finalScore = Math.max(0, Math.min(100, Math.round(newScore)));
            entry.updatedAt = new Date().toISOString();
        }

        history[index] = entry;
        localStorage.setItem('prepHistory', JSON.stringify(history));
        return entry;
    }
    return null;
}

export function getHistory() {
    try {
        const raw = localStorage.getItem('prepHistory');
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return [];

        // Robustness: Filter invalid entries
        return parsed.filter(entry => {
            const isValid = entry && typeof entry === 'object' && entry.id && entry.jdText;
            if (!isValid && entry) {
                console.warn("Skipping corrupted history entry:", entry.id);
            }
            return isValid;
        });
    } catch (e) {
        console.error("Critical: prepHistory corrupted", e);
        return [];
    }
}

export function getAnalysisById(id) {
    return getHistory().find(a => String(a.id) === String(id));
}

export function getLastAnalysis() {
    const h = getHistory();
    return h.length > 0 ? h[0] : null;
}
