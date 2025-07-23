// Funções auxiliares para localStorage
function saveTasksToLocalStorage() {
    const tarefas = [];
    document.querySelectorAll('#Kanban .tarefa, .tarefaFeita').forEach(tarefa => {
        tarefas.push({
            title: tarefa.querySelector('h2 strong').innerText,
            description: tarefa.querySelector('p').innerText,
            done: tarefa.classList.contains('tarefaFeita')
        });
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
}

function loadTasksFromLocalStorage() {
    const saved = localStorage.getItem('tarefas');
    if (!saved) return;
    const tarefas = JSON.parse(saved);
    tarefas.forEach(({ title, description, done }) => {
        const tarefa = createTaskElement(title, description, done);
        if (done) {
            document.querySelector('.historico').appendChild(tarefa);
        } else {
            document.getElementById('Kanban').appendChild(tarefa);
        }
    });
}

function createTaskElement(title, description, done = false) {
    const tarefa = document.createElement('div');
    tarefa.className = done ? 'tarefaFeita' : 'tarefa';
    tarefa.innerHTML = `
        <h2><strong>${title}</strong></h2>
        <p>${description}</p>
        <br>
        <div>
            ${done ? `<button class="restore"><i class='fa fa-trash-restore' style="font-size:15px"></i> Restore</button>` : `
            <button class="edit"><i class="fa fa-edit" style="font-size:15px"></i> Edit</button>
            <br>
            <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
            <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>`}
        </div>
    `;

    if (done) {
        tarefa.querySelector('.restore').addEventListener('click', () => {
            const restored = createTaskElement(title, description, false);
            document.getElementById('Kanban').appendChild(restored);
            tarefa.remove();
            saveTasksToLocalStorage();
        });
    } else {
        tarefa.querySelector('.done').addEventListener('click', () => {
            const finished = createTaskElement(title, description, true);
            document.querySelector('.historico').appendChild(finished);
            tarefa.remove();
            saveTasksToLocalStorage();
        });
        tarefa.querySelector('.delete').addEventListener('click', () => {
            tarefa.remove();
            saveTasksToLocalStorage();
        });
        tarefa.querySelector('.edit').addEventListener('click', () => addEditPopupEvent(tarefa));
    }

    return tarefa;
}

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();
        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();
        if (!title) return;

        const tarefa = createTaskElement(title, description, false);
        document.getElementById('Kanban').appendChild(tarefa);
        this.reset();
        saveTasksToLocalStorage();
    });

    loadTasksFromLocalStorage();

    // Exibe ou esconde imagem de histórico vazio
    const observer = new MutationObserver(() => {
        const historico = document.querySelector('.historico');
        const imgContainer = document.querySelector('.img-completed-container');
        if (!imgContainer) return;
        imgContainer.style.display = historico.children.length > 0 ? 'none' : 'flex';
    });
    observer.observe(document.querySelector('.historico'), { childList: true });
});

function addEditPopupEvent(tarefa) {
    const popup = document.getElementById('editPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupDesc = document.getElementById('popupDesc');
    const saveBtn = document.getElementById('saveEdit');
    const cancelBtn = document.getElementById('cancelEdit');

    popupTitle.value = tarefa.querySelector('h2 strong').innerText;
    popupDesc.value = tarefa.querySelector('p').innerText;
    popup.style.display = 'flex';

    saveBtn.onclick = () => {
        const newTitle = popupTitle.value.trim();
        const newDesc = popupDesc.value.trim();
        tarefa.querySelector('h2 strong').innerText = newTitle;
        tarefa.querySelector('p').innerText = newDesc;
        popup.style.display = 'none';
        saveTasksToLocalStorage();
    };

    cancelBtn.onclick = () => popup.style.display = 'none';
}

/////////////////////////////////////////////////////
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('form').addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value.trim();
        const description = document.getElementById('description').value.trim();

        if (!title) return;

        const tarefa = document.createElement('div');
        tarefa.className = 'tarefa';
        tarefa.innerHTML = `
            <h2><strong>${title}</strong></h2>
            <p>${description}</p>
            <br>
            <div>
                <button class="edit"><i class="fa fa-edit" style="font-size:15px"></i> Edit</button>
                <br>
                <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
                <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>
            </div>
        `;

        document.getElementById('Kanban').appendChild(tarefa);
        addEditPopupEvent(tarefa)
        this.reset();
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        //Aqui é para adicionar eventos aos botões da tarefa
        tarefa.querySelector('.done').addEventListener('click', function () {
            // Move para o histórico
            tarefa.className = 'tarefaFeita';
            // Remove os botões antigos
            tarefa.querySelector('div').innerHTML = `<button class="restore"><i class='fa fa-trash-restore' style="font-size:15px"></i> Restore</button>`;
            // Adiciona ao histórico
            document.querySelector('.historico').appendChild(tarefa);

            // Evento para restaurar
            tarefa.querySelector('.restore').addEventListener('click', function () {
                tarefa.className = 'tarefa';
                tarefa.innerHTML = `
                    <h2><strong>${title}</strong></h2>
                    <p>${description}</p>
                    <br>
                    <div>
                        <button class="edit"><i class="fa fa-edit" style="font-size:15px"></i> Edit</button>
                        <br>
                        <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
                        <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>
                    </div>
                `;
                document.getElementById('Kanban').appendChild(tarefa);
                // Re-adiciona eventos
                addTaskEvents(tarefa, title, description);
            });
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        tarefa.querySelector('.delete').addEventListener('click', function () {
            tarefa.remove();
        });
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Função para re-adicionar eventos ao restaurar
        function addTaskEvents(tarefa, title, description) {
            tarefa.querySelector('.done').addEventListener('click', function () {
                tarefa.className = 'tarefaFeita';
                tarefa.querySelector('div').innerHTML = `<button class="restore"><i class='fa fa-trash-restore' style="font-size:15px"></i> Restore</button>`;
                document.querySelector('.historico').appendChild(tarefa);
                tarefa.querySelector('.restore').addEventListener('click', function () {
                    tarefa.className = 'tarefa';
                    tarefa.innerHTML = `
                        <h2><strong>${title}</strong></h2>
                        <p>${description}</p>
                        <br>
                        <div>
                            <button class="edit"><i class="fa fa-edit" style="font-size:15px"></i> Edit</button>
                            <br>
                            <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
                            <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>
                        </div>
                    `;

                    document.getElementById('Kanban').appendChild(tarefa);
                    addTaskEvents(tarefa, title, description);
                });
            });
            tarefa.querySelector('.delete').addEventListener('click', function () {
                tarefa.remove();
            });
            addEditPopupEvent(tarefa)
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

        function addEditPopupEvent(tarefa) {
            tarefa.querySelector('.edit').addEventListener('click', function () {
                const popup = document.getElementById('editPopup');
                const popupTitle = document.getElementById('popupTitle');
                const popupDesc = document.getElementById('popupDesc');
                const saveBtn = document.getElementById('saveEdit');
                const cancelBtn = document.getElementById('cancelEdit');

                // Preenche os campos com os valores atuais
                popupTitle.value = tarefa.querySelector('h2 strong').innerText;
                popupDesc.value = tarefa.querySelector('p').innerText;

                popup.style.display = 'flex';

                // Remove eventos antigos para evitar múltiplos triggers
                saveBtn.onclick = null;
                cancelBtn.onclick = null;

                // Salvar edição
                saveBtn.onclick = function () {
                    const newTitle = popupTitle.value.trim();
                    const newDesc = popupDesc.value.trim();
                    tarefa.querySelector('h2 strong').innerText = newTitle;
                    tarefa.querySelector('p').innerText = newDesc;
                    popup.style.display = 'none';
                };

                // Cancelar edição
                cancelBtn.onclick = function () {
                    popup.style.display = 'none';
                };
            });
        }
        tarefa.querySelector('.edit').addEventListener('click', function () {
            addEditPopupEvent(tarefa);
        });

        function toggleHistoryImage() {
            const historico = document.querySelector('.historico');
            const imgContainer = document.querySelector('.img-completed-container');
            if (!imgContainer) return;
            if (historico && historico.children.length > 0) {
                imgContainer.style.display = 'none';
            } else {
                imgContainer.style.display = 'flex';
            }
        }

        // Chame ao carregar a página
        toggleHistoryImage();

        // Chame sempre que adicionar ou remover tarefas do histórico
        const observer = new MutationObserver(toggleHistoryImage);
        observer.observe(document.querySelector('.historico'), { childList: true });
        /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    });

});

/******************************************************************/
// --- Background Animation with Floating Task Icons ---
window.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    // Ícones FontAwesome (unicode)
    const icons = [
        '\uf0ae', // fa-tasks
        '\uf044', // fa-edit
        '\uf00c', // fa-check
        '\uf1b2', // fa-cubes
        '\uf02e', // fa-book
        '\uf249', // fa-thumb-tack
    ];
    const iconCount = 101;
    const iconObjects = [];
    let mouse = { x: width / 2, y: height / 2 };

    function randomBetween(a, b) {
        return a + Math.random() * (b - a);
    }

    // Cria os ícones flutuantes
    for (let i = 0; i < iconCount; i++) {
        iconObjects.push({
            icon: icons[Math.floor(Math.random() * icons.length)],
            x: randomBetween(0, width),
            y: randomBetween(0, height),
            size: randomBetween(28, 48),
            speed: randomBetween(0.2, 0.7),
            angle: randomBetween(0, Math.PI * 2),
            drift: randomBetween(0.5, 1.5),
            color: 'rgba(13, 214, 180, 0.18)'
        });
    }

    function draw() {
        // Fundo gradiente dark blue
        let grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "#0a1842");
        grad.addColorStop(1, "#1a2a6c");
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);

        // Desenha os ícones
        iconObjects.forEach(obj => {
            ctx.save();
            ctx.font = `${obj.size}px FontAwesome`;
            ctx.globalAlpha = 0.8;
            ctx.fillStyle = obj.color;
            ctx.translate(obj.x, obj.y);
            ctx.rotate(Math.sin(obj.angle) * 0.1);
            ctx.fillText(obj.icon, 0, 0);
            ctx.restore();

            // Movimento flutuante
            obj.y += Math.sin(obj.angle) * obj.drift + obj.speed;
            obj.x += Math.cos(obj.angle) * obj.drift * 0.5;

            // Segue o mouse levemente
            // obj.x += (mouse.x - obj.x) * 0.0008;
            // obj.y += (mouse.y - obj.y) * 0.0007;

            obj.angle += 0.008 + obj.speed * 0.01;

            // Reposiciona se sair da tela
            if (obj.y > height + 60) obj.y = -40;
            if (obj.x > width + 60) obj.x = -40;
            if (obj.x < -60) obj.x = width + 40;
        });

        requestAnimationFrame(draw);
    }

    // Carrega a fonte FontAwesome para o canvas
    const fa = new FontFace('FontAwesome', 'url(https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/fonts/fontawesome-webfont.woff2?v=4.7.0)');
    fa.load().then(function (font) {
        document.fonts.add(font);
        draw();
    });

    window.addEventListener('resize', () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    });

    window.addEventListener('mousemove', e => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
});