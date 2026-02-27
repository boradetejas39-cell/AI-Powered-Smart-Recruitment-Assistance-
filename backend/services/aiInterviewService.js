const natural = require('natural');
const logger = require('../utils/logger');

/**
 * AI Interview Service
 * Generates role-specific interview questions, evaluates answers,
 * computes per-question and overall scores, and produces feedback.
 */

class AIInterviewService {
    constructor() {
        this.tokenizer = new natural.WordTokenizer();
        this.stemmer = natural.PorterStemmer;

        // ── Question bank organised by category ────────────────────
        this.questionBank = {
            technical: [
                { text: 'Explain the difference between REST and GraphQL APIs.', keywords: ['rest', 'graphql', 'api', 'query', 'endpoint', 'schema'], difficulty: 'medium' },
                { text: 'What is the time complexity of binary search and why?', keywords: ['binary', 'logarithmic', 'o(log n)', 'sorted', 'divide'], difficulty: 'medium' },
                { text: 'How would you optimise a slow database query?', keywords: ['index', 'query', 'optimise', 'explain', 'cache', 'join', 'denormalize'], difficulty: 'hard' },
                { text: 'Describe the concept of middleware in web frameworks.', keywords: ['middleware', 'request', 'response', 'pipeline', 'next', 'express'], difficulty: 'easy' },
                { text: 'What is the difference between SQL and NoSQL databases?', keywords: ['sql', 'nosql', 'relational', 'document', 'schema', 'scalability'], difficulty: 'easy' },
                { text: 'Explain how JWT authentication works.', keywords: ['jwt', 'token', 'header', 'payload', 'signature', 'stateless', 'authentication'], difficulty: 'medium' },
                { text: 'What are microservices and when would you use them?', keywords: ['microservices', 'monolith', 'scalability', 'independent', 'deploy', 'service'], difficulty: 'hard' },
                { text: 'Explain the concept of containerisation (Docker).', keywords: ['docker', 'container', 'image', 'dockerfile', 'isolation', 'deploy'], difficulty: 'medium' },
                { text: 'What is CI/CD and why is it important?', keywords: ['continuous', 'integration', 'deployment', 'pipeline', 'automate', 'test'], difficulty: 'easy' },
                { text: 'What are design patterns? Name three you have used.', keywords: ['pattern', 'singleton', 'factory', 'observer', 'strategy', 'design'], difficulty: 'medium' }
            ],
            behavioral: [
                { text: 'Tell me about a time you had to meet a tight deadline.', keywords: ['deadline', 'prioritize', 'time', 'manage', 'deliver', 'pressure'], difficulty: 'easy' },
                { text: 'How do you handle disagreements with team members?', keywords: ['conflict', 'communicate', 'listen', 'compromise', 'team', 'resolve'], difficulty: 'easy' },
                { text: 'Describe a project where you took initiative beyond your role.', keywords: ['initiative', 'ownership', 'proactive', 'improve', 'lead'], difficulty: 'medium' },
                { text: 'How do you prioritise tasks when everything seems urgent?', keywords: ['prioritize', 'urgent', 'important', 'organize', 'delegate', 'focus'], difficulty: 'medium' },
                { text: 'Describe a failure and what you learned from it.', keywords: ['failure', 'learn', 'mistake', 'improve', 'growth', 'reflection'], difficulty: 'medium' }
            ],
            situational: [
                { text: 'If you found a critical bug in production on a Friday evening, what would you do?', keywords: ['bug', 'production', 'communicate', 'fix', 'rollback', 'team', 'priority'], difficulty: 'medium' },
                { text: 'How would you onboard yourself into a large, unfamiliar codebase?', keywords: ['documentation', 'code', 'read', 'ask', 'understand', 'architecture', 'mentor'], difficulty: 'medium' },
                { text: 'A stakeholder disagrees with your technical recommendation. How do you handle it?', keywords: ['stakeholder', 'data', 'evidence', 'compromise', 'communicate', 'explain'], difficulty: 'hard' }
            ],
            role_specific: [] // Dynamically generated based on job skills
        };
    }

    /**
     * Generate interview questions tailored to a job.
     *
     * @param {Object} job     Job document
     * @param {Object} resume  Resume document
     * @param {number} count   Number of questions (default: 8)
     * @returns {Array} Array of question objects
     */
    generateQuestions(job, resume, count = 8) {
        const questions = [];
        const skills = (job.requiredSkills || []).map(s => s.toLowerCase());

        // 1. Generate role-specific questions from job skills (40%)
        const roleCount = Math.ceil(count * 0.4);
        for (let i = 0; i < roleCount && i < skills.length; i++) {
            questions.push({
                questionId: `q${questions.length + 1}`,
                text: `Explain your experience with ${skills[i]}. How have you used it in a real project?`,
                category: 'role_specific',
                difficulty: 'medium',
                _expectedKeywords: [skills[i], 'project', 'experience', 'used', 'built']
            });
        }

        // 2. Technical questions (30%)
        const techCount = Math.ceil(count * 0.3);
        const shuffledTech = [...this.questionBank.technical].sort(() => Math.random() - 0.5);
        for (let i = 0; i < techCount && i < shuffledTech.length; i++) {
            questions.push({
                questionId: `q${questions.length + 1}`,
                text: shuffledTech[i].text,
                category: 'technical',
                difficulty: shuffledTech[i].difficulty,
                _expectedKeywords: shuffledTech[i].keywords
            });
        }

        // 3. Behavioral questions (20%)
        const behCount = Math.ceil(count * 0.2);
        const shuffledBeh = [...this.questionBank.behavioral].sort(() => Math.random() - 0.5);
        for (let i = 0; i < behCount && i < shuffledBeh.length; i++) {
            questions.push({
                questionId: `q${questions.length + 1}`,
                text: shuffledBeh[i].text,
                category: 'behavioral',
                difficulty: shuffledBeh[i].difficulty,
                _expectedKeywords: shuffledBeh[i].keywords
            });
        }

        // 4. Situational question (10%)
        const sitCount = Math.max(1, Math.floor(count * 0.1));
        const shuffledSit = [...this.questionBank.situational].sort(() => Math.random() - 0.5);
        for (let i = 0; i < sitCount && i < shuffledSit.length; i++) {
            questions.push({
                questionId: `q${questions.length + 1}`,
                text: shuffledSit[i].text,
                category: 'situational',
                difficulty: shuffledSit[i].difficulty,
                _expectedKeywords: shuffledSit[i].keywords
            });
        }

        // Trim to requested count and re-index
        return questions.slice(0, count).map((q, idx) => ({
            ...q,
            questionId: `q${idx + 1}`
        }));
    }

    /**
     * Evaluate a single answer against a question's expected keywords.
     *
     * @param {string} answer           Candidate's answer text
     * @param {Array}  expectedKeywords Keywords that indicate competence
     * @returns {{ score, feedback, matchedKeywords }}
     */
    evaluateAnswer(answer, expectedKeywords = []) {
        if (!answer || answer.trim().length < 10) {
            return {
                score: 0,
                feedback: 'Answer is too short or empty. Please provide a detailed response.',
                matchedKeywords: []
            };
        }

        const answerTokens = this.tokenizer
            .tokenize(answer.toLowerCase().replace(/[^\w\s]/g, ' '))
            .map(t => this.stemmer.stem(t));

        const expectedStems = expectedKeywords.map(k => this.stemmer.stem(k.toLowerCase()));
        const matchedKeywords = expectedKeywords.filter((kw, i) => answerTokens.includes(expectedStems[i]));

        // Score components
        const keywordScore = expectedStems.length > 0
            ? (matchedKeywords.length / expectedStems.length) * 60
            : 30;
        const lengthBonus = Math.min(20, (answer.split(/\s+/).length / 50) * 20); // up to 20 pts for length
        const coherenceBonus = answer.length > 100 ? 10 : answer.length > 50 ? 5 : 0;
        const detailBonus = /example|project|built|implemented|team|result/i.test(answer) ? 10 : 0;

        const score = Math.min(100, Math.round(keywordScore + lengthBonus + coherenceBonus + detailBonus));

        // Feedback generation
        let feedback;
        if (score >= 80) {
            feedback = 'Excellent answer. Demonstrates strong understanding and provides relevant detail.';
        } else if (score >= 60) {
            feedback = 'Good answer. Could be improved with more specific examples or technical depth.';
        } else if (score >= 40) {
            feedback = 'Adequate answer but lacks depth. Consider elaborating on key concepts.';
        } else {
            feedback = 'Needs improvement. Answer does not sufficiently address the question.';
        }

        if (matchedKeywords.length < expectedKeywords.length && expectedKeywords.length > 0) {
            const missing = expectedKeywords.filter(k => !matchedKeywords.includes(k));
            feedback += ` Consider covering: ${missing.slice(0, 3).join(', ')}.`;
        }

        return { score, feedback, matchedKeywords };
    }

    /**
     * Evaluate an entire interview — all questions and answers.
     *
     * @param {Array} questions Array of question objects with answer fields
     * @returns {Object} { overallScore, feedbackSummary, strengths, weaknesses, recommendation, evaluations }
     */
    evaluateInterview(questions) {
        const evaluations = [];
        let totalScore = 0;
        const strengths = [];
        const weaknesses = [];

        for (const q of questions) {
            const expected = q._expectedKeywords || q.evaluation?.keywords || [];
            const result = this.evaluateAnswer(q.answer || '', expected);
            evaluations.push({
                questionId: q.questionId,
                score: result.score,
                feedback: result.feedback,
                keywords: result.matchedKeywords
            });
            totalScore += result.score;

            if (result.score >= 70) {
                strengths.push(`Strong answer on: "${q.text.substring(0, 60)}…"`);
            } else if (result.score < 40) {
                weaknesses.push(`Weak answer on: "${q.text.substring(0, 60)}…"`);
            }
        }

        const overallScore = questions.length > 0 ? Math.round(totalScore / questions.length) : 0;

        // Recommendation thresholds
        let recommendation;
        if (overallScore >= 80) recommendation = 'strong_hire';
        else if (overallScore >= 65) recommendation = 'hire';
        else if (overallScore >= 45) recommendation = 'maybe';
        else recommendation = 'reject';

        const feedbackSummary = `Candidate scored ${overallScore}% across ${questions.length} questions. ` +
            `${strengths.length} strong answer(s), ${weaknesses.length} weak answer(s). ` +
            `Recommendation: ${recommendation.replace('_', ' ')}.`;

        return {
            overallScore,
            feedbackSummary,
            strengths,
            weaknesses,
            recommendation,
            evaluations
        };
    }
}

module.exports = new AIInterviewService();
