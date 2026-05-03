import os
import re

def patch(filename):
    if not os.path.exists(filename):
        return
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    def repl(m):
        code = m.group(1)
        space = m.group(2)
        lines = code.split('\n')
        expected = []
        for line in lines:
            if '# Expected:' in line:
                val = line.split('# Expected:')[1].strip()
                if val: expected.append(val)
            elif '// Expected:' in line:
                val = line.split('// Expected:')[1].strip()
                if val: expected.append(val)
            elif '// ' in line and 'Write ' not in line and 'cpp' in filename.lower():
                val = line.split('// ')[1].strip()
                if val: expected.append(val)
        
        out_str = r'\n'.join(expected).replace('"', r'\"')
        # If we failed to find any expected output, just put something to pass grading or leave empty
        # Wait, if expected is empty, let's put 'MANUAL_REVIEW_REQUIRED'
        if not expected:
            out_str = 'MANUAL_REVIEW_REQUIRED'
        
        # Don't add expectedOutput twice!
        return f'starterCode: `{code}`,{space}expectedOutput: "{out_str}",{space}hint:'

    # WARNING: only replace if expectedOutput is NOT already there!
    # A bit tricky with regex, but let's assume we run it once.
    if 'expectedOutput:' not in content:
        new_content = re.sub(r'starterCode:\s*`([^`]*)`,(\s*)hint:', repl, content)
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(new_content)

patch('ace/scripts/seedCpp.mjs')
patch('ace/scripts/seedPythonExpansion.mjs')
print('Patching complete!')