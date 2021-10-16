// ======== html elements ========
const linkTitleInput = document.querySelector(".name-input");
const linkUrlInput = document.querySelector(".link-input");
const linkDescriptionInput = document.querySelector(".description-input");
const linkSaveBtn = document.querySelector('[type="submit"]');
const linksContainer = document.querySelector(".bookmarks-container");
const noLinkMessage = document.querySelector(".nolink");
const modeToggle = document.querySelector(".toggle-mode");
const [nameAlert, urlAlert] = document.querySelectorAll(".warn");

// ======= when we refresh the page or open the browser we build links from localStorage date =====
window.addEventListener("DOMContentLoaded", function () {
    let savedLinks = Store.getLinks();
    savedLinks.forEach((link) => buildLink(link.title, link.url, link.description, link.id));
    hideGhost();
});
linkSaveBtn.addEventListener("click", function (e) {
    e.preventDefault();
    saveLink();
});
// show alerts over inputs that have unvalid data
linkTitleInput.addEventListener("input", function () {
    toggleInputError(nameAlert);
});
linkUrlInput.addEventListener("input", function () {
    toggleInputError(urlAlert);
});

function saveLink() {
    let title = linkTitleInput.value;
    let url = linkUrlInput.value;
    // if there's no  value in the description input description will be nothing
    let description = linkDescriptionInput.value ? `<p class="bk-description">${linkDescriptionInput.value}</p>` : "";
    // generate id based on stored links length
    let id = Store.getLinks().length;
    // check if the dete is vaalid
    if (checkData(title, url)) {
        // build a link container based on the info above
        buildLink(title, url, description, id);
        clearAllInputs();
        hideGhost();
        // create object to store values in local storage (using es6 we dont have to write the value of a proprety if they have the same name)
        let linkInfo = {
            title, // read more about propery shorthan [https://alligator.io/js/object-property-shorthand-es6/]
            url,
            description,
            id,
        };
        // add the info to localStorage
        Store.addLink(linkInfo);
    }
}

function checkData(name, link) {
    // checking for invalid format
    if (!/\w+/g.test(name)) {
        toggleInputError(nameAlert, true);
        return false;
    } else {
        // this is the format of a valid url (it can also not start with https/http)
        let urlRegex = /((https?):\/\/(www\.))?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)/;
        if (!urlRegex.test(link)) {
            toggleInputError(urlAlert, true);
            return false;
        }
    }
    // if everything is good return truthy value
    return true;
}

function buildLink(title, url, description, id) {
    let wrapper = document.createElement("div");
    wrapper.className = "bookmark-item";
    wrapper.id = id;
    let innerLink = `
        <div class="bookmark-item-info">
            <p class="bk-name">${title}</p>
            <p class="bk-link">
                <i class="fas fa-link"></i>
                ${url}
            </p>
            ${description}
        </div>
        <div class="bookmark-remove">
            <i class="fas fa-trash"></i>
        </div>
        `;
    // add the link to the DOM
    wrapper.insertAdjacentHTML("afterbegin", innerLink);
    linksContainer.append(wrapper);

    // add some events to some elements inside the link element [like trash icon and the link]
    wrapper.querySelector(".bookmark-remove").addEventListener("click", removeElement);
    wrapper.querySelector(".bk-name").addEventListener("click", () => goTo(url));
    wrapper.querySelector(".bk-link").addEventListener("click", () => goTo(url));
}
// go to the url after clicking on the link
function goTo(url) {
    window.location.host = url;
}
// show/remove the alert over inputs based on the state value
function toggleInputError(element, state = false) {
    if (state) {
        element.classList.remove("none");
    } else {
        element.classList.add("none");
    }
}
// show/hide the message of empty links
function hideGhost() {
    if (document.querySelector(".bookmark-item")) {
        noLinkMessage.style.display = "none";
    } else {
        noLinkMessage.style.display = "block";
    }
}
// reset all input values
function clearAllInputs() {
    linkUrlInput.value = "";
    linkTitleInput.value = "";
    linkDescriptionInput.value = "";
}
// the store class where we can get/store/remove elaments from the localStorage
class Store {
    static getLinks() {
        let links = [];

        if (localStorage.getItem("links")) {
            links = JSON.parse(localStorage.getItem("links"));
        }
        return links;
    }

    static addLink(link) {
        let links = this.getLinks();
        links.push(link);

        localStorage.setItem("links", JSON.stringify(links));
    }
    static removeLinks(element) {
        let links = this.getLinks();
        element.remove();

        links.forEach((link, index) => {
            if (element.id == link.id) {
                links.splice(index, 1);
            }
        });

        localStorage.setItem("links", JSON.stringify(links));
    }
}

function removeElement() {
    Store.removeLinks(this.parentElement);
    hideGhost();
}

// ======= mode toggle ========
let root = document.querySelector(":root");
modeToggle.addEventListener("click", function (e) {
    if (document.body.getAttribute("data-theme") == "dark") {
        document.body.setAttribute("data-theme", "light");
        localStorage.setItem("theme", "light");
    } else {
        document.body.setAttribute("data-theme", "dark");
        localStorage.setItem("theme", "dark");
    }
});

const currentMode = localStorage.getItem("theme") ? localStorage.getItem("theme") : null;
if (currentMode) {
    document.body.setAttribute("data-theme", currentMode);
}
