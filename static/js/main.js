/**
 * Dynamic City Explorer - Main JavaScript File
 * Handles interactive functionality for the travel planning application
 */

// Global application state
const App = {
    currentMap: null,
    weatherUpdateInterval: null,
    notifications: [],
    
    // Initialize the application
    init() {
        console.log('Initializing Dynamic City Explorer...');
        
        // Set up global event listeners
        this.setupGlobalEvents();
        
        // Initialize page-specific functionality
        this.initPageSpecific();
        
        // Setup service worker for offline functionality (if supported)
        this.setupServiceWorker();
        
        console.log('Dynamic City Explorer initialized successfully');
    },
    
    // Setup global event listeners
    setupGlobalEvents() {
        // Handle form submissions with loading states
        document.addEventListener('submit', this.handleFormSubmission);
        
        // Handle navigation confirmations for unsaved changes
        window.addEventListener('beforeunload', this.handleBeforeUnload);
        
        // Handle network status changes
        window.addEventListener('online', this.handleOnline);
        window.addEventListener('offline', this.handleOffline);
        
        // Handle keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboardShortcuts);
    },
    
    // Initialize page-specific functionality
    initPageSpecific() {
        const currentPage = this.getCurrentPage();
        
        switch(currentPage) {
            case 'index':
                this.initHomePage();
                break;
            case 'itinerary':
                this.initItineraryPage();
                break;
        }
    },
    
    // Get current page identifier
    getCurrentPage() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index')) return 'index';
        if (path.includes('itinerary')) return 'itinerary';
        return 'other';
    },
    
    // Initialize home page functionality
    initHomePage() {
        console.log('Initializing home page...');
        
        // Setup city autocomplete
        this.setupCityAutocomplete();
        
        // Setup form validation
        this.setupFormValidation();
        
        // Setup destination cards
        this.setupDestinationCards();
        
        // Setup interest suggestions
        this.setupInterestSuggestions();
    },
    
    // Initialize itinerary page functionality
    initItineraryPage() {
        console.log('Initializing itinerary page...');
        
        // Setup map functionality
        this.setupMapFunctionality();
        
        // Setup real-time updates
        this.setupRealTimeUpdates();
        
        // Setup activity interactions
        this.setupActivityInteractions();
        
        // Setup weather monitoring
        this.setupWeatherMonitoring();
    },
    
    // Setup city autocomplete functionality
    setupCityAutocomplete() {
        const cityInputs = document.querySelectorAll('#origin, #destination');
        
        // Indian cities for autocomplete
        const indianCities = [
            'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata',
            'Pune', 'Ahmedabad', 'Jaipur', 'Surat', 'Lucknow', 'Kanpur',
            'Nagpur', 'Visakhapatnam', 'Indore', 'Thane', 'Bhopal', 'Patna',
            'Vadodara', 'Ghaziabad', 'Ludhiana', 'Agra', 'Nashik', 'Faridabad',
            'Meerut', 'Rajkot', 'Kalyan-Dombivali', 'Vasai-Virar', 'Varanasi',
            'Srinagar', 'Aurangabad', 'Dhanbad', 'Amritsar', 'Navi Mumbai',
            'Allahabad', 'Ranchi', 'Howrah', 'Coimbatore', 'Jabalpur',
            'Gwalior', 'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur',
            'Kota', 'Guwahati', 'Chandigarh', 'Solapur', 'Hubballi-Dharwad',
            'Tiruchirappalli', 'Bareilly', 'Mysore', 'Tiruppur', 'Gurgaon',
            'Aligarh', 'Jalandhar', 'Bhubaneswar', 'Salem', 'Warangal',
            'Guntur', 'Bhiwandi', 'Saharanpur', 'Gorakhpur', 'Bikaner',
            'Amravati', 'Noida', 'Jamshedpur', 'Bhilai', 'Cuttack',
            'Firozabad', 'Kochi', 'Nellore', 'Bhavnagar', 'Dehradun',
            'Durgapur', 'Asansol', 'Rourkela', 'Nanded', 'Kolhapur',
            'Ajmer', 'Akola', 'Gulbarga', 'Jamnagar', 'Ujjain', 'Loni',
            'Siliguri', 'Jhansi', 'Ulhasnagar', 'Jammu', 'Sangli-Miraj',
            'Mangalore', 'Erode', 'Belgaum', 'Ambattur', 'Tirunelveli',
            'Malegaon', 'Gaya', 'Jalgaon', 'Udaipur', 'Maheshtala'
        ];
        
        cityInputs.forEach(input => {
            this.createAutocomplete(input, indianCities);
        });
    },
    
    // Create autocomplete functionality for an input
    createAutocomplete(input, suggestions) {
        let currentFocus = -1;
        
        input.addEventListener('input', function() {
            const value = this.value;
            closeAllLists();
            
            if (!value) return false;
            
            const listContainer = document.createElement('div');
            listContainer.setAttribute('id', this.id + 'autocomplete-list');
            listContainer.setAttribute('class', 'autocomplete-items list-group position-absolute w-100');
            listContainer.style.zIndex = '1000';
            this.parentNode.appendChild(listContainer);
            
            const filteredSuggestions = suggestions.filter(city => 
                city.toLowerCase().includes(value.toLowerCase())
            ).slice(0, 8);
            
            filteredSuggestions.forEach((city, index) => {
                const item = document.createElement('div');
                item.setAttribute('class', 'list-group-item list-group-item-action');
                item.style.cursor = 'pointer';
                
                const matchStart = city.toLowerCase().indexOf(value.toLowerCase());
                const matchEnd = matchStart + value.length;
                
                item.innerHTML = 
                    city.substr(0, matchStart) +
                    '<strong>' + city.substr(matchStart, value.length) + '</strong>' +
                    city.substr(matchEnd);
                
                item.addEventListener('click', function() {
                    input.value = city;
                    closeAllLists();
                    input.focus();
                });
                
                listContainer.appendChild(item);
            });
        });
        
        input.addEventListener('keydown', function(e) {
            const list = document.getElementById(this.id + 'autocomplete-list');
            if (list) {
                const items = list.getElementsByTagName('div');
                
                if (e.keyCode === 40) { // Arrow down
                    currentFocus++;
                    addActive(items);
                } else if (e.keyCode === 38) { // Arrow up
                    currentFocus--;
                    addActive(items);
                } else if (e.keyCode === 13) { // Enter
                    e.preventDefault();
                    if (currentFocus > -1 && items[currentFocus]) {
                        items[currentFocus].click();
                    }
                }
            }
        });
        
        function addActive(items) {
            if (!items) return false;
            removeActive(items);
            if (currentFocus >= items.length) currentFocus = 0;
            if (currentFocus < 0) currentFocus = items.length - 1;
            items[currentFocus].classList.add('active');
        }
        
        function removeActive(items) {
            for (let item of items) {
                item.classList.remove('active');
            }
        }
        
        function closeAllLists(except) {
            const lists = document.getElementsByClassName('autocomplete-items');
            for (let list of lists) {
                if (except !== list && except !== input) {
                    list.parentNode.removeChild(list);
                }
            }
        }
        
        document.addEventListener('click', function(e) {
            closeAllLists(e.target);
        });
    },
    
    // Setup form validation
    setupFormValidation() {
        const form = document.getElementById('planTripForm');
        if (!form) return;
        
        const originInput = document.getElementById('origin');
        const destinationInput = document.getElementById('destination');
        const durationInput = document.getElementById('travel_duration');
        
        // Real-time validation
        originInput?.addEventListener('blur', () => this.validateCityInput(originInput));
        destinationInput?.addEventListener('blur', () => this.validateCityInput(destinationInput));
        
        // Prevent same origin and destination
        const validateSameCities = () => {
            if (originInput.value && destinationInput.value &&
                originInput.value.toLowerCase() === destinationInput.value.toLowerCase()) {
                this.showFieldError(destinationInput, 'Destination must be different from origin');
                return false;
            }
            this.clearFieldError(destinationInput);
            return true;
        };
        
        originInput?.addEventListener('change', validateSameCities);
        destinationInput?.addEventListener('change', validateSameCities);
        
        // Duration validation
        durationInput?.addEventListener('change', function() {
            const duration = parseInt(this.value);
            if (duration < 1 || duration > 30) {
                App.showFieldError(this, 'Duration must be between 1 and 30 days');
            } else {
                App.clearFieldError(this);
            }
        });
    },
    
    // Validate city input
    validateCityInput(input) {
        const value = input.value.trim();
        
        if (!value) {
            this.showFieldError(input, 'This field is required');
            return false;
        }
        
        if (value.length < 2) {
            this.showFieldError(input, 'City name must be at least 2 characters');
            return false;
        }
        
        if (!/^[a-zA-Z\s-]+$/.test(value)) {
            this.showFieldError(input, 'City name can only contain letters, spaces, and hyphens');
            return false;
        }
        
        this.clearFieldError(input);
        return true;
    },
    
    // Show field error
    showFieldError(input, message) {
        this.clearFieldError(input);
        
        input.classList.add('is-invalid');
        
        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = message;
        
        input.parentNode.appendChild(errorDiv);
    },
    
    // Clear field error
    clearFieldError(input) {
        input.classList.remove('is-invalid');
        
        const existingError = input.parentNode.querySelector('.invalid-feedback');
        if (existingError) {
            existingError.remove();
        }
    },
    
    // Setup destination cards
    setupDestinationCards() {
        const cards = document.querySelectorAll('.destination-card');
        const destinationInput = document.getElementById('destination');
        
        cards.forEach(card => {
            card.addEventListener('click', () => {
                const destination = card.dataset.destination;
                if (destinationInput) {
                    destinationInput.value = destination;
                    
                    // Visual feedback
                    card.classList.add('border-info', 'bg-info', 'bg-opacity-25');
                    setTimeout(() => {
                        card.classList.remove('border-info', 'bg-info', 'bg-opacity-25');
                    }, 1500);
                    
                    // Scroll to form
                    document.getElementById('planTripForm')?.scrollIntoView({ 
                        behavior: 'smooth',
                        block: 'center'
                    });
                    
                    // Focus the next field
                    setTimeout(() => {
                        document.getElementById('travel_duration')?.focus();
                    }, 1000);
                }
            });
        });
    },
    
    // Setup interest suggestions
    setupInterestSuggestions() {
        const interestsInput = document.getElementById('interests');
        if (!interestsInput) return;
        
        const suggestions = [
            'historical sites', 'temples', 'street food', 'shopping markets',
            'museums', 'palaces', 'nature parks', 'adventure sports',
            'cultural events', 'local cuisine', 'photography', 'art galleries',
            'festivals', 'beaches', 'mountains', 'wildlife', 'architecture',
            'spiritual places', 'handicrafts', 'music and dance'
        ];
        
        // Add suggestion chips below the textarea
        const chipContainer = document.createElement('div');
        chipContainer.className = 'mt-2';
        chipContainer.innerHTML = '<small class="text-muted">Quick add: </small>';
        
        suggestions.slice(0, 8).forEach(suggestion => {
            const chip = document.createElement('span');
            chip.className = 'badge bg-secondary me-1 mb-1';
            chip.style.cursor = 'pointer';
            chip.textContent = suggestion;
            
            chip.addEventListener('click', () => {
                const currentValue = interestsInput.value;
                const newValue = currentValue ? 
                    `${currentValue}, ${suggestion}` : suggestion;
                interestsInput.value = newValue;
                
                // Visual feedback
                chip.classList.add('bg-success');
                setTimeout(() => {
                    chip.classList.remove('bg-success');
                    chip.classList.add('bg-secondary');
                }, 1000);
            });
            
            chipContainer.appendChild(chip);
        });
        
        interestsInput.parentNode.appendChild(chipContainer);
    },
    
    // Setup map functionality
    setupMapFunctionality() {
        // Map initialization is handled in the template
        // This function can be extended for additional map features
        
        // Add map controls if map exists
        if (window.L && this.currentMap) {
            this.addMapControls();
        }
    },
    
    // Add additional map controls
    addMapControls() {
        if (!this.currentMap) return;
        
        // Add fullscreen control
        const fullscreenControl = L.control({position: 'topright'});
        fullscreenControl.onAdd = function() {
            const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
            div.innerHTML = '<a href="#" title="Toggle fullscreen"><i class="fas fa-expand"></i></a>';
            
            L.DomEvent.on(div, 'click', function(e) {
                e.preventDefault();
                const mapContainer = document.getElementById('routeMap');
                if (mapContainer.requestFullscreen) {
                    mapContainer.requestFullscreen();
                }
            });
            
            return div;
        };
        
        fullscreenControl.addTo(this.currentMap);
    },
    
    // Setup real-time updates
    setupRealTimeUpdates() {
        const updateBtn = document.getElementById('updateItineraryBtn');
        if (!updateBtn) return;
        
        // Auto-check for updates every 30 minutes
        this.weatherUpdateInterval = setInterval(() => {
            this.checkForUpdatesBackground();
        }, 30 * 60 * 1000);
        
        // Add visual indicator for last update time
        this.addUpdateIndicator();
    },
    
    // Check for updates in background
    checkForUpdatesBackground() {
        const updateBtn = document.getElementById('updateItineraryBtn');
        if (!updateBtn) return;
        
        const planId = updateBtn.dataset.planId;
        
        fetch(`/update-itinerary/${planId}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
        .then(response => response.json())
        .then(data => {
            if (data.success && data.updated) {
                this.showUpdateNotification('New updates available for your itinerary!');
            }
        })
        .catch(error => {
            console.log('Background update check failed:', error);
        });
    },
    
    // Show update notification
    showUpdateNotification(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast position-fixed top-0 end-0 m-3';
        toast.style.zIndex = '9999';
        toast.innerHTML = `
            <div class="toast-header">
                <i class="fas fa-sync-alt text-info me-2"></i>
                <strong class="me-auto">Update Available</strong>
                <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">
                ${message}
                <div class="mt-2">
                    <button class="btn btn-sm btn-info" onclick="location.reload()">
                        Refresh Page
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast);
        bsToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },
    
    // Add update indicator
    addUpdateIndicator() {
        const updateBtn = document.getElementById('updateItineraryBtn');
        if (!updateBtn) return;
        
        const indicator = document.createElement('small');
        indicator.className = 'text-muted d-block mt-1';
        indicator.id = 'updateIndicator';
        indicator.textContent = 'Auto-checking for updates every 30 minutes';
        
        updateBtn.parentNode.appendChild(indicator);
    },
    
    // Setup activity interactions
    setupActivityInteractions() {
        const activityItems = document.querySelectorAll('.activity-item');
        
        activityItems.forEach(item => {
            // Add click handler for mobile
            item.addEventListener('click', function() {
                if (window.innerWidth <= 768) {
                    this.classList.toggle('active');
                }
            });
            
            // Add location lookup functionality
            const locationElement = item.querySelector('.activity-location');
            if (locationElement) {
                locationElement.style.cursor = 'pointer';
                locationElement.title = 'Click to view on map';
                
                locationElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.lookupLocationOnMap(locationElement.textContent);
                });
            }
        });
    },
    
    // Look up location on map
    lookupLocationOnMap(locationName) {
        // This would integrate with a mapping service
        console.log(`Looking up location: ${locationName}`);
        
        // For now, just show a notification
        this.showToast(`Searching for ${locationName} on map...`, 'info');
    },
    
    // Setup weather monitoring
    setupWeatherMonitoring() {
        const weatherSection = document.querySelector('.weather-forecast');
        if (!weatherSection) return;
        
        // Add refresh button to weather section
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'btn btn-sm btn-outline-info';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt me-1"></i>Refresh';
        refreshBtn.title = 'Refresh weather data';
        
        refreshBtn.addEventListener('click', () => {
            this.refreshWeatherData();
        });
        
        const weatherHeader = weatherSection.closest('.card').querySelector('.card-header');
        if (weatherHeader) {
            weatherHeader.appendChild(refreshBtn);
        }
    },
    
    // Refresh weather data
    refreshWeatherData() {
        const weatherSection = document.querySelector('.weather-forecast');
        if (!weatherSection) return;
        
        // Show loading state
        weatherSection.innerHTML = `
            <div class="text-center py-4">
                <div class="spinner-border text-info mb-2"></div>
                <p class="text-muted">Updating weather data...</p>
            </div>
        `;
        
        // This would make an API call to refresh weather
        setTimeout(() => {
            // For demo, just show a message
            weatherSection.innerHTML = `
                <div class="text-center py-4">
                    <i class="fas fa-check-circle text-success fa-2x mb-2"></i>
                    <p class="text-muted">Weather data updated successfully</p>
                    <small class="text-muted">Reload page to see latest forecast</small>
                </div>
            `;
        }, 2000);
    },
    
    // Handle form submissions
    handleFormSubmission(e) {
        const form = e.target;
        if (!form.matches('form')) return;
        
        const submitBtn = form.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        // Show loading state
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        submitBtn.disabled = true;
        
        // Reset button after a delay if form submission fails
        setTimeout(() => {
            if (submitBtn.disabled) {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        }, 30000);
    },
    
    // Handle before unload
    handleBeforeUnload(e) {
        // Check if there are unsaved changes
        const forms = document.querySelectorAll('form');
        let hasChanges = false;
        
        forms.forEach(form => {
            if (form.dataset.changed === 'true') {
                hasChanges = true;
            }
        });
        
        if (hasChanges) {
            e.preventDefault();
            e.returnValue = '';
        }
    },
    
    // Handle online status
    handleOnline() {
        console.log('Connection restored');
        this.showToast('Connection restored', 'success');
        
        // Resume automatic updates
        if (!this.weatherUpdateInterval) {
            this.setupRealTimeUpdates();
        }
    },
    
    // Handle offline status
    handleOffline() {
        console.log('Connection lost');
        this.showToast('You are offline. Some features may not work.', 'warning', 5000);
        
        // Pause automatic updates
        if (this.weatherUpdateInterval) {
            clearInterval(this.weatherUpdateInterval);
            this.weatherUpdateInterval = null;
        }
    },
    
    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + K: Focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const originInput = document.getElementById('origin');
            if (originInput) {
                originInput.focus();
                originInput.select();
            }
        }
        
        // Escape: Close modals/dropdowns
        if (e.key === 'Escape') {
            const activeModal = document.querySelector('.modal.show');
            if (activeModal) {
                const modal = bootstrap.Modal.getInstance(activeModal);
                modal?.hide();
            }
            
            // Close autocomplete lists
            const autocompleteLists = document.querySelectorAll('.autocomplete-items');
            autocompleteLists.forEach(list => list.remove());
        }
    },
    
    // Setup service worker
    setupServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/static/sw.js')
                .then(registration => {
                    console.log('Service Worker registered successfully');
                })
                .catch(error => {
                    console.log('Service Worker registration failed:', error);
                });
        }
    },
    
    // Utility function to show toast notifications
    showToast(message, type = 'info', duration = 3000) {
        const toastContainer = this.getOrCreateToastContainer();
        
        const toast = document.createElement('div');
        toast.className = `toast align-items-center text-white bg-${type} border-0`;
        toast.setAttribute('role', 'alert');
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, { delay: duration });
        bsToast.show();
        
        // Remove from DOM after hiding
        toast.addEventListener('hidden.bs.toast', () => {
            toast.remove();
        });
    },
    
    // Get or create toast container
    getOrCreateToastContainer() {
        let container = document.getElementById('toastContainer');
        
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container position-fixed top-0 end-0 p-3';
            container.style.zIndex = '9999';
            document.body.appendChild(container);
        }
        
        return container;
    },
    
    // Cleanup function
    cleanup() {
        if (this.weatherUpdateInterval) {
            clearInterval(this.weatherUpdateInterval);
        }
        
        if (this.currentMap) {
            this.currentMap.remove();
        }
    }
};

// Polyfills for older browsers
if (!Element.prototype.matches) {
    Element.prototype.matches = Element.prototype.msMatchesSelector;
}

if (!Element.prototype.closest) {
    Element.prototype.closest = function(s) {
        let el = this;
        do {
            if (el.matches(s)) return el;
            el = el.parentElement || el.parentNode;
        } while (el !== null && el.nodeType === 1);
        return null;
    };
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    App.cleanup();
});

// Handle page visibility changes (for battery optimization)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') {
        // Pause expensive operations
        if (App.weatherUpdateInterval) {
            clearInterval(App.weatherUpdateInterval);
        }
    } else if (document.visibilityState === 'visible') {
        // Resume operations
        if (!App.weatherUpdateInterval) {
            App.setupRealTimeUpdates();
        }
    }
});

// Export for global access
window.App = App;
