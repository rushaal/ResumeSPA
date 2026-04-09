const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const OpenAI = require("openai");
const { resumeProfile } = require("./server/resume-profile");

dotenv.config();

const app = express();
const rootDir = __dirname;
const port = Number(process.env.PORT || 3000);
const openAiApiKey = process.env.OPENAI_API_KEY;
const openAiModel = process.env.OPENAI_MODEL || "gpt-5";
const client = openAiApiKey ? new OpenAI({ apiKey: openAiApiKey }) : null;

app.use(express.json({ limit: "1mb" }));
app.use("/public", express.static(path.join(rootDir, "public")));

app.get("/", function (_req, res) {
  res.sendFile(path.join(rootDir, "index.html"));
});

["/index.html", "/index_apple.html", "/JiraSPA.html", "/CNAME"].forEach(function (routePath) {
  app.get(routePath, function (_req, res) {
    res.sendFile(path.join(rootDir, routePath.slice(1)));
  });
});

app.get("/api/health", function (_req, res) {
  res.json({
    ok: true,
    aiEnabled: Boolean(client),
    model: client ? openAiModel : null
  });
});

app.post("/api/chat", async function (req, res) {
  const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
  const history = Array.isArray(req.body?.history) ? req.body.history : [];

  if (!question) {
    res.status(400).json({ error: "Question is required." });
    return;
  }

  try {
    if (!client) {
      const fallback = buildLocalFallback(question);
      res.json({
        answer: fallback.answer,
        suggestions: fallback.suggestions,
        source: "fallback",
        reason: "OPENAI_API_KEY is not configured."
      });
      return;
    }

    const response = await client.responses.create({
      model: openAiModel,
      reasoning: { effort: "low" },
      instructions: buildInstructions(),
      input: buildModelInput(question, history)
    });

    const answer = (response.output_text || "").trim();

    res.json({
      answer: answer || buildLocalFallback(question).answer,
      suggestions: resumeProfile.suggestedPrompts.slice(0, 4),
      source: "openai"
    });
  } catch (error) {
    const fallback = buildLocalFallback(question);
    res.status(200).json({
      answer: fallback.answer,
      suggestions: fallback.suggestions,
      source: "fallback",
      reason: error && error.message ? error.message : "Unknown AI error."
    });
  }
});

app.listen(port, function () {
  const mode = client ? "AI-backed" : "fallback-only";
  console.log("Resume assistant server running on http://localhost:" + port + " (" + mode + ")");
});

function buildInstructions() {
  return [
    "You are the resume assistant for Rushal Maksane.",
    "Answer only from the approved profile data below.",
    "If a detail is not in the approved profile, say that it is not available in the approved public profile.",
    "Never invent confidential client details, internal architecture, or extra metrics.",
    "Treat project summaries as public-safe summaries only.",
    "Keep answers concise, professional, and recruiter-friendly unless technical depth is explicitly requested.",
    "Approved profile data:",
    JSON.stringify(resumeProfile, null, 2)
  ].join("\n\n");
}

function buildModelInput(question, history) {
  const recentHistory = history
    .filter(function (message) {
      return message && typeof message.role === "string" && typeof message.content === "string";
    })
    .slice(-6)
    .map(function (message) {
      return message.role.toUpperCase() + ": " + message.content.trim();
    })
    .join("\n");

  return [
    recentHistory ? "Recent conversation:\n" + recentHistory : "",
    "Current user question:\n" + question
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildLocalFallback(question) {
  const normalized = normalize(question);
  const questionTokens = tokenize(question);

  const topics = [
    {
      keywords: ["about", "summary", "profile", "introduce", "who is rushal", "tell me about rushal"],
      answer:
        "Rushal is an Engineering Lead and Project Manager with 19+ years in software engineering and 12+ years delivering U.S. healthcare interoperability solutions. His profile combines technical depth, delivery ownership, and distributed team leadership."
    },
    {
      keywords: ["qualification", "qualifications", "qualificaiton", "academic qualification", "academic qualifications", "education qualification", "educational qualification", "highest qualification", "formal qualification", "degree", "education", "mca", "master of computer application", "master of computer applications", "nirma"],
      answer:
        "Rushal's formal academic qualification is a Master of Computer Applications (M.C.A.) from Nirma Institute of Technology, Ahmedabad."
    },
    {
      keywords: ["best qualified for", "qualified for", "fit", "fit for", "best suited", "best suited for", "expertise", "strength", "what can he do", "what can rushal do", "what does he do", "roles", "role", "position", "positions"],
      answer:
        "Rushal is best suited for Engineering Lead, Technical Program, or Project Manager style roles that need both technical depth and delivery ownership. His public profile highlights 19+ years in software engineering, 12+ years in U.S. healthcare interoperability, distributed team leadership, and strong stakeholder management."
    },
    {
      keywords: ["tech stack", "techstack", "stack", "technology", "technologies", "framework", "frameworks", ".net", "dotnet", "c#", "asp.net", "web api", "sql server", "microservices", "wpf", "jenkins", "tools"],
      answer:
        "Here is the tech stack from Rushal's approved public profile:\n\n- C# / .NET Core\n- VB.NET\n- ASP.NET MVC\n- Web API\n- SQL Server\n- Microservices\n- Jenkins CI/CD\n- TDD / BDD\n- WPF\n- HL7 v2 and v3\n- FHIR, CCDA, ECR, SMART on FHIR\n- Mirth Connect"
    },
    {
      keywords: ["experience", "career", "work history", "background", "years", "nextgen", "ust", "dell", "satyam", "tech mahindra"],
      answer:
        "Rushal brings 19+ years of software engineering experience overall. The longest stretch was 13+ years at NextGen Healthcare on EHR and interoperability systems, with earlier experience at UST Global with Dell Technologies and at Satyam Technology, now Tech Mahindra."
    },
    {
      keywords: ["healthcare", "interoperability", "hl7", "fhir", "ccda", "ecr", "smart on fhir", "mirth"],
      answer:
        "Rushal has deep experience in U.S. healthcare interoperability, including HL7 v2 and v3, FHIR, CCDA, ECR, XDS/XDR/XDM, SMART on FHIR, and Mirth Connect. That domain depth is one of the strongest parts of his profile."
    },
    {
      keywords: ["leadership", "manager", "team", "teams", "led", "delivery", "stakeholder", "agile", "scrum"],
      answer:
        "Rushal has led distributed teams of 10+ engineers across India and the USA, owned delivery cadence and solution design, and handled stakeholder communication during client calls and critical production incidents."
    },
    {
      keywords: ["project", "projects", "example", "examples", "work sample"],
      answer:
        "Public-safe project examples include healthcare modernization work, the Symphonia-to-NHapi migration, internal Gherkin-to-Jira automation, and XML productivity utilities. The profile currently supports public summaries rather than deep confidential case studies."
    },
    {
      keywords: ["impact", "achievement", "result", "results", "performance", "optimization", "award", "awards"],
      answer:
        "Public profile highlights include an 80% performance improvement through redesign and query optimization, migration from Symphonia to NHapi to reduce vendor dependency, modernization of legacy application components, and multiple delivery awards."
    },
    {
      keywords: ["certification", "certifications", "certified", "acsm", "scrum", "mirth"],
      answer:
        "Rushal holds Advanced Certified Scrum Master certification, is Mirth Connect Certified, and has participated in the U.S. Connectathon."
    },
    {
      keywords: ["availability", "available", "remote", "relocation", "location", "where is rushal"],
      answer:
        "Rushal is based in India and is open to remote opportunities as well as relocation, depending on the role and fit."
    },
    {
      keywords: ["contact", "email", "phone", "linkedin", "whatsapp", "teams", "reach"],
      answer:
        "You can reach Rushal at rushalmak@gmail.com or +91 9019 197 711. The profile also includes LinkedIn, WhatsApp, and Microsoft Teams contact links."
    }
  ];

  if (isAcademicQualificationQuestion(normalized) && !isRoleFitQuestion(normalized)) {
    return {
      answer: topics[1].answer,
      suggestions: resumeProfile.suggestedPrompts.slice(0, 4)
    };
  }

  if (isRoleFitQuestion(normalized)) {
    return {
      answer: topics[2].answer,
      suggestions: resumeProfile.suggestedPrompts.slice(0, 4)
    };
  }

  const ranked = topics
    .map(function (topic) {
      return {
        topic: topic,
        score: scoreTopic(normalized, questionTokens, topic)
      };
    })
    .sort(function (left, right) {
      return right.score - left.score;
    });

  const winners = ranked.filter(function (entry) {
    return entry.score >= 1.5;
  }).slice(0, 2);

  return {
    answer:
      winners.length
        ? uniqueText(
            winners.map(function (entry) {
              return entry.topic.answer;
            })
          ).join("\n\n")
        : "Sorry, I can't answer that from the current resume database. Please choose one of the suggested questions.",
    suggestions: resumeProfile.suggestedPrompts.slice(0, 4)
  };
}

function normalize(value) {
  return String(value || "")
    .toLowerCase()
    .replace(/asp\.net/g, " aspnet ")
    .replace(/\.net/g, " dotnet ")
    .replace(/c#/g, " csharp ")
    .replace(/[^a-z0-9+ ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenize(value) {
  return normalize(value)
    .split(" ")
    .filter(function (token) {
      return token.length > 1;
    });
}

function containsAny(value, patterns) {
  return patterns.some(function (pattern) {
    return hasPhrase(value, pattern);
  });
}

function escapeRegExp(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasPhrase(text, phrase) {
  const normalizedPhrase = normalize(phrase);
  let tokenPattern;
  let expression;

  if (!normalizedPhrase) {
    return false;
  }

  tokenPattern = normalizedPhrase
    .split(" ")
    .filter(Boolean)
    .map(function (piece) {
      return escapeRegExp(piece);
    })
    .join("\\s+");

  expression = "(^|\\s)" + tokenPattern + "(?=\\s|$)";
  return new RegExp(expression).test(text);
}

function isAcademicQualificationQuestion(value) {
  return containsAny(value, [
    " qualification",
    "qualification ",
    "qualification",
    "qualifications",
    "qualificaiton",
    "highest qualification",
    "academic qualification",
    "education qualification",
    "educational qualification",
    "formal qualification",
    "mca",
    "master of computer application",
    "master of computer applications"
  ]);
}

function isRoleFitQuestion(value) {
  return containsAny(value, [
    "best qualified for",
    "qualified for",
    "best suited",
    "best suited for",
    "fit for",
    "what can he do",
    "what can rushal do",
    "what does he do",
    "roles",
    "role",
    "position",
    "positions"
  ]);
}

function hasApproximateTokenMatch(questionTokens, keywordToken) {
  return questionTokens.some(function (questionToken) {
    if (questionToken === keywordToken) {
      return true;
    }

    if (questionToken.length < 5 || keywordToken.length < 5) {
      return false;
    }

    return levenshteinDistance(questionToken, keywordToken) <= 2;
  });
}

function isWeakToken(token) {
  return !token || token.length < 2 || {
    a: true,
    an: true,
    and: true,
    are: true,
    as: true,
    at: true,
    can: true,
    do: true,
    does: true,
    for: true,
    he: true,
    her: true,
    his: true,
    how: true,
    i: true,
    is: true,
    me: true,
    of: true,
    or: true,
    tell: true,
    the: true,
    their: true,
    them: true,
    they: true,
    to: true,
    what: true,
    who: true,
    you: true,
    your: true
  }[token];
}

function scoreTopic(normalizedQuestion, questionTokens, topic) {
  let score = 0;

  topic.keywords.forEach(function (keyword) {
    const normalizedKeyword = normalize(keyword);
    const keywordTokens = tokenize(normalizedKeyword);
    const strongKeywordTokens = keywordTokens.filter(function (piece) {
      return !isWeakToken(piece);
    });
    const isMultiWordKeyword = normalizedKeyword.indexOf(" ") !== -1;

    if (!normalizedKeyword) {
      return;
    }

    if (normalizedKeyword.length < 2) {
      return;
    }

    if (normalizedQuestion.indexOf(normalizedKeyword) !== -1) {
      score += isMultiWordKeyword ? 4 : 2;
      return;
    }

    // Prevent phrases that reduce to one strong token after weak-word
    // filtering from matching unrelated questions.
    if (isMultiWordKeyword && strongKeywordTokens.length < 2) {
      return;
    }

    if (strongKeywordTokens.length && strongKeywordTokens.every(function (keywordToken) {
      return hasApproximateTokenMatch(questionTokens, keywordToken);
    })) {
      score += isMultiWordKeyword ? 3 : 2;
      return;
    }

    strongKeywordTokens.forEach(function (keywordToken) {
      if (keywordToken.length > 2 && normalizedQuestion.indexOf(keywordToken) !== -1) {
        score += 0.5;
        return;
      }

      if (hasApproximateTokenMatch(questionTokens, keywordToken)) {
        score += 0.75;
      }
    });
  });

  return score;
}

function uniqueText(items) {
  const seen = new Set();
  return items.filter(function (item) {
    if (!item || seen.has(item)) {
      return false;
    }

    seen.add(item);
    return true;
  });
}

function levenshteinDistance(left, right) {
  const a = left || "";
  const b = right || "";
  const matrix = [];

  for (let i = 0; i <= b.length; i += 1) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j += 1) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i += 1) {
    for (let j = 1; j <= a.length; j += 1) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}
