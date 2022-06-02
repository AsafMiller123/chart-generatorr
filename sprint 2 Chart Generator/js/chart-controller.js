'use strict'

var gCanvas;
var gCtx;
const CANVAS_HEIGHT = 600;
const CANVAS_WIDTH = 700;
const PERCENT = 'percent';
const VALUE = 'value';
const LOCAL_STORAGE_KEY = 'chartsDB';
const RECTANGLES = 'rectangles';
const CIRCLES = 'circles';



function onInit() {
    renderGallery();
    gCanvas = document.querySelector('canvas');
    gCtx = gCanvas.getContext('2d');
}



function renderGallery() {
    var loadedGlobalCharts = loadFromStorage(LOCAL_STORAGE_KEY);
    var strHtml = '';
    if (loadedGlobalCharts) gCharts = loadedGlobalCharts;
    gCharts.forEach((chart, index) => {
        var date = new Date(chart.creationDate);
        var time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        strHtml += `
            <div class="gallery-item" onclick="onGalleryItemClick(${index})">
                <div class="gallery-item-title">${chart.title}</div>
                <div>Creation Date: ${date.toLocaleDateString()} ${time}</div>
                <button class="btn-remove-chart" id="remove-chart-button-${index}" onclick="onDeleteChart(this,${index})">X</button>
            </div>
        `;
    });
    document.querySelector('.grid-chart-gallery').innerHTML = strHtml;
    gCharts.forEach((chart, index) => {
        document.getElementById(`remove-chart-button-${index}`).addEventListener('click', function (e) {
            gCharts = gCharts.filter((chart, index1) => index !== index1);
            e.stopPropagation();
        }, false);
    })
}



function onGalleryItemClick(index) {
    var chart = getChart(index);
    onOpenSection(chart, index);
}



function onOpenSection(chart, index) {
    gChart = chart;
    renderChartEditor(chart, index);
    document.querySelector('.container').style.display = 'flex';
    document.querySelector('.grid-chart-gallery').style.display = 'none';
    document.querySelector('.btn-new-chart').style.display = 'none';
    document.querySelector('.chart-editor').style.display = 'flex';
}



function renderChartEditor(chart, index) {
    renderEditor(chart, index);
    renderActionsElements();
    renderChart();
}



function renderEditor(chart, index) {
    var htmlStrTopSection = `
        <div class="value-type-container">
        <button class="btn-theme btn-theme-rectangles" onclick="onChangeTheme('${RECTANGLES}')">Rectangles</button>
        <button class="btn-theme btn-theme-circles" onclick="onChangeTheme('${CIRCLES}')">Circles</button>
        <input type="text" class="title-editor" placeholder="Untitled" value="${chart.title}" oninput="onChangeTitle(this.value)">
        <button class="btn-save-chart" onclick="onSaveChart(${index})">Save Chart</button>
            <h1 class="value-type">value-type</h1>
            <button class="btn-grow-percent" onclick="onChangeType('${PERCENT}')">%</button>
            <button class="btn-grow-number" onclick="onChangeType('${VALUE}')">123</button>
        </div>
    `;
    var htmlStrTerms = '';
    chart.terms.forEach((term, index) => {
        htmlStrTerms += renderRow(index, term);
    });
    document.querySelector('.text-editor-top-section').innerHTML = htmlStrTopSection;
    document.querySelector('.terms-container').innerHTML = htmlStrTerms;
    renderSelectedTheme();
    renderValueType();
}



function onAddTerm() {
    var term = addTerm()
    var htmlStr = '';
    var element = document.createElement('div');
    var index = gChart.terms.length - 1;
    htmlStr += renderRow(index, term);
    element.innerHTML = htmlStr;
    document.querySelector('.terms-container').append(element);
    renderActionsElements();
    renderChart();
}



function renderActionsElements() {
    document.querySelector('.btn-add-term').style.display = gChart.terms.length === 4 ? 'none' : 'block';
    document.querySelectorAll('.btn-remove-term').forEach(termElement => {
        termElement.style.display = gChart.terms.length < 3 ? 'none' : 'block';
    });
}



function onChangeLabel(label, index) {
    changeLabel(label, index)
    renderChart();
}



function onChangeValue(value, index) {
    changeValue(value, index)
    renderChart();
}



function onChangeTitle(value) {
    changeTitle(value)
}



function onRemoveTerm(index) {
    removeTerm(index)
    renderActionsElements();
    renderChartEditor(gChart);
}



function renderChart() {
    if (gChart.theme === RECTANGLES) {
        renderChartAsRectangleTheme();
    } else {
        renderChartAsCircleTheme();
    }
}



function renderChartAsRectangleTheme() {
    var sumOfValues = 0;
    var startX = 0;
    gChart.terms.forEach(term => {
        sumOfValues += term.value;
    });
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height)
    gChart.terms.forEach((term) => {
        var fontSize = gChart.style.fontSize;
        var termValueRatio = term.value / sumOfValues;
        var width = gCanvas.width * termValueRatio;
        gCtx.fillRect(startX, 0, width, gCanvas.height);
        gCtx.fillStyle = term.color;
        gCtx.font = `${fontSize}px ${gChart.style.font}`;
        gCtx.fillText(term.label, startX, fontSize, 220);
        var value = gChart.valueType === PERCENT ? `${Math.round(termValueRatio * 100)}%` : term.value;
        gCtx.fillText(value, startX, 100, 80);
        startX += width;
        gCtx.strokeStyle = term.color;
    });
}



function renderChartAsCircleTheme() {
    var sumOfValues = 0;
    var startX = 0;
    gChart.terms.forEach(term => {
        sumOfValues += term.value;
    });
    gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);
    gChart.terms.forEach((term, index) => {
        var fontSize = gChart.style.fontSize;
        var radius = term.value / sumOfValues;
        var width = (gCanvas.width - 270) / 2 * radius;
        startX = 135 + ((gCanvas.width - 270) / (gChart.terms.length - 1)) * index;
        gCtx.beginPath();
        gCtx.lineWidth = "2";
        gCtx.arc(startX, 250, width / 2, 0, 2 * Math.PI);
        gCtx.moveTo(startX, 250);
        gCtx.lineTo(startX, 450);
        gCtx.fillStyle = term.color;
        gCtx.font = `${fontSize}px ${gChart.style.font}`;
        gCtx.fillText(term.label, startX - 50, 500, 120);
        var value = gChart.valueType === PERCENT ? `${Math.round(radius * 100)}%` : term.value;
        gCtx.fillText(value, startX - 30, 550 + 10, 80);
        gCtx.fill();
        gCtx.stroke();
    });
}



function renderRow(index, term) {
    return `
        <div class="term">
            <h1 class="text-editor-row">Term ${index + 1}</h1>
            <div class="inputs">
                <input type="color" oninput="onChangeColor(this.value, ${index})" value="${term.color}">
                <input type="text" placeholder="Name" value="${term.label}" oninput="onChangeLabel(this.value, ${index})">
                <input type="number" placeholder="Value" min="0" value="${term.value}" oninput="onChangeValue(this.value,${index})">
                <button class="btn-remove-term" onclick="onRemoveTerm(${index})">X</button>
            </div>
        </div>
    `
}



function onBackToGallery() {
    document.querySelector('.chart-editor').style.display = 'none';
    document.querySelector('.btn-new-chart').style.display = 'block';
    document.querySelector('.grid-chart-gallery').style.display = 'grid';
    document.querySelector('.container').style.display = 'none';
    renderGallery()
}



function onChangeType(type) {
    changeType(type)
    renderValueType();
    renderChart();
}



function renderValueType() {
    if (gChart.valueType === PERCENT) {
        document.querySelector('.btn-grow-percent').style.backgroundColor = 'blue';
        document.querySelector('.btn-grow-number').style.backgroundColor = 'transparent';
    } else {
        document.querySelector('.btn-grow-number').style.backgroundColor = 'blue';
        document.querySelector('.btn-grow-percent').style.backgroundColor = 'transparent';
    }
}



function onChangeColor(value, termIndex) {
    changeColor(value, termIndex)
    renderChart();
}



function onCreateNewChart() {
    var newChart = createNewChart()
    onOpenSection(newChart);
}



function onSaveChart(index) {
    if (gChart.title === '') {
        gChart.title = `Chart ${gCharts.length}`;
    }
    saveChart(index);
    onBackToGallery();
}



function onSortGallery(sortBy) {
    sortGallery(sortBy);
    renderGallery();
}



function onChangeTheme(theme) {
    changeTheme(theme);
    renderSelectedTheme();
    renderChart();
}



function renderSelectedTheme() {
    // לחזור לקלאס
    if (gChart.theme === RECTANGLES) {
        document.querySelector('.btn-theme-rectangles').style.backgroundColor = 'red';
        document.querySelector('.btn-theme-circles').style.backgroundColor = 'transparent';
    } else {
        document.querySelector('.btn-theme-circles').style.backgroundColor = 'red';
        document.querySelector('.btn-theme-rectangles').style.backgroundColor = 'transparent';
    }
}



function onDeleteChart(element, index) {
    deleteChart()
    renderGallery();
}