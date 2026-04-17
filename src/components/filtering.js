export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                // Сохраняем текущее значение
                const currentValue = elements[elementName].value;
                
                // Очищаем select
                elements[elementName].innerHTML = '<option value="all">Все продавцы</option>';
                
                // Добавляем новые опции
                const values = Object.values(indexes[elementName]);
                values.forEach(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    elements[elementName].appendChild(el);
                });
                
                // Восстанавливаем значение, если оно было выбрано
                if (currentValue && currentValue !== 'all' && values.includes(currentValue)) {
                    elements[elementName].value = currentValue;
                } else {
                    elements[elementName].value = 'all';
                }
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        console.log('applyFiltering вызван:', { query, state, action });
        
        // @todo: #4.2 — обработка очистки фильтров
        if (action && action.name === 'clear') {
            const fieldName = action.dataset?.field;
            console.log('Очистка фильтра для поля:', fieldName);
            
            if (fieldName && elements[fieldName]) {
                const element = elements[fieldName];
                
                // Сбрасываем значение в зависимости от типа элемента
                if (element.tagName === 'SELECT') {
                    element.value = 'all';
                } else if (element.tagName === 'INPUT') {
                    element.value = '';
                }
                
                console.log(`Очищен фильтр ${fieldName}, новое значение:`, element.value);
                
                // Удаляем этот фильтр из query
                const newQuery = { ...query };
                const filterKey = `filter[${element.name}]`;
                delete newQuery[filterKey];
                
                // Возвращаем query без этого фильтра
                return newQuery;
            }
        }
        
        // @todo: #4.5 — формируем фильтр для запроса
        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element && ['INPUT', 'SELECT'].includes(element.tagName)) {
                const value = element.value;
                // Для INPUT: проверяем что значение не пустая строка
                // Для SELECT: проверяем что значение не 'all' и не пустая строка
                const isValid = element.tagName === 'INPUT' 
                    ? value && value.trim() !== ''
                    : value && value !== 'all' && value !== '';
                
                if (isValid) {
                    filter[`filter[${element.name}]`] = value;
                    console.log(`Добавлен фильтр ${element.name}:`, value);
                }
            }
        });
        
        console.log('Сформированный filter:', filter);
        
        // Если есть фильтры, добавляем их к query
        if (Object.keys(filter).length) {
            return { ...query, ...filter };
        }
        
        return query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}