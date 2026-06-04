(function() {
    const consoleDiv = document.createElement('div');
    consoleDiv.id = 'debug-console';
    consoleDiv.style.cssText = `
        position: fixed; bottom: 10px; left: 10px; z-index: 9999;
        width: 300px; max-height: 200px;
        background: rgba(0,0,0,0.8); color: #0f0;
        font-family: monospace; font-size: 0.7rem;
        border: 1px solid #333; border-radius: 4px;
        display: none; flex-direction: column;
    `;
    consoleDiv.innerHTML = `
        <div id="debug-console-header" style="padding: 4px; border-bottom: 1px solid #333; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
            <strong>Debug</strong>
            <button id="debug-console-clear" style="cursor:pointer; font-size: 0.6rem;">Clear</button>
        </div>
        <div id="debug-console-logs" style="padding: 4px; overflow-y:auto; flex:1;"></div>
    `;
    document.body.appendChild(consoleDiv);

    const logContainer = document.getElementById('debug-console-logs');
    let visible = false;

    function toggleConsole() {
        visible = !visible;
        consoleDiv.style.display = visible ? 'flex' : 'none';
    }

    // Toggle with 'D' key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'd' && e.ctrlKey) toggleConsole();
    });

    function addLog(type, args) {
        const message = args.map(arg => 
            typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' ');
        
        const logEntry = document.createElement('div');
        logEntry.style.color = type === 'error' ? '#f00' : (type === 'warn' ? '#ff0' : '#0f0');
        logEntry.textContent = `[${type.toUpperCase()}] ${message}`;
        logContainer.appendChild(logEntry);
        logContainer.scrollTop = logContainer.scrollHeight;
    }

    const originalLog = console.log;
    console.log = (...args) => { originalLog.apply(console, args); addLog('log', args); };
    console.warn = (...args) => { addLog('warn', args); };
    console.error = (...args) => { addLog('error', args); };

    document.getElementById('debug-console-clear').addEventListener('click', () => {
        logContainer.innerHTML = '';
    });
})();
