// --- Global State Variables ---
let currentLang = 'en';
let selectedHospital = "";
let map;
let chartInstance = null;
let markersArray = [];
let userLat = null;
let userLng = null;

// --- FULL WEST BENGAL DATABASE ---
const hospitalData = [
    { 
        district: "Kolkata", 
        name: "R.G. Kar Blood Bank", 
        address: "1st Floor, Emergency Building, Kolkata", 
        phone: "033 2351 0620", 
        lat: 22.5937, 
        lng: 88.3714 
    },
    { 
        district: "Kolkata", 
        name: "IBTM&IH", 
        address: "205, Vivekananda Rd, Kolkata", 
        phone: "033 2351 0620", 
        lat: 22.5831, 
        lng: 88.3715 
    },
    { 
        district: "Kolkata", 
        name: "Life Care Blood Bank", 
        address: "204/1B, Linton St, Kolkata", 
        phone: "033 2284 2298", 
        lat: 22.5487, 
        lng: 88.3694 
    },
    { 
        district: "Kolkata", 
        name: "Apollo Gleneagles Hospital", 
        address: "Phoolbagan, Kankurgachi, Kolkata", 
        phone: "033 2320 2122", 
        lat: 22.5754, 
        lng: 88.4026 
    },
    { 
        district: "Kolkata", 
        name: "Tata Medical Centre", 
        address: "DH Block(Newtown), Kolkata", 
        phone: "03224 269 048", 
        lat: 22.5750, 
        lng: 88.4789 
    },
    { 
        district: "Howrah", 
        name: "Howrah District Hospital", 
        address: "Howrah Railway Station, West Bengal", 
        phone: "033 2641 1227", 
        lat: 22.5833, 
        lng: 88.3333 
    },
    { 
        district: "Howrah", 
        name: "Suraksha Home Blood Centre", 
        address: "30, 2nd Ln, Pilkhana, Salkia", 
        phone: "099030 30131", 
        lat: 22.5986, 
        lng: 88.3496 
    },
    { 
        district: "Howrah", 
        name: "North Bank Diagnostic", 
        address: "320, Grand Trunk Road, Salkia", 
        phone: "099037 83033", 
        lat: 22.6050, 
        lng: 88.3510 
    },
    { 
        district: "Siliguri", 
        name: "Siliguri Terai Lions Blood Bank", 
        address: "Sevoke Road Jyothi nagar, Siliguri", 
        phone: "090931 00755", 
        lat: 26.7271, 
        lng: 88.4316 
    },
    { 
        district: "Siliguri", 
        name: "Neotia Getwel Specialty Hospital", 
        address: "Uttorayon Twp, Matigara, Siliguri", 
        phone: "0353 660 3000", 
        lat: 26.7258, 
        lng: 88.3912 
    },
    { 
        district: "Siliguri", 
        name: "Indian Red Cross Society", 
        address: "Red Cross Road, Ward 16, Siliguri", 
        phone: "0353 243 5291", 
        lat: 26.7150, 
        lng: 88.4230 
    }
];

// --- FULL ENGLISH / BENGALI DICTIONARY ---
const dictionary = {
    'en': {
        'navHome': 'HOME', 
        'navAdmin': 'ADMIN DASHBOARD', 
        'locTitle': 'Location Services', 
        'locMsg': 'We need your location to find the nearest facilities.', 
        'locBtn': 'Enable Location',
        'mainTitle': 'Healthcare Logistics Portal', 
        'mainDesc': 'Select an option below to find nearby resources instantly.',
        'card1Title': 'Blood / Organ Bank', 
        'card1Desc': 'Find nearby blood groups or check organ availability dynamically.',
        'card2Title': 'NGO Help', 
        'card2Desc': 'Connect with local NGOs for healthcare assistance.',
        'bloodFormTitle': 'Search Availability', 
        'radioBlood': '🩸 Blood Request', 
        'radioOrgan': '🫀 Organ Request',
        'districtLbl': 'Select District:', 
        'bloodTypeLbl': 'Blood Group Required:', 
        'organTypeLbl': 'Organ Required:', 
        'ageLbl': 'Patient Age:', 
        'unitLbl': 'Units Required:',
        'searchHospBtn': 'Search Hospitals 🔍', 
        'btnCancel': 'Cancel', 
        'hospTableTitle': 'Nearby Facilities',
        'colName': 'Facility Details', 
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
        'searchNgoBtn': 'Find Nearest NGOs 🤝', 
        'ngoTableTitle': 'Nearest NGOs', 
        'colNgoName': 'Organization', 
        'btnContact': 'Contact', 
        'connectOptionsTitle': 'Connect with NGO'
    },
    'bn': {
        'navHome': 'হোম', 
        'navAdmin': 'অ্যাডমিন ড্যাশবোর্ড', 
        'locTitle': 'অবস্থান পরিষেবা', 
        'locMsg': 'নিকটতম সুবিধাগুলি খুঁজতে আমাদের আপনার অবস্থান প্রয়োজন।', 
        'locBtn': 'অবস্থান সক্ষম করুন',
        'mainTitle': 'হেলথকেয়ার লজিস্টিক পোর্টাল', 
        'mainDesc': 'কাছাকাছি সংস্থানগুলি অবিলম্বে খুঁজে পেতে নীচের একটি বিকল্প নির্বাচন করুন।',
        'card1Title': 'রক্ত / অঙ্গ ব্যাংক', 
        'card1Desc': 'কাছাকাছি রক্তের গ্রুপ বা অঙ্গের প্রাপ্যতা খুঁজুন।',
        'card2Title': 'এনজিও সহায়তা', 
        'card2Desc': 'স্বাস্থ্যসেবা সহায়তার জন্য স্থানীয় এনজিওগুলির সাথে সংযোগ করুন।',
        'bloodFormTitle': 'প্রাপ্যতা অনুসন্ধান করুন', 
        'radioBlood': '🩸 রক্তের অনুরোধ', 
        'radioOrgan': '🫀 অঙ্গের অনুরোধ',
        'districtLbl': 'জেলা নির্বাচন করুন:', 
        'bloodTypeLbl': 'রক্তের গ্রুপ প্রয়োজন:', 
        'organTypeLbl': 'অঙ্গ প্রয়োজন:', 
        'ageLbl': 'রোগীর বয়স:', 
        'unitLbl': 'ইউনিট প্রয়োজন:',
        'searchHospBtn': 'হাসপাতাল খুঁজুন 🔍', 
        'btnCancel': 'বাতিল করুন', 
        'hospTableTitle': 'নিকটতম সুবিধা',
        'colName': 'নাম এবং যোগাযোগ', 
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
        'searchNgoBtn': 'নিকটতম এনজিও খুঁজুন 🤝', 
        'ngoTableTitle': 'নিকটতম এনজিও', 
        'colNgoName': 'সংগঠন', 
        'btnContact': 'যোগাযোগ', 
        'connectOptionsTitle': 'এনজিওর সাথে সংযোগ করুন'
    }
};

// --- TRANSLATION FUNCTION ---
function toggleLanguage() {
    if (currentLang === 'en') {
        currentLang = 'bn';
    } else {
        currentLang = 'en';
    }
    
    const elementsToTranslate = document.querySelectorAll('[data-translate]');
    
    elementsToTranslate.forEach(function(element) {
        const key = element.getAttribute('data-translate');
        if (dictionary[currentLang][key]) {
            element.innerText = dictionary[currentLang][key];
        }
    });
    
    // Stop any playing audio when language switches
    window.speechSynthesis.cancel();
}

// --- AUDIO FUNCTION ---
function speakText(translationKey) {
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    // Get text and remove emojis so it doesn't read them out loud
    let textToSpeak = dictionary[currentLang][translationKey];
    textToSpeak = textToSpeak.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''); 
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Set language code based on current selection
    if (currentLang === 'en') {
        utterance.lang = 'en-IN';
    } else {
        utterance.lang = 'bn-IN';
    }
    
    window.speechSynthesis.speak(utterance);
}

// --- SECTION NAVIGATION LOGIC ---
function showSection(sectionId) {
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
    
    // Remove active class from all sections
    sections.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('active-section');
            element.classList.add('hidden-section');
        }
    });
    
    // Add active class to requested section to trigger CSS animation
    const activeElement = document.getElementById(sectionId);
    if (activeElement) {
        activeElement.classList.remove('hidden-section');
        activeElement.classList.add('active-section');
    }
    
    // Load map only when results table is visible to prevent sizing bugs
    if (sectionId === 'resultsTable') { 
        setTimeout(initMap, 100); 
    }
}

function goHome() { 
    showSection('homeView'); 
}

function toggleSearchType() {
    const isBlood = document.querySelector('input[name="searchType"]:checked').value === 'blood';
    
    const bloodDropdown = document.getElementById('bloodDropdownDiv');
    const organDropdown = document.getElementById('organDropdownDiv');
    const unitsDiv = document.getElementById('unitsDiv');
    
    if (isBlood) {
        bloodDropdown.style.display = 'block';
        organDropdown.style.display = 'none';
        unitsDiv.style.display = 'block';
    } else {
        bloodDropdown.style.display = 'none';
        organDropdown.style.display = 'block';
        unitsDiv.style.display = 'none';
    }
}

// --- CUSTOM TOAST ALERTS ---
function showToast(message, type) {
    const toast = document.getElementById("toast");
    let icon = '';
    
    if (type === 'success') {
        icon = '✅';
    } else {
        icon = '⚠️';
    }
    
    toast.innerHTML = icon + ' ' + message; 
    toast.className = "show " + type;
    
    setTimeout(function() { 
        toast.className = toast.className.replace("show " + type, ""); 
    }, 3000);
}

// --- HAVERSINE MATH (Calculates distance in KM) ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1) return null;
    
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1); 
}

// --- CORE SEARCH ALGORITHM ---
function validateAndSearch() {
    const age = document.getElementById('patientAge').value;
    const isBlood = document.querySelector('input[name="searchType"]:checked').value === 'blood';
    const units = document.getElementById('bloodUnits').value;
    const selectedDistrict = document.getElementById('districtSelect').value;

    // Form validation
    if (age === "" || (isBlood && units === "")) {
        showToast("Please fill in all required fields!", "error");
        return;
    } 
    
    showToast(`Fetching live data for ${selectedDistrict}...`, "success");
    
    // Filter array based on dropdown
    let results = hospitalData.filter(function(hosp) {
        return hosp.district === selectedDistrict;
    });
    
    // If location is enabled, calculate distance and sort
    if (userLat && userLng) {
        results.forEach(function(hosp) { 
            hosp.distance = calculateDistance(userLat, userLng, hosp.lat, hosp.lng); 
        });
        
        results.sort(function(a, b) {
            return a.distance - b.distance;
        });
    }

    renderTableAndMap(results);
    showSection('resultsTable');
}

// --- DYNAMIC RENDERING (Table and Map) ---
function renderTableAndMap(filteredData) {
    const tbody = document.getElementById('dynamicTableBody');
    tbody.innerHTML = ""; 

    // Handle empty results
    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 30px;">No facilities found in this area.</td></tr>`;
        return;
    }

    // Generate rows
    filteredData.forEach(function(hosp) {
        let distHtml = '';
        if (hosp.distance) {
            distHtml = `<br><span class="dist-badge">📍 ${hosp.distance} km away</span>`;
        }
        
        const btnText = dictionary[currentLang]['btnBook'] || 'Book';
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <strong style="color: var(--primary); font-size: 15px;">${hosp.name}</strong><br>
                    <span style="color:var(--text-muted); font-size:13px;">📞 ${hosp.phone}</span> 
                    ${distHtml}
                </td>
                <td style="color: #4b5563;">${hosp.address}</td>
                <td>
                    <button class="btn" style="margin-top:0; padding: 8px 16px; border-radius: 8px;" onclick="bookFacility('${hosp.name}')" data-translate="btnBook">
                        ${btnText}
                    </button>
                </td>
            </tr>
        `;
    });

    // Update map pins dynamically
    if (map) {
        // Clear old pins
        markersArray.forEach(function(marker) {
            marker.setMap(null);
        });
        markersArray = [];
        
        // Recenter map on the first result
        map.setCenter({ lat: filteredData[0].lat, lng: filteredData[0].lng });
        map.setZoom(12);

        // Add new pins
        filteredData.forEach(function(hosp) {
            let newMarker = new google.maps.Marker({ 
                position: { lat: hosp.lat, lng: hosp.lng }, 
                map: map, 
                title: hosp.name 
            });
            markersArray.push(newMarker);
        });
    }
}

// --- GEOLOCATION INTEGRATION ---
function getLocation() {
    const locText = document.getElementById('locText');
    const btn = document.querySelector('.location-banner button');
    
    if (navigator.geolocation) {
        if (currentLang === 'en') {
            locText.innerHTML = "⏳ Fetching your location...";
        } else {
            locText.innerHTML = "⏳ অবস্থান আনা হচ্ছে...";
        }
        
        btn.classList.remove('pulse-btn');
        
        navigator.geolocation.getCurrentPosition(
            function(position) {
                userLat = position.coords.latitude;
                userLng = position.coords.longitude;
                
                if (currentLang === 'en') {
                    locText.innerHTML = `Location captured: Lat ${userLat.toFixed(2)}, Lng ${userLng.toFixed(2)}`;
                } else {
                    locText.innerHTML = `✅ অবস্থান ক্যাপচার করা হয়েছে: অক্ষাংশ ${userLat.toFixed(2)}, দ্রাঘিমাংশ ${userLng.toFixed(2)}`;
                }
                
                locText.style.color = "var(--primary)";
                btn.style.display = "none";
                
                showToast("Location synced. Distance sorting enabled!", "success");
            }, 
            function() { 
                locText.innerHTML = "❌ Location access denied."; 
                locText.style.color = "red";
                showToast("Could not access location.", "error"); 
            }
        );
    }
}

// --- PREPARE DATA FOR NEXT SECTIONS ---
function bookFacility(hospitalName) { 
    selectedHospital = hospitalName; 
    document.getElementById('hospitalNameDisplay').innerText = hospitalName; 
    showSection('paymentScreen'); 
}

function contactNgo(ngoName) { 
    document.getElementById('ngoNameDisplay').innerText = ngoName; 
    showSection('ngoContactScreen'); 
}

function initMap() { 
    if (map) return; 
    
    const initialLocation = { lat: 22.5726, lng: 88.3639 }; // Default to Kolkata center
    map = new google.maps.Map(document.getElementById("map"), { 
        zoom: 11, 
        center: initialLocation 
    }); 
}

// --- RAZORPAY INTEGRATION (WITH USER DATA) ---
function payWithRazorpay() {
    const options = {
        "key": "YOUR_RAZORPAY_KEY_ID_HERE", // IMPORTANT: Paste your rzp_test_ key here!
        "amount": "10000", // Amount in paise
        "currency": "INR",
        "name": "Green Hacks Logistics",
        "description": "Token for " + selectedHospital,
        "theme": { "color": "#059669" },
        "handler": function (response) {
            showToast("Payment Success! ID: " + response.razorpay_payment_id, "success");
            
            setTimeout(function() { 
                alert("Booking Confirmed for " + selectedHospital + "!\nYour receipt ID is " + Math.floor(Math.random() * 100000)); 
                goHome(); 
            }, 2000);
        },
        "prefill": {
            "name": "Samiul Islam", // Restored user details
            "contact": "7601868550"
        }
    };
    
    const rzp = new Razorpay(options);
    
    rzp.on('payment.failed', function (response) {
        showToast("❌ Payment Failed: " + response.error.description, "error");
    });
    
    rzp.open(); 
}

// --- ADMIN DASHBOARD (CHART.JS) ---
function showAdmin() {
    showSection('adminDashboard'); 
    showToast("Admin access granted.", "success");
    
    const ctx = document.getElementById('inventoryChart').getContext('2d');
    
    // Destroy existing chart to prevent overlapping glitches
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, {
