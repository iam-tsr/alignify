import Chart from 'chart.js/auto';

// Initialize circular progress bars
function initCircularProgress() {
  const progressElements = document.querySelectorAll('.circular-progress');
  
  progressElements.forEach(element => {
    const value = parseInt(element.getAttribute('data-value'));
    const color = element.getAttribute('data-color');
    const circle = element.querySelector('.progress-bar');
    
    if (circle) {
      const radius = parseFloat(circle.getAttribute('r'));
      const circumference = 2 * Math.PI * radius;
      const offset = circumference - (value / 100) * circumference;
      
      circle.style.strokeDasharray = `${circumference} ${circumference}`;
      circle.style.strokeDashoffset = circumference;
      circle.style.stroke = color;
      
      // Animate
      setTimeout(() => {
        circle.style.strokeDashoffset = offset;
      }, 100);
    }
  });
}

// Initialize Monthly Overview Chart
function initMonthlyChart() {
  const ctx = document.getElementById('monthlyChart');
  if (!ctx) return;

  // Generate sample data
  const labels = [];
  const data = [];
  for (let i = 0; i <= 30; i++) {
    labels.push(i);
    // Create a wave-like pattern similar to the image
    data.push(50 + 80 * Math.sin(i / 5) + 30 * Math.sin(i / 2));
  }

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        borderColor: '#60a5fa',
        backgroundColor: (context) => {
          const ctx = context.chart.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 250);
          gradient.addColorStop(0, 'rgba(96, 165, 250, 0.4)');
          gradient.addColorStop(1, 'rgba(96, 165, 250, 0.05)');
          return gradient;
        },
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 0,
        pointHoverRadius: 4,
        pointHoverBackgroundColor: '#60a5fa',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 2,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#60a5fa',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: () => '',
            label: (context) => `Value: ${Math.round(context.parsed.y)}`
          }
        }
      },
      scales: {
        x: {
          display: true,
          grid: {
            display: false
          },
          ticks: {
            color: '#95a5b8',
            font: {
              size: 11
            },
            maxTicksLimit: 7
          }
        },
        y: {
          display: true,
          beginAtZero: true,
          max: 200,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#95a5b8',
            font: {
              size: 11
            },
            stepSize: 50
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });
}

// Initialize Weekly Trend Chart
function initWeeklyChart() {
  const ctx = document.getElementById('weeklyChart');
  if (!ctx) return;

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      datasets: [{
        data: [33, 26, 38, 31, 42, 48, 18],
        backgroundColor: '#52c788',
        borderRadius: 6,
        barThickness: 28
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: 1.5,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: true,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#52c788',
          borderWidth: 1,
          padding: 10,
          displayColors: false,
          callbacks: {
            title: (context) => context[0].label,
            label: (context) => `Value: ${context.parsed.y}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#95a5b8',
            font: {
              size: 11
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 50,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#95a5b8',
            font: {
              size: 11
            },
            stepSize: 10
          }
        }
      }
    }
  });
}

// Initialize Gauge Chart
function initGaugeChart() {
  const gaugeFill = document.querySelector('.gauge-fill');
  if (!gaugeFill) return;

  const value = 72; // 72 out of 100
  const maxDashArray = 251.2; // Approximate arc length
  const dashOffset = maxDashArray - (value / 100) * maxDashArray;

  setTimeout(() => {
    gaugeFill.style.strokeDashoffset = dashOffset;
  }, 100);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initCircularProgress();
  initMonthlyChart();
  initWeeklyChart();
  initGaugeChart();
});
