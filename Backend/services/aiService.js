const axios = require('axios');

// OpenRouter API Configuration
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Helper function to call OpenRouter API
const callOpenRouterAPI = async (prompt, model = 'meta-llama/llama-2-7b-chat') => {
  try {
    const response = await axios.post(OPENROUTER_API_URL, {
      model: model,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    }, {
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': process.env.FRONTEND_URLS || 'http://localhost:3000',
        'X-Title': 'AssessAI',
      },
    });

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('OpenRouter API error:', error.response?.data || error.message);
    throw new Error('Error calling OpenRouter API');
  }
};

// Quiz Auto-grading Service
const gradeQuiz = async (answers, correctAnswers, questions) => {
  let score = 0;
  const detailedResults = [];

  for (let i = 0; i < answers.length; i++) {
    const isCorrect = answers[i].toLowerCase() === correctAnswers[i].toLowerCase();
    score += isCorrect ? questions[i].points : 0;
    detailedResults.push({
      questionId: i,
      studentAnswer: answers[i],
      correctAnswer: correctAnswers[i],
      isCorrect,
      points: isCorrect ? questions[i].points : 0,
    });
  }

  return { score, detailedResults };
};

// Programming Assignment Grading
const gradeProgrammingAssignment = async (code, testCases) => {
  try {
    // Placeholder for actual code execution and test case validation
    // In production, use a sandboxed environment like Judge0 or similar
    let passedTests = 0;
    const testResults = [];

    for (const testCase of testCases) {
      // Simulate test execution
      const passed = code.includes(testCase.expectedOutput);
      if (passed) passedTests++;
      testResults.push({
        input: testCase.input,
        expected: testCase.output,
        passed,
      });
    }

    const score = (passedTests / testCases.length) * 100;
    return { score, testResults, passedTests, totalTests: testCases.length };
  } catch (error) {
    throw new Error('Error grading programming assignment');
  }
};

// Essay Analysis and Grading
const analyzeEssay = async (essayText) => {
  try {
    const prompt = `Analyze this essay and provide:
1. Overall quality score (0-100)
2. Grammar and spelling check
3. Structure and organization feedback
4. Content analysis
5. Key strengths
6. Areas for improvement

Essay: "${essayText}"

Provide detailed feedback in a structured format.`;

    const analysis = await callOpenRouterAPI(prompt);

    return {
      analysis: analysis,
      timestamp: new Date(),
    };
  } catch (error) {
    console.error('Essay analysis error:', error);
    throw new Error('Error analyzing essay');
  }
};

// Generate AI Feedback
const generateFeedback = async (submissionContent, assignmentType, gradingData) => {
  try {
    const prompt = `Based on the following ${assignmentType} submission and grading data, provide constructive and encouraging feedback for a student:

Submission: "${submissionContent.substring(0, 500)}..."
Grading Data: ${JSON.stringify(gradingData, null, 2)}

Provide feedback that:
1. Acknowledges what was done well
2. Points out areas for improvement
3. Suggests specific next steps
4. Is encouragement and supportive in tone`;

    return await callOpenRouterAPI(prompt);
  } catch (error) {
    console.error('Feedback generation error:', error);
    throw new Error('Error generating feedback');
  }
};

// Plagiarism Detection
const detectPlagiarism = async (text) => {
  try {
    // Placeholder for plagiarism detection
    // In production, integrate with services like Turnitin API or Copyscape
    const prompt = `Check this text for potential plagiarism indicators and provide a similarity analysis:

Text: "${text.substring(0, 1000)}..."

Provide:
1. Overall plagiarism risk score (0-100)
2. Detected similar phrases or patterns
3. Recommendations for manual review
4. Confidence level`;

    const analysis = await callOpenRouterAPI(prompt);

    return {
      analysis: analysis,
      score: Math.floor(Math.random() * 100), // Placeholder
    };
  } catch (error) {
    console.error('Plagiarism detection error:', error);
    throw new Error('Error detecting plagiarism');
  }
};

// Learning Outcome Analytics
const analyzeLearningOutcomes = async (gradesData, assignments) => {
  try {
    const prompt = `Analyze student performance data and determine learning outcomes achievement:

Grades Data: ${JSON.stringify(gradesData, null, 2)}
Assignments: ${JSON.stringify(assignments, null, 2)}

Provide:
1. Identified learning outcomes
2. Achievement rate for each outcome (percentage)
3. Improvement areas
4. Student mastery levels
5. Recommendations for instruction`;

    return await callOpenRouterAPI(prompt);
  } catch (error) {
    console.error('Learning outcome analysis error:', error);
    throw new Error('Error analyzing learning outcomes');
  }
};

module.exports = {
  gradeQuiz,
  gradeProgrammingAssignment,
  analyzeEssay,
  generateFeedback,
  detectPlagiarism,
  analyzeLearningOutcomes,
};
