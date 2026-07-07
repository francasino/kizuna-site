import json

# Let's inspect the parsed slides from parse_course
from parse_course import parse_txt

slides = parse_txt('extracted_text.txt')

print("Slide Diagnostics:")
for i, slide in enumerate(slides):
    has_text = len(slide['text_on_screen']) > 0 or len(slide['visual_title']) > 0
    has_extended = len(slide['extended_text']) > 0
    title = slide['title']
    slide_num = slide['slide_num_str']
    mod_id = slide['module_id']
    
    if not has_text or not has_extended:
        print(f"Empty/Missing warning on Slide {i} ({slide_num} - {title}, Mod {mod_id}): Has Text: {has_text}, Has Ext: {has_extended}")
