// Milestones data
const milestones = [
  {"days":1,"label":"24 Hours","title":"Nicotine Cleared","description":"Nicotine level drops to negligible and heart attack risk begins to decrease."},
  {"days":3,"label":"72 Hours","title":"Breathing Improves","description":"Bronchial tubes relax and lung capacity increases."},
  {"days":7,"label":"1 Week","title":"Carbon Monoxide Normal","description":"CO levels return to normal, improving oxygenation."},
  {"days":30,"label":"1 Month","title":"Energy Boost","description":"Lung function improves and coughing decreases."},
  {"days":90,"label":"3 Months","title":"Circulation Better","description":"Circulation improves and physical activity feels easier."},
  {"days":180,"label":"6 Months","title":"Stress Handling","description":"Coughing and mucus reduce; handling stress without smoking becomes easier."},
  {"days":365,"label":"1 Year","title":"Heart Risk Halved","description":"Risk of coronary heart disease is half that of a smoker."}
];

// Global variables
let currentDays = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('Application initializing...');
  
  // Set up event listeners
  setupEventListeners();
  
  // Initialize displays
  renderMilestoneCards();
  renderMilestoneChecklist();
  setupIntersectionObserver();
  
  // Initial render with 0 days
  updateDisplay(0);
  
  console.log('Application initialized successfully');
});

// Set up all event listeners
function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Days input field with multiple event types for better compatibility
  const daysInput = document.getElementById('daysInput');
  if (daysInput) {
    console.log('Days input field found, attaching listeners');
    
    function handleDaysChange(e) {
      const days = parseInt(e.target.value) || 0;
      console.log('Days changed to:', days);
      currentDays = days;
      updateDisplay(days);
    }
    
    daysInput.addEventListener('input', handleDaysChange);
    daysInput.addEventListener('keyup', handleDaysChange);
    daysInput.addEventListener('change', handleDaysChange);
    daysInput.addEventListener('blur', handleDaysChange);
  } else {
    console.error('Days input field not found');
  }
  
  // Newsletter form
  const newsletterForm = document.getElementById('newsletterForm');
  if (newsletterForm) {
    console.log('Newsletter form found, attaching listener');
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Newsletter form submitted');
      
      const nameInput = document.getElementById('name');
      const emailInput = document.getElementById('email');
      
      if (nameInput && emailInput && nameInput.value.trim() && emailInput.value.trim()) {
        showToast('Thanks for joining Lotus! 🌸');
        newsletterForm.reset();
      } else {
        showToast('Please fill in all required fields.');
      }
    });
  }
  
  // Navigation buttons
  const navButton = document.querySelector('.nav-link');
  if (navButton) {
    console.log('Nav button found, attaching listener');
    navButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Nav button clicked, scrolling to newsletter');
      scrollToSection('newsletter');
    });
  }
  
  // Hero CTA button
  const ctaButton = document.querySelector('.hero .btn');
  if (ctaButton) {
    console.log('CTA button found, attaching listener');
    ctaButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('CTA button clicked, scrolling to tracker');
      scrollToSection('tracker');
    });
  }
  
  console.log('Event listeners setup complete');
}

// Update all display elements based on days
function updateDisplay(days) {
  console.log('Updating display for days:', days);
  updateLotusCount(days);
  renderLotusFlowers(days);
  updateProgress(days);
  updateMilestoneChecklist(days);
}

// Update lotus count display
function updateLotusCount(days) {
  const lotusCount = document.getElementById('lotusCount');
  if (lotusCount) {
    const count = days;
    const plural = count === 1 ? 'flower' : 'flowers';
    lotusCount.textContent = `You have earned ${count} lotus ${plural}`;
    console.log('Lotus count updated:', lotusCount.textContent);
  }
}

// Render lotus flower icons
function renderLotusFlowers(days) {
  const lotusContainer = document.getElementById('lotusContainer');
  if (!lotusContainer) return;
  
  console.log('Rendering lotus flowers for days:', days);
  lotusContainer.innerHTML = '';
  
  if (days === 0) {
    return;
  }
  
  if (days <= 30) {
    // Show individual lotus icons
    for (let i = 0; i < days; i++) {
      const lotus = createLotusIcon();
      lotusContainer.appendChild(lotus);
    }
  } else {
    // Show count for large numbers
    const countDisplay = document.createElement('div');
    countDisplay.style.cssText = `
      font-size: 3rem;
      font-weight: bold;
      color: #58A0C8;
      display: flex;
      align-items: center;
      gap: 1rem;
      justify-content: center;
    `;
    
    const lotus = createLotusIcon();
    lotus.style.width = '48px';
    lotus.style.height = '48px';
    
    countDisplay.appendChild(lotus);
    countDisplay.appendChild(document.createTextNode(` × ${days}`));
    lotusContainer.appendChild(countDisplay);
  }
}

// Create SVG lotus icon
function createLotusIcon() {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('class', 'lotus-icon');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', '32');
  svg.setAttribute('height', '32');
  svg.innerHTML = `
    <path d="M12 2C12 2 8 6 8 10C8 12 10 14 12 14C14 14 16 12 16 10C16 6 12 2 12 2Z" fill="#58A0C8"/>
    <path d="M12 14C12 14 16 18 16 22H8C8 18 12 14 12 14Z" fill="#58A0C8"/>
    <path d="M2 12C2 12 6 8 10 8C12 8 14 10 14 12C14 14 12 16 10 16C6 16 2 12 2 12Z" fill="#34699A"/>
    <path d="M14 12C14 12 18 8 22 8V16C18 16 14 12 14 12Z" fill="#34699A"/>
  `;
  return svg;
}

// Update progress bar and next milestone info
function updateProgress(days) {
  const progressFill = document.getElementById('progressFill');
  const nextMilestone = document.getElementById('nextMilestone');
  
  if (!progressFill || !nextMilestone) return;
  
  const nextMilestoneData = findNextMilestone(days);
  
  if (!nextMilestoneData) {
    nextMilestone.textContent = 'All milestones completed! 🎉';
    progressFill.style.width = '100%';
    return;
  }
  
  const previousMilestone = findPreviousMilestone(days);
  const startDays = previousMilestone ? previousMilestone.days : 0;
  const targetDays = nextMilestoneData.days;
  const currentProgress = days - startDays;
  const totalProgress = targetDays - startDays;
  const percentage = Math.min((currentProgress / totalProgress) * 100, 100);
  
  const daysLeft = targetDays - days;
  nextMilestone.textContent = `${daysLeft} days until "${nextMilestoneData.title}"`;
  progressFill.style.width = `${Math.max(percentage, 0)}%`;
  console.log('Progress updated:', percentage + '%');
}

// Find next milestone
function findNextMilestone(days) {
  return milestones.find(milestone => milestone.days > days);
}

// Find previous milestone
function findPreviousMilestone(days) {
  return milestones.slice().reverse().find(milestone => milestone.days <= days);
}

// Render milestone checklist
function renderMilestoneChecklist() {
  const milestonesList = document.getElementById('milestonesList');
  if (!milestonesList) return;
  
  console.log('Rendering milestone checklist');
  milestonesList.innerHTML = '';
  
  milestones.forEach(milestone => {
    const item = document.createElement('div');
    item.className = 'milestone-item';
    item.innerHTML = `
      <div class="milestone-check">
        <span class="check-mark">✓</span>
      </div>
      <div class="milestone-info">
        <div class="milestone-title">${milestone.title}</div>
        <div class="milestone-label">${milestone.label}</div>
      </div>
    `;
    milestonesList.appendChild(item);
  });
}

// Update milestone checklist based on days
function updateMilestoneChecklist(days) {
  const milestonesList = document.getElementById('milestonesList');
  if (!milestonesList) return;
  
  const items = milestonesList.querySelectorAll('.milestone-item');
  
  items.forEach((item, index) => {
    const milestone = milestones[index];
    const check = item.querySelector('.milestone-check');
    
    if (days >= milestone.days) {
      item.classList.add('completed');
      check.classList.add('completed');
    } else {
      item.classList.remove('completed');
      check.classList.remove('completed');
    }
  });
  
  console.log('Milestone checklist updated for', days, 'days');
}

// Render milestone detail cards
function renderMilestoneCards() {
  const milestonesCards = document.getElementById('milestonesCards');
  if (!milestonesCards) return;
  
  console.log('Rendering milestone cards');
  milestonesCards.innerHTML = '';
  
  milestones.forEach(milestone => {
    const card = document.createElement('div');
    card.className = 'milestone-card';
    card.innerHTML = `
      <h3>${milestone.title}</h3>
      <div class="milestone-days">${milestone.label}</div>
      <p>${milestone.description}</p>
    `;
    milestonesCards.appendChild(card);
  });
}

// Set up intersection observer for milestone cards
function setupIntersectionObserver() {
  if (!('IntersectionObserver' in window)) {
    // Fallback for older browsers - just show all cards
    setTimeout(() => {
      const cards = document.querySelectorAll('.milestone-card');
      cards.forEach(card => card.classList.add('visible'));
    }, 500);
    return;
  }
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '50px'
  });
  
  // Observe all milestone cards after a short delay
  setTimeout(() => {
    const cards = document.querySelectorAll('.milestone-card');
    cards.forEach(card => observer.observe(card));
  }, 100);
}

// Show toast notification
function showToast(message) {
  console.log('Showing toast:', message);
  const toastContainer = document.getElementById('toastContainer');
  if (!toastContainer) return;
  
  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  
  toastContainer.appendChild(toast);
  
  // Force reflow to ensure initial styles are applied
  toast.offsetHeight;
  
  // Trigger animation
  requestAnimationFrame(() => {
    toast.classList.add('show');
  });
  
  // Remove toast after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      if (toast.parentNode) {
        toastContainer.removeChild(toast);
      }
    }, 300);
  }, 4000);
}

// Scroll to section function
function scrollToSection(sectionId) {
  console.log('Scrolling to section:', sectionId);
  const element = document.getElementById(sectionId);
  if (element) {
    const nav = document.querySelector('.nav');
    const navHeight = nav ? nav.offsetHeight : 60;
    const elementPosition = element.offsetTop - navHeight - 20;
    
    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    });
  } else {
    console.error('Element not found:', sectionId);
  }
}

// Make scrollToSection available globally
window.scrollToSection = scrollToSection;

// Debug function to test functionality
window.debugTest = function() {
  console.log('Running debug test...');
  updateDisplay(5);
  showToast('Debug test completed');
};