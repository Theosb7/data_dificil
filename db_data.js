// db.js - Mini-framework para IndexedDB em escopo global
const DB_NAME = 'ChaosDB';
const DB_VERSION = 1;
const STORE_NAME = 'birthdates';

let meuBancoDeDados;

function initDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            meuBancoDeDados = event.target.result;
            if (!meuBancoDeDados.objectStoreNames.contains(STORE_NAME)) {
                meuBancoDeDados.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
            }
        };

        request.onsuccess = (event) => {
            meuBancoDeDados = event.target.result;
            console.log('IndexedDB inicializado com sucesso.');
            resolve(meuBancoDeDados);
        };

        request.onerror = (event) => {
            console.error('Erro ao inicializar IndexedDB:', event.target.error);
            reject(event.target.error);
        };
    });
}

function saveDate(dateObj) {
    return new Promise((resolve, reject) => {
        if (!meuBancoDeDados) {
            console.error('Banco de dados não está pronto.');
            reject('Banco de dados fechado.');
            return;
        }

        const transaction = meuBancoDeDados.transaction([STORE_NAME], 'readwrite');
        const store = transaction.objectStore(STORE_NAME);
        const request = store.add(dateObj);

        request.onsuccess = () => {
            console.log('Data salva com sucesso no IndexedDB:', dateObj);
            resolve(request.result);
        };

        request.onerror = (event) => {
            console.error('Erro ao salvar data:', event.target.error);
            reject(event.target.error);
        };
    });
}
