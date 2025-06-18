
document.addEventListener('DOMContentLoaded', function() {
    document.querySelector('form').addEventListener('submit', function(e) {
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
        tarefa.querySelector('.done').addEventListener('click', function() {
            // Move para o histórico
            tarefa.className = 'tarefaFeita';
            // Remove os botões antigos
            tarefa.querySelector('div').innerHTML = `<button class="restore"><i class='fa fa-trash-restore' style="font-size:15px"></i> Restore</button>`;
            // Adiciona ao histórico
            document.querySelector('.historico').appendChild(tarefa);

            // Evento para restaurar (opcional)
            tarefa.querySelector('.restore').addEventListener('click', function() {
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
        tarefa.querySelector('.delete').addEventListener('click', function() {
            tarefa.remove();
        });
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        // Função para re-adicionar eventos ao restaurar
        function addTaskEvents(tarefa, title, description) {
            tarefa.querySelector('.done').addEventListener('click', function() {
                tarefa.className = 'tarefaFeita';
                tarefa.querySelector('div').innerHTML = `<button class="restore"><i class='fa fa-trash-restore' style="font-size:15px"></i> Restore</button>`;
                document.querySelector('.historico').appendChild(tarefa);
                tarefa.querySelector('.restore').addEventListener('click', function() {
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
            tarefa.querySelector('.delete').addEventListener('click', function() {
                tarefa.remove();
            });
           addEditPopupEvent(tarefa)  
        }
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
       
function addEditPopupEvent(tarefa) {
    tarefa.querySelector('.edit').addEventListener('click', function() {
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
        saveBtn.onclick = function() {
            const newTitle = popupTitle.value.trim();
            const newDesc = popupDesc.value.trim();
            tarefa.querySelector('h2 strong').innerText = newTitle;
            tarefa.querySelector('p').innerText = newDesc;
            popup.style.display = 'none';
        };

        // Cancelar edição
        cancelBtn.onclick = function() {
            popup.style.display = 'none';
        };
    });
}
tarefa.querySelector('.edit').addEventListener('click', function() {
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