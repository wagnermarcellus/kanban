
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
                <button class="edit"><i class="fa fa-pencil" style="font-size:15px"></i> Edit</button>
                <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
                <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>
            </div>
        `;

        document.getElementById('Kanban').appendChild(tarefa);

        this.reset();
        

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
                        <button class="edit"><i class="fa fa-pencil" style="font-size:15px"></i> Edit</button>
                        <button class="done"><i class='fa fa-chevron-circle-down' style="font-size:15px"></i> Done</button>
                        <button class="delete"><i class="fa fa-trash" style="font-size:15px"></i> Delete</button>
                    </div>
                `;
                document.getElementById('Kanban').appendChild(tarefa);
                // Re-adiciona eventos
                addTaskEvents(tarefa, title, description);
            });
        });

        tarefa.querySelector('.delete').addEventListener('click', function() {
            tarefa.remove();
        });

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
                            <button class="edit"><i class="fa fa-pencil" style="font-size:15px"></i> Edit</button>
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
        }

       
    });
});
