import { useState } from "react";
import "./App.css";

function App() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const askQuestion = async () => {
    const cleanedQuestion = question.trim();

    // Check whether the user entered a question
    if (!cleanedQuestion) {
      setError("Please enter a question.");
      setAnswer("");
      return;
    }

    // Start loading
    setLoading(true);
    setError("");
    setAnswer("");

    try {
      // Connect to the deployed FastAPI backend
      const response = await fetch(
        "https://askmynotes-backend-a2ub.onrender.com/ask",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            question: cleanedQuestion,
          }),
        }
      );

      // Check whether the backend responded successfully
      if (!response.ok) {
        throw new Error(`Backend returned status ${response.status}`);
      }

      // Convert backend response into JSON
      const data = await response.json();

      // Display the backend answer
      setAnswer(data.answer);
    } catch (err) {
      console.error("Backend connection error:", err);

      setError(
        "Unable to connect to the backend. Check whether the FastAPI container is running."
      );
    } finally {
      // Stop loading
      setLoading(false);
    }
  };

  return (
    <main className="page">
      <section className="card">
        <h1>Ask My Notes</h1>

        <p>Enter a question and send it to the FastAPI backend.</p>

        <label htmlFor="question">Your question</label>

        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="For example: What is Docker?"
          rows="5"
        />

        <button onClick={askQuestion} disabled={loading}>
          {loading ? "Sending..." : "Ask Question"}
        </button>

        {error && <div className="error">{error}</div>}

        {answer && (
          <div className="answer">
            <h2>Backend response</h2>
            <p>{answer}</p>
          </div>
        )}
      </section>
    </main>
  );
}

export default App;