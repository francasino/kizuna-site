import zipfile
import xml.etree.ElementTree as ET
import os

docx_path = r"c:\Users\franc\projects_code\curso_prd_basico\curso_basico.docx"
out_path = r"c:\Users\franc\projects_code\curso_prd_basico\extracted_text.txt"

def docx_to_txt(src, dst):
    namespace = {'w': 'http://schemas.openxmlformats.org/wordprocessingml/2006/main'}
    text = []
    
    with zipfile.ZipFile(src) as docx:
        tree = ET.parse(docx.open('word/document.xml'))
        root = tree.getroot()
        
        for para in root.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}p'):
            para_text = []
            for run in para.iter('{http://schemas.openxmlformats.org/wordprocessingml/2006/main}t'):
                if run.text:
                    para_text.append(run.text)
            text.append("".join(para_text))
                
    with open(dst, 'w', encoding='utf-8') as f:
        f.write("\n".join(text))

try:
    docx_to_txt(docx_path, out_path)
    print("Extracted successfully!")
except Exception as e:
    print(f"Error: {e}")
