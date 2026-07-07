import re
import json

def parse_txt(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        text = f.read()
    
    lines = [line.strip() for line in text.split('\n')]
    
    slides = []
    current_module_id = 0
    current_module_title = "Introducción, Metodología y Aval Normativo"
    
    current_slide = None
    state = None # 'text', 'extended', 'image', None
    is_first_line_of_slide = True
    
    for i, line in enumerate(lines):
        if not line:
            continue
            
        # Detect Module Header (stand-alone line)
        mod_match = re.match(r'^M[oó]dulo\s+(\d+):\s*(.*)', line, re.IGNORECASE)
        if mod_match:
            current_module_id = int(mod_match.group(1))
            current_module_title = mod_match.group(2).strip()
            if current_slide:
                current_slide['module_id'] = current_module_id
                current_slide['module_title'] = current_module_title
            continue
            
        # Detect Slide Header
        slide_range_match = re.match(r'^Diapositivas\s+(\d+)\s+a\s+(\d+)\s*:\s*(.*)', line, re.IGNORECASE)
        slide_final_match = re.match(r'^Diapositiva\s+FINAL\s*(\((.*)\))?', line, re.IGNORECASE)
        slide_single_match = re.match(r'^Diapositiva\s+([\w.-]+)\s*(\((.*?)\))?\s*(?::\s*(.*))?', line, re.IGNORECASE)
        
        is_slide = False
        slide_num_str = ""
        slide_title = ""
        
        if slide_range_match:
            is_slide = True
            slide_num_str = f"Diapositivas {slide_range_match.group(1)} a {slide_range_match.group(2)}"
            slide_title = slide_range_match.group(3).strip()
        elif slide_final_match:
            is_slide = True
            slide_num_str = "FINAL"
            slide_title = slide_final_match.group(2).strip() if slide_final_match.group(2) else "Certificación y Cierre"
        elif slide_single_match:
            is_slide = True
            slide_num_str = f"Diapositiva {slide_single_match.group(1)}"
            if slide_single_match.group(4):
                slide_title = slide_single_match.group(4).strip()
            elif slide_single_match.group(3):
                slide_title = slide_single_match.group(3).strip()
            else:
                slide_title = ""
                
        if is_slide:
            if current_slide:
                slides.append(current_slide)
            
            current_slide = {
                'id': len(slides),
                'module_id': current_module_id,
                'module_title': current_module_title,
                'slide_num_str': slide_num_str,
                'title': slide_title,
                'visual_title': '',
                'text_on_screen': [],
                'extended_text': [],
                'image_desc': None,
                'image_file': None,
                'type': 'content'
            }
            state = None
            is_first_line_of_slide = True
            continue
            
        if not current_slide:
            continue
            
        # Parse fields
        if line.startswith('Título visual:') or line.startswith('Ttulo visual:'):
            val = line.split(':', 1)[1].strip()
            current_slide['visual_title'] = val
            # Check if this visual title contains a module header!
            # E.g. "Módulo 2: Tu Mente es el Objetivo (El Perfilado OCEAN)"
            mod_in_title = re.search(r'M[oó]dulo\s+(\d+)\s*:\s*(.*)', val, re.IGNORECASE)
            if mod_in_title:
                current_module_id = int(mod_in_title.group(1))
                current_module_title = mod_in_title.group(2).strip()
                current_slide['module_id'] = current_module_id
                current_slide['module_title'] = current_module_title
            state = None
        elif 'Texto Principal (En pantalla)' in line:
            state = 'text'
            title_part = line.split('Texto Principal', 1)[0].strip()
            title_part = re.sub(r'[\s:-]+$', '', title_part).strip()
            if title_part and not current_slide['visual_title']:
                current_slide['visual_title'] = title_part
        elif line.startswith('Contenido Extendido'):
            state = 'extended'
        elif line.startswith('IMAGEN') or line.startswith('Descripción de la imagen') or line.startswith('Descripción de la ilustración'):
            state = 'image'
            if ':' in line:
                desc_content = line.split(':', 1)[1].strip()
                if desc_content:
                    if current_slide['image_desc']:
                        current_slide['image_desc'] += " " + desc_content
                    else:
                        current_slide['image_desc'] = desc_content
        elif re.match(r'^img_.*?\.(jpg|png|jpeg)$', line.strip(), re.IGNORECASE):
            state = 'image'
            current_slide['image_file'] = line.strip()
        else:
            if state == 'text':
                current_slide['text_on_screen'].append(line)
            elif state == 'extended':
                current_slide['extended_text'].append(line)
            elif state == 'image':
                if re.match(r'^img_.*?\.(jpg|png|jpeg)$', line.strip(), re.IGNORECASE):
                    current_slide['image_file'] = line.strip()
                else:
                    desc_line = line.strip()
                    if desc_line.lower().startswith('descripción de la imagen:') or desc_line.lower().startswith('descripción de la ilustración:'):
                        desc_line = desc_line.split(':', 1)[1].strip()
                    elif desc_line.lower().startswith('descripción de la imagen') or desc_line.lower().startswith('descripción de la ilustración'):
                        if ':' in desc_line:
                            desc_line = desc_line.split(':', 1)[1].strip()
                    
                    if current_slide['image_desc']:
                        current_slide['image_desc'] += " " + desc_line
                    else:
                        current_slide['image_desc'] = desc_line
            else:
                is_bullet = not re.match(r'^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ¿¡"\'«»(\[]', line.strip())
                if is_first_line_of_slide and not is_bullet:
                    current_slide['visual_title'] = line
                    # Check module in visual title
                    mod_in_title = re.search(r'M[oó]dulo\s+(\d+)\s*:\s*(.*)', line, re.IGNORECASE)
                    if mod_in_title:
                        current_module_id = int(mod_in_title.group(1))
                        current_module_title = mod_in_title.group(2).strip()
                        current_slide['module_id'] = current_module_id
                        current_slide['module_title'] = current_module_title
                else:
                    current_slide['text_on_screen'].append(line)
                    
        is_first_line_of_slide = False
                    
    if current_slide:
        slides.append(current_slide)
        
    return slides

if __name__ == '__main__':
    slides = parse_txt('extracted_text.txt')
    print(f"Total slides parsed: {len(slides)}")
    for i in [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120]:
        if i < len(slides):
            print(f"Slide {i}: {slides[i]['slide_num_str']} - {slides[i]['title']} (Mod {slides[i]['module_id']}: {slides[i]['module_title']})")
