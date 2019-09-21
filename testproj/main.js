        //кнопка для того щоб розпочати пошук
        const button = document.getElementById('butt');
        //div де зберігаються результати пошуку
        const divResult = document.getElementById('result');
        const input = document.getElementById('input');
        //кнопка для того щоб оглянути обрані
        const selected = document.getElementById('watch-selected');
        const localStorageMain = document.getElementById('local-storage')
        //div де зберігаються обрані
        const localStorageDiv = document.getElementById('local-storage-el');
        //кнопка для видалення всіх збережених елементів
        const deleteBtn = document.getElementById('delete');
        button.addEventListener('click', getRepos);
        selected.addEventListener('click', getSelected);
        deleteBtn.addEventListener('click', () => {
            localStorage.clear();
            while(localStorageDiv.firstChild){
                localStorageDiv.removeChild(localStorageDiv.firstChild)

            }
        })
        
        //якщо в localstorage є збережені данні записуєм їх в li
        if(localStorage.length !== 0) {
            for(let key in localStorage) {
                if (!localStorage.hasOwnProperty(key)) {
                  continue; 
                }
                const localElement = document.createElement('li');
                const localAnchor = document.createElement('a');
                localAnchor.href = localStorage.getItem(key);
                localAnchor.textContent = localStorage.getItem(key);
                localElement.appendChild(localAnchor);
                localStorageDiv.appendChild(localElement);

            }
            
        }

        async function getRepos(){
            clear();
            if(localStorageMain.style.display == 'block'){
                localStorageMain.style.display = 'none';
            }
            divResult.style.display = 'block';  
            const url = 'https://api.github.com/search/repositories?q=KEYWORD';
            const inputVal = input.value;
            const response = await fetch(`${url}:${inputVal}`);
            const result = await response.json();
            if(result.total_count == 0) {
                divResult.textContent = 'Нічого не знайдено. Можливо спробуйте ввести літери з латинського алфавіту'
            }
            result.items.forEach(e => {
                //div у якому зберігається лінк на репозиторій і кнопка
                const mainDiv = document.createElement('div');
                mainDiv.classList.add('main-div');
                //тут зберігається лінк на репозиторій
                const anchor = document.createElement('a');
                anchor.classList.add('anchor-style')
                anchor.href = e.html_url;
                anchor.textContent = e.full_name;
                mainDiv.appendChild(anchor);
                //кнопка для збереження у localstorage
                const localDiv = document.createElement('div');
                localDiv.classList.add('local-div');
                localDiv.textContent = 'Добавити в обране';
                //event listener який при кліку додає обраний лінк у localstorage
                localDiv.addEventListener('click', () => {
                         localStorage.setItem(e.id, e.html_url);
                         const localElement = document.createElement('li');
                         const localAnchor = document.createElement('a');
                         localAnchor.href = e.html_url
                         localAnchor.textContent = localStorage.getItem(e.id);
                         localElement.appendChild(localAnchor);
                         localStorageDiv.appendChild(localElement);
                });
                mainDiv.appendChild(localDiv);
                
                divResult.appendChild(mainDiv);
            });
        }
        //функція виводить збережені дані в localstorage
        function getSelected(){
            if(divResult.style.display == 'block'){
                divResult.style.display = 'none';
            }
            localStorageMain.style.display = 'block';
        }

        //функція яка очищає минулі запроси
        function clear(){
        while(divResult.firstChild) 
            divResult.removeChild(divResult.firstChild)
        }

        