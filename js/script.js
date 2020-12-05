var btnAdicionar = document.getElementById('btnAdicionar');
var txtTarefa = document.getElementById('txtTarefa');
var lstTarefas = document.getElementById('lstTarefas');
var btnLimpar = document.getElementById('acaoLimpar');
var arrayTarefas = [];

function adicionarTarefa(tarefa, executada) {
    if (tarefa) {
        if (arrayTarefas.length) {
            var indiceTarefa = -1;
            for (var t = 0; t < arrayTarefas.length; t++) {
                if (arrayTarefas[t].Tarefa == tarefa) {
                    indiceTarefa = t;
                    break;
                }
            }
            if (indiceTarefa >= 0) {
                alert('A tafera \"' + tarefa + '\" está cadastrada, e ' + ((arrayTarefas[indiceTarefa].Executada) ? "já foi executada." : "ainda não foi executada."));
                txtTarefa.value = '';
                txtTarefa.focus();
                return (false);
            }
        }
        var objTarefa = { 'Tarefa': tarefa, 'Executada': executada }
        arrayTarefas.push(objTarefa);
        AtualizaLocalStorage();
        MontarLista();
        
        txtTarefa.value = '';
        txtTarefa.focus();
    } else {
        alert('Informe uma tarefa para adicionar à lista.');
    }
}

function MontarLista() {
    if (arrayTarefas.length != 0) {
        document.getElementById('lstTarefas').innerHTML = '';
        document.getElementById('acaoLimpar').style = 'display:block';
        for (var t = 0; t < arrayTarefas.length; t++) {
            var li = document.createElement('li');
            li.className = 'padding-xs';

            var label = document.createElement('label');
            label.id = 'label' + t;
            label.setAttribute('for', 'tarefa' + t);
            label.innerHTML = arrayTarefas[t].Tarefa;
            label.className = 'margin-left-xs';
            if (arrayTarefas[t].Executada)
                label.classList.add('tachado');

            var inputCheckbox = document.createElement('input');
            inputCheckbox.type = 'checkbox';
            inputCheckbox.value = t;
            inputCheckbox.id = 'tarefa' + t;
            inputCheckbox.checked = arrayTarefas[t].Executada;
            inputCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    arrayTarefas[this.value].Executada = true;
                    document.getElementById('label' + this.value).classList.add('tachado');
                } else {
                    arrayTarefas[this.value].Executada = false;
                    document.getElementById('label' + this.value).classList.remove('tachado');
                }
                AtualizaLocalStorage();
            });

            var btnExcluir = document.createElement('a');
            btnExcluir.innerHTML = '&#x274C';
            btnExcluir.id = t;
            btnExcluir.addEventListener('click', function() {
                if (confirm('Deseja excluir a tarefa \"' + arrayTarefas[this.id].Tarefa + '\"?')) {
                    arrayTarefas.splice((this.id), 1);
                    AtualizaLocalStorage();
                    MontarLista();
                }
            });

            li.appendChild(inputCheckbox);
            li.appendChild(label);
            li.appendChild(btnExcluir);
            lstTarefas.appendChild(li);
        }
    } else {
        document.getElementById('lstTarefas').innerHTML = '';
        btnLimpar.style = 'display:none';
        var vazio = document.createElement('li');
        vazio.className = 'vazio';
        vazio.innerHTML = 'Nenhuma tarefa cadastrada!';
        lstTarefas.appendChild(vazio);
    }
}

function AtualizaLocalStorage() {
    localStorage.setItem("ListaTarefas", JSON.stringify(arrayTarefas));
}

txtTarefa.addEventListener('keyup', function(event) {
    if (event.key == 'Enter') {
        adicionarTarefa(txtTarefa.value, false);
    }
});

btnAdicionar.addEventListener('click', function() {
    adicionarTarefa(txtTarefa.value, false);
});

if (localStorage.getItem('ListaTarefas')) {
    arrayTarefas = JSON.parse(localStorage.getItem('ListaTarefas'));
    MontarLista();
}

btnLimpar.addEventListener('click', function() {
    if (confirm("Deseja limpar a Lista de Tarefas?")) {
        arrayTarefas = [];
        localStorage.removeItem('ListaTarefas');
        MontarLista();
    }
});