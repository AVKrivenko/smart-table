export function initSearching(searchField) {
    console.log('initSearching инициализирован с полем:', searchField);
    
    return (query, state, action) => {
        console.log('applySearch вызван:', { query, state, action });
        
        // Проверяем, что в поле поиска было что-то введено
        if (state[searchField] && state[searchField].trim()) {
            const searchValue = state[searchField].trim();
            console.log('Добавляем поиск:', searchValue);
            
            // ВАЖНО: сохраняем все существующие параметры в query
            return {
                ...query,  // сохраняем все существующие параметры (пагинацию и т.д.)
                search: searchValue
            };
        }
        
        // Если поиск пустой, возвращаем query без изменений
        console.log('Поиск пустой, возвращаем query без изменений');
        return query;
    };
}
