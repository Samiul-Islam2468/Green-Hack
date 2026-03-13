// --- STATE VARIABLES ---
let currentLang = 'en';
let selectedHospital = "";
let map;
let chartInstance = null;

// --- FULLY EXPANDED TRANSLATION DICTIONARY ---
const dictionary = {
    'en': {
        'navHome': 'HOME', 
        'navAdmin': 'ADMIN DASHBOARD',
        'locMsg': '📍 We need your location to find the nearest facilities.', 
        'locBtn': 'Enable Location',
        'mainTitle': 'What kind of assistance do you need?', 
        'mainDesc': 'Select an option below to find nearby resources instantly.',
        'card1Title': 'Blood / Organ Bank', 
        'card1Desc': 'Find nearby blood groups or check organ availability.',
        'card2Title': 'NGO Help', 
        'card2Desc': 'Connect with local NGOs for healthcare assistance.',
        'bloodFormTitle': 'Search Availability', 
        'radioBlood': 'Blood Request', 
        'radioOrgan': 'Organ Request',
        'bloodTypeLbl': 'Blood Group Required:', 
        'organTypeLbl': 'Organ Required:', 
        'ageLbl': 'Patient Age:', 
        'unitLbl': 'Units Required:',
        'searchHospBtn': 'Search Hospitals', 
        'btnCancel': 'Cancel', 
        'hospTableTitle': 'Nearby Facilities',
        'colName': 'Name', 
        'colLoc': 'Location', 
        'colAction': 'Action', 
        'btnBook': 'Book', 
        'btnBack': '← Back', 
        'confirmBookTitle': 'Confirm Booking',
        'ngoFormTitle': 'Request NGO Assistance', 
        'helpTypeLbl': 'Type of Help Required:',
        'optOrgan': 'Organ Transplant Support', 
        'optFin': 'Financial Aid for Surgery', 
        'optPost': 'Post-Op Care & Rehab',
        'searchNgoBtn': 'Find Nearest NGOs', 
        'ngoTableTitle': 'Nearest NGOs', 
        'colNgoName': 'Nearest NGO',
        'btnContact': 'Contact', 
        'connectOptionsTitle': 'Connect with NGO'
    },
    'bn': {
        'navHome': 'হোম', 
        'navAdmin': 'অ্যাডমিন ড্যাশবোর্ড',
        'locMsg': '📍 নিকটতম সুবিধাগুলি খুঁজতে আমাদের আপনার অবস্থান প্রয়োজন।', 
        'locBtn': 'অবস্থান সক্ষম করুন',
        'mainTitle': 'আপনার কী ধরণের সহায়তা প্রয়োজন?', 
        'mainDesc': 'কাছাকাছি সংস্থানগুলি অবিলম্বে খুঁজে পেতে নীচের একটি বিকল্প নির্বাচন করুন।',
        'card1Title': 'রক্ত / অঙ্গ ব্যাংক', 
        'card1Desc': 'কাছাকাছি রক্তের গ্রুপ খুঁজুন বা অঙ্গের প্রাপ্যতা পরীক্ষা করুন।',
        'card2Title': 'এনজিও সহায়তা', 
        'card2Desc': 'স্বাস্থ্যসেবা সহায়তার জন্য স্থানীয় এনজিওগুলির সাথে সংযোগ করুন।',
        'bloodFormTitle': 'প্রাপ্যতা অনুসন্ধান করুন', 
        'radioBlood': 'রক্তের অনুরোধ', 
        'radioOrgan': 'অঙ্গের অনুরোধ',
        'bloodTypeLbl': 'রক্তের গ্রুপ প্রয়োজন:', 
        'organTypeLbl': 'অঙ্গ প্রয়োজন:', 
        'ageLbl': 'রোগীর বয়স:', 
        'unitLbl': 'ইউনিট প্রয়োজন:',
        'searchHospBtn': 'হাসপাতাল খুঁজুন', 
        'btnCancel': 'বাতিল করুন', 
        'hospTableTitle': 'নিকটতম সুবিধা',
        'colName': 'নাম', 
        'colLoc': 'অবস্থান', 
        'colAction': 'কর্ম', 
        'btnBook': 'বুক করুন', 
        'btnBack': '← ফিরে যান', 
        'confirmBookTitle': 'বুকিং নিশ্চিত করুন',
        'ngoFormTitle': 'এনজিও সহায়তা অনুরোধ করুন', 
        'helpTypeLbl': 'কী ধরণের সাহায্য প্রয়োজন:',
        'optOrgan': 'অঙ্গ প্রতিস্থাপন সহায়তা', 
        'optFin': 'সার্জারির জন্য আর্থিক সহায়তা', 
        'optPost': 'অপারেশন পরবর্তী যত্ন',
        'searchNgoBtn': 'নিকটতম এনজিও খুঁজুন', 
        'ngoTableTitle': 'নিকটতম এনজিও', 
        'colNgoName': 'নিকটতম এনজিও',
        'btnContact': 'যোগাযোগ', 
        'connectOptionsTitle': 'এনজিওর সাথে সংযোগ করুন'
    }
};

// --- TRANSLATION FUNCTION ---
function toggleLanguage() {
    currentLang = (currentLang === 'en') ? 'bn' : 'en';
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    elementsToTranslate.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (dictionary[currentLang][key]) {
            element.innerText = dictionary[currentLang][key];
        }
    });
    
    // Stop audio if it's currently speaking when language is switched
    window.speechSynthesis.cancel();
}

// --- TEXT TO AUDIO FUNCTION ---
function speakText(translationKey) {
    window.speechSynthesis.cancel();
    
    const textToSpeak = dictionary[currentLang][translationKey];
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set accent based on language
    utterance.lang = (currentLang === 'en') ? 'en-IN' : 'bn-IN';
    
    window.speechSynthesis.speak(utterance);
}

// --- UI NAVIGATION & TOGGLES ---
function showSection(sectionId) {
    // Array of all major sections in the app
    const sections = [
        'homeView', 
        'bloodOrganForm', 
        'resultsTable', 
        'paymentScreen', 
        'ngoForm', 
        'ngoResultsTable', 
        'ngoContactScreen', 
        'adminDashboard'
    ];
    
    // Hide all sections
    sections.forEach(id => {
        document.getElementById(id).style.display = 'none';
    });
    
    // Show the requested section
    document.getElementById(sectionId).style.display = 'block';
    
    // Map needs to be initialized only when its container becomes visible
    if (sectionId === 'resultsTable') {
        setTimeout(initMap, 100); 
    }
}

function goHome() { 
    showSection('homeView'); 
}

function toggleSearchType() {
    const isBlood = document.querySelector('input[name="searchType"]:checked').value === 'blood';
    
    // Show/Hide relevant dropdowns and inputs
    document.getElementById('bloodDropdownDiv').style.display = isBlood ? 'block' : 'none';
    document.getElementById('organDropdownDiv').style.display = isBlood ? 'none' : 'block';
    document.getElementById('unitsDiv').style.display = isBlood ? 'block' : 'none';
}

// --- TOAST ALERTS & VALIDATION ---
function showToast(message, type) {
    const toast = document.getElementById("toast");
    toast.innerText = message; 
    toast.className = "show " + type;
    
    setTimeout(() => { 
        toast.className = toast.className.replace("show " + type, ""); 
    }, 3000);
}

function validateAndSearch() {
    const age = document.getElementById('patientAge').value;
    const isBlood = document.querySelector('input[name="searchType"]:checked').value === 'blood';
    const units = document.getElementById('bloodUnits').value;

    if (age === "" || (isBlood && units === "")) {
        showToast("⚠️ Please fill in all required fields!", "error");
    } else {
        showToast(`✅ Searching for nearby matches...`, "success");
        showSection('resultsTable');
    }
}

// --- DATA TRANSFER TO NEXT SCREENS ---
function bookFacility(hospitalName) { 
    selectedHospital = hospitalName;
    document.getElementById('hospitalNameDisplay').innerText = "Booking at: " + hospitalName; 
    showSection('paymentScreen'); 
}

function contactNgo(ngoName) { 
    document.getElementById('ngoNameDisplay').innerText = "Connecting to: " + ngoName; 
    showSection('ngoContactScreen'); 
}

// --- GOOGLE MAPS INTEGRATION ---
function initMap() {
    if (map) return; // Prevent recreating the map if it already exists
    
    // Centered around North Dumdum
    const centerLoc = { lat: 22.6500, lng: 88.4300 }; 
    map = new google.maps.Map(document.getElementById("map"), { 
        zoom: 11, 
        center: centerLoc 
    });
    
    // Adding markers for our dummy data hospitals
    new google.maps.Marker({ position: { lat: 22.6534, lng: 88.4321 }, map: map, title: "North Dumdum Municipal Hospital" });
    new google.maps.Marker({ position: { lat: 22.7214, lng: 88.4842 }, map: map, title: "Barasat District Hospital" });
    new google.maps.Marker({ position: { lat: 22.5754, lng: 88.4026 }, map: map, title: "Apollo Multispeciality Hospitals" });
}

// --- RAZORPAY INTEGRATION ---
function payWithRazorpay() {
    const options = {
        "key": "YOUR_RAZORPAY_KEY_HERE", // Paste your Razorpay Test Key here
        "amount": "10000", // Amount is in paise (10000 = 100 INR)
        "currency": "INR",
        "name": "Green Hacks Logistics",
        "description": "Token for " + selectedHospital,
        "theme": { "color": "#2e7d32" },
        "handler": function (response){
            // This runs on a successful payment
            showToast("✅ Payment Success! ID: " + response.razorpay_payment_id, "success");
            setTimeout(() => {
                alert("Booking Confirmed for " + selectedHospital + "!\nYour receipt ID is " + Math.floor(Math.random() * 100000));
                goHome();
            }, 2000);
        },
        "prefill": {
            "name": "Samiul Islam",
            "contact": "7601868550"
        }
    };
    
    const rzp = new Razorpay(options);
    
    // Catch payment failures
    rzp.on('payment.failed', function (response){
        showToast("❌ Payment Failed: " + response.error.description, "error");
    });
    
    rzp.open(); 
}

// --- ADMIN DASHBOARD & CHART.JS ---
function showAdmin() {
    showSection('adminDashboard'); 
    showToast("Admin access granted.", "success");
    
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    
    // Destroy the chart if it already exists to prevent overlapping bugs
    if(chartInstance) chartInstance.destroy();
    
    chartInstance = new Chart(ctx, { 
        type: 'bar', 
        data: { 
            labels: ['A+', 'O+', 'B+', 'AB+', 'Kidney', 'Liver'], 
            datasets: [{ 
                label: 'Current Availability in North Dumdum', 
                data: [45, 60, 25, 10, 5, 2], 
                backgroundColor: ['#e53935', '#e53935', '#e53935', '#e53935', '#1976d2', '#1976d2'], 
                borderRadius: 5 
            }] 
        }, 
        options: { responsive: true } 
    });
}

// --- GEOLOCATION API ---
function getLocation() {
    const locText = document.getElementById('locText');
    
    if (navigator.geolocation) {
        locText.innerHTML = (currentLang === 'en') ? "⏳ Fetching your location..." : "⏳ অবস্থান আনা হচ্ছে...";
        
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude.toFixed(2);
                const lng = position.coords.longitude.toFixed(2);
                
                locText.innerHTML = (currentLang === 'en') ? `✅ Location captured: Lat ${lat}, Lng ${lng}` : `✅ অবস্থান ক্যাপচার করা হয়েছে: অক্ষাংশ ${lat}, দ্রাঘিমাংশ ${lng}`;
                locText.style.color = "var(--primary-green)"; 
                locText.style.fontWeight = "bold";
                
                // Hide the button once location is fetched
                document.querySelector('.location-banner button').style.display = "none";
                showToast("Location successfully synced.", "success");
            }, 
            () => { 
                locText.innerHTML = "❌ Location access denied."; 
                locText.style.color = "red"; 
                showToast("Could not access location.", "error"); 
            }
        );
    }
}