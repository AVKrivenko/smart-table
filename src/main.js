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

const filtering = initFiltering(sampleTable.filter.elements);
applyFiltering = filtering.applyFiltering;
updateIndexes = filtering.updateIndexes;


const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);

// АСИНХРОННАЯ ИНИЦИАЛИЗАЦИЯ
// Функция для настройки обработчиков очистки
function setupClearButtons() {
    // Находим все кнопки очистки в фильтрах
    const clearButtons = document.querySelectorAll('.filter-wrapper button[name="clear"]');
    
    clearButtons.forEach(button => {
        // Удаляем старые обработчики, чтобы не было дублирования
        button.removeEventListener('click', handleClearClick);
        // Добавляем новый обработчик
        button.addEventListener('click', handleClearClick);
    });
}

// Обработчик клика по кнопке очистки
function handleClearClick(e) {
    e.preventDefault();
    e.stopPropagation();
    
    const button = e.currentTarget;
    const fieldName = button.dataset.field;
    console.log('Кнопка очистки нажата для поля:', fieldName);
    
    // Находим поле ввода в том же контейнере
    const wrapper = button.closest('.filter-wrapper');
    if (wrapper) {
        const input = wrapper.querySelector('input');
        if (input) {
            input.value = '';
            console.log('Очищено поле:', fieldName, 'новое значение:', input.value);
        }
    }
    
    // Вызываем рендер с действием очистки
    render({ name: 'clear', dataset: { field: fieldName } });
}

// Вызовите setupClearButtons после инициализации таблицы
async function init() {
    try {
        const indexes = await API.getIndexes();
        console.log('Индексы получены:', indexes);
        
        const filterIndexes = {
            searchBySeller: Object.values(indexes.sellers)
        };
        
        if (typeof updateIndexes === 'function') {
            updateIndexes(sampleTable.filter.elements, filterIndexes);
        }
        
        // Настраиваем обработчики кнопок очистки
        setupClearButtons();
        
        await render();
    } catch (error) {
        console.error('Ошибка при инициализации:', error);
    }
}

// ЗАПУСКАЕМ ИНИЦИАЛИЗАЦИЮ
init();




