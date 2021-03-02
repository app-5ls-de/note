function radom_id() {
    let id = "";
    for (let i = 0; i < 8; i++) {
        var r = (Math.random() * 16) | 0;
        id += r.toString(16);
    }
    return id;
}

function createRandomWord(length = 6) {
    //https://jsfiddle.net/amando96/XjUJM/
    var consonants = "bcdfghjlmnpqrstv".split(""),
        vowels = "aeiou".split(""),
        rand = function (limit) {
            return Math.floor(Math.random() * limit);
        },
        word = "";
    for (var i = 0; i < length / 2; i++) {
        var randConsonant = consonants[rand(consonants.length)],
            randVowel = vowels[rand(vowels.length)];
        word += i === 0 ? randConsonant.toUpperCase() : randConsonant;
        word += i * 2 < length - 1 ? randVowel : "";
    }
    return word;
}

function mount(parent, childs) {
    if (childs.length) {
        childs.forEach((child) => {
            redom.mount(parent, child);
        });
    } else {
        redom.mount(parent, childs);
    }
}

function new_note() {
    id = radom_id();
    title = createRandomWord();
    localStorage.setItem(id, '{"ops":[{"insert":"\\n"}]}');
    localStorage.setItem(id + "-title", title);

    window.location = window.location.origin + "/edit?" + id;
}

function rename_note(id, title) {
    var new_title = prompt("Please enter the new title:", title);
    if (new_title != null && new_title != "") {
        new_title = new_title.trim();
        localStorage.setItem(id + "-title", new_title);
    }
    location.reload();
}

function delete_note(id) {
    localStorage.removeItem(id);
    localStorage.removeItem(id + "-title");
    location.reload();
}

function create_item(id) {
    let title = localStorage.getItem(id + "-title");

    let btn_delete = redom.el("button.delete", "x");
    btn_delete.addEventListener("click", (e) => {
        delete_note(id);
        e.preventDefault();
    });

    let btn_rename = redom.el("button.rename", "e");
    btn_rename.addEventListener("click", (e) => {
        rename_note(id, title);
        e.preventDefault();
    });

    let a_link = redom.el("a.link", [
        redom.el("div.buttons", [btn_rename, btn_delete]),
        redom.el("div.title", title),
        { href: "/edit?" + id },
    ]);

    el = redom.el("div.item", a_link);

    return el;
}

let keys = Object.keys(localStorage);
keys.forEach((key) => {
    const regex = new RegExp("^[a-f0-9]{8}(-title)?$");
    if (!regex.test(key)) {
        console.log("deleting key:", key);
        localStorage.removeItem(key);
        return;
    }

    if (key.endsWith("-title")) {
        if (!keys.includes(key.replace("-title", ""))) {
            localStorage.setItem(
                key_without_title,
                '{"ops":[{"insert":"\\n"}]}'
            );
            return;
        }
    } else {
        if (!keys.includes(key + "-title")) {
            title = createRandomWord();
            localStorage.setItem(key + "-title", title);
        }
    }
});

var div_list = document.getElementById("list");

Object.keys(localStorage).forEach((key) => {
    if (key.endsWith("-title")) return;

    mount(div_list, create_item(key));
});

var btn_new = document.getElementById("new");
btn_new.addEventListener("click", new_note);
