import Chart from 'chart.js/auto';

// Load sidebar component
async function loadSidebar() {
  try {
    const response = await fetch('components/sidebar.html');
    const html = await response.text();
    const sidebarElement = document.getElementById('sidebar');
    if (sidebarElement) {
      sidebarElement.innerHTML = html;
      // Set active state for explore
      const exploreLink = sidebarElement.querySelector('a[href="explore.html"]');
      if (exploreLink) {
        exploreLink.classList.add('active');
      }
      // Remove active from dashboard
      const dashboardLink = sidebarElement.querySelector('a[href="#"]');
      if (dashboardLink) {
        dashboardLink.classList.remove('active');
        dashboardLink.href = 'dashboard.html';
      }
    }
  } catch (error) {
    console.error('Error loading sidebar:', error);
  }
}

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
document.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  initDropdown();
  initFilterChips();
  initSearch();
  initAddFilter();
});
