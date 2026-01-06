/**
 * PDF to PowerPoint Converter - Frontend Application
 * Clean and Modern Implementation
 */

const API_BASE = window.location.origin;

// State
let currentJobId = null;
let selectedFile = null;
let pollInterval = null;
let selectedMode = 'precision';  // 'precision' or 'safeguard'

// DOM Elements
const uploadSection = document.getElementById('upload-section');
const processingSection = document.getElementById('processing-section');
const resultSection = document.getElementById('result-section');

const uploadZone = document.getElementById('upload-zone');
const fileInput = document.getElementById('file-input');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const removeFileBtn = document.getElementById('remove-file');
const modeSelector = document.getElementById('mode-selector');
const convertBtn = document.getElementById('convert-btn');

const progressFill = document.getElementById('progress-fill');
const progressText = document.getElementById('progress-text');
const processingTitle = document.getElementById('processing-title');
const processingMessage = document.getElementById('processing-message');

const resultFilename = document.getElementById('result-filename');
const downloadBtn = document.getElementById('download-btn');
const newConvertBtn = document.getElementById('new-convert-btn');

// Steps
const steps = {
    upload: document.getElementById('step-upload'),
    analyze: document.getElementById('step-analyze'),
    generate: document.getElementById('step-generate'),
    complete: document.getElementById('step-complete')
};

// ===== Event Listeners =====

// Upload Zone Click
uploadZone.addEventListener('click', () => fileInput.click());

// File Input Change
fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileSelect(e.target.files[0]);
    }
});

// Drag & Drop
uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('drag-over');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('drag-over');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('drag-over');

    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type === 'application/pdf') {
        handleFileSelect(files[0]);
    } else {
        showError('Please drop a PDF file');
    }
});

// Remove File
removeFileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

// Mode Selection
document.querySelectorAll('input[name="conversion-mode"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
        selectedMode = e.target.value;
    });
});

// Convert Button
convertBtn.addEventListener('click', startConversion);

// Download Button
downloadBtn.addEventListener('click', downloadResult);

// New Convert Button
newConvertBtn.addEventListener('click', resetAll);

// ===== Functions =====

function handleFileSelect(file) {
    if (file.type !== 'application/pdf') {
        showError('Please select a PDF file');
        return;
    }

    selectedFile = file;
    fileName.textContent = file.name;
    uploadZone.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    modeSelector.classList.remove('hidden');
    convertBtn.classList.remove('hidden');
}

function resetUpload() {
    selectedFile = null;
    fileInput.value = '';
    fileName.textContent = '';
    uploadZone.classList.remove('hidden');
    fileInfo.classList.add('hidden');
    modeSelector.classList.add('hidden');
    convertBtn.classList.add('hidden');

    // Reset mode to default
    selectedMode = 'precision';
    document.querySelector('input[name="conversion-mode"][value="precision"]').checked = true;
}

async function startConversion() {
    if (!selectedFile) return;

    try {
        // Show processing section
        uploadSection.classList.add('hidden');
        processingSection.classList.remove('hidden');

        updateStep('upload');
        updateProgress(5, 'Uploading PDF...');

        // Upload the file with mode
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('mode', selectedMode);

        const uploadResponse = await fetch(`${API_BASE}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!uploadResponse.ok) {
            throw new Error('Upload failed');
        }

        const uploadData = await uploadResponse.json();
        currentJobId = uploadData.job_id;

        updateProgress(10, 'Upload complete. Starting processing...');
        completeStep('upload');
        updateStep('analyze');

        // Start processing with mode
        const processResponse = await fetch(`${API_BASE}/api/process/${currentJobId}?mode=${selectedMode}`, {
            method: 'POST'
        });

        if (!processResponse.ok) {
            throw new Error('Failed to start processing');
        }

        // Start polling for status
        startPolling();

    } catch (error) {
        showError(error.message);
        resetAll();
    }
}

function startPolling() {
    pollInterval = setInterval(async () => {
        try {
            const response = await fetch(`${API_BASE}/api/status/${currentJobId}`);

            if (!response.ok) {
                throw new Error('Failed to get status');
            }

            const status = await response.json();
            handleStatusUpdate(status);

        } catch (error) {
            console.error('Polling error:', error);
        }
    }, 1000);
}

function stopPolling() {
    if (pollInterval) {
        clearInterval(pollInterval);
        pollInterval = null;
    }
}

function handleStatusUpdate(status) {
    updateProgress(status.progress, status.message);

    // Update steps based on status
    switch (status.status) {
        case 'processing':
            updateStep('analyze');
            break;
        case 'analyzing':
            completeStep('upload');
            updateStep('analyze');
            break;
        case 'generating':
            completeStep('analyze');
            updateStep('generate');
            break;
        case 'completed':
            stopPolling();
            completeStep('generate');
            completeStep('complete');
            showResult(status);
            break;
        case 'error':
            stopPolling();
            showError(status.message);
            break;
    }
}

function updateProgress(percent, message) {
    progressFill.style.width = `${percent}%`;
    progressText.textContent = `${Math.round(percent)}%`;
    if (message) {
        processingMessage.textContent = message;
    }
}

function updateStep(stepId) {
    Object.values(steps).forEach(step => step.classList.remove('active'));
    if (steps[stepId]) {
        steps[stepId].classList.add('active');
    }
}

function completeStep(stepId) {
    if (steps[stepId]) {
        steps[stepId].classList.add('completed');
    }
}

function showResult(status) {
    processingSection.classList.add('hidden');
    resultSection.classList.remove('hidden');
    resultFilename.textContent = status.output_filename || 'presentation.pptx';
}

async function downloadResult() {
    if (!currentJobId) return;

    // Simply open the download URL directly - browser handles the download
    window.location.href = `${API_BASE}/api/download/${currentJobId}`;
}

function resetAll() {
    stopPolling();
    currentJobId = null;
    selectedFile = null;

    // Reset UI
    uploadSection.classList.remove('hidden');
    processingSection.classList.add('hidden');
    resultSection.classList.add('hidden');

    resetUpload();

    // Reset progress
    updateProgress(0, 'Initializing...');

    // Reset steps
    Object.values(steps).forEach(step => {
        step.classList.remove('active', 'completed');
    });
}

function showError(message) {
    alert(`Error: ${message}`);
    console.error(message);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    console.log('PDF to PowerPoint Converter initialized');
});
