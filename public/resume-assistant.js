(function () {
  var knowledge = window.resumeAssistantKnowledge;
  if (!knowledge) {
    return;
  }

  var launcher = document.getElementById("assistantLauncher");
  var launcherButton = document.getElementById("assistantLauncherButton");
  var shell = document.getElementById("assistantShell");
  var closeButton = document.getElementById("assistantClose");
  var voiceToggle = document.getElementById("assistantVoiceToggle");
  var statusEl = document.getElementById("assistantStatus");
  var suggestionBar = document.getElementById("assistantSuggestionBar");
  var suggestionsEl = document.getElementById("assistantSuggestions");
  var messagesEl = document.getElementById("assistantMessages");
  var form = document.getElementById("assistantForm");
  var input = document.getElementById("assistantInput");
  var heroTrigger = document.getElementById("heroAssistantTrigger");
  var typingId = "assistantTypingMessage";

  if (
    !launcher ||
    !launcherButton ||
    !shell ||
    !closeButton ||
    !voiceToggle ||
    !statusEl ||
    !suggestionBar ||
    !suggestionsEl ||
    !messagesEl ||
    !form ||
    !input
  ) {
    return;
  }

  var state = {
    voiceEnabled: false,
    isOpen: false,
    history: [],
    showSuggestions: true
  };

  function normalize(text) {
    return (text || "")
      .toLowerCase()
      .replace(/asp\.net/g, " aspnet ")
      .replace(/\.net/g, " dotnet ")
      .replace(/c#/g, " csharp ")
      .replace(/[^a-z0-9+ ]/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  function unique(items) {
    var seen = {};
    var result = [];
    items.forEach(function (item) {
      if (!item || seen[item]) {
        return;
      }
      seen[item] = true;
      result.push(item);
    });
    return result;
  }

  function tokenize(text) {
    return normalize(text)
      .split(" ")
      .filter(function (token) {
        return token.length > 1;
      });
  }

  function levenshteinDistance(left, right) {
    var a = left || "";
    var b = right || "";
    var matrix = [];
    var i;
    var j;

    for (i = 0; i <= b.length; i += 1) {
      matrix[i] = [i];
    }

    for (j = 0; j <= a.length; j += 1) {
      matrix[0][j] = j;
    }

    for (i = 1; i <= b.length; i += 1) {
      for (j = 1; j <= a.length; j += 1) {
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

  function containsAny(question, patterns) {
    return patterns.some(function (pattern) {
      return hasPhrase(question, pattern);
    });
  }

  function escapeRegExp(value) {
    return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function hasPhrase(text, phrase) {
    var normalizedPhrase = normalize(phrase);
    var tokenPattern;
    var expression;
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

  function findTopicById(id) {
    return (knowledge.topics || []).find(function (topic) {
      return topic.id === id;
    });
  }

  function buildTopicReply(topic) {
    if (!topic) {
      return {
        text: knowledge.fallbackMessage,
        prompts: knowledge.suggestedPrompts
      };
    }

    return {
      text: topic.answer,
      prompts: topic.relatedPrompts && topic.relatedPrompts.length
        ? topic.relatedPrompts
        : knowledge.suggestedPrompts
    };
  }

  function pickDirectTopicId(question) {
    var rules = [
      {
        id: "education",
        patterns: [
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
        ]
      },
      {
        id: "role-fit",
        patterns: [
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
        ]
      },
      {
        id: "tech-stack",
        patterns: [
          "tech stack",
          "techstack",
          "stack",
          "csharp",
          "dotnet",
          "aspnet",
          "web api",
          "sql server",
          "microservices",
          "wpf",
          "vbnet",
          "jenkins"
        ]
      },
      {
        id: "healthcare",
        patterns: ["healthcare", "interoperability", "hl7", "fhir", "ccda", "ecr", "mirth", "smart on fhir"]
      },
      {
        id: "leadership",
        patterns: ["leadership", "manager", "management", "team", "stakeholder", "agile", "scrum"]
      },
      {
        id: "experience",
        patterns: ["experience", "career", "work history", "nextgen", "ust", "dell", "satyam", "tech mahindra"]
      },
      {
        id: "projects",
        patterns: ["project", "projects", "portfolio", "work sample", "case study", "examples"]
      },
      {
        id: "certifications",
        patterns: ["certification", "certifications", "certified", "acsm", "connectathon"]
      },
      {
        id: "contact",
        patterns: ["contact", "reach", "email", "phone", "whatsapp", "linkedin", "teams"]
      },
      {
        id: "availability",
        patterns: ["availability", "available", "remote", "relocation", "location"]
      }
    ];
    var matched = rules.find(function (rule) {
      return containsAny(question, rule.patterns);
    });

    return matched ? matched.id : null;
  }

  function isAcademicQualificationQuestion(question) {
    return containsAny(question, [
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

  function isRoleFitQuestion(question) {
    return containsAny(question, [
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

  function setStatus(text) {
    statusEl.textContent = text;
  }

  function setSuggestionsVisible(visible) {
    state.showSuggestions = visible;
    suggestionBar.classList.toggle("hidden", !visible);
  }

  function scrollMessages() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function paragraphize(target, text) {
    text.split(/\n\s*\n/).forEach(function (paragraph) {
      var lines = paragraph
        .split("\n")
        .map(function (line) {
          return line.trim();
        })
        .filter(Boolean);
      var bulletLines;
      var ul;

      if (!lines.length) {
        return;
      }

      bulletLines = lines.filter(function (line) {
        return /^[-*]\s+/.test(line);
      });

      if (bulletLines.length === lines.length) {
        ul = document.createElement("ul");
        ul.className = "assistant-list";
        bulletLines.forEach(function (line) {
          var li = document.createElement("li");
          li.textContent = line.replace(/^[-*]\s+/, "");
          ul.appendChild(li);
        });
        target.appendChild(ul);
        return;
      }

      var p = document.createElement("p");
      p.textContent = lines.join(" ");
      target.appendChild(p);
    });
  }

  function addMessage(role, text) {
    var message = document.createElement("div");
    message.className = "assistant-message " + role;

    var bubble = document.createElement("div");
    bubble.className = "assistant-bubble";
    paragraphize(bubble, text);

    message.appendChild(bubble);
    messagesEl.appendChild(message);
    scrollMessages();
  }

  function rememberMessage(role, content) {
    state.history.push({
      role: role,
      content: content
    });

    if (state.history.length > 8) {
      state.history = state.history.slice(-8);
    }
  }

  function addTypingMessage() {
    removeTypingMessage();

    var message = document.createElement("div");
    message.className = "assistant-message assistant";
    message.id = typingId;

    var bubble = document.createElement("div");
    bubble.className = "assistant-bubble assistant-bubble--typing";

    for (var i = 0; i < 3; i += 1) {
      var dot = document.createElement("span");
      dot.className = "assistant-dot";
      dot.style.animationDelay = i * 0.15 + "s";
      bubble.appendChild(dot);
    }

    message.appendChild(bubble);
    messagesEl.appendChild(message);
    scrollMessages();
  }

  function removeTypingMessage() {
    var existing = document.getElementById(typingId);
    if (existing && existing.parentNode) {
      existing.parentNode.removeChild(existing);
    }
  }

  function renderSuggestions(prompts) {
    var promptList = (knowledge.suggestedPrompts || []).slice(0, 4);

    suggestionsEl.innerHTML = "";

    promptList.forEach(function (prompt) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "assistant-chip";
      button.textContent = prompt;
      button.addEventListener("click", function () {
        submitQuestion(prompt);
      });
      suggestionsEl.appendChild(button);
    });
  }

  function isOutOfScopeAnswer(answer) {
    var normalizedAnswer = normalize(answer);
    return (
      normalizedAnswer.indexOf("sorry i can t answer that from my current resume database") !== -1 ||
      normalizedAnswer.indexOf("sorry i can t answer that from the current resume database") !== -1
    );
  }

  function withBackHint(answer) {
    if (answer.indexOf("Type \"back\"") !== -1) {
      return answer;
    }

    return answer + "\n\nType \"back\" to go to questions, or type a question.";
  }

  function scoreTopic(topic, question) {
    var score = 0;
    var questionTokens = tokenize(question);
    topic.keywords.forEach(function (keyword) {
      var normalizedKeyword = normalize(keyword);
      var keywordTokens;
      var strongKeywordTokens;
      var isMultiWordKeyword;
      if (!normalizedKeyword) {
        return;
      }

      if (normalizedKeyword.length < 2) {
        return;
      }

      isMultiWordKeyword = normalizedKeyword.indexOf(" ") !== -1;

      if (question.indexOf(normalizedKeyword) !== -1) {
        score += isMultiWordKeyword ? 4 : 1.25;
        return;
      }

      keywordTokens = normalizedKeyword.split(" ");
      strongKeywordTokens = keywordTokens.filter(function (piece) {
        return !isWeakToken(piece);
      });

      // Avoid false positives from phrases that collapse to one useful token
      // after weak-word filtering (e.g. "who is rushal" -> "rushal").
      if (isMultiWordKeyword && strongKeywordTokens.length < 2) {
        return;
      }

      if (
        strongKeywordTokens.length &&
        strongKeywordTokens.every(function (piece) { return hasApproximateTokenMatch(questionTokens, piece); })
      ) {
        score += isMultiWordKeyword ? 3 : 1;
        return;
      }

      strongKeywordTokens.forEach(function (piece) {
        if (piece.length > 2 && question.indexOf(piece) !== -1) {
          score += 0.5;
          return;
        }

        if (hasApproximateTokenMatch(questionTokens, piece)) {
          score += 0.75;
        }
      });
    });
    return score;
  }

  function buildReply(question) {
    var normalizedQuestion = normalize(question);

    if (!normalizedQuestion) {
      return {
        text: knowledge.fallbackMessage,
        prompts: knowledge.suggestedPrompts
      };
    }

    if (isAcademicQualificationQuestion(normalizedQuestion) && !isRoleFitQuestion(normalizedQuestion)) {
      return buildTopicReply(findTopicById("education"));
    }

    if (isRoleFitQuestion(normalizedQuestion)) {
      return buildTopicReply(findTopicById("role-fit"));
    }

    var directTopicId = pickDirectTopicId(normalizedQuestion);
    if (directTopicId) {
      return buildTopicReply(findTopicById(directTopicId));
    }

    var ranked = knowledge.topics
      .map(function (topic) {
        return {
          topic: topic,
          score: scoreTopic(topic, normalizedQuestion)
        };
      })
      .sort(function (left, right) {
        return right.score - left.score;
      });

    var winners = ranked.filter(function (entry) {
      return entry.score >= 2.25;
    }).slice(0, 1);

    if (!winners.length) {
      return {
        text: knowledge.fallbackMessage,
        prompts: knowledge.suggestedPrompts
      };
    }

    var response = unique(
      winners.map(function (entry) {
        return entry.topic.answer;
      })
    ).join("\n\n");

    var prompts = unique(
      winners.reduce(function (all, entry) {
        return all.concat(entry.topic.relatedPrompts || []);
      }, [])
    );

    return {
      text: response,
      prompts: prompts.length ? prompts : knowledge.suggestedPrompts
    };
  }

  function buildFallbackResult(question) {
    var reply = buildReply(question);
    return {
      answer: reply.text,
      suggestions: reply.prompts,
      source: "fallback"
    };
  }

  async function getAssistantReply(question) {
    if (!window.fetch) {
      return buildFallbackResult(question);
    }

    try {
      var response = await window.fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          question: question,
          history: state.history
        })
      });

      if (!response.ok) {
        return buildFallbackResult(question);
      }

      var data = await response.json();
      if (!data || typeof data.answer !== "string" || !data.answer.trim()) {
        return buildFallbackResult(question);
      }

      if (data.source === "fallback") {
        return buildFallbackResult(question);
      }

      return {
        answer: data.answer.trim(),
        suggestions: Array.isArray(data.suggestions) && data.suggestions.length
          ? data.suggestions
          : knowledge.suggestedPrompts,
        source: data.source || "openai"
      };
    } catch (_error) {
      return buildFallbackResult(question);
    }
  }

  function getPreferredVoice() {
    if (!window.speechSynthesis) {
      return null;
    }

    var voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) {
      return null;
    }

    return (
      voices.find(function (voice) {
        return /en(-|_)?(in|gb|us)/i.test(voice.lang || "");
      }) ||
      voices.find(function (voice) {
        return /^en/i.test(voice.lang || "");
      }) ||
      voices[0]
    );
  }

  function stopSpeaking() {
    if (!window.speechSynthesis) {
      return;
    }

    window.speechSynthesis.cancel();
    shell.classList.remove("is-speaking");
    setStatus(state.voiceEnabled ? "Voice is on" : knowledge.statusLine);
  }

  function speak(text) {
    if (!state.voiceEnabled || !window.speechSynthesis) {
      return;
    }

    stopSpeaking();

    var utterance = new SpeechSynthesisUtterance(text.replace(/\s+/g, " ").trim());
    utterance.rate = 1;
    utterance.pitch = 0.95;
    utterance.voice = getPreferredVoice();

    utterance.onstart = function () {
      shell.classList.add("is-speaking");
      setStatus("Speaking answer...");
    };

    utterance.onend = function () {
      shell.classList.remove("is-speaking");
      setStatus("Voice is on");
    };

    utterance.onerror = function () {
      shell.classList.remove("is-speaking");
      setStatus("Voice is on");
    };

    window.speechSynthesis.speak(utterance);
  }

  function syncVoiceButton() {
    var supported = !!window.speechSynthesis;
    voiceToggle.disabled = !supported;
    voiceToggle.textContent = supported
      ? (state.voiceEnabled ? "Voice on" : "Voice off")
      : "Voice unavailable";
    voiceToggle.setAttribute("aria-pressed", state.voiceEnabled ? "true" : "false");
  }

  function openAssistant(prefill) {
    shell.classList.add("open");
    launcher.classList.add("hidden");
    launcherButton.setAttribute("aria-expanded", "true");
    shell.setAttribute("aria-hidden", "false");
    state.isOpen = true;
    setStatus(state.voiceEnabled ? "Voice is on" : knowledge.statusLine);
    setSuggestionsVisible(state.showSuggestions);

    if (prefill) {
      input.value = prefill;
    }

    input.focus();
  }

  function closeAssistant() {
    shell.classList.remove("open");
    launcher.classList.remove("hidden");
    launcherButton.setAttribute("aria-expanded", "false");
    shell.setAttribute("aria-hidden", "true");
    state.isOpen = false;
    stopSpeaking();
  }

  async function submitQuestion(question) {
    var trimmed = (question || "").trim();
    var normalizedTrimmed = normalize(trimmed);
    var answerText;
    var outOfScope;
    var backReply;

    if (!trimmed) {
      return;
    }

    addMessage("user", trimmed);
    rememberMessage("user", trimmed);
    input.value = "";

    if (normalizedTrimmed === "back") {
      setSuggestionsVisible(true);
      renderSuggestions(knowledge.suggestedPrompts);
      backReply = "Quick prompts are back below. Pick one, or type a question.";
      addMessage("assistant", backReply);
      rememberMessage("assistant", backReply);
      setStatus(state.voiceEnabled ? "Voice is on" : "Using local resume mode");
      speak(backReply);
      return;
    }

    setSuggestionsVisible(false);
    addTypingMessage();
    setStatus("Checking the resume...");

    var reply = await getAssistantReply(trimmed);
    removeTypingMessage();
    answerText = reply.answer;
    outOfScope = isOutOfScopeAnswer(answerText);
    answerText = withBackHint(answerText);

    addMessage("assistant", answerText);
    rememberMessage("assistant", answerText);
    renderSuggestions(reply.suggestions);
    setSuggestionsVisible(outOfScope);

    if (reply.source === "openai") {
      setStatus(state.voiceEnabled ? "Voice is on" : "AI + resume grounding");
    } else {
      setStatus(state.voiceEnabled ? "Voice is on" : "Using local resume mode");
    }

    speak(answerText);
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    submitQuestion(input.value);
  });

  launcherButton.addEventListener("click", function () {
    openAssistant("");
  });

  closeButton.addEventListener("click", function () {
    closeAssistant();
  });

  voiceToggle.addEventListener("click", function () {
    if (!window.speechSynthesis) {
      return;
    }

    state.voiceEnabled = !state.voiceEnabled;
    syncVoiceButton();

    if (!state.voiceEnabled) {
      stopSpeaking();
      return;
    }

    setStatus("Voice is on");
  });

  if (heroTrigger) {
    heroTrigger.addEventListener("click", function () {
      openAssistant("What roles is Rushal best suited for?");
    });
  }

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && state.isOpen) {
      closeAssistant();
    }
  });

  if (window.speechSynthesis && typeof window.speechSynthesis.onvoiceschanged !== "undefined") {
    window.speechSynthesis.onvoiceschanged = syncVoiceButton;
  }

  syncVoiceButton();
  renderSuggestions(knowledge.suggestedPrompts);
  setSuggestionsVisible(true);
  addMessage("assistant", knowledge.openingMessage);
}());
