import './fonts/ys-display/fonts.css'
import './style.css'

import {data as sourceData} from "./data/dataset_1.js";

import {initData} from "./data.js";
import {processFormData} from "./lib/utils.js";
import {initPagination} from "./components/pagination.js"
import {initTable} from "./components/table.js";
import {initSorting} from "./components/sorting.js";
import {initFiltering} from "./components/filtering.js";
import {initSearching} from "./components/searching.js";

const API = initData(sourceData);

// Объявляем переменные, которые будут использоваться везде
let sampleTable;
let applyPagination;
let updatePagination;
let applySearch;
let applySorting;
let applyFiltering;
let updateIndexes;

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
async function render(action) {
    let state = collectState();
    let query = {};

    // ПРИМЕНЯЕМ ПОИСК
    if (typeof applySearch === 'function') {
        query = applySearch(query, state, action);
    }
      
    // ПРИМЕНЯЕМ ПАГИНАЦИЮ
    if (typeof applyPagination === 'function') {
        query = applyPagination(query, state, action);
    }
        // ПРИМЕНЯЕМ СОРТИРОВКУ
    if (typeof applySorting === 'function') {
        query = applySorting(query, state, action);
    }
    
        // ПРИМЕНЯЕМ ФИЛЬТРАЦИЮ
    if (typeof applyFiltering === 'function') {
        query = applyFiltering(query, state, action);
    }
    
    const { total, items } = await API.getRecords(query);

    if (typeof updatePagination === 'function') {
        updatePagination(total, query);
    }
    
    sampleTable.render(items);
    console.log('рендер завершен');
}

    // СОЗДАЕМ ТАБЛИЦУ
sampleTable = initTable({
        tableTemplate: 'table',
        rowTemplate: 'row',
        before: ['search','header','filter'],
        after: ['pagination'] 
    }, render);

// ИНИЦИАЛИЗИРУЕМ КОМПОНЕНТЫ, КОТОРЫЕ НЕ ЗАВИСЯТ ОТ ИНДЕКСОВ
const pagination = initPagination(
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

applyPagination = pagination.applyPagination;
updatePagination = pagination.updatePagination;

applySearch = initSearching('search');

applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

// ВРЕМЕННО СОЗДАЕМ ЗАГЛУШКУ ДЛЯ ФИЛЬТРАЦИИ
applyFiltering = (query) => query; // временная функция, которая ничего не делает
updateIndexes = () => {}; // временная функция

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// АСИНХРОННАЯ ИНИЦИАЛИЗАЦИЯ
async function init() {
    try {
        // Получаем индексы с сервера
        const indexes = await API.getIndexes();
        
        // Теперь, когда индексы есть, инициализируем фильтрацию правильно
        const filtering = initFiltering(sampleTable.filter.elements, {
            searchBySeller: indexes.sellers
        });
        
        // Обновляем функции фильтрации
        applyFiltering = filtering.applyFiltering;
        updateIndexes = filtering.updateIndexes;
        
        // Запускаем рендер
        await render();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
}

// ЗАПУСКАЕМ ИНИЦИАЛИЗАЦИЮ
init();




