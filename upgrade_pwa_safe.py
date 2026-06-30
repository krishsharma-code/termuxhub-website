import os
import re

directory = r'D:\website4'
html_files = [f for f in os.listdir(directory) if f.endswith('.html')]

head_update = """    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#10b981">"""

install_button = """<button id="installAppBtn" style="display:none; background:#10b981; color:#fff; border:none; padding:8px 15px; border-radius:20px; cursor:pointer; font-weight:bold; margin-left:10px;">⬇️ Install App</button>"""

script_logic = """<script>
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('sw.js');
        });
    }

    // PWA Install Logic
    let deferredPrompt;
    const installBtn = document.getElementById('installAppBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI notify the user they can add to home screen
        if (installBtn) installBtn.style.display = 'inline-block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', (e) => {
            // hide our user interface that shows our A2HS button
            installBtn.style.display = 'none';
            // Show the prompt
            deferredPrompt.prompt();
            // Wait for the user to respond to the prompt
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('User accepted the A2HS prompt');
                } else {
                    console.log('User dismissed the A2HS prompt');
                }
                deferredPrompt = null;
            });
        });
    }
</script>"""

for filename in html_files:
    filepath = os.path.join(directory, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # TASK 1: HEAD UPDATES
    # Remove old manifest and theme-color if they exist (non-destructively)
    content = re.sub(r'\s*<link rel="manifest" href="[^"]*">', '', content)
    content = re.sub(r'\s*<meta name="theme-color" content="[^"]*">', '', content)
    
    # Inject new ones before </head> if not already present
    if 'href="manifest.json"' not in content:
        content = content.replace('</head>', f'{head_update}\n</head>')

    # TASK 2: INSTALL BUTTON
    # Inject before theme-toggle button if not already present
    if 'id="installAppBtn"' not in content:
        if '<button id="theme-toggle"' in content:
            content = content.replace('<button id="theme-toggle"', f'{install_button}<button id="theme-toggle"')
        else:
            # If no theme-toggle, inject at the end of nav
            content = content.replace('</nav>', f'    {install_button}\n</nav>')

    # TASK 3: SERVICE WORKER & INSTALL LOGIC
    # Avoid aggressive regex. Just check if our script is already there.
    if 'PWA Install Logic' not in content:
        # Check for old SW registration and remove it if it's simple
        content = content.replace("navigator.serviceWorker.register('service-worker.js')", "")
        
        # Inject new script logic before </body>
        content = content.replace('</body>', f'{script_logic}\n</body>')

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print(f"Processed {len(html_files)} files.")
