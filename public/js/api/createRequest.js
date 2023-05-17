/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
    let {url, data, method, callback} = options;

    const xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    let formData = null;

    xhr.addEventListener("load", () => callback(null, xhr.response));

    xhr.addEventListener("error", () => {
        callback(xhr.response);
    });

    try {
        if ( method === "GET") {
            url += "?"
            for ( let pos in data ) {
                url += `${pos}=${data[pos]}&`;
            }
            xhr.open(method, url.slice(0, -1));
        } else {
            formData = new FormData();
            for ( let pos in data ) {
                formData.append(`${pos}`, `${data[pos]}`);
            }
            xhr.open(method, url);
        }

        xhr.send(formData);
    }
    catch (e) {
        callback(e);
    }
};