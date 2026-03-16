import {cloneTemplate} from "../lib/utils.js";

/**
 * Инициализирует таблицу и вызывает коллбэк при любых изменениях и нажатиях на кнопки
 *
 * @param {Object} settings
 * @param {(action: HTMLButtonElement | undefined) => void} onAction
 * @returns {{container: Node, elements: *, render: render}}
 */
export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    
    // @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы
// @todo: #1.2 — вывести дополнительные шаблоны до и после таблицы

// Добавляем шаблоны ДО таблицы (в обратном порядке, потому что используем prepend)
console.log('before array:', settings); // Проверяем, что в массиве before

settings.before.reverse().forEach(subName => {
    console.log('Добавляем шаблон ДО таблицы:', subName);
    
    // 1. Клонируем шаблон по его имени
    const cloned = cloneTemplate(subName);
    console.log('Клонированный объект:', cloned);
    
    // 2. Сохраняем в root под именем шаблона
    root[subName] = cloned;
    
    // 3. Добавляем в начало контейнера (до таблицы)
    root.container.prepend(cloned.container);
});

// Добавляем шаблоны ПОСЛЕ таблицы
console.log('after array:', settings.after); // Проверяем, что в массиве after

settings.after.forEach(subName => {
    console.log('Добавляем шаблон ПОСЛЕ таблицы:', subName);
    
    // 1. Клонируем шаблон по его имени
    const cloned = cloneTemplate(subName);
    console.log('Клонированный объект:', cloned);
    
    // 2. Сохраняем в root под именем шаблона
    root[subName] = cloned;
    
    // 3. Добавляем в конец контейнера (после таблицы)
    root.container.append(cloned.container);
});

console.log('Итоговый root:', root);

    // @todo: #1.3 —  обработать события и вызвать onAction()
     root.container.addEventListener('change', () => {
        onAction();
    });
    
    root.container.addEventListener('reset', () => {
        setTimeout(() => onAction());
    });
    
    root.container.addEventListener('submit', (e) => {
        e.preventDefault();
        onAction(e.submitter);
    });
    const render = (data) => {
        // @todo: #1.1 — преобразовать данные в массив строк на основе шаблона rowTemplate
        console.log(rowTemplate)
        const nextRows = data.map(item => { 
            const row = cloneTemplate(rowTemplate);
             // 2. Для каждого поля в данных (id, name, age и т.д.)
        Object.keys(item).forEach(key => {
            // 3. Проверяем, есть ли такой элемент в шаблоне строки
            if (row.elements[key]) {
                // 4. Если есть - вставляем туда значение
                row.elements[key].textContent = item[key];
            }
        });
        
        // 5. Возвращаем контейнер строки (саму строку таблицы)
        return row.container;
        })
        root.elements.rows.replaceChildren(...nextRows);
    //       console.log('Создано строк:', nextRows.length); // Сколько строк создали
    // root.elements.rows.replaceChildren(...nextRows);
    // console.log('Строки вставлены в таблицу'); // Проверяем вставку
    }

    return {...root, render};
}