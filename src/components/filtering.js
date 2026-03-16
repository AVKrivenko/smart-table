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
        console.log('Заполняем элемент:', elementName);
        
        // Получаем элемент из DOM
        const element = elements[elementName];
        if (!element) {
            console.warn(`Элемент ${elementName} не найден`);
            return;
        }
        
        // Получаем массив значений для этого элемента
        const values = Object.values(indexes[elementName]);
        console.log(`Значения для ${elementName}:`, values);
        
        // Создаем опции и добавляем их в элемент
        const options = values.map(value => {
            const option = document.createElement('option');
            option.value = value;
            option.textContent = value;
            return option;
        });
        
        // Добавляем все опции в элемент
        element.append(...options);
    });
    
    return (data, state, action) => {
        // @todo: #4.2 — очистка полей фильтров (опционально)
        if (action?.name === 'clear') {
            console.log('Очистка фильтров', action);
            
            // Находим родительский элемент кнопки
            const parent = action.parentElement;
            if (parent) {
                // Ищем поле ввода в родителе
                const input = parent.querySelector('input, select');
                if (input) {
                    // Очищаем значение
                    input.value = '';
                    
                    // Получаем имя поля из data-field кнопки
                    const field = action.dataset.field;
                    if (field && state) {
                        // Очищаем соответствующее поле в state
                        state[field] = '';
                    }
                }
            }
        }
        
        // @todo: #4.3 — настроить функцию сравнения
        const compare = createComparison(defaultRules);
        
        // @todo: #4.4 — фильтрация данных
        console.log('Фильтрация данных:', {
            исходныеДанные: data.length,
            состояние: state
        });
        
        // Применяем фильтрацию
        const filteredData = data.filter(row => {
            const shouldInclude = compare(row, state);
            return shouldInclude;
        });
        
        console.log('После фильтрации:', filteredData.length);
        
        // @todo: #4.5 — вернуть отфильтрованные данные
        return filteredData;
    };
}