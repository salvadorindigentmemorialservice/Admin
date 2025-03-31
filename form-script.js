document.addEventListener('DOMContentLoaded', function() {
    // Store form data in localStorage
    const formFields = [
        'client-name', 'client-address', 'client-contact', 'client-signature',
        'last-name', 'first-name', 'middle-name', 'address', 'contact',
        'civil-status', 'gender', 'occupation', 'age', 'religion', 
        'birthdate', 'facebook', 'signature'
    ];
    
    // Load any saved data when the page loads
    loadSavedData();
    
    // Save data when input changes
    formFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            element.addEventListener('change', saveFormData);
            element.addEventListener('input', saveFormData);
        }
    });
    
    // Facebook checkbox
    const fbCheckbox = document.getElementById('fb-account');
    if (fbCheckbox) {
        fbCheckbox.addEventListener('change', function() {
            localStorage.setItem('fb-account', this.checked);
            saveFormData();
        });
        
        // Set the checkbox state from localStorage
        const savedState = localStorage.getItem('fb-account');
        if (savedState === 'true') {
            fbCheckbox.checked = true;
        }
    }
    
    // Add beneficiary functionality
    const addBeneficiaryBtn = document.getElementById('add-beneficiary');
    if (addBeneficiaryBtn) {
        addBeneficiaryBtn.addEventListener('click', function() {
            // Different implementation based on which page we're on
            if (window.location.pathname.includes('mobile.html')) {
                addMobileBeneficiary();
            } else {
                addDesktopBeneficiary();
            }
        });
    }
    
    // Print/PDF buttons
    const printButtons = document.querySelectorAll('#print-btn, #print-btn-bottom');
    printButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                saveFormData();
                window.print();
            });
        }
    });
    
    const pdfButtons = document.querySelectorAll('#pdf-btn, #pdf-btn-bottom');
    pdfButtons.forEach(button => {
        if (button) {
            button.addEventListener('click', function() {
                saveFormData();
                generatePDF();
            });
        }
    });
    
    // Paper size selection
    const paperSelect = document.getElementById('paper-select');
    if (paperSelect) {
        paperSelect.addEventListener('change', function() {
            const formContainer = document.getElementById('form-container');
            if (formContainer) {
                formContainer.classList.remove('a4', 'letter', 'legal');
                formContainer.classList.add(this.value);
            }
            localStorage.setItem('paper-size', this.value);
        });
        
        // Set the selected paper size from localStorage
        const savedPaperSize = localStorage.getItem('paper-size');
        if (savedPaperSize) {
            paperSelect.value = savedPaperSize;
            const event = new Event('change');
            paperSelect.dispatchEvent(event);
        }
    }
    
    // Load beneficiary data from localStorage
    loadBeneficiaries();
});

function saveFormData() {
    const formFields = [
        'client-name', 'client-address', 'client-contact', 'client-signature',
        'last-name', 'first-name', 'middle-name', 'address', 'contact',
        'civil-status', 'gender', 'occupation', 'age', 'religion', 
        'birthdate', 'facebook', 'signature'
    ];
    
    formFields.forEach(field => {
        const element = document.getElementById(field);
        if (element) {
            localStorage.setItem(field, element.value);
        }
    });
    
    // Save beneficiary data
    saveBeneficiaries();
}

function loadSavedData() {
    const formFields = [
        'client-name', 'client-address', 'client-contact', 'client-signature',
        'last-name', 'first-name', 'middle-name', 'address', 'contact',
        'civil-status', 'gender', 'occupation', 'age', 'religion', 
        'birthdate', 'facebook', 'signature'
    ];
    
    formFields.forEach(field => {
        const element = document.getElementById(field);
        if (element && localStorage.getItem(field)) {
            element.value = localStorage.getItem(field);
        }
    });
}

function addMobileBeneficiary() {
    const container = document.getElementById('beneficiaries-container');
    if (!container) return;
    
    const entry = document.createElement('div');
    entry.className = 'beneficiary-entry';
    
    entry.innerHTML = `
        <div class="input-group">
            <label>Name:</label>
            <input type="text" class="ben-name">
        </div>
        <div class="two-columns">
            <div class="input-group">
                <label>Age:</label>
                <input type="text" class="ben-age">
            </div>
            <div class="input-group">
                <label>Relation:</label>
                <input type="text" class="ben-relation">
            </div>
        </div>
        <button type="button" class="remove-beneficiary">&times;</button>
    `;
    
    container.appendChild(entry);
    
    const removeButton = entry.querySelector('.remove-beneficiary');
    if (removeButton) {
        removeButton.addEventListener('click', function() {
            container.removeChild(entry);
            saveBeneficiaries();
        });
    }
    
    const inputs = entry.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', saveBeneficiaries);
        input.addEventListener('input', saveBeneficiaries);
    });
}

function addDesktopBeneficiary() {
    const container = document.getElementById('beneficiaries-list');
    if (!container) return;
    
    const line = document.createElement('div');
    line.className = 'beneficiary-line';
    container.appendChild(line);
}

function saveBeneficiaries() {
    const nameInputs = document.querySelectorAll('.ben-name');
    const ageInputs = document.querySelectorAll('.ben-age');
    const relationInputs = document.querySelectorAll('.ben-relation');
    
    const beneficiaries = [];
    
    for (let i = 0; i < nameInputs.length; i++) {
        beneficiaries.push({
            name: nameInputs[i]?.value || '',
            age: ageInputs[i]?.value || '',
            relation: relationInputs[i]?.value || ''
        });
    }
    
    localStorage.setItem('beneficiaries', JSON.stringify(beneficiaries));
}

function loadBeneficiaries() {
    const savedBeneficiaries = localStorage.getItem('beneficiaries');
    if (!savedBeneficiaries) return;
    
    const beneficiaries = JSON.parse(savedBeneficiaries);
    if (!beneficiaries || !Array.isArray(beneficiaries)) return;
    
    // Mobile view
    const benContainer = document.getElementById('beneficiaries-container');
    
    // We need to add more beneficiary entries if needed
    if (benContainer) {
        const mobileBeneficiaries = benContainer.querySelectorAll('.beneficiary-entry');
        
        // If we have more saved beneficiaries than entries, add more entries
        if (beneficiaries.length > mobileBeneficiaries.length) {
            for (let i = mobileBeneficiaries.length; i < beneficiaries.length; i++) {
                addMobileBeneficiary();
            }
        }
        
        // Fill in the data
        const updatedEntries = benContainer.querySelectorAll('.beneficiary-entry');
        beneficiaries.forEach((ben, index) => {
            if (index < updatedEntries.length) {
                const nameInput = updatedEntries[index].querySelector('.ben-name');
                const ageInput = updatedEntries[index].querySelector('.ben-age');
                const relationInput = updatedEntries[index].querySelector('.ben-relation');
                
                if (nameInput) nameInput.value = ben.name || '';
                if (ageInput) ageInput.value = ben.age || '';
                if (relationInput) relationInput.value = ben.relation || '';
            }
        });
    }
    
    // Desktop view - just make sure we have enough lines
    const benList = document.getElementById('beneficiaries-list');
    if (benList) {
        const desktopLines = benList.querySelectorAll('.beneficiary-line');
        
        if (beneficiaries.length > desktopLines.length) {
            for (let i = desktopLines.length; i < beneficiaries.length; i++) {
                addDesktopBeneficiary();
            }
        }
    }
}

function generatePDF() {
    const formContainer = document.getElementById('form-container');
    if (!formContainer) return;
    
    const paperSize = document.getElementById('paper-select').value;
    
    // Configure pdf dimensions based on selected paper size
    let pdfConfig = {
        margin: 5,
        filename: 'salvador-memorial-services-form.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', orientation: 'landscape' }
    };
    
    // Set the format based on paper selection
    if (paperSize === 'a4') {
        pdfConfig.jsPDF.format = 'a4';
    } else if (paperSize === 'letter') {
        pdfConfig.jsPDF.format = 'letter';
    } else if (paperSize === 'legal') {
        pdfConfig.jsPDF.format = [356, 216]; // Legal dimensions in mm
    }
    
    html2pdf().set(pdfConfig).from(formContainer).save();
}