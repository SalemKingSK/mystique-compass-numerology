import re
import json

def extract_sections(text):
    # Split by "# The Number X Pinnacle" or "# The Number X Challenge" or "# Challenge X"
    # The PDF text has variations like "# The Number 1 Pinnacle", "# Challenge 0: The Crucible of Free Will"
    
    # Let's try to find all headers first
    headers = re.findall(r'# (?:The Number )?(\d+)\s+(Pinnacle|Challenge)', text)
    
    # Split text by these headers
    parts = re.split(r'# (?:The Number )?\d+\s+(?:Pinnacle|Challenge)', text)
    # parts[0] is the intro text
    
    meanings = {'Pinnacle': {}, 'Challenge': {}}
    
    for i, (num, type_) in enumerate(headers):
        content = parts[i+1].strip()
        content = re.sub(r'\x0c', '', content)
        
        # Extract sub-sections
        sub_sections = {}
        
        # Look for "## " headers
        sub_parts = re.split(r'## (.*?)\n', content)
        if len(sub_parts) > 1:
            # sub_parts[0] is the intro to the number
            sub_sections['Intro'] = sub_parts[0].strip()
            for j in range(1, len(sub_parts), 2):
                title = sub_parts[j].strip()
                body = sub_parts[j+1].strip()
                sub_sections[title] = body
        else:
            sub_sections['Full'] = content
            
        meanings[type_][num] = sub_sections
        
    return meanings

with open('/home/ubuntu/project_analysis/pinnacles_text.txt', 'r') as f:
    text = f.read()

meanings = extract_sections(text)

with open('/home/ubuntu/project_analysis/meanings_layers_v2.json', 'w') as f:
    json.dump(meanings, f, indent=2)
