class SurveyApp {
  constructor() {
    this.currentQuestion = 0;
    this.responses = [];
    this.questions = [];
    this.options = [
      "Strongly Disagree",
      "Disagree",
      "Neutral",
      "Agree",
      "Strongly Agree"
    ];
    this.totalQuestions = 0;
    this.isLoading = true;

    this.init();
  }

  async init() {
    // Check if survey was already completed
    if (localStorage.getItem('surveyCompleted') === 'true') {
      this.showThankYou();
      return;
    }

    // Get DOM elements
    this.progressText = document.getElementById('progressText');
    this.progressPercent = document.getElementById('progressPercent');
    this.progressBar = document.getElementById('progressBar');
    this.questionText = document.getElementById('questionText');
    this.optionsContainer = document.getElementById('optionsContainer');
    this.feedbackInput = document.getElementById('feedbackInput');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');

    // Add event listeners
    this.prevBtn.addEventListener('click', () => this.previousQuestion());
    this.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.feedbackInput.addEventListener('input', (e) => this.saveFeedback(e.target.value));

    // Fetch questions from API
    await this.fetchQuestions();

    // Initialize responses array
    for (let i = 0; i < this.totalQuestions; i++) {
      this.responses.push({
        question: this.questions[i],
        selectedOption: null,
        feedback: '',
        feedbackSentiment: null
      });
    }

    this.isLoading = false;

    // Render first question
    this.renderQuestion();
  }

  async fetchQuestions() {
    try {
      const response = await fetch('/api/fetch');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      this.questions = await response.json();
      this.questions = this.questions.splice(0); // Limit to questions for testing
      this.totalQuestions = this.questions.length;
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert('Applogize, failed to load survey questions. Please try again later.');
      this.questions = [];
      this.totalQuestions = 0;
    }
  }

  renderQuestion() {
    if (this.isLoading || this.totalQuestions === 0) {
      return;
    }

    const questionText = this.questions[this.currentQuestion];
    const response = this.responses[this.currentQuestion];

    // Update progress
    const progress = ((this.currentQuestion + 1) / this.totalQuestions) * 100;
    this.progressText.textContent = `Question ${this.currentQuestion + 1} of ${this.totalQuestions}`;
    this.progressPercent.textContent = `${Math.round(progress)}%`;
    this.progressBar.style.width = `${progress}%`;

    // Update question text
    this.questionText.textContent = questionText;

    // Update feedback textarea
    this.feedbackInput.value = response.feedback;

    // Render options
    this.renderOptions(response.selectedOption);

    // Update button states
    this.prevBtn.disabled = this.currentQuestion === 0;
    this.nextBtn.disabled = response.selectedOption === null;
    this.nextBtn.textContent = this.currentQuestion === this.totalQuestions - 1 ? 'Submit' : 'Next';
  }

  renderOptions(selectedOption) {
    this.optionsContainer.innerHTML = '';

    this.options.forEach((option) => {
      const label = document.createElement('label');
      label.className = 'option-label';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'satisfaction';
      input.value = option;
      input.checked = selectedOption === option;
      input.addEventListener('change', (e) => this.selectOption(e.target.value));

      const span = document.createElement('span');
      span.className = 'option-text';
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      this.optionsContainer.appendChild(label);
    });
  }

  selectOption(option) {
    this.responses[this.currentQuestion].selectedOption = option;
    this.nextBtn.disabled = false;
  }

  saveFeedback(feedback) {
    this.responses[this.currentQuestion].feedback = feedback;
  }

  previousQuestion() {
    if (this.currentQuestion > 0) {
      this.currentQuestion--;
      this.renderQuestion();
    }
  }

  nextQuestion() {
    if (this.currentQuestion < this.totalQuestions - 1) {
      this.currentQuestion++;
      this.renderQuestion();
    } else {
      this.submitSurvey();
    }
  }
  
  async submitSurvey() {
    
    let doc_id = null;
    // Send the responses to the server
    try {
      const response = await fetch('/api/save', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json' 
        },
        body: JSON.stringify(this.responses)
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit survey');
      }
      
      doc_id = await response.json();
      console.log('Survey submitted successfully:', doc_id);
      
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Failed to submit survey. Please try again.');
      return;
    }
    
    // Mark survey as completed in localStorage
    // localStorage.setItem('surveyCompleted', 'true'); // Disabled for testing purposes
    this.showThankYou();
    
    console.log('Analyzing feedback sentiment...');
    
    // Analyze sentiment for all responses with feedback
    try {
      const sentimentAnalysis = await fetch('/api/text_classify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({doc_id: doc_id}),
        keepalive: true
      });
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    }
    
    console.log('Sentiment analysis complete:', this.responses);
  }

  showThankYou() {
    const surveyContainer = document.getElementById('surveyContainer');
    const thankYouContainer = document.getElementById('thankYouContainer');
    
    surveyContainer.style.display = 'none';
    thankYouContainer.style.display = 'flex';
  }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new SurveyApp();
});