import re
import json
import os

MODULE_TITLES = {
    0: "Introducción, Metodología y Aval Normativo",
    1: "Identidad Digital y Validez Jurídica",
    2: "Psicología del Ataque y Shadow AI",
    3: "Protección de Datos 360",
    4: "Seguridad en el Entorno Híbrido",
    5: "Protocolo de Respuesta ante Incidentes",
    6: "Salud Mental y Ética Digital",
    7: "Gestión de Vulnerabilidades y Brechas"
}

def parse_course():
    with open('extracted_text.txt', 'r', encoding='utf-8') as f:
        text = f.read()
        
    lines = [line.strip() for line in text.split('\n')]
    
    slides = []
    current_module_id = 0
    current_slide = None
    state = None
    is_first_line_of_slide = True
    
    for line in lines:
        if not line:
            continue
            
        # Detect Module Header
        mod_match = re.match(r'^M[oó]dulo\s+(\d+):\s*(.*)', line, re.IGNORECASE)
        if mod_match:
            current_module_id = int(mod_match.group(1))
            if current_slide:
                current_slide['module_id'] = current_module_id
            continue
            
        # Detect Slide Header
        slide_range_match = re.match(r'^Diapositivas\s+(\d+)\s+a\s+(\d+)\s*:\s*(.*)', line, re.IGNORECASE)
        slide_final_match = re.match(r'^Diapositiva\s+FINAL\s*(\((.*)\))?', line, re.IGNORECASE)
        slide_single_match = re.match(r'^Diapositiva\s+([\w.-]+)\s*(\((.*?)\))?\s*(?::\s*(.*))?', line, re.IGNORECASE)
        
        is_slide = False
        slide_num_str = ""
        slide_title = ""
        is_range = False
        
        if slide_range_match:
            is_slide = True
            slide_num_str = f"Diapositivas {slide_range_match.group(1)} a {slide_range_match.group(2)}"
            slide_title = slide_range_match.group(3).strip()
            is_range = True
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
                'module_id': current_module_id,
                'slide_num_str': slide_num_str,
                'title': slide_title,
                'visual_title': '',
                'text_on_screen': [],
                'extended_text': [],
                'image_desc': None,
                'image_file': None,
                'type': 'content',
                'is_range': is_range
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
            mod_in_title = re.search(r'M[oó]dulo\s+(\d+)\s*:\s*(.*)', val, re.IGNORECASE)
            if mod_in_title:
                current_module_id = int(mod_in_title.group(1))
                current_slide['module_id'] = current_module_id
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
                    mod_in_title = re.search(r'M[oó]dulo\s+(\d+)\s*:\s*(.*)', line, re.IGNORECASE)
                    if mod_in_title:
                        current_module_id = int(mod_in_title.group(1))
                        current_slide['module_id'] = current_module_id
                else:
                    current_slide['text_on_screen'].append(line)
                    
        is_first_line_of_slide = False
                    
    if current_slide:
        slides.append(current_slide)
        
    # We now post-process the slides
    for slide in slides:
        m_id = slide['module_id']
        slide['module_title'] = MODULE_TITLES.get(m_id, f"Módulo {m_id}")
        
    processed_slides = []
    image_slide_count = 0
    
    for slide in slides:
        title_lower = slide['title'].lower()
        num_lower = slide['slide_num_str'].lower()
        visual_lower = slide['visual_title'].lower()
        
        # Skip range slides for quizzes using the is_range boolean
        if slide.get('is_range', False):
            continue
            
        if "final" in num_lower:
            slide['type'] = 'final'
            slide['time'] = 0
            processed_slides.append(slide)
            continue
            
        # Check for image slide
        is_image_slide = "imagen" in title_lower or "ilustración" in title_lower or "imagen" in num_lower or "ilustración" in num_lower or "_img" in num_lower
        if is_image_slide:
            slide['type'] = 'image'
            slide['time'] = 30
            if not slide.get('image_file'):
                image_slide_count += 1
                slide['image_file'] = f"img_{image_slide_count:02d}.jpg"
            processed_slides.append(slide)
            continue
            
        # Robust check for quiz feedback slide
        is_feedback = "resultados" in title_lower or "retroalimentación" in title_lower or "feedback" in title_lower
        is_feedback = is_feedback and ("módulo" in title_lower or "quiz" in title_lower or "corrección" in title_lower)
        
        if is_feedback:
            slide['type'] = 'quiz_feedback'
            slide['time'] = 0
            processed_slides.append(slide)
            continue
            
        is_question = "pregunta" in title_lower or "pregunta" in num_lower
        
        if is_question:
            slide['type'] = 'quiz_question'
            slide['time'] = 45 # Quiz questions have a 45s timer
            text_lines = slide['text_on_screen']
            
            question_text = ""
            options = []
            
            for line in text_lines:
                opt_match = re.match(r'^•?\s*\[([A-D])\]\s*(.*)', line)
                if opt_match:
                    options.append({
                        'id': opt_match.group(1),
                        'text': opt_match.group(2).strip()
                    })
                else:
                    if line.strip() and not line.startswith('('):
                        if question_text:
                            question_text += " " + line.strip()
                        else:
                            question_text = line.strip()
            
            question_text = re.sub(r'^Pregunta\s+\d+\s*(?:\(.*?\))?\s*:\s*', '', question_text, flags=re.IGNORECASE)
            slide['question_text'] = question_text
            slide['options'] = options
            
            # Split double questions
            has_multiple_questions = len(re.findall(r'Pregunta\s+\d+', " ".join(text_lines), re.IGNORECASE)) > 1
            if has_multiple_questions:
                sub_questions = []
                current_q = None
                
                for line in text_lines:
                    q_start_match = re.match(r'^Pregunta\s+(\d+)\s*(?:\(.*?\))?\s*:\s*(.*)', line, re.IGNORECASE) or \
                                    re.match(r'^Pregunta\s+(\d+)\s*(?:\(.*\))?', line, re.IGNORECASE)
                    if q_start_match:
                        if current_q:
                            sub_questions.append(current_q)
                        q_num = q_start_match.group(1)
                        q_text = q_start_match.group(2).strip() if q_start_match.lastindex >= 2 and q_start_match.group(2) else ""
                        current_q = {
                            'module_id': slide['module_id'],
                            'module_title': slide['module_title'],
                            'slide_num_str': f"Diapositiva {slide['slide_num_str'].replace('Diapositiva ', '')} - Pregunta {q_num}",
                            'title': f"Pregunta {q_num}",
                            'visual_title': slide['visual_title'],
                            'type': 'quiz_question',
                            'time': 45,
                            'question_text': q_text,
                            'options': [],
                            'extended_text': slide['extended_text'],
                            'image_desc': slide['image_desc']
                        }
                    elif current_q:
                        opt_match = re.match(r'^•?\s*\[([A-D])\]\s*(.*)', line)
                        if opt_match:
                            current_q['options'].append({
                                'id': opt_match.group(1),
                                'text': opt_match.group(2).strip()
                            })
                        else:
                            if line.strip() and not line.startswith('('):
                                if current_q['question_text']:
                                    current_q['question_text'] += " " + line.strip()
                                else:
                                    current_q['question_text'] = line.strip()
                if current_q:
                    sub_questions.append(current_q)
                
                for sq in sub_questions:
                    sq['question_text'] = re.sub(r'^Pregunta\s+\d+\s*(?:\(.*?\))?\s*:\s*', '', sq['question_text'], flags=re.IGNORECASE)
                    processed_slides.append(sq)
            else:
                processed_slides.append(slide)
        else:
            is_perfil = False
            for num in ["21", "22", "23", "24", "25"]:
                if f"Diapositiva {num}" in slide['slide_num_str']:
                    is_perfil = True
                    break
            if is_perfil:
                slide['time'] = 45
            else:
                slide['time'] = 60
            processed_slides.append(slide)
            
    # Associate feedback
    for mod_id in range(1, 8):
        feedback_slide = next((s for s in processed_slides if s['module_id'] == mod_id and s['type'] == 'quiz_feedback'), None)
        if not feedback_slide:
            print(f"Warning: No feedback slide found for Mod {mod_id}")
            continue
            
        feedback_text = " ".join(feedback_slide['text_on_screen']) + " " + " ".join(feedback_slide['extended_text'])
        
        matches = re.finditer(r'(?:(?:Respuesta\s+Correcta\s+)?Q|Pregunta)\s*(\d+)\s*:\s*(?:Correcta\s+)?\[([A-D])\](?:\s*-\s*(?:Feedback:|¿?Por\s+qu[eé]\??)?)?\s*(.*?)(?=(?:(?:Respuesta\s+Correcta\s+)?Q|Pregunta)\s*\d+\s*:|Contenido\s+Extendido|$)', feedback_text, re.IGNORECASE)
        answers_map = {}
        for m in matches:
            q_num = int(m.group(1))
            ans = m.group(2)
            fb = m.group(3).strip()
            answers_map[q_num] = {
                'correct_answer': ans,
                'feedback': fb
            }
            
        mod_questions = [s for s in processed_slides if s['module_id'] == mod_id and s['type'] == 'quiz_question']
        
        for idx, q in enumerate(mod_questions):
            q_num = idx + 1
            if q_num in answers_map:
                q['correct_answer'] = answers_map[q_num]['correct_answer']
                q['feedback'] = answers_map[q_num]['feedback']
            else:
                print(f"Warning: Could not find correct answer for Mod {mod_id} Question {q_num} ('{q['question_text'][:30]}')")
                
    # Renumber IDs
    for idx, s in enumerate(processed_slides):
        s['id'] = idx
        
    return processed_slides

def save_slides_js(slides, dst_path):
    os.makedirs(os.path.dirname(dst_path), exist_ok=True)
    
    modules_list = []
    seen_mods = set()
    for s in slides:
        m_id = s['module_id']
        m_title = s['module_title']
        if m_id not in seen_mods:
            seen_mods.add(m_id)
            modules_list.append({
                'id': m_id,
                'title': m_title
            })
            
    modules_list.sort(key=lambda x: x['id'])
    
    course_data = {
        'modules': modules_list,
        'slides': slides
    }
    
    with open(dst_path, 'w', encoding='utf-8') as f:
        f.write("const COURSE_DATA = ")
        f.write(json.dumps(course_data, ensure_ascii=False, indent=2))
        f.write(";\n")
    print(f"Saved slides JS data to {dst_path}")

if __name__ == '__main__':
    slides = parse_course()
    save_slides_js(slides, 'js/slides-data.js')
    print(f"Total processed slides: {len(slides)}")
    types = {}
    for s in slides:
        t = s['type']
        types[t] = types.get(t, 0) + 1
    print(f"Slide types: {types}")
