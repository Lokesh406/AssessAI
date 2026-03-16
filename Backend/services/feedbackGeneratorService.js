/**
 * AI Feedback Generator Service
 * Generates automatic feedback based on student scores
 */

/**
 * Generate feedback based on score
 * @param {number} score - Student's score
 * @param {number} maxScore - Maximum possible score
 * @returns {string} Generated feedback
 */
function generateFeedback(score, maxScore) {
  const percentage = (score / maxScore) * 100;

  if (percentage >= 80) {
    return "Excellent work! You have demonstrated a strong understanding of the concepts. Keep up the great performance!";
  } else if (percentage >= 60 && percentage < 80) {
    return "Good attempt! You've grasped most of the concepts. Try to focus on the areas where you struggled and review them for better understanding.";
  } else if (percentage >= 40 && percentage < 60) {
    return "Fair attempt! You have completed the assignment, but some concepts need more attention. Review the topic and try again. Consider asking your teacher for additional help.";
  } else {
    return "Needs improvement. This topic requires further review and practice. We recommend reviewing the course material, looking at examples, and practicing similar problems. Don't hesitate to use office hours.";
  }
}

/**
 * Generate detailed feedback with assignment type consideration
 * @param {number} score - Student's score
 * @param {number} maxScore - Maximum possible score
 * @param {string} assignmentType - Type of assignment (quiz, programming, essay)
 * @returns {string} Detailed feedback with personalized suggestions
 */
function generateDetailedFeedback(score, maxScore, assignmentType) {
  const percentage = (score / maxScore) * 100;
  let baseFeedback = '';
  let typeSuggestion = '';

  // Base feedback
  if (percentage >= 80) {
    baseFeedback = "Excellent work! You have demonstrated a strong understanding of the concepts. Keep up the great performance!";
  } else if (percentage >= 60 && percentage < 80) {
    baseFeedback = "Good attempt! You've grasped most of the concepts. Try to focus on the areas where you struggled and review them for better understanding.";
  } else if (percentage >= 40 && percentage < 60) {
    baseFeedback = "Fair attempt! You have completed the assignment, but some concepts need more attention. Review the topic and try again.";
  } else {
    baseFeedback = "Needs improvement. This topic requires further review and practice.";
  }

  // Assignment type specific suggestions
  switch (assignmentType) {
    case 'quiz':
      if (percentage < 60) {
        typeSuggestion = " Review the quiz questions you answered incorrectly and study the corresponding material carefully.";
      } else if (percentage < 80) {
        typeSuggestion = " Pay extra attention to the topics where you made mistakes to solidify your understanding.";
      }
      break;
    case 'programming':
      if (percentage < 60) {
        typeSuggestion = " Review the logic and algorithm used in your solution. Test your code with more test cases to identify edge cases.";
      } else if (percentage < 80) {
        typeSuggestion = " Your code structure is good. Consider refactoring for better performance or readability. Check for edge cases and optimize your algorithm.";
      }
      break;
    case 'essay':
      if (percentage < 60) {
        typeSuggestion = " Focus on improving your arguments and evidence. Practice organizing your thoughts more clearly and ensure all claims are well-supported.";
      } else if (percentage < 80) {
        typeSuggestion = " Your essay structure is solid. Work on deepening your analysis and adding more diverse evidence to support your points.";
      }
      break;
    default:
      break;
  }

  return baseFeedback + typeSuggestion;
}

/**
 * Generate feedback based on specific performance metrics
 * @param {Object} metrics - Performance metrics {score, maxScore, assignmentType, rubricScores}
 * @returns {string} Custom feedback based on metrics
 */
function generateMetricBasedFeedback(metrics) {
  const { score, maxScore, assignmentType, rubricScores } = metrics;

  let feedback = generateDetailedFeedback(score, maxScore, assignmentType);

  // Add rubric-specific feedback if available
  if (rubricScores && Array.isArray(rubricScores) && rubricScores.length > 0) {
    const lowestCriteria = rubricScores.reduce((prev, current) =>
      prev.points < current.points ? prev : current
    );

    if (lowestCriteria && lowestCriteria.criteriaName) {
      feedback += ` Pay special attention to improving your "${lowestCriteria.criteriaName}".`;
    }
  }

  return feedback;
}

/**
 * Build default rubric criteria when teacher does not provide rubric scores.
 * Points are distributed from achieved score to provide meaningful criteria-level guidance.
 * @param {number} score - Student score awarded by teacher
 * @param {number} maxScore - Maximum score for assignment
 * @param {string} assignmentType - Assignment type
 * @returns {Array<{criteriaName: string, points: number}>}
 */
function buildDefaultRubricScores(score, maxScore, assignmentType) {
  const safeMax = Number(maxScore) > 0 ? Number(maxScore) : 100;
  const safeScore = Math.max(0, Math.min(Number(score) || 0, safeMax));
  const percentage = safeScore / safeMax;

  const criteriaByType = {
    programming: ['Logic & Problem Solving', 'Code Quality', 'Correctness', 'Testing & Edge Cases'],
    essay: ['Concept Clarity', 'Structure & Coherence', 'Depth of Analysis', 'Language & Presentation'],
    quiz: ['Concept Accuracy', 'Application of Knowledge', 'Consistency', 'Time/Attempt Strategy'],
    default: ['Understanding', 'Application', 'Accuracy', 'Presentation'],
  };

  const criteria = criteriaByType[assignmentType] || criteriaByType.default;
  const perCriterionMax = safeMax / criteria.length;

  return criteria.map((criteriaName) => ({
    criteriaName,
    points: Number((perCriterionMax * percentage).toFixed(2)),
  }));
}

/**
 * Generate default teacher feedback when no manual feedback is provided.
 * @param {number} score - Student score
 * @param {number} maxScore - Maximum score
 * @returns {string}
 */
function generateDefaultTeacherFeedback(score, maxScore) {
  const safeMax = Number(maxScore) > 0 ? Number(maxScore) : 100;
  const safeScore = Math.max(0, Math.min(Number(score) || 0, safeMax));
  const percentage = (safeScore / safeMax) * 100;

  if (percentage >= 85) {
    return 'Excellent performance. You met the evaluation criteria with strong consistency and quality.';
  }
  if (percentage >= 70) {
    return 'Good performance. You met most criteria; focus on weaker areas to improve further.';
  }
  if (percentage >= 50) {
    return 'Satisfactory effort. Some criteria are met, but concept clarity and accuracy need improvement.';
  }
  return 'Needs improvement. Please review core concepts and rework based on the evaluation criteria.';
}

module.exports = {
  generateFeedback,
  generateDetailedFeedback,
  generateMetricBasedFeedback,
  buildDefaultRubricScores,
  generateDefaultTeacherFeedback,
};
