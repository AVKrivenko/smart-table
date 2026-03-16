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
    
    // Правильно настраиваем поиск по нескольким полям
    const compare = createComparison(
        { skipEmptyTargetValues: true },
        rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
    );
    
    return (data, state, action) => {
        const searchQuery = state?.[searchField]?.trim() || '';
        
        // Если поисковый запрос пустой, возвращаем все данные
        if (!searchQuery) {
            return data;
        }
        
        // Фильтруем данные по поисковому запросу
        const searchResult = data.filter(row => {
            // Проверяем каждое поле для поиска
            const fields = ['date', 'customer', 'seller'];
            
            for (const field of fields) {
                const fieldValue = row[field]?.toString().toLowerCase() || '';
                if (fieldValue.includes(searchQuery.toLowerCase())) {
                    return true; // Нашли совпадение в одном из полей
                }
            }
            return false; // Нет совпадений
        });
        
        console.log('Результаты поиска:', {
            было: data.length,
            стало: searchResult.length,
            запрос: searchQuery
        });
        
        // ВАЖНО: возвращаем пустой массив, если нет совпадений
        return searchResult;
    };
}