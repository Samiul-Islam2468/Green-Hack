console.log("Script loaded successfully!");

// --- Global State Variables ---
let currentLang = 'en';
let selectedHospital = "";
let map;
let chartInstance = null;
let markersArray = [];
let userLat = null;
let userLng = null;

// --- FULL WEST BENGAL HOSPITAL DATABASE (From Image 1 & Previous) ---
const hospitalData = [
    // LIVER (Kolkata)
    { district: "Kolkata", organ: "Liver", name: "Bidhan Nagar Sub Divisional Hospital", address: "Salt Lake, DD 36, beside Bidhannagar, DD Block, Sector 1, Bidhannagar, Kolkata", phone: "N/A", lat: 22.5831, lng: 88.4026 },
    { district: "Kolkata", organ: "Liver", name: "Infectious Diseases & Beleghata General Hospital", address: "57, Beleghata Main Rd, Subhas Sarobar Park, Phoolbagan, Beleghata, Kolkata", phone: "033 2303 2248", lat: 22.5694, lng: 88.3961 },
    { district: "Kolkata", organ: "Liver", name: "Institute of Post Graduate Medical Education & Research and SSKM Hospital", address: "SSKM Hospital Rd, Bhowanipore, Kolkata", phone: "033 2204 1100", lat: 22.5393, lng: 88.3444 },
    { district: "Kolkata", organ: "Liver", name: "Nil Ratan Sarkar Medical College and Hospital", address: "138, Acharya Jagdish Chandra Bose Rd, Sealdah, Raja Bazar, Kolkata", phone: "N/A", lat: 22.5658, lng: 88.3713 },
    { district: "Kolkata", organ: "Liver", name: "R G Kar Medical College & Hospital", address: "1, Khudiram Bose Sarani, Bidhan Sarani, Shyam Bazar, Kolkata", phone: "033 2555 7656", lat: 22.5937, lng: 88.3714 },
    { district: "Kolkata", organ: "Liver", name: "Calcutta National Medical College & Hospital", address: "32, Gorachand Rd, Beniapukur, Kolkata", phone: "N/A", lat: 22.5447, lng: 88.3744 },
    { district: "Kolkata", organ: "Liver", name: "Apollo Multispeciality Hospitals", address: "58, Canal Circular Rd, Kadapara, Phoolbagan, Kankurgachi, Kolkata", phone: "080 6297 2764", lat: 22.5754, lng: 88.4026 },
    { district: "Kolkata", organ: "Liver", name: "Woodlands Multispeciality Hospital Private Limited (WMHL)", address: "8/5, Alipore Rd, Alipore, Kolkata", phone: "033 4033 7000", lat: 22.5284, lng: 88.3291 },
    { district: "Kolkata", organ: "Liver", name: "Manipal Hospitals Broadway", address: "JC-16 & 17, No. 3A, Broadway Rd, opp. to Stadium Gate, Sector 3, Bidhannagar, Kolkata", phone: "033 6907 0000", lat: 22.5684, lng: 88.4111 },
    { district: "Kolkata", organ: "Liver", name: "Desun Hospital", address: "Desun More, 720, Eastern Metropolitan Bypass, Golpark, Sector I, Kasba, Kolkata", phone: "090517 15171", lat: 22.5188, lng: 88.4024 },
    
    // KIDNEY (Kolkata)
    { district: "Kolkata", organ: "Kidney", name: "ILS Hospitals, Salt lake", address: "DD 6, Salt Lake Bypass, DD Block, Sector 1, Bidhannagar, Kolkata", phone: "033 4020 6500", lat: 22.5855, lng: 88.4023 },
    { district: "Kolkata", organ: "Kidney", name: "Charnock Hospital - Super Specialty Hospital", address: "BMC 195, Biswa Bangla Sarani, Dhalipara, Tegharia, Newtown, Kolkata", phone: "033 4050 0500", lat: 22.6288, lng: 88.4443 },
    { district: "Kolkata", organ: "Kidney", name: "Ruby General Hospital", address: "576, Anandapur Main Rd, Golpark, Sector I, Kasba, Kolkata", phone: "033 6601 1800", lat: 22.5132, lng: 88.4031 },
    { district: "Kolkata", organ: "Kidney", name: "B.P. Poddar Hospital & Medical Research Limited", address: "71/1, Humayun Kabir Sarani, Block G, New Alipore, Kolkata", phone: "085850 35846", lat: 22.5113, lng: 88.3308 },
    { district: "Kolkata", organ: "Kidney", name: "Fortis Hospital and Kidney Institute, Rash Behari", address: "11A, Rash Behari Ave, Dover Terrace, Gariahat, Kolkata", phone: "098730 30996", lat: 22.5186, lng: 88.3662 },
    { district: "Kolkata", organ: "Kidney", name: "Sambhunath Pandit Hospital", address: "11, lala lajput rai road, Gaza Park, Sreepally, Bhowanipore, Kolkata", phone: "N/A", lat: 22.5398, lng: 88.3456 },
    { district: "Kolkata", organ: "Kidney", name: "Chittaranjan Seva Sadan Hospital", address: "83, Shyama Prasad Mukherjee Rd, Bakul Bagan, Bhowanipore, Kolkata", phone: "033 2475 4584", lat: 22.5222, lng: 88.3473 },
    { district: "Kolkata", organ: "Kidney", name: "Kolkata Police Hospital", address: "Beninandan St, Bhowanipore, Kolkata", phone: "033 2455 2064", lat: 22.5356, lng: 88.3441 },

    // HEART (Kolkata)
    { district: "Kolkata", organ: "Heart", name: "Vidyasagar State General Hospital", address: "4, Brahmo Samaj Rd, Vidyasagar Park, Behala, Kolkata", phone: "033 2397 1591", lat: 22.4939, lng: 88.3181 },
    { district: "Kolkata", organ: "Heart", name: "M R Bangur Hospital", address: "249, Deshpran Sasmal Rd, Netajinagar, Rajendra Prasad Colony, Tollygunge, Kolkata", phone: "033 2473 3354", lat: 22.4965, lng: 88.3455 },
    { district: "Kolkata", organ: "Heart", name: "B. R. Singh Hospital (Eastern Railway)", address: "Parikshit Roy Ln, Sealdah, Raja Bazar, Kolkata", phone: "033 2350 4075", lat: 22.5686, lng: 88.3732 },
    { district: "Kolkata", organ: "Heart", name: "Kolkata Port Trust Hospital", address: "block a, 1, Diamond Harbour Rd, Uttar Raypur, New Alipore, Kolkata", phone: "033 2401 4503", lat: 22.5218, lng: 88.3248 },
    { district: "Kolkata", organ: "Heart", name: "CMRI Hospital | CK Birla Hospitals", address: "7, 2, Diamond Harbour Rd, New Alipore, Kolkata", phone: "080 6213 6596", lat: 22.5330, lng: 88.3303 },
    { district: "Kolkata", organ: "Heart", name: "IRIS MULTISPECIALITY HOSPITAL", address: "82/1, Raja Subodh Chandra Mallick Rd, Vidyasagar Colony, Ganguly Bagan, Kolkata", phone: "089295 79509", lat: 22.4764, lng: 88.3846 },
    { district: "Kolkata", organ: "Heart", name: "Manipal Hospitals - Dhakuria", address: "C.I.T Scheme, Gariahat Rd, Dhakuria, LXXII Block A, P-4 & 5, Kolkata", phone: "033 6907 0000", lat: 22.5140, lng: 88.3719 },

    // PREVIOUS OTHER DISTRICTS
    { district: "Howrah", name: "Howrah District Hospital", address: "Howrah Railway Station, West Bengal", phone: "033 2641 1227", lat: 22.5833, lng: 88.3333 },
    { district: "Howrah", name: "Suraksha Home Blood Centre", address: "30, 2nd Ln, Pilkhana, Salkia", phone: "099030 30131", lat: 22.5986, lng: 88.3496 },
    { district: "Siliguri", name: "Siliguri Terai Lions Blood Bank", address: "Sevoke Road Jyothi nagar, Siliguri", phone: "090931 00755", lat: 26.7271, lng: 88.4316 },
    { district: "Siliguri", name: "Neotia Getwel Specialty Hospital", address: "Uttorayon Twp, Matigara, Siliguri", phone: "0353 660 3000", lat: 26.7258, lng: 88.3912 }
];

// --- FULL NGO DATABASE (From Image 2) ---
const ngoData = [
    // KOLKATA
    { district: "Kolkata", name: "Narayan Seva Sansthan", address: "216, Bangur Ave, Block B, Block A, Lake Town, Kolkata", phone: "095299 20097" },
    { district: "Kolkata", name: "Anudip Foundation for Social Welfare", address: "8th Floor, Mira Tower, Plot -27, DN Block, Sector V, Bidhannagar, Kolkata", phone: "N/A" },
    { district: "Kolkata", name: "Hat Baralei Bondhu NGO", address: "BK 216, BK Block, Sector II, Bidhannagar, Kolkata", phone: "070014 64389" },
    { district: "Kolkata", name: "CRY - Child Rights And You | NGO in Kolkata", address: "152, New No. 8, 2nd St, Gitanjali Park, Kalikapur, Haltu, Kolkata", phone: "091159 11500" },
    { district: "Kolkata", name: "Jagorani NGO", address: "G-1, SS Heights, AC-130, Prafulla Kanan Rd, E, Rabindrapally, Kestopur, Kolkata", phone: "081001 55055" },
    { district: "Kolkata", name: "Helpp", address: "86, Nalta Mahajati Rd, Nalta, Rajbari, Dum Dum, Kolkata", phone: "091233 48301" },
    { district: "Kolkata", name: "Hi Charitable Foundation - NGO", address: "11B, NGO Office, 1, Gorapada Sarkar Ln, Daspara, Ultadanga, Kolkata", phone: "091631 95158" },
    { district: "Kolkata", name: "Touch Of Earth NGO", address: "121, Gorakshabasi Rd, opposite to rajat bakery, Pratapaditya Nagar, Nagerbazar, Kolkata", phone: "090387 59422" },
    
    // BANKURA (Bakura)
    { district: "Bankura", name: "Gandhi Vichar Parisad", address: "63Q7+JFC, School Danga, Bankura, West Bengal 722101", phone: "03242 250 664" },
    { district: "Bankura", name: "Rural Development Society", address: "63Q6+CG4, Central Church Compound, College Road, Bankura", phone: "03242 250 001" },
    { district: "Bankura", name: "Bankura Life Foundation", address: "38Q7+44M, Gopalpur, Shyamsundarpur, Bishnupur, West Bengal", phone: "089679 06455" },
    { district: "Bankura", name: "Bankura Anusilan Samity", address: "63MG+G6R, Kuchkuchia Rd, Bankura, West Bengal 722101", phone: "N/A" },

    // MEDINIPUR (Midnapore)
    { district: "Medinipur", name: "Manabik Samsthan", address: "N-007, Mirbazar, Nabinabag, Midnapore, West Bengal", phone: "094750 28182" },
    { district: "Medinipur", name: "Midnapur Marwari Sammelan", address: "Rangamati Mal, Jana Godayun Rd, Midnapore, West Bengal", phone: "N/A" },
    { district: "Medinipur", name: "RADIANT THE HELPING SQUAD", address: "Ward Number 10, near Balaji Temple, Dhekeya, Malancha, Kharagpur", phone: "090464 20677" },
    { district: "Medinipur", name: "Dishari Foundation", address: "Church Road, Netaji Nagar, Shekhpura, Midnapore, West Bengal", phone: "097496 28182" },
    { district: "Medinipur", name: "Sarada Kalyan Bhandar", address: "Sector - F/1, Saratpally, West Bengal 721101", phone: "089001 56422" },
    { district: "Medinipur", name: "Midnapore Peace Foundation", address: "Paramedical Surjonogor, Rangamati, Midnapore, West Bengal", phone: "095644 70827" }
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
        // New NGO Dropdown Options (English)
        'optAdvocacy': 'Advocacy & Policy Influence',
        'optRelief': 'Humanitarian Relief',
        'optCommDev': 'Community Development & Empowerment',
        'optResearch': 'Research & Information Sharing',
        'optEnv': 'Environmental Protection',
        'optBridging': 'Bridging Gaps',
        'optOthers': 'Others',
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
        // New NGO Dropdown Options (Bengali)
        'optAdvocacy': 'অ্যাডভোকেসি এবং পলিসি প্রভাব',
        'optRelief': 'মানবিক ত্রাণ',
        'optCommDev': 'কমিউনিটি উন্নয়ন ও ক্ষমতায়ন',
        'optResearch': 'গবেষণা ও তথ্য আদান-প্রদান',
        'optEnv': 'পরিবেশ সুরক্ষা',
        'optBridging': 'ব্যবধান দূরীকরণ',
        'optOthers': 'অন্যান্য',
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
    
    window.speechSynthesis.cancel();
}

// --- AUDIO FUNCTION ---
function speakText(translationKey) {
    window.speechSynthesis.cancel();
    
    let textToSpeak = dictionary[currentLang][translationKey];
    textToSpeak = textToSpeak.replace(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g, ''); 
    
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
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
    
    sections.forEach(function(id) {
        const element = document.getElementById(id);
        if (element) {
            element.classList.remove('active-section');
            element.classList.add('hidden-section');
        }
    });
    
    const activeElement = document.getElementById(sectionId);
    if (activeElement) {
        activeElement.classList.remove('hidden-section');
        activeElement.classList.add('active-section');
    }
    
    if (sectionId === 'resultsTable') { 
        setTimeout(initMap, 100); 
    }
}

function goHome() { 
    showSection('homeView'); 
}

function toggleSearchType() {
    const searchTypeElement = document.querySelector('input[name="searchType"]:checked');
    if (!searchTypeElement) return;

    const isBlood = searchTypeElement.value === 'blood';
    
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
    if(!toast) return;

    let icon = (type === 'success') ? '✅' : '⚠️';
    toast.innerHTML = icon + ' ' + message; 
    toast.className = "show " + type;
    
    setTimeout(function() { 
        toast.className = toast.className.replace("show " + type, ""); 
    }, 3000);
}

// --- HAVERSINE MATH (Calculates distance in KM) ---
function calculateDistance(lat1, lon1, lat2, lon2) {
    if (!lat1 || !lon1) return null;
    
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) + 
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon/2) * Math.sin(dLon/2);
        
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    return distance.toFixed(1); 
}

// --- CORE SEARCH ALGORITHM (HOSPITALS) ---
function validateAndSearch() {
    const ageElem = document.getElementById('patientAge');
    const bloodUnitsElem = document.getElementById('bloodUnits');
    const districtSelectElem = document.getElementById('districtSelect');
    const searchTypeElem = document.querySelector('input[name="searchType"]:checked');
    const organSelectElem = document.getElementById('organGrp');

    if (!ageElem || !bloodUnitsElem || !districtSelectElem || !searchTypeElem) return;

    const age = ageElem.value;
    const isBlood = searchTypeElem.value === 'blood';
    const units = bloodUnitsElem.value;
    const selectedDistrict = districtSelectElem.value;
    const selectedOrgan = organSelectElem.value;

    if (age === "" || (isBlood && units === "")) {
        showToast("Please fill in all required fields!", "error");
        return;
    } 
    
    showToast(`Fetching live data for ${selectedDistrict}...`, "success");
    
    let results = hospitalData.filter(function(hosp) {
        let matchDistrict = hosp.district === selectedDistrict;
        // If it's an organ search, only show hospitals that handle that organ (if specified in our data)
        let matchOrgan = isBlood ? true : (!hosp.organ || hosp.organ === selectedOrgan);
        return matchDistrict && matchOrgan;
    });
    
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

// --- NGO SEARCH ALGORITHM ---
function validateAndSearchNgo() {
    const districtSelectElem = document.getElementById('ngoDistrictSelect');
    if (!districtSelectElem) return;

    const selectedDistrict = districtSelectElem.value;
    showToast(`Fetching NGOs in ${selectedDistrict}...`, "success");

    let results = ngoData.filter(function(ngo) {
        return ngo.district === selectedDistrict;
    });

    renderNgoTable(results);
    showSection('ngoResultsTable');
}

// --- DYNAMIC RENDERING (Hospitals) ---
function renderTableAndMap(filteredData) {
    const tbody = document.getElementById('dynamicTableBody');
    if (!tbody) return;

    tbody.innerHTML = ""; 

    if (filteredData.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 30px;">No facilities found matching your criteria in this area.</td></tr>`;
        
        // Clear map if no results
        if (map && typeof google !== 'undefined') {
            markersArray.forEach(marker => marker.setMap(null));
            markersArray = [];
        }
        return;
    }

    filteredData.forEach(function(hosp) {
        let distHtml = '';
        if (hosp.distance) {
            distHtml = `<br><span class="dist-badge">📍 ${hosp.distance} km away</span>`;
        }
        
        const phoneTxt = hosp.phone !== "N/A" ? `📞 ${hosp.phone}` : "No contact available";
        const btnText = dictionary[currentLang]['btnBook'] || 'Book';
        
        tbody.innerHTML += `
            <tr>
                <td>
                    <strong style="color: var(--primary); font-size: 15px;">${hosp.name}</strong><br>
                    <span style="color:var(--text-muted); font-size:13px;">${phoneTxt}</span> 
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

    if (map && typeof google !== 'undefined') {
        markersArray.forEach(function(marker) {
            marker.setMap(null);
        });
        markersArray = [];
        
        map.setCenter({ lat: filteredData[0].lat, lng: filteredData[0].lng });
        map.setZoom(12);

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

// --- DYNAMIC RENDERING (NGOs) ---
function renderNgoTable(data) {
    const tbody = document.getElementById('dynamicNgoTableBody');
    if (!tbody) return;

    tbody.innerHTML = "";
    
    if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="3" style="text-align:center; padding: 30px;">No NGOs found in this district.</td></tr>`;
        return;
    }

    data.forEach(function(ngo) {
        const phoneTxt = ngo.phone !== "N/A" ? `📞 ${ngo.phone}` : "No contact available";
        const btnText = dictionary[currentLang]['btnContact'] || 'Contact';

        tbody.innerHTML += `
            <tr>
                <td>
                    <strong style="color: var(--primary); font-size: 15px;">${ngo.name}</strong><br>
                    <span style="color:var(--text-muted); font-size:13px;">${phoneTxt}</span>
                </td>
                <td style="color: #4b5563;">${ngo.address}</td>
                <td>
                    <button class="btn" style="margin-top:0; padding: 8px 15px; border-radius: 8px;" onclick="contactNgo('${ngo.name}')" data-translate="btnContact">
                        ${btnText}
                    </button>
                </td>
            </tr>
        `;
    });
}

// --- PREPARE DATA FOR NEXT SECTIONS ---
function bookFacility(hospitalName) { 
    selectedHospital = hospitalName; 
    const display = document.getElementById('hospitalNameDisplay');
    if (display) display.innerText = hospitalName; 
    showSection('paymentScreen'); 
}

function contactNgo(ngoName) { 
    const display = document.getElementById('ngoNameDisplay');
    if (display) display.innerText = ngoName; 
    showSection('ngoContactScreen'); 
}

function initMap() { 
    if (map || typeof google === 'undefined') return; 
    
    const initialLocation = { lat: 22.5726, lng: 88.3639 };
    const mapElement = document.getElementById("map");
    if (mapElement) {
        map = new google.maps.Map(mapElement, { 
            zoom: 11, 
            center: initialLocation 
        }); 
    }
}

// --- ADMIN DASHBOARD (CHART.JS) ---
function showAdmin() {
    showSection('adminDashboard'); 
    showToast("Admin access granted.", "success");
    
    const canvas = document.getElementById('inventoryChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const ctx = canvas.getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }
    
    chartInstance = new Chart(ctx, { 
        type: 'bar', 
        data: { 
            labels: ['A+', 'O+', 'B+', 'AB+', 'Kidney', 'Liver'], 
            datasets: [{ 
                label: 'Current Availability', 
                data: [45, 60, 25, 10, 5, 2], 
                backgroundColor: ['#10b981', '#10b981', '#10b981', '#10b981', '#0f766e', '#0f766e'], 
                borderRadius: 8 
            }] 
        }, 
        options: { 
            responsive: true, 
            plugins: { 
                legend: { position: 'bottom' } 
            } 
        } 
    });
}

// --- NEW & ROBUST GEOLOCATION FUNCTION (NATIVE READY) ---
async function getLocation() {
    const locText = document.getElementById('locText');
    const btn = document.querySelector('.location-banner button');
    
    if (locText) {
        if (currentLang === 'en') {
            locText.innerHTML = "⏳ Fetching your location...";
        } else {
            locText.innerHTML = "⏳ অবস্থান আনা হচ্ছে...";
        }
        locText.style.color = "var(--text-muted)";
    }
    if (btn) btn.classList.remove('pulse-btn');

    try {
        // 1. Check if running inside the Native Android App (Capacitor)
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Geolocation) {
            
            // 2. Force the Native Android Permission Request
            const permissionStatus = await window.Capacitor.Plugins.Geolocation.requestPermissions();
            
            if (permissionStatus.location !== 'granted') {
                throw new Error("User denied native permission");
            }

            // 3. Get the native coordinates
            const position = await window.Capacitor.Plugins.Geolocation.getCurrentPosition({
                enableHighAccuracy: true,
                timeout: 10000
            });
            
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;

        } else {
            // Fallback for normal web browser testing
            if (!navigator.geolocation) throw new Error("Browser doesn't support geolocation");
            
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, { enableHighAccuracy: true });
            });
            userLat = position.coords.latitude;
            userLng = position.coords.longitude;
        }

        // Success Update
        if (locText) {
            if (currentLang === 'en') {
                locText.innerHTML = `✅ Location captured: Lat ${userLat.toFixed(2)}, Lng ${userLng.toFixed(2)}`;
            } else {
                locText.innerHTML = `✅ অবস্থান ক্যাপচার করা হয়েছে: অক্ষাংশ ${userLat.toFixed(2)}, দ্রাঘিমাংশ ${userLng.toFixed(2)}`;
            }
            locText.style.color = "var(--primary)";
        }
        if (btn) btn.style.display = "none";
        showToast("Location synced. Distance sorting enabled!", "success");

    } catch (error) {
        console.error("Location Error:", error);
        if (locText) {
            locText.innerHTML = "❌ Location access denied."; 
            locText.style.color = "red";
        }
        if (btn) btn.classList.add('pulse-btn');
        showToast("Permission denied. Check Android Settings.", "error");
    }
}

// --- CAPACITOR NATIVE RAZORPAY INTEGRATION ---
async function payWithRazorpay() {
    const options = {
        "key": "rzp_live_SJiSy0USTt3wUl", // Change this back to your key!
        "amount": "10000",
        "currency": "INR",
        "name": "Green Hacks Logistics",
        "description": "Token for " + selectedHospital,
        "theme": { "color": "#059669" },
        "prefill": {
            "name": "Samiul Islam",
            "contact": "7601868550"
        }
    };
    
    try {
        // Check if Capacitor is available (App Mode)
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Checkout) {
            const data = await window.Capacitor.Plugins.Checkout.open(options);
            
            showToast("Payment Success! ID: " + data.response.razorpay_payment_id, "success");
            
            setTimeout(function() { 
                alert("Booking Confirmed for " + selectedHospital + "!\nYour receipt ID is " + Math.floor(Math.random() * 100000)); 
                goHome(); 
            }, 2000);
        } else {
            // Fallback for Browser Mode
            if (typeof Razorpay !== 'undefined') {
                options.handler = function (response) {
                    showToast("Payment Success! ID: " + response.razorpay_payment_id, "success");
                    
                    setTimeout(function() { 
                        alert("Booking Confirmed for " + selectedHospital + "!\nYour receipt ID is " + Math.floor(Math.random() * 100000)); 
                        goHome(); 
                    }, 2000);
                };
                
                const rzp = new Razorpay(options);
                
                rzp.on('payment.failed', function (response) {
                    showToast("❌ Payment Failed: " + response.error.description, "error");
                });
                
                rzp.open(); 
            } else {
                showToast("Razorpay failed to load.", "error");
            }
        }
    } catch (error) {
        console.error("Payment Failed or Cancelled:", error);
        showToast("❌ Payment Failed or Cancelled.", "error");
    }
}