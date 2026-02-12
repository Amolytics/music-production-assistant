
import { useEffect, useState } from "react";

function TutorialsPage() {
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState([]);
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    async function fetchTutorials() {
      setLoading(true);
      setError(null);
      try {
        // Fetch session context first
        const backendUrl = import.meta.env.VITE_BACKEND_URL || '';
        const sessionRes = await fetch(`${backendUrl}/session-info`);
        const sessionData = await sessionRes.json();
        const response = await fetch("/tutorials/recommend", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_context: sessionData, user_profile: {} })
        });
        const data = await response.json();
        setTutorials(data.recommendations || []);
      } catch (err) {
        setError("Failed to load tutorials.");
      } finally {
        setLoading(false);
      }
    }
    fetchTutorials();
  }, []);

  const handleBookmark = idx => {
    setBookmarked(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleRating = (idx, rating) => {
    setRatings(prev => ({ ...prev, [idx]: rating }));
  };

  return (
    <div className="tutorials-page">
      <h1>Tutorials</h1>
      {loading && <p>Loading recommendations...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {!loading && !error && (
        <ul>
          {tutorials.map((tutorial, idx) => (
            <li key={idx} style={{ marginBottom: "1em" }}>
              <a href={tutorial.url} target="_blank" rel="noopener noreferrer">
                {tutorial.title}
              </a>
              <button style={{ marginLeft: 8 }} onClick={() => handleBookmark(idx)}>
                {bookmarked.includes(idx) ? "★ Bookmarked" : "☆ Bookmark"}
              </button>
              <span style={{ marginLeft: 12 }}>
                Rate:
                {[1,2,3,4,5].map(star => (
                  <button
                    key={star}
                    style={{ color: ratings[idx] >= star ? "gold" : "gray", border: "none", background: "none", cursor: "pointer" }}
                    onClick={() => handleRating(idx, star)}
                  >
                    ★
                  </button>
                ))}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TutorialsPage;
