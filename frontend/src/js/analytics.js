import Chart from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(MatrixController, MatrixElement);

// Line Chart - Engagement Score and Well-being Index
const lineCtx = document.getElementById('lineChart').getContext('2d');
const lineChart = new Chart(lineCtx, {
  type: 'line',
  data: {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6', 'Week 7', 'Week 8'],
    datasets: [
      {
        label: 'Engagement Score',
        data: [70, 75, 80, 75, 90, 78, 75, 82],
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
      {
        label: 'Well-being Index',
        data: [65, 70, 68, 85, 80, 78, 72, 88],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 4,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        displayColors: true,
        callbacks: {
          label: function(context) {
            return context.dataset.label + ': ' + context.parsed.y + '/100';
          }
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          callback: function(value) {
            return value;
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        }
      }
    },
  },
});

// Bar Chart - Top 3 Focus Areas
const barCtx = document.getElementById('barChart').getContext('2d');
const barChart = new Chart(barCtx, {
  type: 'bar',
  data: {
    labels: ['Communication', 'Work-Life Balance', 'Recognition', 'Reintegration'],
    datasets: [
      {
        label: 'Score',
        data: [7.8, 7.5, 6.5, 7.0],
        backgroundColor: [
          '#1e40af',
          '#1e3a8a',
          '#059669',
          '#047857',
        ],
        borderRadius: 6,
        barThickness: 80,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return 'Score: ' + context.parsed.y + '/10';
          }
        }
      },
      datalabels: {
        anchor: 'end',
        align: 'top',
        formatter: function(value) {
          return value + '/10';
        },
        color: '#1f2937',
        font: {
          weight: 'bold',
          size: 12,
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10,
        ticks: {
          stepSize: 2,
          callback: function(value) {
            return value + '/10';
          }
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 12,
            weight: '500'
          }
        }
      }
    },
  },
  plugins: [{
    afterDatasetsDraw: function(chart) {
      const ctx = chart.ctx;
      chart.data.datasets.forEach(function(dataset, i) {
        const meta = chart.getDatasetMeta(i);
        if (!meta.hidden) {
          meta.data.forEach(function(element, index) {
            ctx.fillStyle = '#1f2937';
            const fontSize = 13;
            const fontStyle = 'bold';
            const fontFamily = 'Arial';
            ctx.font = Chart.helpers.fontString(fontSize, fontStyle, fontFamily);
            
            const dataString = dataset.data[index] + '/10';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            
            const padding = 5;
            const position = element.tooltipPosition();
            ctx.fillText(dataString, position.x, position.y - padding);
          });
        }
      });
    }
  }]
});

// Heatmap Chart - Department Overview
const heatmapCtx = document.getElementById('heatmapChart').getContext('2d');

// Generate heatmap data
const departments = ['Engineering', 'Marketing', 'Management', 'Culture', 'Growth', 'Operations'];
const weeks = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8'];

// Create matrix data with varying intensity
const heatmapData = [];
departments.forEach((dept, deptIdx) => {
  weeks.forEach((week, weekIdx) => {
    // Generate values that create a pattern from light to dark
    const baseValue = 3 + weekIdx * 0.5 + (deptIdx * 0.3);
    const value = Math.min(10, baseValue + Math.random() * 2);
    heatmapData.push({
      x: week,
      y: dept,
      v: value
    });
  });
});

const heatmapChart = new Chart(heatmapCtx, {
  type: 'matrix',
  data: {
    datasets: [{
      label: 'Department Performance',
      data: heatmapData,
      backgroundColor: function(context) {
        const value = context.dataset.data[context.dataIndex].v;
        const alpha = value / 10;
        return `rgba(37, 99, 235, ${alpha})`;
      },
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
      width: ({ chart }) => (chart.chartArea || {}).width / weeks.length - 2,
      height: ({ chart }) => (chart.chartArea || {}).height / departments.length - 2,
    }]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 12,
        borderRadius: 8,
        displayColors: false,
        callbacks: {
          title: function() {
            return '';
          },
          label: function(context) {
            const d = context.dataset.data[context.dataIndex];
            return d.y + ' - ' + d.x + ': ' + d.v.toFixed(1);
          }
        }
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: weeks,
        offset: true,
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
        }
      },
      y: {
        type: 'category',
        labels: departments,
        offset: true,
        ticks: {
          font: {
            size: 11
          }
        },
        grid: {
          display: false,
        }
      }
    }
  }
});

// Tab functionality for chart selection
const chartTabs = document.querySelectorAll('.chart-tab');
chartTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => {
    chartTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    
    // Toggle between datasets (simplified - you can expand this)
    if (index === 0) {
      lineChart.data.datasets[0].hidden = false;
      lineChart.data.datasets[1].hidden = true;
    } else {
      lineChart.data.datasets[0].hidden = true;
      lineChart.data.datasets[1].hidden = false;
    }
    lineChart.update();
  });
});
