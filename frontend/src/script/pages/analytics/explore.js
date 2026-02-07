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

// Initialize search functionality
function initSearch() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
      console.log('Search query:', query);
      // In a real application, you would send this to an API
      alert(`Searching for: ${query}\n\nSearch functionality is not available yet.`);
    }
  });

  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// Fetch and Render Data
async function fetchExploreData() {
  const container = document.querySelector('.data-section');
  if (!container) return;
  
  // Show loading state
  container.innerHTML = '<p style="text-align: center; color: var(--gray);">Loading data...</p>';

  try {
    const response = await fetch('/api/rFetch');
    if (!response.ok) throw new Error('Failed to fetch data');
    
    const data = await response.json();
    renderData(data);
  } catch (error) {
    console.error('Error fetching data:', error);
    container.innerHTML = '<p style="text-align: center; color: var(--red);">Error loading data. Please try again later.</p>';
  }
}

function renderData(data) {
  const container = document.querySelector('.data-section');
  container.innerHTML = '';
  
  if (data.length === 0) {
    container.innerHTML = '<p style="text-align: center; color: var(--gray);">No data found.</p>';
    return;
  }

  const cardTemplate = document.getElementById('data-card-template');
  const entryTemplate = document.getElementById('entry-item-template');

  data.forEach(item => {
    // Clone card template
    const card = cardTemplate.content.cloneNode(true);
    const cardElement = card.querySelector('.data-card');
    
    const dateStr = item.created_at ? item.created_at.split(' ')[0] : 'N/A';
    
    // Populate card header
    card.querySelector('.card-id').textContent = `Id: ${item.id}`;
    card.querySelector('.card-date').textContent = `Date: ${dateStr}`;
    
    // Populate entries
    const contentContainer = card.querySelector('.data-card-content');
    (item.entries || []).forEach(entry => {
      const entryElement = entryTemplate.content.cloneNode(true);
      entryElement.querySelector('.entry-question').textContent = entry.question || '';
      entryElement.querySelector('.entry-nps').textContent = entry.nps || '';
      entryElement.querySelector('.entry-feedback').textContent = entry.feedback || 'NULL';
      contentContainer.appendChild(entryElement);
    });

    // Interactive Toggle
    const btn = card.querySelector('.toggle-btn');
    const content = card.querySelector('.data-card-content');
    
    btn.addEventListener('click', () => {
      const isExpanded = btn.classList.contains('expanded');
      
      if (isExpanded) {
        btn.classList.remove('expanded');
        content.classList.remove('visible');
      } else {
        btn.classList.add('expanded');
        content.classList.add('visible');
      }
    });

    container.appendChild(card);
  });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', async () => {
  await loadSidebar();
  initSearch();
  fetchExploreData();
});
