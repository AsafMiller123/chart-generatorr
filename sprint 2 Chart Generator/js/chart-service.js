'use strict'

var gChart;



const initialChart = {
    theme: 'circles',
    title: '',
    style: {
        font: 'Arial',
        fontSize: '45',
        backgroundColor: 'transparent',
    },
    valueType: 'value',
    terms: [
        {
            label: 'Joe',
            value: 50,
            color: '#f44336'
        },
        {
            label: 'Ken',
            value: 50,
            color: '#f22336'
        },
    ],
    creationDate: null,
}



var gCharts = [{
    theme: 'circles',
    title: 'Elections Results',
    style: {
        font: 'Arial',
        fontSize: '45',
        backgroundColor: 'transparent',
    },
    valueType: 'value',
    terms: [
        {
            label: 'Joe',
            value: 50,
            color: '#f44336'
        },
        {
            label: 'Brandon',
            value: 50,
            color: '#4caf50'
        }
    ],
    creationDate: new Date()
},
{
    theme: 'rectangles',
    title: 'TV Rating',
    style: {
        font: 'Arial',
        fontSize: '45',
        backgroundColor: 'transparent',
    },
    valueType: 'percent',
    terms: [
        {
            label: 'Survival',
            value: 40,
            color: '#ffeb3b'
        },
        {
            label: 'Fox News',
            value: 30,
            color: '#cddc39',
        },
        {
            label: 'Friends',
            value: 20,
            color: '#8bc34a',
        }
    ],
    creationDate: new Date()
}];



const initialTerm = {
    label: '',
    value: 0,
    color: `rgb(${100 * Math.random()}, ${120 * Math.random()}, ${180 * Math.random()})`,
}



function getChart(index) {
    var chart = gCharts[index];
    return chart;
}



function addTerm() {
    var term = { ...initialTerm };
    gChart.terms.push(term);
    return term
}



function changeTitle(value) {
    gChart.title = value;
}



function removeTerm(index) {
    gChart.terms = gChart.terms.filter((value, index1) => index1 !== index);
}



function changeType(type) {
    gChart.valueType = type;
}



function changeColor(value, termIndex) {
    gChart.terms[termIndex].color = value;
}



function sortGallery(sortBy) {
    if (sortBy === 'newest') {
        gCharts.sort(function (a, b) {
            return a.creationDate.localeCompare(b.creationDate);
        });
    } else {
        gCharts.sort((first, second) => {
            return first.title.localeCompare(second.title);
        });
    }

    saveToStorage(LOCAL_STORAGE_KEY, gCharts);
}



function changeLabel(label, index) {
    gChart.terms[index].label = label;
}



function changeValue(value, index) {
    gChart.terms[index].value = Number(value);
}



function downloadCanvas(elLink) {
    const data = gCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my-img.jpg'
}



function createNewChart() {
    var newChart = { ...initialChart };
    newChart.creationDate = new Date();

    return newChart;
}



function changeTheme(theme) {
    gChart.theme = theme;
}


function deleteChart() {
    gCharts = gCharts.filter((chart, index1) => index !== index1);
    saveToStorage(LOCAL_STORAGE_KEY, gCharts);
}



function saveChart(index) {
    if (getChart(index)) {
        gCharts[index] = gChart;
    } else {
        gCharts.push(gChart);
    }
    saveToStorage(LOCAL_STORAGE_KEY, gCharts);
}


