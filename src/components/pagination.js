import {getPages} from "../lib/utils.js";

export const initPagination = ({pages, fromRow, toRow, totalRows}, createPage) => {
    // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
    const pageTemplate = pages.firstElementChild.cloneNode(true);
    pages.innerHTML = ''; // Очищаем контейнер полностью (лучше чем просто remove)
    
    let pageCount; // Храним общее количество страниц
    
    const applyPagination = (query, state, action) => {
        const limit = state.rowsPerPage;
        let page = state.page;
        
        // @todo: #2.6 — обработать действия
        if (action) {
            switch(action.name) {
                case 'prev': 
                    page = Math.max(1, page - 1); 
                    break;
                case 'next': 
                    page = Math.min(pageCount, page + 1); 
                    break;
                case 'first': 
                    page = 1; 
                    break;
                case 'last': 
                    page = pageCount; 
                    break;
            }
        }
        
        // Убеждаемся, что страница в допустимых пределах
        if (pageCount && page > pageCount) {
            page = pageCount;
        }
        if (page < 1) {
            page = 1;
        }
        
        return Object.assign({}, query, {
            limit,
            page
        });
    }
    
    const updatePagination = (total, { page, limit }) => {
        pageCount = Math.ceil(total / limit);
        
        // @todo: #2.4 — получить список видимых страниц и вывести их
        const visiblePages = getPages(page, pageCount, 5);
        pages.replaceChildren(...visiblePages.map(pageNumber => {
            const el = pageTemplate.cloneNode(true);
            return createPage(el, pageNumber, pageNumber === page);
        }));
        
        // @todo: #2.5 — обновить статус пагинации
        const from = (page - 1) * limit + 1;
        const to = Math.min(page * limit, total);
        
        fromRow.textContent = total > 0 ? from : 0;
        toRow.textContent = to;
        totalRows.textContent = total;
    }
    
    return {
        updatePagination,
        applyPagination
    };
}
