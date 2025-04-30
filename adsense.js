// AdSense initialization
(function() {
    console.log('Starting AdSense initialization...');
    
    // Check if AdSense is already being initialized
    if (window.adsbygoogleInit === true) {
        console.log('AdSense initialization already in progress, skipping');
        return;
    }
    
    // Set flag to prevent multiple initializations
    window.adsbygoogleInit = true;
    
    // Maximum number of retries for failed ad slot initializations
    const MAX_RETRIES = 3;
    const retryCounts = new Map();
    
    // Function to check if all ad slots are already filled
    function areAllAdSlotsFilled() {
        const adElements = document.querySelectorAll('ins.adsbygoogle');
        if (adElements.length === 0) return false;
        
        // Check if each element has already been initialized
        for (let i = 0; i < adElements.length; i++) {
            const status = adElements[i].getAttribute('data-adsbygoogle-status');
            // AdSense adds a 'data-adsbygoogle-status' attribute when ads are loaded
            // Status can be 'done', 'filled', or undefined
            if (!status || (status !== 'done' && status !== 'filled')) {
                return false;
            }
        }
        return true;
    }
    
    // Function to initialize a single ad slot with retry logic
    function initializeAdSlot(adElement, retryCount = 0) {
        if (retryCount >= MAX_RETRIES) {
            console.error(`Max retries (${MAX_RETRIES}) reached for ad slot`, adElement);
            return;
        }
        
        try {
            // Check if this specific ad slot is already filled
            const status = adElement.getAttribute('data-adsbygoogle-status');
            if (status === 'done' || status === 'filled') {
                console.log('Ad slot already filled, skipping initialization');
                return;
            }
            
            (window.adsbygoogle = window.adsbygoogle || []).push({});
            console.log(`Ad slot initialized successfully (attempt ${retryCount + 1})`);
        } catch (error) {
            // Check if the error is about all slots being filled
            if (error.message && error.message.includes('already have ads in them')) {
                console.log('All ad slots are already filled, skipping initialization');
                return;
            }
            
            console.error(`Error initializing ad slot (attempt ${retryCount + 1}):`, error);
            
            // Schedule a retry with exponential backoff
            setTimeout(() => {
                initializeAdSlot(adElement, retryCount + 1);
            }, Math.pow(2, retryCount) * 1000); // Exponential backoff: 1s, 2s, 4s
        }
    }
    
    // Wait for the page to be fully loaded
    window.addEventListener('load', function() {
        console.log('Page loaded, waiting 1 second before initializing AdSense...');
        
        // Add a small delay to ensure everything is ready
        setTimeout(function() {
            try {
                // First check if all ad slots are already filled
                if (areAllAdSlotsFilled()) {
                    console.log('All ad slots already have ads, skipping initialization');
                    return;
                }
                
                // Check if AdSense is already loaded
                if (typeof window.adsbygoogle !== 'undefined') {
                    console.log('AdSense already loaded, only initializing unfilled ad slots');
                    
                    // Find all ad slots that haven't been filled yet
                    const uninitializedAds = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"]):not([data-adsbygoogle-status="filled"])');
                    
                    if (uninitializedAds.length > 0) {
                        console.log(`Found ${uninitializedAds.length} uninitialized ad slots, initializing them`);
                        
                        // Initialize each unfilled ad slot individually with retry logic
                        uninitializedAds.forEach(adElement => {
                            initializeAdSlot(adElement);
                        });
                    } else {
                        console.log('No uninitialized ad slots found');
                    }
                    return;
                }

                console.log('Loading AdSense script...');
                // Load AdSense script dynamically
                const script = document.createElement('script');
                script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-508182002579598';
                script.async = true;
                script.crossOrigin = 'anonymous';
                
                // Initialize AdSense after script loads
                script.onload = function() {
                    console.log('AdSense script loaded, initializing unfilled ad slots...');
                    try {
                        window.adsbygoogle = window.adsbygoogle || [];
                        
                        // Find all ad slots that haven't been filled yet
                        const uninitializedAds = document.querySelectorAll('ins.adsbygoogle:not([data-adsbygoogle-status="done"]):not([data-adsbygoogle-status="filled"])');
                        
                        if (uninitializedAds.length > 0) {
                            console.log(`Found ${uninitializedAds.length} uninitialized ad slots, initializing them`);
                            
                            // Initialize each unfilled ad slot individually with retry logic
                            uninitializedAds.forEach(adElement => {
                                initializeAdSlot(adElement);
                            });
                            
                            console.log('Ad slots initialization process started');
                        } else {
                            console.log('No uninitialized ad slots found');
                            
                            // Only if no ad slots exist at all, try to push the global config
                            if (document.querySelectorAll('ins.adsbygoogle').length === 0) {
                                window.adsbygoogle.push({
                                    google_ad_client: "ca-pub-508182002579598",
                                    overlays: {bottom: true}
                                });
                                console.log('Pushed global AdSense configuration');
                            }
                        }
                    } catch (error) {
                        console.error('AdSense initialization error:', error);
                    }
                };
                
                // Handle script load error
                script.onerror = function() {
                    console.error('Failed to load AdSense script');
                    window.adsbygoogleInit = false; // Reset flag on error
                };
                
                // Add script to document
                document.head.appendChild(script);
                console.log('AdSense script added to document');
            } catch (error) {
                console.error('AdSense setup error:', error);
                window.adsbygoogleInit = false; // Reset flag on error
            }
        }, 1000); // 1 second delay
    });
})();