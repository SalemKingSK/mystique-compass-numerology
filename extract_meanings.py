import re

def extract_sections(text):
    # Split by "# The Number" or "# Challenge"
    sections = re.split(r'# (?:The Number |Challenge )(\d+)\s+(Pinnacle|Challenge)', text)
    
    meanings = {'Pinnacle': {}, 'Challenge': {}}
    
    for i in range(1, len(sections), 3):
        num = int(sections[i])
        type_ = sections[i+1]
        content = sections[i+2]
        
        # Clean up content
        content = content.strip()
        # Remove page breaks and other artifacts
        content = re.sub(r'\x0c', '', content)
        
        meanings[type_][num] = content
        
    return meanings

with open('/home/ubuntu/project_analysis/pinnacles_text.txt', 'r') as f:
    text = f.read()

meanings = extract_sections(text)

import json
with open('/home/ubuntu/project_analysis/meanings_layers.json', 'w') as f:
    json.dump(meanings, f, indent=2)
