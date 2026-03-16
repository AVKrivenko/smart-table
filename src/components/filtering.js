// import {createComparison, defaultRules} from "../lib/compare.js";

// // @todo: #4.3 — настроить компаратор

// export function initFiltering(elements, indexes) {
//     // @todo: #4.1 — заполнить выпадающие списки опциями

//     return (data, state, action) => {
//         // @todo: #4.2 — обработать очистку поля

//         // @todo: #4.5 — отфильтровать данные используя компаратор
//         return data;
//     }
// }
import {createComparison, defaultRules} from "../lib/compare.js";

export function initFiltering(elements, indexes) {
    console.log('initFilter инициализирован', {elements, indexes});
    
    // @todo: #4.1 — заполнить выпадающие списки данными
    Object.keys(indexes).forEach((elementName) => {
        const element = elements[elementName];
        if (!element) return;
        
        // Очищаем текущие опции
        while (element.options.length > 0) {
            element.remove(0);
        }
        
        // Добавляем пустую опцию для возможности сброса
        const emptyOption = document.createElement('option');
        emptyOption.value = '';
        emptyOption.textContent = 'Все';
        element.appendChild(emptyOption);
        
        // Добавляем новые опции
        Object.values(indexes[elementName]).forEach(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            element.appendChild(option);
        });
    });
    
    // Создаем функцию сравнения
    const compare = createComparison(defaultRules);
    
    return (data, state, action) => {
        console.log('applyFilter вызван:', state);
        
        // @todo: #4.2 — очистка полей фильтров
        if (action?.name === 'clear') {
            const field = action.dataset?.field;
            if (field && state) {
                state[field] = '';
                // Находим и очищаем поле ввода
                const input = action.closest('.filter-group')?.querySelector('input, select');
                if (input) {
                    if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else {
                        input.value = '';
                    }
                }
            }
        }
        
        // @todo: #4.4 — фильтрация данных с учетом числовых диапазонов
        const filteredData = data.filter(row => {
            // Проверяем каждый фильтр в state
            for (const [key, value] of Object.entries(state)) {
                // Пропускаем пустые значения и специальные поля
                if (!value || key === 'rowsPerPage' || key === 'page') continue;
                
                // Специальная обработка для числовых полей (totalFrom/totalTo)
                if (key === 'totalFrom' && value) {
                    const numValue = parseFloat(value);
                    const rowValue = parseFloat(row.total);
                    if (isNaN(rowValue) || rowValue < numValue) return false;
                }
                else if (key === 'totalTo' && value) {
                    const numValue = parseFloat(value);
                    const rowValue = parseFloat(row.total);
                    if (isNaN(rowValue) || rowValue > numValue) return false;
                }
                // Для остальных полей используем стандартный компаратор
                else {
                    // Создаем объект с одним полем для сравнения
                    const testState = { [key]: value };
                    if (!compare(row, testState)) return false;
                }
            }
            return true;
        });
        
        console.log('После фильтрации:', filteredData.length);
        
        // @todo: #4.5 — вернуть отфильтрованные данные
        return filteredData;
    };
}