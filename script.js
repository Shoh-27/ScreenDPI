// Screen DPI & Physical Size Checker - Complete JavaScript

(function() {
    'use strict';

    // Global variables
    let screenWidth = 0;
    let screenHeight = 0;
    let devicePixelRatio = 1;
    let calculatedDPI = 0;

    // DOM elements
    const elements = {
        resolution: document.getElementById('resolution'),
        pixelRatio: document.getElementById('pixelRatio'),
        browser: document.getElementById('browser'),
        os: document.getElementById('os'),
        creditCardMethod: document.getElementById('creditCardMethod'),
        manualMethod: document.getElementById('manualMethod'),
        creditCard: document.getElementById('creditCard'),
        cardSlider: document.getElementById('cardSlider'),
        cardWidth: document.getElementById('cardWidth'),
        calibrateBtn: document.getElementById('calibrateBtn'),
        diagonalInput: document.getElementById('diagonalInput'),
        unitSelect: document.getElementById('unitSelect'),
        calculateBtn: document.getElementById('calculateBtn'),
        resultsSection: document.getElementById('resultsSection'),
        dpiValue: document.getElementById('dpiValue'),
        densityClass: document.getElementById('densityClass'),
        physicalWidth: document.getElementById('physicalWidth'),
        physicalHeight: document.getElementById('physicalHeight'),
        diagonalSize: document.getElementById('diagonalSize'),
        aspectRatio: document.getElementById('aspectRatio'),
        totalPixels: document.getElementById('totalPixels')
    };

    // Initialize on page load
    function init() {
        // Only initialize if we're on the main page with the tool
        if (!elements.resolution) {
            return;
        }

        detectScreenInfo();
        setupEventListeners();
        updateCreditCardSize();
    }

    // Detect screen information
    function detectScreenInfo() {
        // Get actual physical pixels (accounting for device pixel ratio)
        devicePixelRatio = window.devicePixelRatio || 1;
        screenWidth = window.screen.width * devicePixelRatio;
        screenHeight = window.screen.height * devicePixelRatio;

        // Update display
        elements.resolution.textContent = `${screenWidth} × ${screenHeight} pixels`;
        elements.pixelRatio.textContent = devicePixelRatio.toFixed(2);
        elements.browser.textContent = detectBrowser();
        elements.os.textContent = detectOS();
    }

    // Detect browser
    function detectBrowser() {
        const ua = navigator.userAgent;
        let browserName = 'Unknown';

        if (ua.indexOf('Firefox') > -1) {
            browserName = 'Mozilla Firefox';
        } else if (ua.indexOf('SamsungBrowser') > -1) {
            browserName = 'Samsung Internet';
        } else if (ua.indexOf('Opera') > -1 || ua.indexOf('OPR') > -1) {
            browserName = 'Opera';
        } else if (ua.indexOf('Trident') > -1) {
            browserName = 'Internet Explorer';
        } else if (ua.indexOf('Edge') > -1) {
            browserName = 'Microsoft Edge (Legacy)';
        } else if (ua.indexOf('Edg') > -1) {
            browserName = 'Microsoft Edge';
        } else if (ua.indexOf('Chrome') > -1) {
            browserName = 'Google Chrome';
        } else if (ua.indexOf('Safari') > -1) {
            browserName = 'Safari';
        }

        return browserName;
    }

    // Detect operating system
    function detectOS() {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        let osName = 'Unknown OS';

        if (ua.indexOf('Win') > -1 || platform.indexOf('Win') > -1) {
            osName = 'Windows';
            if (ua.indexOf('Windows NT 10.0') > -1) osName = 'Windows 10/11';
            else if (ua.indexOf('Windows NT 6.3') > -1) osName = 'Windows 8.1';
            else if (ua.indexOf('Windows NT 6.2') > -1) osName = 'Windows 8';
            else if (ua.indexOf('Windows NT 6.1') > -1) osName = 'Windows 7';
        } else if (ua.indexOf('Mac') > -1 || platform.indexOf('Mac') > -1) {
            osName = 'macOS';
        } else if (ua.indexOf('X11') > -1 || platform.indexOf('Linux') > -1) {
            osName = 'Linux';
        } else if (ua.indexOf('Android') > -1) {
            osName = 'Android';
        } else if (ua.indexOf('iPhone') > -1 || ua.indexOf('iPad') > -1 || ua.indexOf('iPod') > -1) {
            osName = 'iOS';
        }

        return osName;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Calibration method radio buttons
        const radioButtons = document.querySelectorAll('input[name="calibration"]');
        radioButtons.forEach(radio => {
            radio.addEventListener('change', handleCalibrationMethodChange);
        });

        // Credit card slider
        elements.cardSlider.addEventListener('input', updateCreditCardSize);

        // Calibrate button
        elements.calibrateBtn.addEventListener('click', calibrateWithCreditCard);

        // Calculate button (manual method)
        elements.calculateBtn.addEventListener('click', calculateManualDPI);

        // Enter key on manual input
        elements.diagonalInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                calculateManualDPI();
            }
        });

        // Window resize handler
        window.addEventListener('resize', function() {
            detectScreenInfo();
        });
    }

    // Handle calibration method change
    function handleCalibrationMethodChange(e) {
        if (e.target.value === 'creditcard') {
            elements.creditCardMethod.classList.add('active');
            elements.manualMethod.classList.remove('active');
        } else {
            elements.creditCardMethod.classList.remove('active');
            elements.manualMethod.classList.add('active');
        }
    }

    // Update credit card size based on slider
    function updateCreditCardSize() {
        const width = elements.cardSlider.value;
        elements.creditCard.style.width = width + 'px';
        
        // Standard credit card aspect ratio (85.6mm / 53.98mm = 1.5857)
        const height = width / 1.5857;
        elements.creditCard.style.height = height + 'px';
        
        elements.cardWidth.textContent = width + 'px';
    }

    // Calibrate using credit card
    function calibrateWithCreditCard() {
        // Standard credit card width in millimeters
        const creditCardWidthMM = 85.6;
        const creditCardWidthInches = creditCardWidthMM / 25.4;

        // Get the current width of the card in pixels
        const cardWidthPixels = parseFloat(elements.cardSlider.value);

        // Calculate DPI
        calculatedDPI = cardWidthPixels / creditCardWidthInches;

        // Calculate physical dimensions
        calculatePhysicalDimensions(calculatedDPI);

        // Show results
        displayResults();
    }

    // Calculate DPI using manual entry
    function calculateManualDPI() {
        const diagonalValue = parseFloat(elements.diagonalInput.value);
        const unit = elements.unitSelect.value;

        if (!diagonalValue || diagonalValue <= 0) {
            alert('Please enter a valid screen diagonal size.');
            return;
        }

        // Convert to inches if needed
        let diagonalInches = diagonalValue;
        if (unit === 'cm') {
            diagonalInches = diagonalValue / 2.54;
        }

        // Calculate DPI using Pythagorean theorem
        const diagonalPixels = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2));
        calculatedDPI = diagonalPixels / diagonalInches;

        // Calculate physical dimensions
        calculatePhysicalDimensions(calculatedDPI);

        // Show results
        displayResults();
    }

    // Calculate physical dimensions based on DPI
    function calculatePhysicalDimensions(dpi) {
        // Store for use in display
        calculatedDPI = dpi;
    }

    // Display results
    function displayResults() {
        // Show results section
        elements.resultsSection.style.display = 'block';

        // Calculate all values
        const widthInches = screenWidth / calculatedDPI;
        const heightInches = screenHeight / calculatedDPI;
        const widthCM = widthInches * 2.54;
        const heightCM = heightInches * 2.54;
        const diagonalInches = Math.sqrt(Math.pow(widthInches, 2) + Math.pow(heightInches, 2));
        const diagonalCM = diagonalInches * 2.54;
        const aspectRatio = calculateAspectRatio(screenWidth, screenHeight);
        const totalPixels = screenWidth * screenHeight;
        const densityClassification = getDensityClassification(calculatedDPI);

        // Update DOM
        elements.dpiValue.textContent = Math.round(calculatedDPI) + ' PPI';
        elements.densityClass.textContent = densityClassification;
        
        elements.physicalWidth.textContent = 
            widthInches.toFixed(2) + '" (' + widthCM.toFixed(1) + ' cm)';
        
        elements.physicalHeight.textContent = 
            heightInches.toFixed(2) + '" (' + heightCM.toFixed(1) + ' cm)';
        
        elements.diagonalSize.textContent = 
            diagonalInches.toFixed(2) + '" (' + diagonalCM.toFixed(1) + ' cm)';
        
        elements.aspectRatio.textContent = aspectRatio;
        
        elements.totalPixels.textContent = 
            (totalPixels / 1000000).toFixed(2) + ' megapixels';

        // Scroll to results
        elements.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Calculate aspect ratio
    function calculateAspectRatio(width, height) {
        const gcd = findGCD(width, height);
        const ratioWidth = width / gcd;
        const ratioHeight = height / gcd;

        // Check for common aspect ratios
        const ratio = width / height;
        
        if (Math.abs(ratio - 16/9) < 0.01) return '16:9';
        if (Math.abs(ratio - 16/10) < 0.01) return '16:10';
        if (Math.abs(ratio - 4/3) < 0.01) return '4:3';
        if (Math.abs(ratio - 21/9) < 0.01) return '21:9';
        if (Math.abs(ratio - 32/9) < 0.01) return '32:9';
        if (Math.abs(ratio - 3/2) < 0.01) return '3:2';
        
        // If no common ratio found, simplify the actual ratio
        if (ratioWidth > 100 || ratioHeight > 100) {
            // If ratio is too complex, show decimal
            return ratio.toFixed(2) + ':1';
        }
        
        return Math.round(ratioWidth) + ':' + Math.round(ratioHeight);
    }

    // Find greatest common divisor
    function findGCD(a, b) {
        a = Math.round(a);
        b = Math.round(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    // Get density classification
    function getDensityClassification(dpi) {
        if (dpi < 100) {
            return 'Low Density';
        } else if (dpi < 150) {
            return 'Standard Desktop';
        } else if (dpi < 220) {
            return 'High Density';
        } else {
            return 'Retina/HiDPI';
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose for debugging (optional)
    window.screenChecker = {
        getScreenInfo: function() {
            return {
                width: screenWidth,
                height: screenHeight,
                devicePixelRatio: devicePixelRatio,
                calculatedDPI: calculatedDPI
            };
        },
        recalculate: function() {
            detectScreenInfo();
        }
    };

})();