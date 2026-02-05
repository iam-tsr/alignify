import Chart from 'chart.js/auto';

// Sample data
const sampleData = [
  { id: '300000440', date: '03/07/2023', region: 'UK', department: 'Management', score: 75, comment: 'Fiming to somt thi responsive wat...' },
  { id: '300000562', date: '03/07/2023', region: 'UK', department: 'Department', score: 63, comment: 'Thank you to at zuv stafio.' },
  { id: '300000583', date: '03/07/2023', region: 'Germany', department: 'Sales', score: 60, comment: 'Very mgly seht about satisfaction...' },
  { id: '300000435', date: '03/07/2023', region: 'Germany', department: 'Manager', score: 66, comment: 'People wiith handson woдload' },
  { id: '300000406', date: '03/07/2023', region: 'UK', department: 'Management', score: 75, comment: 'Thienиrreutch as stay-mpoiled ca...' },
  { id: '300000677', date: '03/07/2023', region: 'UK', department: 'Department', score: 68, comment: 'Health work usudl of дeding team...' },
  { id: '300000643', date: '03/07/2023', region: 'Germany', department: 'Sales', score: 67, comment: 'Collaboration with a communicati...' },
];

let chartInstance = null;

// Initialize dropdown
function initDropdown() {
  const dropdownBtn = document.getElementById('dateRangeBtn');
  const dropdownMenu = document.getElementById('dateRangeMenu');
  const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');

  dropdownBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
  });

  dropdownItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const value = item.getAttribute('data-value');
      const text = item.textContent;
      
      // Update button text
      dropdownBtn.childNodes[0].textContent = text + ' ';
      
      // Update active state
      dropdownItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      
      // Close dropdown
      dropdownMenu.classList.remove('show');
    });
  });

  // Close dropdown when clicking outside
  document.addEventListener('click', () => {
    dropdownMenu.classList.remove('show');
  });
}

// Initialize filter chips
function initFilterChips() {
  const filterChips = document.getElementById('filterChips');
  
  filterChips.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.chip-remove');
    if (removeBtn) {
      const chip = removeBtn.closest('.filter-chip');
      chip.classList.remove('active');
      const span = chip.querySelector('span');
      if (span) {
        // Reset to default
        const text = span.textContent.split(':')[0];
        span.textContent = text + ': All';
      }
    }
  });
}

// Initialize view toggle
function initViewToggle() {
  const viewToggle = document.getElementById('viewToggle');
  const tableView = document.getElementById('tableView');
  const chartView = document.getElementById('chartView');

  viewToggle.addEventListener('change', () => {
    if (viewToggle.checked) {
      // Show chart view
      tableView.style.display = 'none';
      chartView.style.display = 'block';
      renderChart();
    } else {
      // Show table view
      tableView.style.display = 'block';
      chartView.style.display = 'none';
    }
  });
}

// Render chart
function renderChart() {
  const ctx = document.getElementById('dataChart');
  if (!ctx) return;

  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }

  // Aggregate data by region
  const regionData = {};
  sampleData.forEach(item => {
    if (!regionData[item.region]) {
      regionData[item.region] = { total: 0, count: 0 };
    }
    regionData[item.region].total += item.score;
    regionData[item.region].count += 1;
  });

  const labels = Object.keys(regionData);
  const data = labels.map(region => 
    Math.round(regionData[region].total / regionData[region].count)
  );

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Average Satisfaction Score',
        data: data,
        backgroundColor: [
          'rgba(99, 102, 241, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(147, 51, 234, 0.8)',
        ],
        borderColor: [
          'rgb(99, 102, 241)',
          'rgb(59, 130, 246)',
          'rgb(147, 51, 234)',
        ],
        borderWidth: 2,
        borderRadius: 8,
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: '#6366f1',
          borderWidth: 1,
          padding: 12,
          displayColors: true,
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 13,
              weight: 500
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 100,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
          },
          ticks: {
            color: '#6b7280',
            font: {
              size: 13
            },
            stepSize: 20
          }
        }
      }
    }
  });
}

// Initialize search functionality
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      console.log('Search query:', query);
      // In a real application, you would send this to an API
      alert(`Searching for: ${query}\n\nThis would typically query your backend API.`);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// Initialize add filter button
function initAddFilter() {
  const addFilterBtn = document.getElementById('addFilterBtn');
  
  addFilterBtn.addEventListener('click', () => {
    // In a real application, this would open a filter modal
    alert('Add Filter functionality would open a modal to select additional filters.');
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initDropdown();
  initFilterChips();
  initViewToggle();
  initSearch();
  initAddFilter();
});
