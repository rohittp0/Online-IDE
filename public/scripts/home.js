firebase.auth().onAuthStateChanged((user) => {
    if (!user) window.location.replace("/");
});

const code = CodeMirror.fromTextArea(document.getElementById('code'), {
    lineNumbers: true,
    mode: "text/x-python",
    extraKeys: {
        "'.'": "autocomplete"
    },
    theme: 'vscode-dark'
});

const run = document.getElementById('run');
const output = document.getElementById('output');

async function runCode(code) {
    if (code == '') return {
        code: 0,
        error: 'Please write some code before running'
    };
    const response = await fetch('function/run', {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            code: code
        })
    });
    return await response.json();
}

run.onclick = () => {
    if (run.disabled) return;
    runCode(code.getValue()).then((json) => {
        if (json.error) {
            output.value = json.error;
            output.classList.add("error");
        } else {
            output.value = json.output;
            output.classList.remove("error");
        }
        output.value += '\nProgram exited with code ' + json.code;
    }).finally(() => run.disabled = false)
    run.disabled = true;
}