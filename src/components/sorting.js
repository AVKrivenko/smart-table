import {sortMap} from "../lib/sort.js";


export function initSorting(columns) {
    console.log('initSorting инициализирован с колонками:', columns);
    
    return (query, state, action) => {
        console.log('applySorting вызван:', {query, action});
        
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            const currentValue = action.dataset.value || 'none';
            const nextValue = sortMap[currentValue];
            
            console.log('Сортировка:', {
                field: action.dataset.field,
                currentValue,
                nextValue
            });
            
            // Сохраняем новое значение в dataset кнопки
            action.dataset.value = nextValue;
            
            // Запоминаем поле и направление для сортировки
            field = action.dataset.field;
            order = nextValue;
            
            // @todo: #3.2 — сбросить сортировки остальных колонок
            columns.forEach(column => {
                // Если это не та кнопка, что нажал пользователь
                if (column.dataset.field !== action.dataset.field) {
                    // Сбрасываем её в начальное состояние
                    column.dataset.value = 'none';
                }
            });
            
        } else {
            // @todo: #3.3 — получить выбранный режим сортировки (когда нет действия)
            columns.forEach(column => {
                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                    console.log('Найдена активная сортировка:', {field, order});
                }
            });
        }

        // Формируем параметр сортировки для сервера
        const sort = (field && order && order !== 'none') ? `${field}:${order}` : null;
        
        // Если есть сортировка, добавляем её в query, если нет - возвращаем query без изменений
        return sort ? Object.assign({}, query, { sort }) : query;
    }
}