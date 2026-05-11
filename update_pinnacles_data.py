import json

with open('/home/ubuntu/project_analysis/meanings_layers_v2.json', 'r') as f:
    meanings = json.load(f)

def format_content(content_dict):
    formatted = ""
    for title, body in content_dict.items():
        if title == 'Intro':
            formatted += body + "\n\n"
        elif title == 'Full':
            formatted += body + "\n\n"
        else:
            formatted += f"### {title}\n{body}\n\n"
    return formatted.strip()

pinnacle_desc = {}
for num, content in meanings['Pinnacle'].items():
    pinnacle_desc[int(num)] = format_content(content)

challenge_desc = {}
for num, content in meanings['Challenge'].items():
    challenge_desc[int(num)] = format_content(content)

# Generate the TypeScript file
ts_content = """/**
 * @fileOverview Verbatim Pinnacle and Challenge stage definitions from your chunks.
 */

export const PINNACLE_DESC: Record<number, string> = """ + json.dumps(pinnacle_desc, indent=2) + """;

export const CHALLENGE_DESC: Record<number, string> = """ + json.dumps(challenge_desc, indent=2) + """;
"""

with open('/home/ubuntu/project_analysis/src/lib/cosmic-fate/pinnacles.ts', 'w') as f:
    f.write(ts_content)
