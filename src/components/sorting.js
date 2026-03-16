import {sortCollection, sortMap} from "../lib/sort.js";

export function initSorting(columns) {
    console.log('initSorting инициализирован с колонками:', columns);
    
    return (data, state, action) => {
        console.log('applySorting вызван:', {dataLength: data.length, action});
        
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            // @todo: #3.1 — запомнить выбранный режим сортировки
            // Получаем текущее значение сортировки
            const currentValue = action.dataset.value || 'none';
            // Получаем следующее значение из карты
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
                // Ищем кнопку, у которой значение не 'none'
                if (column.dataset.value && column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                    console.log('Найдена активная сортировка:', {field, order});
                }
            });
        }

        // Применяем сортировку к данным (ТОЛЬКО если есть поле и порядок)
        if (field && order && order !== 'none') {
            console.log('Применяем сортировку:', {field, order});
            const sortedData = sortCollection(data, field, order);
            console.log('Данные после сортировки:', sortedData.length);
            return sortedData;
        }
        
        // Если нет активной сортировки, возвращаем данные как есть
        console.log('Сортировка не применяется');
        return data;
    }
}