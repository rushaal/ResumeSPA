(function () {
  window.resumeAssistantKnowledge = {
    statusLine: "Grounded in public resume data",
    openingMessage:
      "Hello, I am Rushal's resume assistant. I answer only from the approved public resume profile.",
    fallbackMessage:
      "Sorry, I can't answer that from my current resume database. Please choose one of the suggested questions below.",
    suggestedPrompts: [
      "What is Rushal's highest qualification?",
      "What roles is Rushal best suited for?",
      "What is Rushal's tech stack?",
      "Tell me about Rushal's healthcare interoperability experience.",
      "What leadership experience does Rushal have?",
      "What public project examples can you share?",
      "How can I contact Rushal?"
    ],
    topics: [
      {
        id: "overview",
        keywords: ["about", "summary", "profile", "introduce", "who is rushal", "tell me about rushal", "tell me about yourself"],
        answer:
          "I am an Engineering Lead and Project Manager with 19+ years in software engineering and 12+ years delivering large-scale healthcare interoperability solutions. My background combines hands-on architecture, people leadership, stakeholder management, and end-to-end delivery across distributed teams.",
        relatedPrompts: [
          "What roles is Rushal best suited for?",
          "What leadership experience does Rushal have?",
          "Tell me about Rushal's healthcare interoperability experience."
        ]
      },
      {
        id: "role-fit",
        keywords: ["best qualified for", "qualified for", "strength", "fit", "fit for", "why hire", "why should", "best suited", "best suited for", "expertise", "what can he do", "what can rushal do", "what does he do", "roles", "role", "position", "positions"],
        answer:
          "My strongest fit is for Engineering Lead, Technical Program, or Project Manager style roles where deep technical judgment and delivery ownership both matter. I bring 19+ years in the .NET stack, 12+ years in U.S. healthcare interoperability, experience leading 10+ engineers across India and the USA, and a track record of improving performance, reliability, and delivery discipline.",
        relatedPrompts: [
          "What is Rushal's highest qualification?",
          "What is Rushal's tech stack?",
          "What leadership experience does Rushal have?",
          "Tell me about Rushal's healthcare interoperability experience."
        ]
      },
      {
        id: "tech-stack",
        keywords: ["tech stack", "techstack", "stack", "technology", "technologies", "framework", "frameworks", ".net", "dotnet", "c#", "asp.net", "web api", "sql server", "microservices", "wpf", "jenkins", "tools"],
        answer:
          "Here is the tech stack from Rushal's approved public profile:\n\n- C# / .NET Core\n- VB.NET\n- ASP.NET MVC\n- Web API\n- SQL Server\n- Microservices\n- Jenkins CI/CD\n- TDD / BDD\n- WPF\n- HL7 v2 and v3\n- FHIR, CCDA, ECR, SMART on FHIR\n- Mirth Connect",
        relatedPrompts: [
          "Tell me about Rushal's healthcare interoperability experience.",
          "What public project examples can you share?",
          "What roles is Rushal best suited for?"
        ]
      },
      {
        id: "leadership",
        keywords: ["leadership", "manager", "management", "team", "teams", "led", "lead", "stakeholder", "delivery", "scrum", "agile"],
        answer:
          "I have led distributed teams of 10+ engineers, owned solution design and Agile delivery, and handled onshore-offshore synchronization across India and the USA. I have also acted as a primary technical liaison during client calls and critical production incidents, which means I am comfortable carrying both people leadership and delivery accountability.",
        relatedPrompts: [
          "What roles is Rushal best suited for?",
          "What public project examples can you share?",
          "How can I contact Rushal?"
        ]
      },
      {
        id: "healthcare",
        keywords: ["healthcare", "interoperability", "hl7", "fhir", "ccda", "ecr", "xds", "xdr", "xdm", "smart on fhir", "mirth"],
        answer:
          "My deepest domain experience is in U.S. healthcare interoperability. I have worked extensively with HL7 v2 and v3, FHIR, CCDA, ECR, XDS/XDR/XDM, and SMART on FHIR, and I am Mirth Connect Certified. That combination of domain depth and delivery ownership is one of the strongest parts of my profile.",
        relatedPrompts: [
          "What roles is Rushal best suited for?",
          "What is Rushal's highest qualification?",
          "What measurable impact has Rushal delivered?"
        ]
      },
      {
        id: "impact",
        keywords: ["impact", "achievement", "results", "performance", "optimization", "improvement", "cost", "modernization", "award"],
        answer:
          "Some of the clearest public outcomes in my resume are an 80% performance improvement through architectural redesign and database query optimization, migration from paid Symphonia licensing to open-source NHapi, modernization of legacy application components, and the introduction of CI/CD and engineering quality practices. I have also received Star Award, Pat on Back, and multiple Spot Awards for delivery and engineering contributions.",
        relatedPrompts: [
          "What public project examples can you share?",
          "Tell me about Rushal's healthcare interoperability experience.",
          "What is Rushal's highest qualification?"
        ]
      },
      {
        id: "experience",
        keywords: ["experience", "years", "career", "nextgen", "ust", "dell", "satyam", "tech mahindra", "history"],
        answer:
          "I bring 19+ years of software engineering experience overall. The most significant stretch was 13+ years at NextGen Healthcare, focused on EHR and interoperability systems. Before that, I worked at UST Global with Dell Technologies and earlier at Satyam Technology, now Tech Mahindra, building a foundation in enterprise software and client-facing delivery.",
        relatedPrompts: [
          "Tell me about Rushal's healthcare interoperability experience.",
          "What leadership experience does Rushal have?",
          "What measurable impact has Rushal delivered?"
        ]
      },
      {
        id: "certifications",
        keywords: ["certification", "certifications", "certificate", "certified", "acsm", "scrum", "mirth", "connectathon"],
        answer:
          "I hold Advanced Certified Scrum Master certification and I am also Mirth Connect Certified. My resume also notes participation in the U.S. Connectathon, which reinforces the healthcare interoperability side of my profile.",
        relatedPrompts: [
          "Tell me about Rushal's healthcare interoperability experience.",
          "What roles is Rushal best suited for?",
          "What leadership experience does Rushal have?"
        ]
      },
      {
        id: "education",
        keywords: ["qualification", "qualifications", "qualificaiton", "academic qualification", "academic qualifications", "education qualification", "educational qualification", "highest qualification", "formal qualification", "degree", "education", "college", "university", "mca", "master of computer application", "master of computer applications", "nirma"],
        answer:
          "Rushal's formal academic qualification is a Master of Computer Applications (M.C.A.) from Nirma Institute of Technology, Ahmedabad.",
        relatedPrompts: [
          "What roles is Rushal best suited for?",
          "What is Rushal's tech stack?",
          "How can I contact Rushal?"
        ]
      },
      {
        id: "projects",
        keywords: ["project", "projects", "portfolio", "case study", "work sample", "examples", "actual project", "dummy project"],
        answer:
          "The public profile currently supports project-level discussion at a high level rather than full case studies. Public examples I can safely talk about include legacy application modernization with Windows Forms to WPF, a Symphonia-to-NHapi migration to remove vendor dependency, in-house G2J Gherkin-to-Jira automation, and XML utilities that streamlined QA and development workflows.\n\nIf you want richer project answers, the next step is to add a few sanitized project summaries with stack, role, problem, solution, and measurable impact.",
        relatedPrompts: [
          "What measurable impact has Rushal delivered?",
          "Tell me about Rushal's healthcare interoperability experience.",
          "What leadership experience does Rushal have?"
        ]
      },
      {
        id: "tools",
        keywords: ["ai", "copilot", "claude", "windsurf", "tooling", "automation", "gherkin", "jira", "xml", "developer tools", "productivity tools"],
        answer:
          "Rushal's productivity tooling in the approved profile includes:\n\n- Windsurf\n- Claude\n- Copilot\n- G2J (Gherkin to Jira) automation\n- XML utilities for QA and development workflows",
        relatedPrompts: [
          "What is Rushal's tech stack?",
          "What public project examples can you share?",
          "What measurable impact has Rushal delivered?",
          "What roles is Rushal best suited for?"
        ]
      },
      {
        id: "availability",
        keywords: ["availability", "available", "location", "remote", "relocation", "where are you", "where is rushal"],
        answer:
          "I am based in India and open to remote opportunities as well as relocation, depending on the role and fit.",
        relatedPrompts: [
          "How can I contact Rushal?",
          "What roles is Rushal best suited for?",
          "What leadership experience does Rushal have?"
        ]
      },
      {
        id: "contact",
        keywords: ["contact", "reach", "email", "phone", "whatsapp", "linkedin", "teams", "connect"],
        answer:
          "You can reach me at rushalmak@gmail.com or call me on +91 9019 197 711. The page also includes LinkedIn, WhatsApp, and Microsoft Teams links if you prefer those channels.",
        relatedPrompts: [
          "What roles is Rushal best suited for?",
          "Tell me about Rushal's healthcare interoperability experience.",
          "What public project examples can you share?"
        ]
      }
    ]
  };
}());
