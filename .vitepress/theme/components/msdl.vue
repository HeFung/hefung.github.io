<template>
    <h1>Microsoft Software Download Listing 🏳️‍🌈</h1>

    <a href="https://github.com/gravesoft/msdl">
        <b>Source code on GitHub</b>
    </a>

    <noscript>
        <p>This page requires JavaScript to work.</p>
    </noscript>

    <div id="products-list">
        <h2>Select product</h2>
        <input id="search-products" type="search" placeholder="Search with regex..." onInput="updateResults();">
        <div id="quick-search">
            📌
            <button onClick="setSearch('Windows 8\\.1');">Windows 8.1</button>
            <button onClick="setSearch('Windows 10 22H2');">Latest Windows 10</button>
            <button onClick="setSearch('25H2');">Latest Windows 11</button>
        </div>
        <table style="table-layout: auto;">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>ID</th>
                </tr>
            </thead>
            <tbody id="products-table-body"></tbody>
        </table>
    </div>

    <div id="msdl-ms-content"></div>

    <div id="msdl-please-wait">
        <h2>Please wait...</h2>
        <p>Please wait while the data you requested is being retrieved.</p>
    </div>

    <div id="msdl-processing-error">
        <h2>Error</h2>
        <p>
            An error has occurred while processing your request. If reloading the page does not work, <a href="https://gravesoft.dev/troubleshoot/">contact us</a> or create an issue on GitHub.
        </p>
    </div>

    <div id="back-to-products">
        <hr>
        <button onClick="backToProducts();">Go back to the product list</button>
    </div>

    <input id="msdl-session-id" type="hidden">
</template>

<script setup>
const apiUrl = "https://api.gravesoft.dev/msdl/"

const sessionId = document.getElementById('msdl-session-id');
const msContent = document.getElementById('msdl-ms-content');
const pleaseWait = document.getElementById('msdl-please-wait');
const processingError = document.getElementById('msdl-processing-error');

const productsList = document.getElementById('products-list');
const backToProductsDiv = document.getElementById('back-to-products');

let availableProducts = {};
let skuId;

function uuidv4() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

function updateVars() {
    let id = document.getElementById('product-languages').value;
    if (id == "") {
        document.getElementById('submit-sku').disabled = 1;
        return;
    }

    document.getElementById('submit-sku').disabled = 0;

    return JSON.parse(id)['id'];
}

function langJsonStrToHTML(jsonStr) {
    let json = JSON.parse(jsonStr);
    let container = document.createElement('div');

    let header = document.createElement('h2');
    header.textContent = "Select the product language";
    container.appendChild(header);

    let info = document.createElement('p');
    info.innerHTML = "You'll need to choose the same language when you install Windows. To see what language you're currently using, go to <strong>Time and language</strong> in PC settings or <strong>Region</strong> in Control Panel.";
    container.appendChild(info);

    let select = document.createElement('select');
    select.id = "product-languages";

    let defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.selected = "selected";
    defaultOption.textContent = "Choose one";
    select.appendChild(defaultOption);

    json.Skus.forEach(sku => {
        let option = document.createElement('option');
        option.value = JSON.stringify({ id: sku.Id });
        option.textContent = sku.LocalizedLanguage;
        select.appendChild(option);
    });

    container.appendChild(select);

    let button = document.createElement('button');
    button.id = "submit-sku";
    button.textContent = "Submit";
    button.disabled = true;
    button.setAttribute("onClick", "getDownload();");

    container.appendChild(button);

    return container.innerHTML;
}

function onLanguageXhrChange() {
    if (!(this.status == 200))
        return;

    if (pleaseWait.style.display != "block")
        return;

    pleaseWait.style.display = "none";
    msContent.style.display = "block";

    let langHtml = langJsonStrToHTML(this.responseText);

    msContent.innerHTML = langHtml

    let submitSku = document.getElementById('submit-sku');
    submitSku.setAttribute("onClick", "getDownload();");

    let prodLang = document.getElementById('product-languages');
    prodLang.setAttribute("onChange", "updateVars();");

    updateVars();
}

function onDownloadsXhrChange() {
    if (!(this.status == 200)) {
        processingError.style.display = "block";
        return;
    }

    let response = JSON.parse(this.responseText);

    if (pleaseWait.style.display != "block") return;

    pleaseWait.style.display = "none";
    msContent.style.display = "block";
    msContent.innerHTML = "";

    if (response.ProductDownloadOptions && response.ProductDownloadOptions.length > 0) {
        let header = document.createElement('h2');
        header.textContent = `${response.ProductDownloadOptions[0].ProductDisplayName} ${response.ProductDownloadOptions[0].LocalizedLanguage}`
        msContent.appendChild(header);

        response.ProductDownloadOptions.forEach(option => {
            let downloadButton = document.createElement('a');
            downloadButton.href = option.Uri;
            let raw_link = option.Uri.split('?')[0];
            downloadButton.textContent = raw_link.split('/').pop();;
            downloadButton.target = "_blank";

            let br = document.createElement('br');

            msContent.appendChild(downloadButton);
            msContent.appendChild(br);
        });
    } else {
        msContent.innerHTML = "<p>No download options available.</p>";
    }
}

function getLanguages(productId) {
    let url = `${apiUrl}skuinfo?product_id=${productId}`;
    let xhr = new XMLHttpRequest();
    xhr.onload = onLanguageXhrChange;
    xhr.open("GET", url, true);
    xhr.send();
}

function getDownload() {
    msContent.style.display = "none";
    pleaseWait.style.display = "block";

    skuId = skuId ? skuId : updateVars();

    let url = apiUrl + "proxy" + "?product_id=" + window.location.hash.substring(1) + "&sku_id=" + skuId;

    let xhr = new XMLHttpRequest();
    xhr.onload = onDownloadsXhrChange;
    xhr.open("GET", url, true);
    xhr.send();
}

function backToProducts() {
    backToProductsDiv.style.display = 'none';
    productsList.style.display = 'block';
    msContent.style.display = 'none';
    pleaseWait.style.display = 'none';
    processingError.style.display = 'none';

    window.location.hash = "";
    skuId = null;
}

function prepareDownload(id) {
    productsList.style.display = 'none';
    backToProductsDiv.style.display = 'block';
    pleaseWait.style.display = "block";

    getLanguages(id);
}

function addTableElement(table, value, data) {
    let a = document.createElement('a')
    a.href = "#" + value;
    a.setAttribute("onClick", "prepareDownload(" + value + ");");
    a.appendChild(document.createTextNode(data[value]))

    let tr = table.insertRow();

    let td = tr.insertCell();
    td.appendChild(a);

    let td2 = tr.insertCell();
    td2.appendChild(document.createTextNode(value))
}

function createTable(data, search) {
    let table = document.getElementById('products-table-body');
    let regex = new RegExp('' + search + '', 'ig');

    table.innerHTML = "";

    for (value in data) {
        if (data[value].match(regex) == null)
            continue;

        addTableElement(table, value, data);
    }
}

function updateResults() {
    let search = document.getElementById('search-products');
    createTable(availableProducts, search.value);
}

function setSearch(query) {
    let search = document.getElementById('search-products');
    search.value = search.value == query ? null : query;
    updateResults();
}

function checkHash() {
    let hash = window.location.hash;
    if (hash.length == 0)
        return

    prepareDownload(hash.substring(1))
}

function preparePage(resp) {
    availableProducts = JSON.parse(resp);
    if (!availableProducts) {
        pleaseWait.style.display = 'none';
        processingError.style.display = 'block';
        return;
    }

    pleaseWait.style.display = 'none';
    productsList.style.display = 'block';

    updateResults();
    checkHash();
}

sessionId.value = uuidv4();

let xhr = new XMLHttpRequest();

xhr.onload = function () {
    if (this.status != 200) {
        pleaseWait.style.display = 'none';
        processingError.style.display = 'block';
        return;
    }

    preparePage(this.responseText);
};

xhr.open("GET", 'https://msdl.gravesoft.dev/data/products.json', true);
xhr.send();

pleaseWait.style.display = 'block';
</script>
