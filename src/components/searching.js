import {rules, createComparison} from "../lib/compare.js";


// export function initSearching(searchField) {
//     // @todo: #5.1 — настроить компаратор

//     return (data, state, action) => {
//         // @todo: #5.2 — применить компаратор
//         return data;
//     }
// }



export function initSearching(searchField) {
    console.log('initSearching инициализирован с полем:', searchField);
    
    // Создаем компаратор для поиска
    // Используем skipEmptyTargetValues и rules.searchMultipleFields
    const compare = createComparison(
        { skipEmptyTargetValues: true },
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );
    
    return (data, state, action) => {
        console.log('applySearch вызван:', {
            длинаДанных: data?.length,
            поисковыйЗапрос: state?.[searchField],
            действие: action
        });
        
        // Получаем поисковый запрос из state
        const searchQuery = state?.[searchField]?.trim() || '';
        
        // Если поисковый запрос пустой, возвращаем все данные
        if (!searchQuery) {
            console.log('Поисковый запрос пустой, данные без изменений');
            return data;
        }
        
        // Применяем поиск
        const searchResult = data.filter(row => {
            // Компаратор сравнивает строку поиска с данными строки
            // Создаем объект с поисковым запросом для компаратора
            const searchState = { [searchField]: searchQuery };
            return compare(row, searchState);
        });
        
        console.log('Результаты поиска:', {
            было: data.length,
            стало: searchResult.length,
            запрос: searchQuery
        });
        
        return searchResult;
    };
}