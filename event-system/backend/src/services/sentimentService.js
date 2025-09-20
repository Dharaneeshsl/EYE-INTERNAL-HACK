import nlp from 'compromise';

/**
 * Service for analyzing text sentiment using compromise.js
 */
export class SentimentService {
  // Sentiment word dictionaries
  static positiveWords = new Set([
    'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic',
    'helpful', 'useful', 'satisfied', 'satisfying', 'impressive',
    'love', 'like', 'best', 'perfect', 'happy', 'enjoyed', 'clear',
    'easy', 'informative', 'interesting', 'valuable', 'well',
    'professional', 'recommended', 'positive', 'organized'
  ]);

  static negativeWords = new Set([
    'bad', 'poor', 'terrible', 'horrible', 'awful', 'worst',
    'useless', 'unhelpful', 'difficult', 'confusing', 'complicated',
    'hate', 'dislike', 'disappointed', 'boring', 'waste', 'negative',
    'hard', 'unclear', 'unprofessional', 'slow', 'frustrating',
    'error', 'problem', 'issue', 'bug', 'crash', 'fail'
  ]);

  /**
   * Analyze text sentiment
   * @param {string} text - Text to analyze
   * @returns {Object} Sentiment analysis result
   */
  static analyzeSentiment(text) {
    try {
      const doc = nlp(text);
      
      // Get all terms (words) from the text
      const terms = doc.terms().out('array');
      
      // Count positive and negative words
      let positiveCount = 0;
      let negativeCount = 0;
      let totalWords = 0;
      
      const keywords = new Set();
      
      terms.forEach(term => {
        term = term.toLowerCase();
        totalWords++;
        
        if (this.positiveWords.has(term)) {
          positiveCount++;
          keywords.add(term);
        } else if (this.negativeWords.has(term)) {
          negativeCount++;
          keywords.add(term);
        }
      });
      
      // Calculate sentiment score (-1 to 1)
      const score = totalWords > 0 ? 
        (positiveCount - negativeCount) / totalWords : 0;
      
      // Determine sentiment label
      let label;
      if (score > 0.1) {
        label = 'positive';
      } else if (score < -0.1) {
        label = 'negative';
      } else {
        label = 'neutral';
      }
      
      // Extract key phrases (noun phrases)
      const phrases = doc.nouns().out('array');
      
      return {
        score,
        label,
        keywords: Array.from(keywords),
        keyPhrases: phrases,
        stats: {
          totalWords,
          positiveWords: positiveCount,
          negativeWords: negativeCount
        }
      };
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      return {
        score: 0,
        label: 'neutral',
        keywords: [],
        keyPhrases: [],
        stats: {
          totalWords: 0,
          positiveWords: 0,
          negativeWords: 0
        }
      };
    }
  }

  /**
   * Analyze sentiment for form responses
   * @param {Array} responses - Array of form responses
   * @returns {Object} Aggregated sentiment analysis
   */
  static analyzeFormResponses(responses) {
    try {
      const results = responses.map(response => {
        // Combine all text answers for analysis
        const textAnswers = response.answers
          .filter(answer => 
            ['text', 'textarea'].includes(answer.questionType) &&
            typeof answer.value === 'string'
          )
          .map(answer => answer.value)
          .join(' ');
        
        return this.analyzeSentiment(textAnswers);
      });
      
      // Aggregate results
      const totalResponses = results.length;
      const averageScore = results.reduce((acc, curr) => acc + curr.score, 0) / totalResponses;
      
      const sentimentCounts = {
        positive: results.filter(r => r.label === 'positive').length,
        neutral: results.filter(r => r.label === 'neutral').length,
        negative: results.filter(r => r.label === 'negative').length
      };
      
      // Collect all keywords
      const keywordFrequency = {};
      results.forEach(result => {
        result.keywords.forEach(keyword => {
          keywordFrequency[keyword] = (keywordFrequency[keyword] || 0) + 1;
        });
      });
      
      // Sort keywords by frequency
      const topKeywords = Object.entries(keywordFrequency)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10)
        .map(([keyword, frequency]) => ({ keyword, frequency }));
      
      return {
        overallScore: averageScore,
        sentimentBreakdown: sentimentCounts,
        topKeywords,
        responseCount: totalResponses
      };
    } catch (error) {
      console.error('Error analyzing form responses:', error);
      throw error;
    }
  }
}

export default SentimentService;