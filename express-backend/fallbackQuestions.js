// Fallback questions used when MongoDB is unavailable.
// Focused on MERN, Node.js, C++, and Data Structures.

const FALLBACK_QUESTIONS = [
  // ✅ MERN Stack
  { question: "What is the MERN stack and what are its key components?", techStack: "mern" },
  { question: "How does data flow between React, Express, and MongoDB in a MERN application?", techStack: "mern" },
  { question: "Explain how to implement authentication in a MERN stack app.", techStack: "mern" },
  { question: "What are React Hooks and how do they simplify state management?", techStack: "mern" },

  // ✅ Node.js
  { question: "Explain the event-driven architecture of Node.js.", techStack: "node" },
  { question: "What are streams in Node.js and how are they used?", techStack: "node" },
  { question: "How do you handle asynchronous operations in Node.js?", techStack: "node" },
  { question: "What is middleware in Express.js and how is it used?", techStack: "node" },

  // ✅ C++
  { question: "What are the differences between compile-time and run-time polymorphism in C++?", techStack: "cpp" },
  { question: "Explain memory management and pointers in C++.", techStack: "cpp" },
  { question: "What is the difference between shallow copy and deep copy in C++?", techStack: "cpp" },
  { question: "Explain the concept of inheritance and virtual functions in C++.", techStack: "cpp" },

  // ✅ Data Structures
  { question: "What is the difference between a stack and a queue?", techStack: "dsa" },
  { question: "How is a linked list different from an array?", techStack: "dsa" },
  { question: "Explain the time complexity of different tree traversals.", techStack: "dsa" },
  { question: "What are hash tables and how do they work internally?", techStack: "dsa" }
];

module.exports = { FALLBACK_QUESTIONS };
