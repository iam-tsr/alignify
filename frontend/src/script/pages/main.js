class SurveyApp {
  constructor() {
    this.currentQuestion = 0;
    this.responses = [];
    this.questions = [];
    this.options = Array.from({length: 11}, (_, i) => i);
    this.totalQuestions = 0;
    this.isLoading = true;
    this.retryInterval = null;

    this.init();
  }

  async init() {
    // Check if survey was already completed
    if (localStorage.getItem('surveyCompleted') === 'true') {
      document.body.classList.remove('loading-container');
      this.showThankYou();
      return;
    }

    // Get DOM elements
    this.questionText = document.getElementById('questionText');
    this.optionsContainer = document.getElementById('optionsContainer');
    this.feedbackInput = document.getElementById('feedbackInput');
    this.prevBtn = document.getElementById('prevBtn');
    this.nextBtn = document.getElementById('nextBtn');
    this.skipBtn = document.getElementById('skipBtn');
    this.loadingContainer = document.getElementById('loadingContainer');
    this.surveyContainer = document.getElementById('surveyContainer');
    this.sentimentIcon = document.getElementById('sentimentIcon');
    
    // Progress SVG element
    this.progressSvg = document.querySelector('.progress-border-svg');
    this.progressRect = document.querySelector('.progress-border-svg .progress-rect');

    // Add event listeners
    if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.previousQuestion());
    if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextQuestion());
    if (this.skipBtn) {
        this.skipBtn.addEventListener('click', () => this.skipQuestion());
    }
    if (this.feedbackInput) this.feedbackInput.addEventListener('input', (e) => this.saveFeedback(e.target.value));
    
    // Update progress bar on resize to recalculate perimeter
    window.addEventListener('resize', () => {
        if (!this.isLoading && this.questions.length > 0) {
            this.updateProgress();
        }
    });

    // Fetch questions from API
    const success = await this.fetchQuestions();

    if (this.loadingContainer) {
      this.loadingContainer.style.display = 'none';
    }
    
    // Remove loading class from body
    document.body.classList.remove('loading-container');

    if (!success) {
      return;
    }

    // Initialize responses array
    for (let i = 0; i < this.totalQuestions; i++) {
        if (!this.responses[i]) {
            this.responses.push({
                question: this.questions[i],
                nps: null,
                feedback: '',
                feedbackSentiment: null
            });
        }
    }

    this.isLoading = false;
    if (this.surveyContainer) {
      this.surveyContainer.style.display = 'flex';
      // Trigger updateProgress after layout is visible to get correct dimensions
      setTimeout(() => this.updateProgress(), 50);
    }

    // Render first question
    this.renderQuestion();
  }

  async fetchQuestions() {
    try {

      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate loading delay

      const response = await fetch('/api/qFetch');
      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }
      this.questions = await response.json();
      this.questions = this.questions.splice(0,1); // Limit to questions for testing
      this.totalQuestions = this.questions.length;
      return true;
    } catch (error) {
      console.error('Error fetching questions:', error);
      this.showError();
      return false;
    }
  }

  renderQuestion() {
    if (this.isLoading || this.totalQuestions === 0) {
      return;
    }

    const questionText = this.questions[this.currentQuestion];
    const response = this.responses[this.currentQuestion];

    this.updateProgress();

    // Update question text
    if (this.questionText) this.questionText.textContent = questionText;

    // Update feedback textarea
    if (this.feedbackInput) this.feedbackInput.value = response.feedback || '';

    // Render options
    this.renderOptions(response.nps);
    
    // Update sentiment icon
    this.updateSentiment(response.nps);

    // Update button states
    if (this.prevBtn) {
        this.prevBtn.disabled = this.currentQuestion === 0;
    }
    
    if (this.nextBtn) {
        this.nextBtn.disabled = response.nps === null;
        this.nextBtn.textContent = this.currentQuestion === this.totalQuestions - 1 ? 'Submit' : 'Next';
    }
  }
  
  updateProgress() {
      if (!this.progressRect) return;
      
      // Calculate total length path
      // Since it is a rect in SVG, we can use getTotalLength()
      const perimeter = this.progressRect.getTotalLength();
      
      // Set dasharray to perimeter so we can offset it
      this.progressRect.style.strokeDasharray = perimeter;
      
      // Calculate remaining "length" based on questions left.
      // Logic: "Shows how much survey is left."
      // Start (Q1, index 0): 100% visible (offset 0).
      // End (Q10, index 9): Small amount visible? Or just before submit 10% visible?
      // After Submit: 0 visible.
      
      // Formula: ((total - current) / total) * perimeter
      // Ex: total 10. current 0. (10-0)/10 = 1. Offset = 0 ? No.
      // StrokeDashOffset: 0 means full stroke visible. perimeter means 0 visible.
      // So visible_fraction = (totalQuestions - currentQuestion) / totalQuestions;
      // offset = perimeter * (1 - visible_fraction)
      //        = perimeter * (1 - (total - current)/total)
      //        = perimeter * (current / total)
      
      // Let's verify:
      // Q1 (idx 0): offset = P * 0 = 0. Stroke full. Correct "100% left".
      // Q10 (idx 9): offset = P * 0.9. Stroke 10% visible (1/10th left). Correct.
      // After last question submit -> usually goes to thank you page so no matter.
      
      const offset = perimeter * (this.currentQuestion / this.totalQuestions);
      this.progressRect.style.strokeDashoffset = offset;
  }

  renderOptions(nps) {
    if (!this.optionsContainer) return;
    
    this.optionsContainer.innerHTML = '';

    this.options.forEach((option) => {
      const label = document.createElement('label');
      label.className = 'scale-option-label';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'satisfaction';
      input.value = option;
      input.checked = nps == option;
      input.addEventListener('change', (e) => this.selectOption(parseInt(e.target.value)));

      const span = document.createElement('span');
      span.textContent = option;

      label.appendChild(input);
      label.appendChild(span);
      this.optionsContainer.appendChild(label);
    });
  }

  selectOption(option) {
    this.responses[this.currentQuestion].nps = option;
    if (this.nextBtn) this.nextBtn.disabled = false;
    this.updateSentiment(option);
  }

  updateSentiment(score) {
      if (!this.sentimentIcon) return;
      
      if (score === null || score === undefined) {
          this.sentimentIcon.src = sentimentImages.none;
          return;
      }
      
      let sentiment = 'neutral';
      if (score <= 3) sentiment = 'sad';
      else if (score == 7 || score == 8) sentiment = 'happy';
      else if (score >= 9) sentiment = 'excited';
      
      this.sentimentIcon.src = sentimentImages[sentiment];
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
  
  skipQuestion() {
      this.responses[this.currentQuestion].nps = null;
      if (this.currentQuestion < this.totalQuestions - 1) {
          this.currentQuestion++;
          this.renderQuestion();
      } else {
          this.submitSurvey();
      }
  }
  
  async submitSurvey() {
    let doc_id = null;
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
      this.showError();
      return;
    }
    
    this.showThankYou();
    
    // Analyze sentiment
    try {
      fetch('/api/resp_classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({doc_id: doc_id}),
        keepalive: true
      });
    } catch (error) {
      console.error('Error triggering analysis:', error);
    }
  }

  showThankYou() {
    const surveyContainer = document.getElementById('surveyContainer');
    const thankYouContainer = document.getElementById('thankYouContainer');

    localStorage.setItem('surveyCompleted', 'true');
    
    if (surveyContainer) surveyContainer.style.display = 'none';
    if (thankYouContainer) thankYouContainer.style.display = 'flex';
    if (loadingContainer) loadingContainer.style.display = 'none';
  }

  showError() {
    const surveyContainer = document.getElementById('surveyContainer');
    const errorContainer = document.getElementById('errorContainer');
    
    if (surveyContainer) surveyContainer.style.display = 'none';
    if (errorContainer) errorContainer.style.display = 'flex';
    
    this.startRetryConnection();
  }

  async checkBackendConnection() {
    try {
      const response = await fetch('/health', { 
        method: 'GET',
        cache: 'no-cache'
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }

  startRetryConnection() {
    if (this.retryInterval) clearInterval(this.retryInterval);
    
    this.retryInterval = setInterval(async () => {
      console.log('Checking backend connection...');
      const isConnected = await this.checkBackendConnection();
      
      if (isConnected) {
        console.log('Backend connection restored! Reloading...');
        clearInterval(this.retryInterval);
        window.location.reload();
      }
    }, 5000);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new SurveyApp();
});

const sentimentImages = {
  none: new URL('../../assets/images/sentiments/none.png', import.meta.url).href,
  sad: new URL('../../assets/images/sentiments/sad.png', import.meta.url).href,
  neutral: new URL('../../assets/images/sentiments/neutral.png', import.meta.url).href,
  happy: new URL('../../assets/images/sentiments/happy.png', import.meta.url).href,
  excited: new URL('../../assets/images/sentiments/excited.png', import.meta.url).href,
};