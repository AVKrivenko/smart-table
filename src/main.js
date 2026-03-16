import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initPagination} from "./components/pagination.js"
import {initTable} from "./components/table.js";
import {initSorting} from "./components/sorting.js";  // ← ДОБАВЛЕНО!
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";
// Исходные данные используемые в render()
const {data, ...indexes} = initData(sourceData);

/**
 * Сбор и обработка полей из таблицы
 * @returns {Object}
 */
function collectState() {
    const state = processFormData(new FormData(sampleTable.container));
    const rowsPerPage = parseInt(state.rowsPerPage);
    const page = parseInt(state.page ?? 1);

    return {
        ...state,
        rowsPerPage,
        page
    };
}

/**
 * Перерисовка состояния таблицы при любых изменениях
 * @param {HTMLButtonElement?} action
 */
function render(action) {
    console.log('render вызван с action:', action);
    
    let state = collectState();
    console.log('state:', state);
    
    let result = [...data];
    console.log('данных до обработки:', result.length);
        if (typeof applySearch === 'function') {
        result = applySearch(result, state, action);
    }
    // Применяем сортировку (СНАЧАЛА!)
    if (typeof applySorting === 'function') {
        result = applySorting(result, state, action);
        console.log('после сортировки:', result.length);
    }
     if (typeof applyFiltering === 'function') {
        result = applyFiltering(result, state, action);
        console.log('после сортировки:', result.length);
    }
    // Применяем пагинацию (ПОТОМ!)
    if (typeof applyPagination === 'function') {
        result = applyPagination(result, state, action);
        console.log('после пагинации:', result.length);
    }

    sampleTable.render(result);
    console.log('рендер завершен');
}

const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search','header','filter'],
    after:  ['pagination'] 
}, render);

// @todo: инициализация
const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const label = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        label.textContent = page;
        return el;
    }
); 

// Проверяем, что элементы сортировки существуют
console.log('sampleTable.header:', sampleTable.header);
console.log('sortByDate:', sampleTable.header?.elements?.sortByDate);
console.log('sortByTotal:', sampleTable.header?.elements?.sortByTotal);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(sampleTable.filter.elements, {    // передаём элементы фильтра
    searchBySeller: indexes.sellers                                    // для элемента с именем searchBySeller устанавливаем массив продавцов
});
const applySearch = initSearching('search'); 
const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

render();