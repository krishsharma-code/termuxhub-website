import os
import glob
import re

def migrate_html_files():
    directory = r"d:\website4"
    html_files = glob.glob(os.path.join(directory, "*.html"))
    
    for file_path in html_files:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # 1. Remove <style>...</style> blocks
        content = re.sub(r'<style>.*?</style>', '', content, flags=re.DOTALL)
        
        # 2. Remove Google Fonts <link> tags (we moved this to CSS @import)
        content = re.sub(r'<link[^>]*fonts\.googleapis\.com[^>]*>', '', content)
        content = re.sub(r'<link[^>]*fonts\.gstatic\.com[^>]*>', '', content)
        
        # 3. Inject astra-theme.css link before </head> if not already there
        if 'href="astra-theme.css"' not in content:
            # We want to replace the FIRST </head> (there should only be one)
            content = content.replace('</head>', '    <link rel="stylesheet" href="astra-theme.css">\n</head>', 1)
            
        # Write the updated content back
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Migrated {os.path.basename(file_path)}")

if __name__ == "__main__":
    migrate_html_files()
