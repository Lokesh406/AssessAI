import React, { useState } from 'react';
import { jsPDF } from 'jspdf';

const QUESTION_API_URL = (process.env.REACT_APP_QUESTION_API_URL || 'http://localhost:8000').replace(/\/$/, '');

const QuestionGenerator = ({ onQuestionsGenerated }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [className, setClassName] = useState('');
  const [topics, setTopics] = useState('');
  const [numQuestions, setNumQuestions] = useState(1);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState([]);
  const [error, setError] = useState('');

  const handleDownloadPdf = () => {
    if (!Array.isArray(generated) || generated.length === 0) {
      setError('No questions available to download. Please generate first.');
      return;
    }

    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const leftMargin = 14;
      const rightMargin = 14;
      const usableWidth = pageWidth - leftMargin - rightMargin;
      const topHeaderHeight = 32;
      const bottomFooterY = pageHeight - 10;
      let y = topHeaderHeight + 8;

      const createdAt = new Date();
      const createdDate = createdAt.toLocaleDateString();
      const createdTime = createdAt.toLocaleTimeString();

      const drawHeader = () => {
        doc.setFillColor(30, 64, 175);
        doc.rect(0, 0, pageWidth, topHeaderHeight, 'F');

        doc.setTextColor(255, 255, 255);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.text('AssessAI - Scenario Question Paper', leftMargin, 14);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(`Generated: ${createdDate} ${createdTime}`, leftMargin, 22);
        doc.text(`Class: ${className?.trim() || 'N/A'}`, pageWidth - rightMargin - 30, 22);
      };

      const drawFooter = () => {
        const pageNumber = doc.getNumberOfPages();
        doc.setTextColor(90, 90, 90);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.text('AssessAI Question Generator', leftMargin, bottomFooterY);
        doc.text(`Page ${pageNumber}`, pageWidth - rightMargin - 12, bottomFooterY);
      };

      const writeWrapped = (text, size = 11, indent = 0, gap = 6) => {
        doc.setTextColor(20, 20, 20);
        doc.setFontSize(size);
        const wrapped = doc.splitTextToSize(String(text || ''), usableWidth - indent);
        wrapped.forEach((line) => {
          if (y > pageHeight - 18) {
            drawFooter();
            doc.addPage();
            drawHeader();
            y = topHeaderHeight + 8;
          }
          doc.text(line, leftMargin + indent, y);
          y += gap;
        });
      };

      drawHeader();

      const cleanTopics = topics?.trim() || 'N/A';
      const topicsLabel = 'Topics: ';
      const topicsLines = doc.splitTextToSize(`${topicsLabel}${cleanTopics}`, usableWidth - 4);
      const titleLineHeight = 7;
      const topicsLineHeight = 5;
      const cardPaddingTop = 5;
      const cardPaddingBottom = 5;
      const cardHeight = cardPaddingTop + titleLineHeight + (topicsLines.length * topicsLineHeight) + cardPaddingBottom;

      if (y + cardHeight > pageHeight - 20) {
        drawFooter();
        doc.addPage();
        drawHeader();
        y = topHeaderHeight + 8;
      }

      doc.setFillColor(239, 246, 255);
      doc.setDrawColor(191, 219, 254);
      doc.roundedRect(leftMargin, y - 2, usableWidth, cardHeight, 2, 2, 'FD');
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(14);
      doc.text(title?.trim() || 'Scenario-Based Questions', leftMargin + 2, y + 5);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(topicsLines, leftMargin + 2, y + 12);
      y += cardHeight + 6;

      generated.forEach((q, idx) => {
        doc.setFont('helvetica', 'bold');
        writeWrapped(`Question ${idx + 1}: ${q?.main || 'Untitled Question'}`, 12, 0, 6);
        doc.setFont('helvetica', 'normal');
        const subs = Array.isArray(q?.subs) ? q.subs : [];
        if (subs.length === 0) {
          writeWrapped('No sub-questions available.', 10, 4, 5);
        } else {
          subs.forEach((sub, i) => {
            writeWrapped(`${idx + 1}.${i + 1} ${sub}`, 10, 6, 5);
          });
        }
        y += 4;
      });

      drawFooter();

      const fileName = `${(title?.trim() || 'scenario-questions').replace(/\s+/g, '_')}.pdf`;
      doc.save(fileName);
    } catch (downloadError) {
      setError(downloadError?.message || 'Failed to download PDF');
    }
  };

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setGenerated([]);
    try {
      const response = await fetch(`${QUESTION_API_URL}/generate-questions/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics, num_questions: numQuestions }),
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      
      // Validate response structure
      if (!data.questions || !Array.isArray(data.questions)) {
        console.error('Invalid response structure:', data);
        throw new Error('Invalid response format from API');
      }
      
      setGenerated(data.questions);
      if (onQuestionsGenerated) onQuestionsGenerated(data.questions);
    } catch (err) {
      console.error('Question generation error:', err);
      setError(err.message || 'Failed to generate questions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Dashboard Button */}
      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold mb-6"
        onClick={() => setShowModal(true)}
      >
        Generate Questions
      </button>

      {/* Modal for Question Generation */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-60 z-50">
          <div className="h-screen w-screen bg-white relative overflow-hidden">
            <button
              className="absolute top-4 right-5 text-3xl text-gray-500 hover:text-gray-800"
              onClick={() => setShowModal(false)}
            >
              ×
            </button>
            <div className="h-full p-4 sm:p-6 lg:p-8 overflow-y-auto">
              <h2 className="font-bold text-2xl sm:text-3xl mb-6 pr-12">Generate Scenario-Based Questions</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-9rem)]">
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-6 overflow-y-auto">
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Title</label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded mb-1"
                      value={title}
                      onChange={e => setTitle(e.target.value)}
                      placeholder="Enter title for this set"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Class</label>
                    <input
                      type="text"
                      className="w-full border p-3 rounded mb-1"
                      value={className}
                      onChange={e => setClassName(e.target.value)}
                      placeholder="Enter class (e.g., 10)"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Topics</label>
                    <textarea
                      className="w-full border p-3 rounded mb-1"
                      rows={4}
                      placeholder="Enter topics, separated by commas or newlines"
                      value={topics}
                      onChange={e => setTopics(e.target.value)}
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 font-semibold mb-1">Number of Questions</label>
                    <input
                      type="number"
                      min={1}
                      className="w-full border p-3 rounded mb-1"
                      value={numQuestions}
                      onChange={e => setNumQuestions(Number(e.target.value))}
                      placeholder="Number of questions"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 mt-6">
                    <button
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded font-semibold w-full"
                      onClick={handleGenerate}
                      disabled={loading}
                    >
                      {loading ? 'Generating...' : 'Generate'}
                    </button>
                    <button
                      className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white px-4 py-3 rounded font-semibold w-full"
                      onClick={handleDownloadPdf}
                      disabled={loading || !Array.isArray(generated) || generated.length === 0}
                    >
                      Download PDF
                    </button>
                  </div>

                  {error && <div className="text-red-600 mt-4 p-3 bg-red-50 rounded">{error}</div>}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 overflow-y-auto">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Generated Questions</h3>
                  {Array.isArray(generated) && generated.length > 0 ? (
                    generated.map((q, idx) => (
                      <div key={idx} className="mb-5 border-b border-gray-200 pb-4">
                        <div className="font-semibold text-gray-800">{q.main || 'Untitled Question'}</div>
                        <ul className="list-disc ml-6 mt-2">
                          {Array.isArray(q.subs) && q.subs.length > 0 ? (
                            q.subs.map((sub, i) => <li key={i} className="text-gray-700 mb-1">{sub}</li>)
                          ) : (
                            <li className="text-gray-500 italic">No sub-questions available</li>
                          )}
                        </ul>
                      </div>
                    ))
                  ) : (
                    !loading && !error && (
                      <p className="text-gray-500 italic text-center py-8">Generate questions to preview and download as PDF.</p>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionGenerator;
