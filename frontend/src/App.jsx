import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [analysis, setAnalysis] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      setResumeText(data.resume_text);
      setAnalysis(data.analysis);
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="app-container">
      {/* Animated background */}
      <div className="animated-bg"></div>

      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-content">
          <div className="logo-section">
            <div className="logo-icon">✨</div>
            <h1 className="logo-text">Resume AI</h1>
          </div>
          <p className="tagline">Intelligent Resume Analysis Powered by AI</p>
        </div>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        {/* Upload Section */}
        <div className="upload-section">
          <div className="section-card">
            <div className="section-header">
              <h2 className="section-title">📄 Upload Your Resume</h2>
              <p className="section-subtitle">
                Drop your PDF resume and let our AI analyze it
              </p>
            </div>

            <div
              className={`upload-area ${isDragging ? "dragging" : ""}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <div className="upload-content">
                <div className="upload-icon">📤</div>
                <p className="upload-text">
                  {file ? file.name : "Drag & drop your PDF here"}
                </p>
                <p className="upload-subtext">or</p>
                <label className="file-input-label">
                  <span>Browse Files</span>
                  <input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files[0])}
                    className="file-input"
                  />
                </label>
              </div>
            </div>

            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="upload-button"
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="button-icon">⚡</span>
                  Analyze Resume
                </>
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {(resumeText || analysis) && (
          <div className="results-section">
            {/* Resume Text */}
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">📋 Extracted Resume Text</h2>
              </div>
              <div className="textarea-wrapper">
                <textarea
                  className="output-textarea"
                  rows="12"
                  value={resumeText}
                  readOnly
                />
              </div>
            </div>

            {/* AI Analysis */}
            <div className="section-card">
              <div className="section-header">
                <h2 className="section-title">🤖 AI Analysis & Insights</h2>
              </div>
              <div className="textarea-wrapper">
                <textarea
                  className="output-textarea"
                  rows="20"
                  value={analysis}
                  readOnly
                />
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!resumeText && !analysis && !loading && (
          <div className="empty-state">
            <div className="empty-state-icon">🎯</div>
            <p className="empty-state-text">
              Start by uploading a PDF resume to get AI-powered insights
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="footer">
        <p>
          Powered by Advanced AI • Secure & Private • No data stored
        </p>
      </footer>
    </div>
  );
}

export default App;