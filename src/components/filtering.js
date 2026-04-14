export function initFiltering(elements) {
    const updateIndexes = (elements, indexes) => {
        // Очищаем существующие опции (оставляем только первую - "Все")
        Object.keys(indexes).forEach((elementName) => {
            if (elements[elementName]) {
                // Очищаем select, оставляя только опцию "Все" если она есть
                elements[elementName].innerHTML = '<option value="all">Все продавцы</option>';
                
                // Добавляем новые опции из индексов
                elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                    const el = document.createElement('option');
                    el.textContent = name;
                    el.value = name;
                    return el;
                }));
            }
        });
    };

    const applyFiltering = (query, state, action) => {
        console.log('applyFiltering вызван:', { query, state, action });
        
        // @todo: #4.2 — обработка очистки фильтров
        if (action && action.name === 'clear') {
            const fieldName = action.dataset?.field;
            if (fieldName && elements[fieldName]) {
                // Сбрасываем значение поля
                elements[fieldName].value = 'all';
                console.log('Очищен фильтр:', fieldName);
            }
        }
        
        // @todo: #4.5 — формируем фильтр для запроса
        const filter = {};
        
        Object.keys(elements).forEach(key => {
            const element = elements[key];
            if (element) {
                // Проверяем, что это поле ввода и оно имеет значение
                if (['INPUT', 'SELECT'].includes(element.tagName)) {
                    const value = element.value;
                    // Добавляем фильтр только если значение не пустое и не равно 'all'
                    if (value && value !== 'all') {
                        // Формируем параметр filter[имя_поля]
                        filter[`filter[${element.name}]`] = value;
                        console.log(`Добавлен фильтр ${element.name}:`, value);
                    }
                }
            }
        });
        
        console.log('Сформированный filter:', filter);
        
        // Если есть фильтры, добавляем их к query
        if (Object.keys(filter).length) {
            return { ...query, ...filter };
        }
        
        // Если фильтров нет, возвращаем query без изменений
        return query;
    };

    return {
        updateIndexes,
        applyFiltering
    };
}